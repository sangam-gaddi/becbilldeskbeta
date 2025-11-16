import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import Student from '@/database/models/Student';
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

    // Get online users (active in last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const onlineUsers = await Student.find({
      isOnline: true,
      lastSeen: { $gte: fiveMinutesAgo },
      usn: { $ne: session.usn }, // Exclude current user
    })
      .select('usn studentName profilePicture department lastSeen')
      .limit(50)
      .lean();

    return NextResponse.json({
      success: true,
      users: onlineUsers,
    });
  } catch (error: any) {
    console.error(' Error fetching online users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch online users' },
      { status: 500 }
    );
  }
}
