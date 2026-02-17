import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import NotificationToast from "../components/NotificationToast";
import { useAuth } from "./Authcontext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);
  const [allNotifications, setAllNotifications] = useState([]);

  /* ================= FETCH ON LOGIN ================= */
  const fetchHistoryAndSync = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setAllNotifications(data);

      // 🔥 Show popup ONLY if there are unread notifications
      const unread = data.filter((n) => n.is_read === false);

      if (unread.length > 0) {
        const firstUnread = unread[0];

        setNotification(firstUnread);

        // Mark ALL unread as read in DB
        const { error: updateError } = await supabase
  .from("notifications")
  .update({ is_read: true })
  .eq("user_id", user.id)
  .eq("is_read", false);

if (updateError) {
  console.error("Update failed:", updateError);
}


        // Update local state
        setAllNotifications((prev) =>
          prev.map((n) => ({ ...n, is_read: true }))
        );
      }
    }
  };

  /* ================= REALTIME LISTENER ================= */
  useEffect(() => {
    if (!user) return;

    fetchHistoryAndSync();

    const channel = supabase
      .channel("global_notifications_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          const newNotif = payload.new;

          // Show popup immediately
          setNotification(newNotif);
          setAllNotifications((prev) => [newNotif, ...prev]);

          // Play sound
          try {
            new Audio(
              "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
            )
              .play()
              .catch(() => {});
          } catch (e) {}

          // Mark as read immediately
          await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", newNotif.id);

          // Update local state
          setAllNotifications((prev) =>
            prev.map((n) =>
              n.id === newNotif.id ? { ...n, is_read: true } : n
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  /* ================= MARK ALL READ ================= */
  const markAllAsRead = async () => {
    if (!user) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id);

    setAllNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );
  };

  

  /* ================= SEND NOTIFICATION ================= */
  const sendNotification = async (
    targetUserId,
    title,
    message,
    type = "info",
    link = null
  ) => {
    if (!targetUserId) return;

    try {
      await supabase.from("notifications").insert([
        {
          user_id: targetUserId,
          title,
          message,
          type,
          link,
          is_read: false,
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const triggerToast = (title, message, type = "info") => {
    setNotification({ title, message, type });
  };
  return (
    <NotificationContext.Provider
      value={{
        allNotifications,
        markAllAsRead,
        fetchHistory: fetchHistoryAndSync,
        sendNotification,
        triggerToast
      }}
    >
      {children}

      {/* TOAST */}
      <div className="fixed bottom-6 right-6 z-[99999] pointer-events-auto">
        {notification && (
          <NotificationToast
            notification={notification}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
