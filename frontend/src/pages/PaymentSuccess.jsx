import React from "react";
import { FiCheck, FiArrowRight, FiDownload } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { transactionId, amount } = location.state || { transactionId: "TXN-0000", amount: 5000 };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 font-sans">
      <div className="max-w-md w-full">
        
        {/* Receipt Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative">
          {/* Top Green Section */}
          <div className="bg-green-600 p-8 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce-short">
                <FiCheck className="text-4xl text-green-600" />
             </div>
             <h1 className="text-2xl font-bold text-white mb-1">Payment Successful</h1>
             <p className="text-green-100 text-sm">Your case is now active</p>
          </div>

          {/* Receipt Details */}
          <div className="p-8 relative">
             {/* Receipt Cutout Effect */}
             <div className="absolute top-0 left-0 w-full h-4 -mt-2 bg-[#F8FAFC] rounded-b-xl"></div>

             <div className="space-y-4 mb-8 pt-4">
                <div className="flex justify-between items-center pb-4 border-b border-dashed border-slate-200">
                   <span className="text-slate-500 text-sm">Transaction ID</span>
                   <span className="font-mono text-slate-800 font-bold">{transactionId}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-dashed border-slate-200">
                   <span className="text-slate-500 text-sm">Amount Paid</span>
                   <span className="font-bold text-slate-900 text-xl">₹{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-slate-500 text-sm">Payment Method</span>
                   <span className="text-slate-800 font-medium">HDFC Bank **** 4242</span>
                </div>
             </div>

             {/* Actions */}
             <div className="space-y-3">
                <button
                  onClick={() => navigate("/cases")}
                  className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  Go to Dashboard <FiArrowRight />
                </button>
                
                <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-slate-200">
                  <FiDownload /> Download Receipt
                </button>
             </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
           A confirmation email has been sent to your registered address.
        </p>

      </div>
    </div>
  );
}