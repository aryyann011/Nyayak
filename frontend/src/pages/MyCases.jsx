import React, { useState } from 'react';
import { Briefcase, Clock, FileText, ChevronRight } from 'lucide-react';

const MyCases = () => {
  const allCases = [
    {
      id: "FIR-88291",
      type: "Property Dispute",
      status: "In Progress",
      filedDate: "Oct 12, 2025",
      lastUpdate: "Hearing scheduled for July 15, 2026",
      officer: "Insp. Vikram Singh"
    },
    {
      id: "FIR-77410",
      type: "Cyber Crime",
      status: "Pending",
      filedDate: "Jan 05, 2026",
      lastUpdate: "Evidence verification under process",
      officer: "Sub-Insp. Ananya Rao"
    },
    {
      id: "FIR-99102",
      type: "Civil Defamation",
      status: "Closed",
      filedDate: "Sept 20, 2025",
      lastUpdate: "Final verdict delivered on Feb 01, 2026",
      officer: "Advocate Rajesh Kumar"
    },
    {
      id: "FIR-11223",
      type: "Fraud",
      status: "Pending",
      filedDate: "Feb 02, 2026",
      lastUpdate: "Investigation started",
      officer: "Insp. Rakesh Sharma"
    }
  ];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const casesPerPage = 2;

  const getStatusStyle = (status) => {
    switch (status) {
      case "In Progress":
        return "text-blue-600 bg-blue-50";
      case "Pending":
        return "text-orange-600 bg-orange-50";
      case "Closed":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Filtering logic
  const filteredCases = allCases.filter((c) => {
    const matchesSearch = c.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);
  const startIndex = (currentPage - 1) * casesPerPage;
  const currentCases = filteredCases.slice(
    startIndex,
    startIndex + casesPerPage
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Cases</h1>
          <p className="text-gray-500 mt-1">
            Manage and track your active legal proceedings
          </p>
        </div>
        <button className="bg-[#ff4d00] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition shadow-sm">
          + File New Case
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Case ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-lg w-full md:w-1/3"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-lg w-full md:w-1/4"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Case Grid */}
      <div className="grid gap-6">
        {currentCases.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            No cases found.
          </div>
        ) : (
          currentCases.map((legalCase) => (
            <div
              key={legalCase.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Case Info */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-orange-50 transition">
                    <Briefcase className="w-6 h-6 text-gray-600 group-hover:text-[#ff4d00]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {legalCase.type}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(
                          legalCase.status
                        )}`}
                      >
                        {legalCase.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1 uppercase font-semibold tracking-tighter">
                      Case ID: {legalCase.id}
                    </p>
                  </div>
                </div>

                {/* Updates Section */}
                <div className="flex-1 md:max-w-md bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      Latest Update
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    {legalCase.lastUpdate}
                  </p>
                </div>

                {/* Action Button */}
                <button className="flex items-center gap-2 text-[#ff4d00] font-bold hover:underline">
                  View Details
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50 flex flex-wrap gap-8">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Filed on:{" "}
                    <b className="text-gray-700">
                      {legalCase.filedDate}
                    </b>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-500">
                    Handling Officer:{" "}
                    <b className="text-gray-700">
                      {legalCase.officer}
                    </b>
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() =>
              setCurrentPage((p) => Math.max(p - 1, 1))
            }
            className="px-4 py-2 border rounded-lg"
          >
            Prev
          </button>

          <span className="px-4 py-2 text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(p + 1, totalPages)
              )
            }
            className="px-4 py-2 border rounded-lg"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCases;
