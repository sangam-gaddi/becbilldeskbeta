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

    const { searchParams } = new URL(req.url);
    const otherUsn = searchParams.get('usn');

    if (!otherUsn) {
      return NextResponse.json(
        { success: false, error: 'USN required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Get messages between current user and other user
    const messages = await ChatMessage.find({
      type: 'private',
      $or: [
        { senderUsn: session.usn, recipientUsn: otherUsn },
        { senderUsn: otherUsn, recipientUsn: session.usn },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      success: true,
      messages: messages.reverse(),
    });
  } catch (error: any) {
    console.error(' Error fetching private messages:', error);
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

    const { recipientUsn, message } = await req.json();

    if (!recipientUsn || !message) {
      return NextResponse.json(
        { success: false, error: 'Recipient USN and message required' },
        { status: 400 }
      );
    }

    if (message.trim().length === 0) {
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
    const sender = await Student.findOne({ usn: session.usn });
    const recipient = await Student.findOne({ usn: recipientUsn.toUpperCase() });

    if (!sender) {
      return NextResponse.json(
        { success: false, error: 'Sender not found' },
        { status: 404 }
      );
    }

    if (!recipient) {
      return NextResponse.json(
        { success: false, error: 'Recipient not found' },
        { status: 404 }
      );
    }

    // Create private message
    const newMessage = await ChatMessage.create({
      type: 'private',
      senderUsn: sender.usn,
      senderName: sender.studentName,
      senderProfilePic: sender.profilePicture,
      recipientUsn: recipient.usn,
      recipientName: recipient.studentName,
      message: message.trim(),
      readBy: [sender.usn],
    });

    return NextResponse.json({
      success: true,
      message: newMessage,
    });
  } catch (error: any) {
    console.error('❌ Error sending private message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
