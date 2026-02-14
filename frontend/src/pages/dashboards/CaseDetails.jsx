import { useNavigate } from "react-router-dom";
import { FiClock, FiUser, FiCreditCard, FiArrowRight, FiCheckCircle } from "react-icons/fi";

export default function CaseDetails() {
  const navigate = useNavigate();

  const caseData = {
    title: "Property Dispute Case",
    caseId: "NYA-2024-0892",
    lawyer: "Adv. Rajesh Sharma",
    status: "Accepted",
    payment_due: 5000,
    payment_status: "unpaid",
    next_hearing: "Oct 24, 2026",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <span className="text-orange-500 font-bold tracking-widest text-xs uppercase">Case Management</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mt-1">{caseData.title}</h1>
            <p className="text-slate-500 mt-1">ID: {caseData.caseId}</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-slate-800 transition font-medium flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Status Card */}
          <div className="md:col-span-2 bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-slate-400 mb-6 uppercase tracking-wider">Current Progress</h3>
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-green-50 rounded-2xl">
                    <FiCheckCircle className="text-3xl text-green-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-800">{caseData.status}</p>
                    <p className="text-slate-500">Your application was reviewed and approved.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Simple Timeline Visual */}
            <div className="mt-10 flex items-center gap-2">
              <div className="h-2 w-full bg-green-500 rounded-full"></div>
              <div className="h-2 w-full bg-green-500 rounded-full"></div>
              <div className="h-2 w-full bg-slate-100 rounded-full"></div>
              <div className="h-2 w-full bg-slate-100 rounded-full"></div>
            </div>
          </div>

          {/* Payment Widget */}
          <div className={`p-8 rounded-[2rem] border transition-all ${caseData.payment_status === 'unpaid' ? 'bg-orange-500 text-white border-orange-400 shadow-orange-200 shadow-xl' : 'bg-white border-slate-100'}`}>
            <FiCreditCard className="text-3xl mb-4" />
            <h3 className="text-lg font-medium opacity-80 uppercase tracking-wider">Pending Dues</h3>
            <p className="text-4xl font-black mt-2">₹{caseData.payment_due}</p>
            
            {caseData.payment_status === "unpaid" && (
              <button
                onClick={() => navigate("/payment")}
                className="mt-8 w-full bg-white text-orange-600 py-4 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg"
              >
                Pay Now <FiArrowRight />
              </button>
            )}
          </div>

          {/* Lawyer Info Card */}
          <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Assigned Council</h3>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-xl font-bold text-slate-500">
                <FiUser />
              </div>
              <div>
                <p className="font-bold text-slate-800">{caseData.lawyer}</p>
                <p className="text-xs text-slate-500 underline cursor-pointer hover:text-orange-500">View Profile</p>
              </div>
            </div>
          </div>

          {/* Next Hearing Card */}
          <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Next Hearing</h3>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <FiClock size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-800">{caseData.next_hearing}</p>
                <p className="text-xs text-slate-500 uppercase">District Court, Room 4</p>
              </div>
            </div>
          </div>

          {/* Action Center */}
        </div>
      </div>
    </div>
        
  );
}