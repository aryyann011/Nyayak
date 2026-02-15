// components/SuccessModal.jsx
import React from 'react';
import { CheckCircle, X } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, meetingTime }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-2xl transform transition-all scale-100">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-green-100 p-2 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">Meeting Scheduled!</h3>
        <p className="text-gray-600 mb-6">
          Your meeting has been successfully set for <span className="font-semibold text-gray-900">{meetingTime}</span>. A notification has been sent to the client.
        </p>

        <button 
          onClick={onClose}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;