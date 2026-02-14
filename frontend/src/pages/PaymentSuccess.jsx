import { FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white shadow-xl rounded-3xl p-10 text-center max-w-md">
        <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-3">Payment Successful</h1>
        <p className="text-gray-500 mb-6">
          Your payment has been securely processed.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
