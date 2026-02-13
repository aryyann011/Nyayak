import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Scale 
} from "lucide-react";

export default function CaseManagement() {
  const [activeTab, setActiveTab] = useState("requests");

  const dummyRequests = [
    { id: 1, title: "Cyber Fraud - Bank Phishing", client: "Raj Patel", category: "Cyber Crime", description: "Lost ₹50,000 due to phishing link scam.", date: "14 Feb 2026" },
    { id: 2, title: "Bail Application", client: "Amit Kumar", category: "Criminal", description: "Need urgent bail assistance.", date: "13 Feb 2026" },
  ];

  const dummyDocket = [
    { id: 1, title: "State vs Kumar", client: "Amit Kumar", nextHearing: "20 Feb 2026", status: "Active" },
    { id: 2, title: "Consumer Complaint - Flipkart", client: "Rohit Sharma", nextHearing: "25 Feb 2026", status: "Filed" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
            <Scale size={28} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Case Management</h1>
        </div>
        <p className="text-gray-500">Manage pending legal requests and track your active court docket.</p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Modern Tabs */}
        <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl w-fit mb-8">
          {["requests", "docket"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg ${
                activeTab === tab ? "text-orange-700" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white shadow-sm rounded-lg"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <span className="relative z-10 capitalize">
                {tab === "requests" ? "Case Requests" : "My Docket"}
              </span>
            </button>
          ))}
        </div>

        {/* Content with Animation */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === "requests" ? (
              <motion.div 
                key="requests"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                {dummyRequests.map((item) => (
                  <CaseCard key={item.id} data={item} type="request" />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="docket"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                {dummyDocket.map((item) => (
                  <CaseCard key={item.id} data={item} type="docket" />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function CaseCard({ data, type }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
      className="group bg-white border border-gray-100 p-6 rounded-2xl transition-all duration-300 hover:border-orange-200 relative overflow-hidden"
    >
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-orange-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
            <Briefcase size={14} />
            {data.category || data.status}
          </div>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={14} />
            {data.date || "Next: " + data.nextHearing}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">
          {data.title}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <User size={16} />
          <span className="text-sm font-medium">{data.client}</span>
        </div>

        {data.description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
            {data.description}
          </p>
        )}

        <div className="flex items-center gap-3">
          {type === "request" ? (
            <>
              <button className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-gray-200">
                <CheckCircle size={18} /> Accept
              </button>
              <button className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
                <XCircle size={18} />
              </button>
            </>
          ) : (
            <button className="w-full bg-white border-2 border-orange-500 text-orange-600 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-all">
              View Full File <ExternalLink size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}