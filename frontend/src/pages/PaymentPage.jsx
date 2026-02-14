import { useState, useEffect } from "react";
import { FiShield, FiArrowLeft, FiInfo, FiLock, FiCheckCircle } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useNotification } from "../context/NotificationContext"; // <--- Import Context

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendNotification } = useNotification(); // <--- Init Hook
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // State to hold real data
  const [details, setDetails] = useState({
    amount: location.state?.amount || 5000, 
    caseTitle: "Loading...",
    lawyerName: "Loading...",
    caseId: location.state?.caseId,
    lawyerId: null // <--- Needed for notification
  });

  // --- FETCH REAL CASE DETAILS ---
  useEffect(() => {
    if (!details.caseId) {
        navigate('/my-cases'); 
        return;
    }

    const fetchDetails = async () => {
        // Fetch Title AND Lawyer ID so we can notify them later
        const { data, error } = await supabase
            .from('cases')
            .select(`
                title, 
                lawyer_id,
                lawyer:lawyers ( name )
            `)
            .eq('id', details.caseId)
            .single();

        if (!error && data) {
            setDetails(prev => ({
                ...prev,
                caseTitle: data.title,
                lawyerName: data.lawyer?.name || "Assigned Counsel",
                lawyerId: data.lawyer_id
            }));
        }
        setFetching(false);
    };

    fetchDetails();
  }, [details.caseId, navigate]);

  // --- HANDLE PAYMENT LOGIC ---
  const handlePayment = async () => {
    setLoading(true);
    
    // 1. Simulate Gateway
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 2. Update Supabase
    const { error } = await supabase
        .from('cases')
        .update({ 
            status: 'Active', 
            payment_status: 'paid',
            payment_amount: details.amount
        })
        .eq('id', details.caseId);

    setLoading(false);

    if (error) {
        alert("Payment verification failed. Please try again.");
    } else {
        // 3. Notify the Lawyer
        if (details.lawyerId) {
            await sendNotification(
                details.lawyerId,
                "Retainer Received",
                "Payment confirmed. The case is now Active.",
                "success",
                "/lawyer/cases"
            );
        }

        // 4. Navigate to Success
        navigate('/payment-success', { 
            state: { 
                transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`,
                amount: details.amount
            } 
        });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col md:flex-row font-sans">
      
      {/* LEFT: CONTEXT & SUMMARY */}
      <div className="w-full md:w-5/12 bg-[#0F172A] p-10 md:p-16 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

        <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-bold uppercase tracking-wider mb-12"
            >
              <FiArrowLeft /> Cancel Payment
            </button>

            <div className="flex items-center gap-2 text-orange-500 font-bold tracking-widest text-xs uppercase mb-4">
                <FiLock /> Secure Escrow
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
                Confirm & <br/> Activate
            </h1>

            {!fetching && (
                <div className="space-y-8 border-l-2 border-slate-700 pl-8 relative">
                    <div className="relative">
                        <div className="absolute -left-[39px] top-1 h-5 w-5 bg-[#0F172A] border-2 border-orange-500 rounded-full"></div>
                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Legal Service</p>
                        <p className="text-xl font-medium text-white">{details.caseTitle}</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[39px] top-1 h-5 w-5 bg-[#0F172A] border-2 border-slate-600 rounded-full"></div>
                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Retainer For</p>
                        <p className="text-xl font-medium text-white">{details.lawyerName}</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[39px] top-1 h-5 w-5 bg-[#0F172A] border-2 border-slate-600 rounded-full"></div>
                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Reference ID</p>
                        <p className="text-xl font-mono text-slate-300 tracking-wide">{details.caseId?.slice(0,8).toUpperCase()}</p>
                    </div>
                </div>
            )}
        </div>

        <div className="mt-12 p-5 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 flex items-start gap-4">
          <FiInfo className="text-orange-500 text-xl shrink-0 mt-1" />
          <p className="text-sm text-slate-300 leading-relaxed">
            Funds are held in a secure escrow account. The lawyer initiates work immediately upon successful transaction.
          </p>
        </div>
      </div>

      {/* RIGHT: PAYMENT ACTION */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl p-10 relative">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Total Due</h2>
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <FiShield /> 256-Bit SSL Encrypted
              </div>
            </div>

            <div className="mb-10 text-center">
              <span className="text-6xl font-black text-slate-900 tracking-tighter">
                ₹{details.amount.toLocaleString()}
              </span>
              <p className="text-slate-400 font-medium mt-2 text-sm">One-time retainer fee</p>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading || fetching}
              className={`w-full py-5 rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-3 relative overflow-hidden group
                ${loading 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                  : "bg-orange-600 text-white hover:bg-orange-700 hover:-translate-y-1"}`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-slate-400 border-t-transparent rounded-full" />
                    <span>Processing Securely...</span>
                </div>
              ) : (
                <>
                    <FiCheckCircle className="text-xl" />
                    <span>Pay Securely</span>
                </>
              )}
            </button>

            <div className="mt-10 grid grid-cols-3 gap-6 opacity-40 grayscale items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-6 mx-auto" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Visa.svg" alt="Visa" className="h-4 mx-auto" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Razorpay_logo.svg" alt="Razorpay" className="h-5 mx-auto" />
            </div>
          </div>
          
          <p className="text-center text-slate-400 text-xs mt-8">
            NyayaSetu does not store your card details. All transactions are handled by authorized payment gateways.
          </p>
        </div>
      </div>
    </div>
  );
}