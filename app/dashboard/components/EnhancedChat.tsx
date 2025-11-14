"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import { Send, MessageCircle, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedChatProps {
  currentUsn: string;
  currentName: string;
}

export function EnhancedChat({ currentUsn, currentName }: EnhancedChatProps) {
  const [messageInput, setMessageInput] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isConnected,
    globalMessages,
    privateMessages,
    onlineUsers,
    sendGlobalMessage,
    sendPrivateMessage,
    fetchPrivateMessages,
  } = useChat(currentUsn, currentName);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [globalMessages, privateMessages, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      fetchPrivateMessages(selectedUser);
    }
  }, [selectedUser, fetchPrivateMessages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    if (selectedUser) {
      sendPrivateMessage(selectedUser, messageInput);
    } else {
      sendGlobalMessage(messageInput);
    }

    setMessageInput("");
  };

  const selectedUserName = onlineUsers.find((u) => u.usn === selectedUser)?.studentName || selectedUser;

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="border-b p-4 bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Chat</h3>
          </div>
          {isConnected && (
            <Badge variant="success" className="text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
              Online
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="global" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="m-4 grid grid-cols-2">
          <TabsTrigger value="global" onClick={() => setSelectedUser(null)}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Global
          </TabsTrigger>
          <TabsTrigger value="custom">
            <Users className="w-4 h-4 mr-2" />
            Private ({onlineUsers.length})
          </TabsTrigger>
        </TabsList>

        {/* Global Tab */}
        <TabsContent value="global" className="flex-1 flex flex-col m-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence>
              {globalMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={cn("flex", msg.senderUsn === currentUsn ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      msg.senderUsn === currentUsn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {msg.senderUsn !== currentUsn && (
                      <p className="text-xs font-semibold mb-1 opacity-70">{msg.senderName}</p>
                    )}
                    <p className="text-sm break-words">{msg.message}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(msg.createdAt || msg.timestamp!).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </TabsContent>

        {/* Custom Tab */}
        <TabsContent value="custom" className="flex-1 flex m-0 overflow-hidden">
          <div className="w-32 border-r overflow-y-auto bg-muted/10">
            {onlineUsers.map((user) => (
              <button
                key={user.usn}
                onClick={() => setSelectedUser(user.usn)}
                className={cn(
                  "w-full text-left p-3 text-xs hover:bg-muted/50 border-b transition-colors",
                  selectedUser === user.usn && "bg-primary/10 border-l-2 border-l-primary"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{user.studentName || user.usn}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedUser ? (
              <>
                <div className="p-3 border-b bg-muted/10">
                  <p className="text-sm font-semibold">{selectedUserName}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <AnimatePresence>
                    {(privateMessages[selectedUser] || []).map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={cn("flex", msg.senderUsn === currentUsn ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg p-3",
                            msg.senderUsn === currentUsn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p className="text-sm break-words">{msg.message}</p>
                          <p className="text-xs opacity-60 mt-1">
                            {new Date(msg.createdAt || msg.timestamp!).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                Select a user to chat
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Input */}
      <div className="border-t p-4 bg-muted/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={selectedUser ? `Message ${selectedUserName}...` : "Message everyone..."}
            className="flex-1 px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            maxLength={1000}
          />
          <Button onClick={handleSendMessage} size="icon" disabled={!messageInput.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
