'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  senderUsn: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'global' | 'private';
  recipientUsn?: string;
}

interface OnlineUser {
  usn: string;
  name: string;
  studentName: string;
}

export const useChat = (usn: string, name: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [globalMessages, setGlobalMessages] = useState<Message[]>([]);
  const [privateMessages, setPrivateMessages] = useState<Record<string, Message[]>>({});
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io({
      path: '/api/socket',
      transports: ['polling'],
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: 10,
    });

    socketRef.current = socketInstance;

    socketInstance.on('connect', () => {
      console.log(' Connected to chat server');
      setIsConnected(true);
      socketInstance.emit('join', { usn, name });
    });

    socketInstance.on('disconnect', () => {
      console.log(' Disconnected from chat server');
      setIsConnected(false);
    });

    socketInstance.on('online-users-list', (data: { users: OnlineUser[] }) => {
      console.log(' Online users:', data.users.length);
      setOnlineUsers(data.users);
    });

    socketInstance.on('user-online', (data: { usn: string; name: string }) => {
      console.log(' User online:', data.name);
      setOnlineUsers((prev) => {
        if (prev.find(u => u.usn === data.usn)) return prev;
        return [...prev, { usn: data.usn, name: data.name, studentName: data.name }];
      });
    });

    socketInstance.on('user-offline', (data: { usn: string }) => {
      console.log(' User offline:', data.usn);
      setOnlineUsers((prev) => prev.filter(u => u.usn !== data.usn));
    });

    socketInstance.on('new-global-message', (message: Message) => {
      console.log(' New global message from:', message.senderName);
      setGlobalMessages((prev) => [...prev, message]);
    });

    socketInstance.on('new-private-message', (message: Message) => {
      console.log(' New private message from:', message.senderName);
      const chatPartner = message.senderUsn === usn ? message.recipientUsn! : message.senderUsn;
      setPrivateMessages((prev) => ({
        ...prev,
        [chatPartner]: [...(prev[chatPartner] || []), message],
      }));
    });

    socketInstance.on('user-typing-global', (data: { usn: string; name: string }) => {
      setTypingUsers((prev) => new Set(prev).add(data.usn));
      setTimeout(() => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.usn);
          return newSet;
        });
      }, 3000);
    });

    socketInstance.on('user-typing-private', (data: { usn: string; name: string }) => {
      setTypingUsers((prev) => new Set(prev).add(data.usn));
      setTimeout(() => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.usn);
          return newSet;
        });
      }, 3000);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [usn, name]);

  const sendGlobalMessage = useCallback((message: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send-global-message', { message });
    }
  }, [isConnected]);

  const sendPrivateMessage = useCallback((recipientUsn: string, message: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send-private-message', { recipientUsn, message });
    }
  }, [isConnected]);

  const emitTypingGlobal = useCallback(() => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing-global');
    }
  }, [isConnected]);

  const emitTypingPrivate = useCallback((recipientUsn: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing-private', { recipientUsn });
    }
  }, [isConnected]);

  return {
    socket,
    isConnected,
    globalMessages,
    privateMessages,
    onlineUsers,
    typingUsers,
    sendGlobalMessage,
    sendPrivateMessage,
    emitTypingGlobal,
    emitTypingPrivate,
  };
};