import React, { useEffect, useState } from "react";
import { Check, Info, AlertCircle, X, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationToast = ({ notification, onClose }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation in
    requestAnimationFrame(() => setIsVisible(true));

    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation out
  };

  const handleClick = () => {
    if (notification.link) {
      navigate(notification.link);
      handleClose();
    }
  };

  // Icon Mapping
  const icons = {
    success: <Check className="w-6 h-6 text-green-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
    error: <AlertCircle className="w-6 h-6 text-red-500" />
  };

  return (
    <div
      className={`
        pointer-events-auto 
        w-80 md:w-96  /* <--- CHANGED THIS: Fixed width prevents squishing */
        overflow-hidden rounded-2xl 
        bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 
        shadow-2xl ring-1 ring-black ring-opacity-5 
        transition-all duration-300 ease-out transform
        ${isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-2 opacity-0 scale-95"}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            {icons[notification.type] || icons.info}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5 cursor-pointer" onClick={handleClick}>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {notification.title}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 break-words leading-relaxed">
              {notification.message}
            </p>
            {notification.link && (
                <p className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                    View Details <ExternalLink className="w-3 h-3" />
                </p>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md bg-white dark:bg-transparent text-slate-400 hover:text-slate-500 focus:outline-none"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;