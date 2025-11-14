'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Users, MessageCircle, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/hooks/useChat';

interface ChatPanelProps {
  usn: string;
  studentName: string;
}

type ChatView = 'global' | string; // 'global' or USN for private chat

export default function ChatPanel({ usn, studentName }: ChatPanelProps) {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ChatView>('global');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    isConnected, 
    globalMessages, 
    privateMessages, 
    onlineUsers, 
    typingUsers,
    sendGlobalMessage, 
    sendPrivateMessage,
    emitTypingGlobal,
    emitTypingPrivate 
  } = useChat(usn, studentName);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [globalMessages, privateMessages, currentView]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (currentView === 'global') {
      sendGlobalMessage(message);
    } else {
      sendPrivateMessage(currentView, message);
    }
    setMessage('');
  };

  const handleTyping = () => {
    if (currentView === 'global') {
      emitTypingGlobal();
    } else {
      emitTypingPrivate(currentView);
    }
  };

  const currentMessages = currentView === 'global' 
    ? globalMessages 
    : privateMessages[currentView] || [];

  const unreadPrivateChats = Object.keys(privateMessages).filter(
    partnerUsn => partnerUsn !== currentView && privateMessages[partnerUsn].length > 0
  );

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-2xl flex items-center justify-center text-white"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {isConnected && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        )}
        {unreadPrivateChats.length > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white text-xs font-bold flex items-center justify-center">
            {unreadPrivateChats.length}
          </span>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-40 w-[450px] h-[650px] bg-gray-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-white" />
                  <div>
                    <h3 className="font-bold text-white">
                      {currentView === 'global' ? 'Global Chat' : onlineUsers.find(u => u.usn === currentView)?.name || 'Private Chat'}
                    </h3>
                    <p className="text-xs text-white/80 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {onlineUsers.length + 1} online
                    </p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-400'} animate-pulse`} />
              </div>

              {/* View Tabs */}
              <div className="flex gap-2 overflow-x-auto custom-scrollbar">
                <button
                  onClick={() => setCurrentView('global')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    currentView === 'global' 
                      ? 'bg-white text-green-600' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                   Global
                </button>
                {onlineUsers.map(user => (
                  <button
                    key={user.usn}
                    onClick={() => setCurrentView(user.usn)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all relative ${
                      currentView === user.usn 
                        ? 'bg-white text-green-600' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                     {user.name.split(' ')[0]}
                    {privateMessages[user.usn]?.length > 0 && currentView !== user.usn && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gray-950">
              {currentMessages.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs mt-1">
                    {currentView === 'global' ? 'Start the conversation!' : `Send a private message to ${onlineUsers.find(u => u.usn === currentView)?.name}`}
                  </p>
                </div>
              ) : (
                currentMessages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.senderUsn === usn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] ${msg.senderUsn === usn ? 'bg-green-600' : 'bg-gray-700'} rounded-2xl px-4 py-2 shadow-lg`}>
                      {msg.senderUsn !== usn && (
                        <p className="text-xs text-green-300 font-semibold mb-1">
                          {msg.senderName}
                        </p>
                      )}
                      <p className="text-white text-sm break-words">{msg.message}</p>
                      <p className="text-xs text-white/50 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
              
              {/* Typing Indicator */}
              {Array.from(typingUsers).filter(u => u !== usn).map(typingUsn => (
                <div key={typingUsn} className="flex items-center gap-2 text-gray-400 text-xs">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>{onlineUsers.find(u => u.usn === typingUsn)?.name || 'Someone'} is typing...</span>
                </div>
              ))}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-gray-800 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                  }}
                  placeholder={currentView === 'global' ? 'Message everyone...' : `Message ${onlineUsers.find(u => u.usn === currentView)?.name}...`}
                  className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={!isConnected}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || !isConnected}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              {!isConnected && (
                <p className="text-xs text-red-400 mt-2 text-center">Connecting to chat...</p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}