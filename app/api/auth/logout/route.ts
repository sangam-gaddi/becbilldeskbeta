import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    await deleteSession();
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}