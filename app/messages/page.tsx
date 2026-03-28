"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Send,
  Search,
  User,
  Clock,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import MobileBottomNav from "@/components/MobileBottomNav";
import { messages } from "@/lib/api";

interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  isFromAdmin: boolean;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [messagesList, setMessagesList] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const data = await messages.getUser();
      setMessagesList(data || []);
      if (data && data.length > 0) {
        setSelectedMessage(data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchMessages();
  }, [router]);

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    try {
      setSending(true);
      await messages.create({ content: reply });
      toast.success("Message sent!");
      setReply("");
      fetchMessages();
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="text-center p-8 relative z-10 glass-panel rounded-3xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-r-2 border-emerald-500 border-b-transparent border-l-transparent mx-auto mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-grey-50 via-dark-grey-100 to-white text-black font-bold pb-24">
      <header className="pt-20 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black text-black mb-2">Messages</h1>
          <p className="text-gray-600">Chat with support</p>
        </div>
      </header>

      <main className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            {messagesList.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-bold mb-2">No messages yet</p>
                <p className="text-sm">
                  Start a conversation with our support team
                </p>
                <Button className="mt-6 bg-emerald-600">Contact Support</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                {/* Message List */}
                <div className="max-h-[600px] overflow-y-auto">
                  <div className="p-4 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search messages..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="divide-y">
                    {messagesList.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => setSelectedMessage(msg)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${selectedMessage?.id === msg.id ? "bg-emerald-50" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-black truncate">
                                {msg.isFromAdmin ? "Support Team" : "You"}
                              </p>
                              <span className="text-xs text-gray-500">
                                {formatTime(msg.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {msg.content}
                            </p>
                            {!msg.isRead && (
                              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mt-1"></span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="md:col-span-2 flex flex-col h-[600px]">
                  {selectedMessage ? (
                    <>
                      <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-black">Support Team</p>
                            <p className="text-xs text-gray-500">Online</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messagesList
                          .filter((m) => m.isFromAdmin || !m.isFromAdmin)
                          .map((msg) => (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${msg.isFromAdmin ? "justify-start" : "justify-end"}`}
                            >
                              <div
                                className={`max-w-[70%] p-4 rounded-2xl ${msg.isFromAdmin ? "bg-gray-100 text-black" : "bg-emerald-500 text-white"}`}
                              >
                                <p className="text-sm">{msg.content}</p>
                                <div
                                  className={`flex items-center justify-end gap-1 mt-1 ${msg.isFromAdmin ? "text-gray-500" : "text-white/70"}`}
                                >
                                  <span className="text-xs">
                                    {formatTime(msg.createdAt)}
                                  </span>
                                  {!msg.isFromAdmin && msg.isRead && (
                                    <CheckCheck className="w-3 h-3" />
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>

                      <div className="p-4 border-t">
                        <div className="flex gap-3">
                          <Input
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Type your message..."
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleSendReply()
                            }
                          />
                          <Button
                            onClick={handleSendReply}
                            disabled={sending || !reply.trim()}
                            className="bg-emerald-600"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      <p>Select a message to view</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <MobileBottomNav active="messages" />
    </div>
  );
}
