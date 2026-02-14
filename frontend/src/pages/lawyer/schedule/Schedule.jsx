import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Calendar,
  Clock,
  AlertTriangle,
  FileText,
  Phone,
  Video,
  FolderOpen,
  Navigation,
  X,
  Timer,
  Gauge,
  MapPin,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const now = () => new Date();

const roundToInterval = (date, minutes = 15) => {
  const d = new Date(date);
  d.setMilliseconds(0);
  d.setSeconds(0);
  const m = d.getMinutes();
  const r = Math.round(m / minutes) * minutes;
  d.setMinutes(r);
  return d;
};

const addMinutes = (date, mins) => new Date(date.getTime() + mins * 60000);

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const minutesDiff = (a, b) => Math.round((a.getTime() - b.getTime()) / 60000);

const defaultBufferMins = 20;
const travelSpeedKmPerHr = 25;

const initialEvents = (() => {
  const base = roundToInterval(addMinutes(now(), 20));
  const e1Start = base;
  const e1End = addMinutes(e1Start, 60);
  const e2Start = addMinutes(e1End, 30);
  const e2End = addMinutes(e2Start, 45);
  const e3Start = addMinutes(e2End, 45);
  const e3End = addMinutes(e3Start, 30);
  return [
    {
      id: "evt-1",
      title: "Court Hearing: State vs. Kumar",
      type: "Court",
      start: e1Start,
      end: e1End,
      location: "High Court, Room 402",
      caseNumber: "HC/2026/0912",
      client: "Mr. Kumar",
      documents: ["Charge Sheet.pdf", "Bail Application.docx"],
      notes: "Focus on cross-examination",
      opposingCounsel: "R. Desai",
      courtroom: "402",
      distanceKm: 8,
      checklists: {
        documents: true,
        clientBriefed: true,
        evidenceVerified: false,
        argumentsReady: false,
      },
      riskFlags: { missingDocs: false, tightDeadline: false, aggressiveOpposition: true },
      insight: { winProbability: 0.62, priority: "Critical", lastOutcome: "Adjourned" },
    },
    {
      id: "evt-2",
      title: "Client Briefing: Mrs. Desai",
      type: "Meeting",
      start: e2Start,
      end: e2End,
      location: "Office / Zoom",
      caseNumber: "CIV/2026/2210",
      client: "Mrs. Desai",
      documents: ["Client Notes.md"],
      notes: "Discuss settlement options",
      opposingCounsel: "K. Shah",
      courtroom: "-",
      distanceKm: 0,
      checklists: {
        documents: true,
        clientBriefed: false,
        evidenceVerified: false,
        argumentsReady: false,
      },
      riskFlags: { missingDocs: false, tightDeadline: false, aggressiveOpposition: false },
      insight: { winProbability: 0.55, priority: "Important", lastOutcome: "Negotiation Ongoing" },
    },
    {
      id: "evt-3",
      title: "Filing Deadline: Appeal #9921",
      type: "Deadline",
      start: e3Start,
      end: e3End,
      location: "E-Filing Portal",
      caseNumber: "APP/2026/9921",
      client: "Internal",
      documents: ["Appeal Draft.docx"],
      notes: "Double-check annexures",
      opposingCounsel: "-",
      courtroom: "-",
      distanceKm: 0,
      checklists: {
        documents: false,
        clientBriefed: false,
        evidenceVerified: false,
        argumentsReady: false,
      },
      riskFlags: { missingDocs: true, tightDeadline: true, aggressiveOpposition: false },
      insight: { winProbability: 0.48, priority: "Critical", lastOutcome: "N/A" },
    },
  ];
})();

const stageFlow = [
  { key: "prep", label: "Case Preparation" },
  { key: "brief", label: "Client Briefing" },
  { key: "evidence", label: "Evidence Review" },
  { key: "hearing", label: "Court Hearing" },
  { key: "filing", label: "Filing Deadline" },
];

