"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Jam, Message, User } from "@/lib/types";
import { X, Send, Calendar, Users, MapPin, UserPlus, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatPanelProps {
  jam: Jam;
  messages: Message[];
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (content: string) => void;
  onJoinJam: () => void;
  onLeaveJam: () => void;
  isAttending: boolean;
}

export default function ChatPanel({
  jam,
  messages,
  currentUser,
  isOpen,
  onClose,
  onSendMessage,
  onJoinJam,
  onLeaveJam,
  isAttending,
}: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage.trim());
    setNewMessage("");
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    if (date.toDateString() === now.toDateString()) {
      return `Hoje às ${date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Amanhã às ${date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}`;
    }
    return date.toLocaleDateString("pt-PT", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[1000]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-[1001] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X size={20} className="text-foreground" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {jam.icon && <span className="text-lg">{jam.icon}</span>}
                  <h2 className="font-semibold text-foreground truncate">{jam.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground truncate">{jam.location}</p>
              </div>
            </div>

            {/* Jam Info */}
            <div className="px-4 py-3 bg-secondary/50 border-b border-border">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{formatDate(jam.dateTime)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={14} />
                  <span>{jam.attendees.length} a participar</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {isAttending ? (
                  <button
                    onClick={onLeaveJam}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors text-sm font-medium"
                  >
                    <LogOut size={16} />
                    Sair da jam
                  </button>
                ) : (
                  <button
                    onClick={onJoinJam}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium"
                  >
                    <UserPlus size={16} />
                    Participar
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <p className="text-center">Ainda não há mensagens</p>
                  <p className="text-sm">Sê o primeiro a dizer alguma coisa!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = message.userId === currentUser.uid;
                  return (
                    <div
                      key={message.id}
                      className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}
                    >
                      {!isOwn && (
                        <span className="text-xs text-muted-foreground mb-1 ml-1">
                          {message.userName}
                        </span>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] px-4 py-2 rounded-2xl",
                          isOwn
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-secondary text-secondary-foreground rounded-bl-md"
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 mx-1">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escreve uma mensagem..."
                  className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="p-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
