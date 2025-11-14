'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { Send, Users, X, MessageCircle } from 'lucide-react';

interface ChatBoxProps {
  currentUsn: string;
  currentName: string;
}

export function ChatBox({ currentUsn, currentName }: ChatBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'global' | 'private'>('global');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isConnected,
    globalMessages,
    privateMessages,
    onlineUsers,
    typingUsers,
    sendGlobalMessage,
    sendPrivateMessage,
    sendTypingIndicator,
    fetchPrivateMessages,
  } = useChat(currentUsn, currentName);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [globalMessages, privateMessages, selectedUser]);

  // Fetch private messages when user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchPrivateMessages(selectedUser);
    }
  }, [selectedUser]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    if (activeTab === 'global') {
      sendGlobalMessage(messageInput);
    } else if (selectedUser) {
      sendPrivateMessage(selectedUser, messageInput);
    }

    setMessageInput('');
  };

  const handleTyping = () => {
    if (activeTab === 'global') {
      sendTypingIndicator(true);
    } else if (selectedUser) {
      sendTypingIndicator(false, selectedUser);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-bold">Chat</h3>
          {isConnected && (
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          )}
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('global')}
          className={`flex-1 py-3 text-sm font-semibold ${
            activeTab === 'global'
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Global Chat
        </button>
        <button
          onClick={() => setActiveTab('private')}
          className={`flex-1 py-3 text-sm font-semibold ${
            activeTab === 'private'
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <span>Private</span>
            <Users className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {activeTab === 'global' ? (
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {globalMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.senderUsn === currentUsn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${
                      msg.senderUsn === currentUsn
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.senderUsn !== currentUsn && (
                      <p className="text-xs font-semibold mb-1">{msg.senderName}</p>
                    )}
                    <p className="text-sm break-words">{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.createdAt || msg.timestamp!).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {typingUsers.size > 0 && (
                <p className="text-xs text-gray-500 italic">
                  {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex">
            {/* Online Users List */}
            <div className="w-32 border-r border-gray-200 overflow-y-auto">
              <div className="p-2 bg-gray-50 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-600">Online ({onlineUsers.length})</p>
              </div>
              {onlineUsers.map((user) => (
                <button
                  key={user.usn}
                  onClick={() => setSelectedUser(user.usn)}
                  className={`w-full text-left p-2 text-xs hover:bg-gray-50 border-b border-gray-100 ${
                    selectedUser === user.usn ? 'bg-blue-50 border-l-2 border-l-blue-600' : ''
                  }`}
                >
                  <p className="font-semibold truncate">{user.studentName}</p>
                  <p className="text-gray-500 text-[10px]">{user.usn}</p>
                </button>
              ))}
            </div>

            {/* Private Messages */}
            <div className="flex-1 flex flex-col">
              {selectedUser ? (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {(privateMessages[selectedUser] || []).map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${
                          msg.senderUsn === currentUsn ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-lg p-3 ${
                            msg.senderUsn === currentUsn
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm break-words">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.createdAt || msg.timestamp!).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                  Select a user to chat
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              activeTab === 'global' ? 'Type a message...' : selectedUser ? 'Type a message...' : 'Select a user'
            }
            disabled={activeTab === 'private' && !selectedUser}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            maxLength={1000}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || (activeTab === 'private' && !selectedUser)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">{messageInput.length}/1000 characters</p>
      </div>
    </div>
  );
}
