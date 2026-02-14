import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import NotificationToast from '../components/NotificationToast'; // Verify this path!
import { useAuth } from './Authcontext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);

  // 1. LISTEN FOR ALERTS
  useEffect(() => {
    if (!user) return;

    // console.log("🔌 Connecting to Realtime for user:", user.id);

    const channel = supabase
      .channel('realtime_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`, // Only show alerts meant for ME
        },
        (payload) => {
          // console.log("🔔 REALTIME EVENT RECEIVED:", payload);
          setNotification(payload.new);
          // Play sound
          try {
             const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
             audio.play().catch(() => {});
          } catch(e) {}
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            // console.log("✅ Realtime Connected");
        }
        if (status === 'CHANNEL_ERROR') {
            console.error("❌ Realtime Error. Check Supabase Dashboard -> Replication.");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // 2. SEND ALERTS
  const sendNotification = async (targetUserId, title, message, type = 'info', link = null) => {
    // SAFETY CHECK: Don't try to insert if ID is missing
    if (!targetUserId) {
        console.error("❌ ABORTING NOTIFICATION: Target User ID is missing/undefined.");
        return;
    }

    try {
        const { error } = await supabase.from('notifications').insert([
          {
            user_id: targetUserId,
            title,
            message,
            type,
            link
          }
        ]);

        if (error) {
            console.error("❌ DB Insert Failed:", error.message);
            // alert("System Notification Error: " + error.message); 
        } else {
            // console.log("✅ Notification saved to DB");
        }
    } catch (err) {
        console.error("System Error:", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ sendNotification }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-auto">
        {notification && (
          <NotificationToast 
            notification={notification} 
            onClose={() => setNotification(null)} 
          />
        )}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);