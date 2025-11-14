import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { NextApiResponse } from 'next';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: HTTPServer & {
      io?: SocketIOServer;
    };
  };
};

export const initSocketIO = (res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log('🔌 Initializing Socket.io server...');

    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('✅ Client connected:', socket.id);

      // User joins with their USN
      socket.on('join', (data: { usn: string; name: string }) => {
        socket.data.usn = data.usn;
        socket.data.name = data.name;
        
        // Join global room
        socket.join('global');
        
        // Join personal room for private messages
        socket.join(`user:${data.usn}`);
        
        console.log(`👤 ${data.name} (${data.usn}) joined`);
        
        // Broadcast online status
        io.emit('user-online', { usn: data.usn, name: data.name });
      });

      // Send global message
      socket.on('send-global-message', (data: { message: string }) => {
        io.to('global').emit('new-global-message', {
          senderUsn: socket.data.usn,
          senderName: socket.data.name,
          message: data.message,
          timestamp: new Date(),
        });
      });

      // Send private message
      socket.on('send-private-message', (data: { recipientUsn: string; message: string }) => {
        const messageData = {
          senderUsn: socket.data.usn,
          senderName: socket.data.name,
          recipientUsn: data.recipientUsn,
          message: data.message,
          timestamp: new Date(),
        };

        // Send to recipient
        io.to(`user:${data.recipientUsn}`).emit('new-private-message', messageData);
        
        // Send back to sender for confirmation
        socket.emit('new-private-message', messageData);
      });

      // Typing indicators
      socket.on('typing-global', () => {
        socket.to('global').emit('user-typing-global', {
          usn: socket.data.usn,
          name: socket.data.name,
        });
      });

      socket.on('typing-private', (data: { recipientUsn: string }) => {
        io.to(`user:${data.recipientUsn}`).emit('user-typing-private', {
          usn: socket.data.usn,
          name: socket.data.name,
        });
      });

      // Disconnect
      socket.on('disconnect', () => {
        console.log(' Client disconnected:', socket.id);
        
        if (socket.data.usn) {
          io.emit('user-offline', { usn: socket.data.usn });
        }
      });
    });

    console.log(' Socket.io server initialized');
  } else {
    console.log(' Socket.io server already running');
  }

  return res.socket.server.io;
};
