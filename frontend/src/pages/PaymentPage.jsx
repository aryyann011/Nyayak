import { useState } from "react";
import { FiShield, FiCheck, FiArrowLeft, FiInfo, FiMoon, FiSun } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/themeContext";
import { supabase } from "../lib/supabase";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  // This would ideally come from your Router State or Supabase
  const paymentDetails = {
    amount: 5000,
    caseTitle: "Property Dispute Case",
    lawyerName: "Adv. Rajesh Sharma",
    caseId: "NYA-2024-0892"
  };

  const handlePayment = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("Payment Successful 🎉");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-slate-950 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Theme Toggle Button */}
     

      {/* Left Side: Order Summary (Context for the User) */}
      <div className="w-full md:w-1/2 bg-slate-900 dark:bg-[#0f172a] p-8 md:p-16 text-white flex flex-col justify-center">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-slate-300 transition mb-12"
        >
          <FiArrowLeft /> Back to Case
        </button>

        <span className="text-orange-500 dark:text-orange-400 font-bold tracking-widest text-xs uppercase mb-2">Secure Checkout</span>
        <h1 className="text-4xl font-bold mb-8 text-white dark:text-slate-100">Confirm & Pay</h1>

        <div className="space-y-6 border-l-2 border-slate-800 dark:border-slate-700 pl-6">
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-sm">Service</p>
            <p className="text-xl font-medium text-white dark:text-slate-200">{paymentDetails.caseTitle}</p>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-sm">Legal Counsel</p>
            <p className="text-xl font-medium text-white dark:text-slate-200">{paymentDetails.lawyerName}</p>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-sm">Case Reference</p>
            <p className="text-xl font-mono text-orange-400 dark:text-orange-300">{paymentDetails.caseId}</p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-slate-800/50 dark:bg-slate-800/30 rounded-2xl flex items-center gap-4">
          <FiInfo className="text-orange-500 dark:text-orange-400 text-xl" />
          <p className="text-sm text-slate-300 dark:text-slate-400">
            Payment goes into a secure escrow. Funds are released to the lawyer once the next milestone is reached.
          </p>
        </div>
      </div>

      {/* Right Side: Payment Action */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-slate-900">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] shadow-xl dark:shadow-2xl p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Total Due</h2>
              <div className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <FiShield size={12}/> SECURE
              </div>
            </div>

            <div className="mb-10 text-center">
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                ₹{paymentDetails.amount.toLocaleString()}
              </span>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Inclusive of all legal processing fees</p>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3
                ${loading 
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed" 
                  : "bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white hover:-translate-y-1"}`}
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>Pay Now</>
              )}
            </button>

            <div className="mt-8 grid grid-cols-3 gap-4 opacity-40 dark:opacity-30 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4 mx-auto" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Visa.svg" alt="Visa" className="h-4 mx-auto" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Razorpay_logo.svg" alt="Razorpay" className="h-4 mx-auto" />
            </div>
          </div>
          
          <p className="text-center text-slate-400 dark:text-slate-500 text-xs mt-6 px-10">
            By clicking "Pay Now", you agree to NyayaSetu's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}