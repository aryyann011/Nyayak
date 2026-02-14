import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { Check, Info, AlertCircle, BellOff, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationCenter = ({ isOpen, onClose }) => {
  const { allNotifications, markAllAsRead } = useNotification();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const icons = {
    success: <Check className="w-4 h-4 text-green-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />
  };

  const handleItemClick = (link) => {
    if (link) {
      navigate(link);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop to close on outside click */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      
      <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Notifications</h3>
          <button 
            onClick={markAllAsRead} 
            className="text-[10px] font-bold text-orange-600 hover:text-orange-700 uppercase tracking-tighter transition-colors"
          >
            Mark all as read
          </button>
        </div>

        {/* List */}
        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {allNotifications.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <BellOff className="w-10 h-10 text-slate-200 dark:text-slate-800 mb-3" />
              <p className="text-slate-400 text-sm font-medium">No notifications yet</p>
            </div>
          ) : (
            allNotifications.map((n) => (
              <div 
                key={n.id} 
                onClick={() => handleItemClick(n.link)}
                className={`p-4 border-b border-slate-50 dark:border-slate-800 transition-all cursor-pointer
                  ${!n.is_read ? 'bg-orange-50/40 dark:bg-orange-900/5 hover:bg-orange-50/60' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                `}
              >
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">{icons[n.type] || icons.info}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{n.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                    {n.link && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                        View Details <ExternalLink size={10} />
                      </div>
                    )}
                  </div>
                  {!n.is_read && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 shrink-0 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-center">
            <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                Clear all history
            </button>
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;