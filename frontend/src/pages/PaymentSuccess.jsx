import React from "react";
import { FiCheck, FiArrowRight, FiDownload, FiHome } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { transactionId, amount, caseTitle, caseId } = location.state || { 
    transactionId: "PAY-0000", 
    amount: 5000, 
    caseTitle: "Case Details", 
    caseId: null 
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Success Indicator */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <FiCheck className="text-4xl text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful</h1>
          <p className="text-slate-600">Your payment has been processed</p>
        </div>

        {/* Details Card */}
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 mb-6">
          
          {/* Amount */}
          <div className="mb-6 pb-6 border-b border-slate-200">
            <p className="text-slate-600 text-sm mb-2">Amount Paid</p>
            <p className="text-3xl font-bold text-slate-900">₹ {String(amount).replace(/₹/g, '').toLocaleString()}</p>
          </div>

          {/* Case Info */}
          <div className="space-y-4">
            <div>
              <p className="text-slate-600 text-sm mb-1">Case</p>
              <p className="text-slate-900 font-semibold">{caseTitle}</p>
            </div>
            
            <div>
              <p className="text-slate-600 text-sm mb-1">Case ID</p>
              <p className="text-slate-900 font-mono text-sm">{caseId?.slice(0, 8).toUpperCase()}</p>
            </div>

            <div>
              <p className="text-slate-600 text-sm mb-1">Transaction ID</p>
              <p className="text-slate-900 font-mono text-sm">{transactionId}</p>
            </div>

            <div>
              <p className="text-slate-600 text-sm mb-1">Date & Time</p>
              <p className="text-slate-900 text-sm">
                {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} at {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div>
              <p className="text-slate-600 text-sm mb-1">Status</p>
              <p className="text-green-600 font-semibold flex items-center gap-2">
                <FiCheck className="w-4 h-4" /> Completed
              </p>
            </div>
          </div>

        </div>

        {/* Info Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-900 text-sm leading-relaxed">
            Your case is now active. Your assigned lawyer will contact you shortly. You'll receive updates via email.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/cases")}
            className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <FiHome className="w-5 h-5" /> Go to Dashboard
          </button>
          
          <button
            onClick={() => window.print()}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 border border-slate-300"
          >
            <FiDownload className="w-5 h-5" /> Download Receipt
          </button>
        </div>

      </div>
    </div>
  );
}