export default function Schedule() {
  const [view, setView] = useState("day");
  const [events, setEvents] = useState(initialEvents);
  const [drawerEvent, setDrawerEvent] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const [bufferMins, setBufferMins] = useState(defaultBufferMins);
  const [draggingId, setDraggingId] = useState(null);
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => a.start.getTime() - b.start.getTime()),
    [events]
  );

  const upcoming = useMemo(() => {
    const n = now();
    return sortedEvents.find((e) => e.start > n) || null;
  }, [sortedEvents]);

  const countdown = useMemo(() => {
    if (!upcoming) return null;
    const mins = Math.max(0, minutesDiff(upcoming.start, now()));
    const h = Math.floor(mins / 60)
      .toString()
      .padStart(2, "0");
    const m = (mins % 60).toString().padStart(2, "0");
    return `${h}h ${m}m`;
  }, [upcoming]);

  useEffect(() => {
    const t = setInterval(() => {
      setEvents((prev) => [...prev]);
    }, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!upcoming) return;
    const mins = minutesDiff(upcoming.start, now());
    if (mins <= 60) setFocusMode(true);
  }, [upcoming]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nyayak_schedule_events");
      if (raw) {
        const parsed = JSON.parse(raw).map((e) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }));
        setEvents(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const serializable = events.map((e) => ({
        ...e,
        start: e.start.toISOString(),
        end: e.end.toISOString(),
      }));
      localStorage.setItem("nyayak_schedule_events", JSON.stringify(serializable));
    } catch {}
  }, [events]);

  const notifyTimers = useRefStore();
  useEffect(() => {
    notifyTimers.clearAll();
    const n = now();
    sortedEvents.forEach((e) => {
      const tenBefore = addMinutes(e.start, -10);
      const diff = tenBefore.getTime() - n.getTime();
      if (diff > 0 && diff < 6 * 60 * 60 * 1000) {
        const id = setTimeout(() => {
          toast.info(`Reminder: ${e.title} in 10 minutes`, { position: "top-right" });
        }, diff);
        notifyTimers.add(id);
      }
    });
    return () => notifyTimers.clearAll();
  }, [sortedEvents]);

  const priorityOf = (e) => {
    const mins = minutesDiff(e.start, now());
    if (mins <= 60 || e.type === "Deadline") return "Critical";
    if (mins <= 180 || e.type === "Meeting") return "Important";
    return "Normal";
  };

  const priColor = (pri) => {
    if (pri === "Critical") return "bg-red-500";
    if (pri === "Important") return "bg-blue-500";
    return "bg-amber-500";
  };

  const overlapWarnings = useMemo(() => {
    const warns = [];
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const a = sortedEvents[i];
      const b = sortedEvents[i + 1];
      if (a.end > addMinutes(b.start, 0)) {
        warns.push(`${a.title} overlaps with ${b.title}`);
      }
    }
    return warns;
  }, [sortedEvents]);

  const workload = useMemo(() => {
    let hearings = 0,
      meetings = 0,
      deadlines = 0,
      mins = 0;
    sortedEvents.forEach((e) => {
      if (e.type === "Court") hearings++;
      if (e.type === "Meeting") meetings++;
      if (e.type === "Deadline") deadlines++;
      mins += minutesDiff(e.end, e.start);
    });
    const score = Math.min(100, Math.round((mins / 480) * 100));
    return { hearings, meetings, deadlines, mins, score };
  }, [sortedEvents]);

  const adjustPredictively = (updated) => {
    const arr = [...updated].sort((a, b) => a.start - b.start);
    for (let i = 0; i < arr.length - 1; i++) {
      const a = arr[i];
      const b = arr[i + 1];
      const endWithBuffer = addMinutes(a.end, bufferMins);
      if (endWithBuffer > b.start) {
        const shiftBy = minutesDiff(endWithBuffer, b.start) * -1;
        b.start = addMinutes(b.start, -shiftBy);
        b.end = addMinutes(b.end, -shiftBy);
      }
    }
    return arr;
  };

  const simulateDelay = (id, delayMins = 15) => {
    setEvents((prev) => {
      const copy = prev.map((e) =>
        e.id === id
          ? { ...e, end: addMinutes(e.end, delayMins) }
          : e
      );
      return adjustPredictively(copy);
    });
  };

  const onDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, overId) => {
    e.preventDefault();
    if (!draggingId || draggingId === overId) return;
    const fromIdx = events.findIndex((ev) => ev.id === draggingId);
    const toIdx = events.findIndex((ev) => ev.id === overId);
    if (fromIdx === -1 || toIdx === -1) return;
    const arr = [...events];
    const [moved] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, moved);
    const normalized = arr
      .map((e, i) =>
        i === 0
          ? e
          : (() => {
              const prev = arr[i - 1];
              const dur = minutesDiff(e.end, e.start);
              const start = addMinutes(prev.end, bufferMins);
              return { ...e, start, end: addMinutes(start, dur) };
            })()
      )
      .map((e) => ({ ...e }));
    setEvents(adjustPredictively(normalized));
    setDraggingId(null);
  };

  const leaveByFor = (e) => {
    const minsTravel = Math.ceil((e.distanceKm / travelSpeedKmPerHr) * 60);
    const leaveBy = addMinutes(e.start, -minsTravel - bufferMins);
    return { leaveBy: formatTime(leaveBy), travelMins: minsTravel };
  };

  const stageActiveIndex = useMemo(() => {
    if (!upcoming) return 0;
    if (upcoming.type === "Court") return 3;
    if (upcoming.type === "Deadline") return 4;
    if (upcoming.type === "Meeting") return 1;
    return 0;
  }, [upcoming]);

  const weekAnalytics = useMemo(() => {
    let court = 0,
      office = 0,
      client = 0;
    events.forEach((e) => {
      if (e.type === "Court") court += 1;
      if (e.type === "Deadline") office += 1;
      if (e.type === "Meeting") client += 1;
    });
    const total = Math.max(1, court + office + client);
    return {
      courtPct: Math.round((court / total) * 100),
      officePct: Math.round((office / total) * 100),
      clientPct: Math.round((client / total) * 100),
    };
  }, [events]);

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedEvents;
    return sortedEvents.filter((e) => {
      return (
        e.title.toLowerCase().includes(q) ||
        (e.client || "").toLowerCase().includes(q) ||
        (e.caseNumber || "").toLowerCase().includes(q) ||
        (e.location || "").toLowerCase().includes(q) ||
        (e.type || "").toLowerCase().includes(q)
      );
    });
  }, [sortedEvents, query]);

  const currentEvent = useMemo(() => {
    const n = now();
    return sortedEvents.find((e) => e.start <= n && e.end > n) || null;
  }, [sortedEvents]);

  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === "n" || ev.key === "N") setShowAdd(true);
      if (ev.key === "f" || ev.key === "F") setFocusMode((v) => !v);
      if (ev.key === "/") {
        const el = document.getElementById("schedule-search");
        if (el) {
          ev.preventDefault();
          el.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const getSuggestedSlot = useCallback(
    (date, durMins) => {
      const dayStart = new Date(date);
      dayStart.setHours(9, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(18, 0, 0, 0);
      const dayEvents = sortedEvents
        .filter(
          (e) =>
            e.start.toDateString() === date.toDateString() ||
            e.end.toDateString() === date.toDateString()
        )
        .sort((a, b) => a.start - b.start);
      let cursor = dayStart;
      for (let i = 0; i <= dayEvents.length; i++) {
        const nextStart = i < dayEvents.length ? dayEvents[i].start : dayEnd;
        const slotEnd = addMinutes(cursor, durMins);
        if (slotEnd <= nextStart) return { start: new Date(cursor), end: new Date(slotEnd) };
        cursor = addMinutes((i < dayEvents.length ? dayEvents[i].end : dayEnd), bufferMins);
      }
      return { start: new Date(dayStart), end: addMinutes(dayStart, durMins) };
    },
    [sortedEvents, bufferMins]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-orange-100 dark:border-slate-700 bg-gradient-to-br from-orange-50 to-white dark:from-slate-800 dark:to-slate-900 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-white dark:bg-slate-700 text-orange-700 border border-orange-200 dark:border-slate-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Court Schedule</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Day & week timeline with smart assistance</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <input
                id="schedule-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cases, clients, events"
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 w-64"
              />
            </div>
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 overflow-hidden">
              <button
                className={`px-3 py-1.5 text-sm font-bold ${
                  view === "day" ? "bg-slate-900 text-white" : "text-slate-600 dark:text-slate-300"
                }`}
                onClick={() => setView("day")}
              >
                Day
              </button>
              <button
                className={`px-3 py-1.5 text-sm font-bold ${
                  view === "week" ? "bg-slate-900 text-white" : "text-slate-600 dark:text-slate-300"
                }`}
                onClick={() => setView("week")}
              >
                Week
              </button>
              <button
                className={`px-3 py-1.5 text-sm font-bold ${
                  view === "month" ? "bg-slate-900 text-white" : "text-slate-600 dark:text-slate-300"
                }`}
                onClick={() => setView("month")}
              >
                Month
              </button>
            </div>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
              <Timer className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {upcoming ? `Next: ${upcoming.title}` : "No upcoming"}
              </span>
              <span className="text-xs text-slate-500">{upcoming ? `in ${countdown}` : ""}</span>
            </div>
          </div>
        </div>
        {currentEvent && (
          <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
            <div className="flex items-center justify-between text-sm">
              <div className="font-bold text-slate-900 dark:text-white">{currentEvent.title}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {formatTime(currentEvent.start)} – {formatTime(currentEvent.end)}
              </div>
            </div>
            <ProgressNow start={currentEvent.start} end={currentEvent.end} />
          </div>
        )}
      </div>

      {overlapWarnings.length > 0 && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <div>{overlapWarnings.join(" • ")}</div>
        </div>
      )}

      <div className="relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div className="text-sm font-bold mb-3 text-slate-900 dark:text-slate-100">Legal Command Timeline</div>
        <div className="absolute left-5 right-5 top-[64px] h-px bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center gap-4">
          {stageFlow.map((s, idx) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={`px-3 py-1.5 rounded-md text-xs font-bold border shadow-sm ${
                  idx <= stageActiveIndex
                    ? "bg-orange-100 border-orange-200 text-orange-700"
                    : "bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400"
                }`}
              >
                {s.label}
              </div>
              {idx < stageFlow.length - 1 && (
                <div className="w-8 h-px bg-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>

      {view === "month" ? (
        <MonthGrid events={events} onSelectDay={(d) => setView("day")} />
      ) : view === "week" ? (
        <WeekGrid events={filteredEvents} />
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredEvents.map((e) => {
            const pri = priorityOf(e);
            const priStyle =
              pri === "Critical"
                ? "bg-red-50 border-red-200 text-red-700"
                : pri === "Important"
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-amber-50 border-amber-200 text-amber-700";
            const { leaveBy, travelMins } = leaveByFor(e);
            return (
              <div
                key={e.id}
                draggable
                onDragStart={(ev) => onDragStart(ev, e.id)}
                onDragOver={onDragOver}
                onDrop={(ev) => onDrop(ev, e.id)}
                className="relative p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm cursor-move overflow-hidden"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${priColor(pri)}`} />
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                      <Clock className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{e.title}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {formatTime(e.start)} – {formatTime(e.end)} • {e.location}
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${priStyle}`}>
                    {pri}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span>Leave by {leaveBy}</span>
                    {e.distanceKm > 0 && (
                      <span className="ml-2 text-slate-400">{e.distanceKm}km • {travelMins}m</span>
                    )}
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => setDrawerEvent(e)}
                      className="px-2 py-1 text-xs rounded-md bg-white hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => simulateDelay(e.id, 15)}
                      className="px-2 py-1 text-xs rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/40"
                    >
                      +15m delay
                    </button>
                    <button
                      onClick={() => toast.success("Client notified about delay")}
                      className="px-2 py-1 text-xs rounded-md bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 dark:border-red-800/40"
                    >
                      Running Late
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button className="px-2 py-1 text-xs rounded-md bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700 flex items-center gap-1">
                    <Video className="w-3 h-3" /> Join Meeting
                  </button>
                  <button className="px-2 py-1 text-xs rounded-md bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700 flex items-center gap-1">
                    <FolderOpen className="w-3 h-3" /> Open Case
                  </button>
                  <button className="px-2 py-1 text-xs rounded-md bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> View Docs
                  </button>
                  <button className="px-2 py-1 text-xs rounded-md bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Call Client
                  </button>
                  <button className="px-2 py-1 text-xs rounded-md bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700 flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> Navigate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold flex items-center gap-2">
                <Gauge className="w-4 h-4 text-orange-600" />
                Daily Workload
              </div>
              <div className="text-xs text-slate-500">{Math.round(workload.mins / 60)}h</div>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
                style={{ width: `${workload.score}%` }}
              />
            </div>
            <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-400">
              Hearings {workload.hearings} • Meetings {workload.meetings} • Deadlines {workload.deadlines}
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-sm font-bold mb-2 text-slate-900 dark:text-slate-100">Court vs Office Time (Week)</div>
            <div className="space-y-2">
              <div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mb-1">Court</div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-900 rounded">
                  <div className="h-full bg-red-500 rounded" style={{ width: `${weekAnalytics.courtPct}%` }} />
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mb-1">Office</div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-900 rounded">
                  <div className="h-full bg-slate-500 rounded" style={{ width: `${weekAnalytics.officePct}%` }} />
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mb-1">Client Meetings</div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-900 rounded">
                  <div className="h-full bg-blue-500 rounded" style={{ width: `${weekAnalytics.clientPct}%` }} />
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Smart Settings</div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">Default buffer time</span>
                <select
                  value={bufferMins}
                  onChange={(e) => setBufferMins(parseInt(e.target.value, 10))}
                  className="border rounded px-2 py-1 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200"
                >
                  {[10, 15, 20, 30, 45].map((m) => (
                    <option key={m} value={m}>
                      {m}m
                    </option>
                  ))}
                </select>
              </label>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                Upcoming events auto-adjust if prior events run late.
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {focusMode && upcoming && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-end lg:items-center justify-center p-4 z-40">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <div className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                Focus Mode
              </div>
              <button
                onClick={() => setFocusMode(false)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="text-lg font-bold text-slate-900 dark:text-white">{upcoming.title}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Starts at {formatTime(upcoming.start)} • {upcoming.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4" />
                <span>Time remaining: {countdown}</span>
              </div>
              <div className="mt-4">
                <div className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-2">Preparation Checklist</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(upcoming.checklists).map(([k, v]) => (
                    <label key={k} className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                      <input
                        type="checkbox"
                        checked={v}
                        onChange={(ev) =>
                          setEvents((prev) =>
                            prev.map((e) =>
                              e.id === upcoming.id
                                ? { ...e, checklists: { ...e.checklists, [k]: ev.target.checked } }
                                : e
                            )
                          )
                        }
                      />
                      <span className="capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {drawerEvent && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerEvent(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-slate-900 dark:text-white">Event Details</div>
              <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setDrawerEvent(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="text-lg font-bold text-slate-900 dark:text-white">{drawerEvent.title}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {formatTime(drawerEvent.start)} – {formatTime(drawerEvent.end)} • {drawerEvent.location}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-xs">
                  <div className="font-bold text-slate-700 dark:text-slate-300">Case Number</div>
                  <div>{drawerEvent.caseNumber}</div>
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-700 dark:text-slate-300">Client</div>
                  <div>{drawerEvent.client}</div>
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-700 dark:text-slate-300">Opposing Counsel</div>
                  <div>{drawerEvent.opposingCounsel}</div>
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-700 dark:text-slate-300">Courtroom</div>
                  <div>{drawerEvent.courtroom}</div>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Documents</div>
                <div className="flex flex-wrap gap-2">
                  {drawerEvent.documents.map((d) => (
                    <span key={d} className="text-xs px-2 py-1 rounded border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Notes</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">{drawerEvent.notes}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40">
                  <div className="text-xs font-bold text-amber-800 dark:text-amber-400 mb-1">Risk Awareness</div>
                  <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                    {drawerEvent.riskFlags.missingDocs && <li>Missing documents</li>}
                    {drawerEvent.riskFlags.tightDeadline && <li>Tight deadlines</li>}
                    {drawerEvent.riskFlags.aggressiveOpposition && <li>Aggressive opposing counsel</li>}
                    {!drawerEvent.riskFlags.missingDocs &&
                      !drawerEvent.riskFlags.tightDeadline &&
                      !drawerEvent.riskFlags.aggressiveOpposition && <li>No major risks</li>}
                  </ul>
                </div>
                <div className="p-3 rounded border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Event Insights</div>
                  <div className="text-sm text-slate-800 dark:text-slate-200">Win probability: {Math.round(drawerEvent.insight.winProbability * 100)}%</div>
                  <div className="text-sm text-slate-800 dark:text-slate-200">Priority: {drawerEvent.insight.priority}</div>
                  <div className="text-sm text-slate-800 dark:text-slate-200">Last outcome: {drawerEvent.insight.lastOutcome}</div>
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Consequence: {drawerEvent.type === "Court" || drawerEvent.type === "Deadline" ? "High – Legal consequences" : drawerEvent.type === "Meeting" ? "Medium – Client dissatisfaction" : "Low – Minor disruption"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 text-sm rounded-md bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700 flex items-center gap-2">
                  <Video className="w-4 h-4" /> Join
                </button>
                <button className="px-3 py-2 text-sm rounded-md bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" /> Case File
                </button>
                <button className="px-3 py-2 text-sm rounded-md bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Docs
                </button>
                <button className="px-3 py-2 text-sm rounded-md bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed right-6 bottom-6 px-4 py-3 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-900/20 border border-orange-400/30"
      >
        Add Event
      </button>
      {showAdd && (
        <AddEventModal
          onClose={() => setShowAdd(false)}
          onAdd={(payload) => {
            const { title, type, dateStr, timeStr, duration, location, client, caseNumber, distanceKm, repeat, documents, notes } = payload;
            const [h, m] = timeStr.split(":").map((x) => parseInt(x, 10));
            const date = new Date(dateStr);
            date.setHours(h, m, 0, 0);
            let slot = getSuggestedSlot(date, duration);
            if (slot.start < date) slot = { start: date, end: addMinutes(date, duration) };
            const baseEvent = {
              id: `evt-${Date.now()}`,
              title,
              type,
              start: slot.start,
              end: slot.end,
              location,
              caseNumber,
              client,
              documents: documents.filter(Boolean),
              notes,
              opposingCounsel: "-",
              courtroom: "-",
              distanceKm: parseFloat(distanceKm || "0") || 0,
              checklists: { documents: false, clientBriefed: false, evidenceVerified: false, argumentsReady: false },
              riskFlags: { missingDocs: false, tightDeadline: type === "Deadline", aggressiveOpposition: false },
              insight: { winProbability: 0.5, priority: "Normal", lastOutcome: "N/A" },
            };
            const newEvents = [baseEvent];
            if (repeat === "weekly-4") {
              for (let i = 1; i <= 4; i++) {
                const ns = addMinutes(addMinutes(new Date(slot.start), i * 7 * 24 * 60), 0);
                const ne = addMinutes(addMinutes(new Date(slot.end), i * 7 * 24 * 60), 0);
                newEvents.push({ ...baseEvent, id: `evt-${Date.now()}-${i}`, start: ns, end: ne });
              }
            }
            setEvents((prev) => adjustPredictively([...prev, ...newEvents]));
            setShowAdd(false);
            toast.success("Event added");
          }}
          suggestSlot={getSuggestedSlot}
        />
      )}
      <ToastContainer />
    </div>
  );
}

function ProgressNow({ start, end }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const update = () => {
      const n = new Date().getTime();
      const p = Math.min(100, Math.max(0, ((n - start.getTime()) / (end.getTime() - start.getTime())) * 100));
      setPct(p);
    };
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, [start, end]);
  return (
    <div className="mt-2 h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${pct}%` }} />
    </div>
  );
}

function MonthGrid({ events, onSelectDay }) {
  const [cursor, setCursor] = useState(() => {
    const d = now();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const start = new Date(cursor);
  const startDay = new Date(start);
  startDay.setDate(1 - ((start.getDay() + 6) % 7));
  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(startDay);
    d.setDate(startDay.getDate() + i);
    days.push(d);
  }
  const byDay = events.reduce((acc, e) => {
    const key = e.start.toDateString();
    acc[key] = acc[key] || [];
    acc[key].push(e);
    return acc;
  }, {});
  const title = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700" onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>Prev</button>
          <button className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700" onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>Next</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (<div key={d} className="text-center">{d}</div>))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const key = d.toDateString();
          const isThisMonth = d.getMonth() === cursor.getMonth();
          const list = byDay[key] || [];
          return (
            <button key={key} onClick={() => onSelectDay && onSelectDay(new Date(d))}
              className={`h-24 p-2 rounded border text-left flex flex-col gap-1 overflow-hidden ${isThisMonth ? "bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700" : "bg-slate-50 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800"}`}>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">{d.getDate()}</div>
              <div className="flex flex-col gap-1 overflow-hidden">
                {list.slice(0,3).map((e) => (
                  <div key={e.id} className={`text-[10px] px-1 py-0.5 rounded border truncate ${
                    e.type === "Court" ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40" :
                    e.type === "Meeting" ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40" :
                    e.type === "Deadline" ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40" :
                    "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40"
                  }`}>{e.title}</div>
                ))}
                {list.length > 3 && <div className="text-[10px] text-slate-500">+{list.length-3} more</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeekGrid({ events }) {
  const startOfWeek = (() => {
    const d = now();
    const w = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - w);
    d.setHours(0, 0, 0, 0);
    return d;
  })();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });
  const byDay = events.reduce((acc, e) => {
    const key = e.start.toDateString();
    acc[key] = acc[key] || [];
    acc[key].push(e);
    return acc;
  }, {});
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const key = d.toDateString();
          const list = byDay[key] || [];
          return (
            <div key={key} className="min-h-40 rounded border bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 p-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</div>
              <div className="flex flex-col gap-1">
                {list.map((e) => (
                  <div key={e.id} className={`text-[10px] px-2 py-1 rounded border truncate ${
                    e.type === "Court" ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40" :
                    e.type === "Meeting" ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40" :
                    e.type === "Deadline" ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40" :
                    "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40"
                  }`}>
                    <span className="font-bold">{e.title}</span>
                    <span className="ml-2">{e.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                ))}
                {list.length === 0 && <div className="text-[11px] text-slate-500 dark:text-slate-400">No events</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AddEventModal({ onClose, onAdd, suggestSlot }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Meeting");
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().slice(0, 10));
  const [timeStr, setTimeStr] = useState("10:00");
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState("");
  const [client, setClient] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [repeat, setRepeat] = useState("none");
  const [doc1, setDoc1] = useState("");
  const [doc2, setDoc2] = useState("");
  const [notes, setNotes] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold text-slate-900 dark:text-white">Add Event</div>
            <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onClose}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="px-3 py-2 rounded border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
            <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 rounded border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <option>Court</option><option>Meeting</option><option>Deadline</option><option>Personal</option>
            </select>
            <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="px-3 py-2 rounded border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
            <input type="time" value={timeStr} onChange={(e) => setTimeStr(e.target.value)} className="px-3 py-2 rounded border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
            <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value, 10))} placeholder="Duration (min)" className="px-3 py-2 rounded border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="px-3 py-2 rounded border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
            <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" className="px-3 py-2 rounded border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
            <input value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} placeholder="Case number" className="px-3 py-2 rounded border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
            <input value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} placeholder="Distance (km)" className="px-3 py-2 rounded border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
            <select value={repeat} onChange={(e) => setRepeat(e.target.value)} className="px-3 py-2 rounded border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <option value="none">No repeat</option>
              <option value="weekly-4">Weekly x4</option>
            </select>
            <input value={doc1} onChange={(e) => setDoc1(e.target.value)} placeholder="Document 1 (name)" className="px-3 py-2 rounded border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
            <input value={doc2} onChange={(e) => setDoc2(e.target.value)} placeholder="Document 2 (name)" className="px-3 py-2 rounded border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes or voice memo link" className="col-span-2 px-3 py-2 rounded border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => {
                const date = new Date(dateStr);
                const s = suggestSlot(date, duration);
                setSuggestion(s);
              }}
              className="px-3 py-2 text-sm rounded-md bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700"
            >
              Suggest Slot
            </button>
            {suggestion && (
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Suggested {suggestion.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {suggestion.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            )}
            <div className="ml-auto flex items-center gap-2">
              <button onClick={onClose} className="px-3 py-2 text-sm rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">Cancel</button>
              <button
                onClick={() =>
                  onAdd({
                    title,
                    type,
                    dateStr,
                    timeStr,
                    duration,
                    location,
                    client,
                    caseNumber,
                    distanceKm,
                    repeat,
                    documents: [doc1, doc2],
                    notes,
                  })
                }
                className="px-3 py-2 text-sm rounded-md bg-orange-600 hover:bg-orange-500 text-white border border-orange-500/50"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function useRefStore() {
  const [ids, setIds] = useState([]);
  const add = (id) => setIds((prev) => [...prev, id]);
  const clearAll = () => {
    ids.forEach((i) => clearTimeout(i));
    setIds([]);
  };
  return { add, clearAll };
}
