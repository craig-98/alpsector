'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bell, Trash2, Check, DollarSign, TrendingUp, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileBottomNav from '@/components/MobileBottomNav';
import { messages as messagesApi } from '@/lib/api';

interface Notification {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'profit' | 'alert' | 'info';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      const data = await messagesApi.getUser();
      // Filter for messages from admin/support as notifications
      const formattedNotifications = (data || []).filter((m: any) => m.isFromAdmin).map((m: any) => ({
        id: m.id,
        type: 'info',
        title: 'New Message',
        message: m.content,
        isRead: m.isRead,
        createdAt: m.createdAt
      }));
      
      setNotifications(formattedNotifications);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [router]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <DollarSign className="w-5 h-5 text-emerald-500" />;
      case 'withdrawal': return <DollarSign className="w-5 h-5 text-red-500" />;
      case 'profit': return <TrendingUp className="w-5 h-5 text-yellow-500" />;
      case 'investment': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-700">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-grey-50 via-dark-grey-100 to-white text-black font-bold pb-24">
      <header className="pt-20 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-black mb-2">Notifications</h1>
              <p className="text-gray-600">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead} className="rounded-xl">
                <Check className="w-4 h-4 mr-2" />Mark all read
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-bold text-gray-600 mb-2">No notifications</p>
              <p className="text-gray-500">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl p-6 shadow-lg ${!notification.isRead ? 'border-l-4 border-emerald-500' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-xl">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-black">{notification.title}</h3>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{formatTime(notification.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {!notification.isRead && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-emerald-600 p-0 mt-2"
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <MobileBottomNav active="notifications" />
    </div>
  );
}
