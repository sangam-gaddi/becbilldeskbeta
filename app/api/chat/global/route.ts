import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import ChatMessage from '@/database/models/ChatMessage';
import { getSession } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get last 50 global messages
    const messages = await ChatMessage.find({ type: 'global' })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      success: true,
      messages: messages.reverse(), // Oldest first
    });
  } catch (error: any) {
    console.error('❌ Error fetching global messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { message } = await req.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Message too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const Student = (await import('@/database/models/Student')).default;
    const student = await Student.findOne({ usn: session.usn });

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    // Create message
    const newMessage = await ChatMessage.create({
      type: 'global',
      senderUsn: student.usn,
      senderName: student.studentName,
      senderProfilePic: student.profilePicture,
      message: message.trim(),
      readBy: [student.usn],
    });

    return NextResponse.json({
      success: true,
      message: newMessage,
    });
  } catch (error: any) {
    console.error('❌ Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
