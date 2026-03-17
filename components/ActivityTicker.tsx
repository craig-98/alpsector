import { useEffect, useState } from 'react';
import { initSocket } from '@/lib/socket';

interface Activity {
  message: string;
  timestamp: string;
}

export default function ActivityTicker() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const socket = initSocket();

    socket.on('activity', (data: Activity) => {
      setActivities(prev => {
        const newActivities = [data, ...prev].slice(0, 5);
        return newActivities;
      });
    });

    return () => {
      socket.off('activity');
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl z-40 animate-slide-in-right">
      <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
        Live Activity
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Waiting for activity...</p>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="text-white/90 text-sm p-2 bg-white/5 rounded-xl animate-pulse">
              {activity.message}
              <span className="text-xs text-gray-400 block mt-1">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
