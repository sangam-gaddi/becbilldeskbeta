import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import Student from '@/database/models/Student';
import { getSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { isOnline } = await req.json();

    await connectToDatabase();

    await Student.updateOne(
      { usn: session.usn },
      { 
        isOnline: isOnline,
        lastSeen: new Date()
      }
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error(' Error updating status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update status' },
      { status: 500 }
    );
  }
}
