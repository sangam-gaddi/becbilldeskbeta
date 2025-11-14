import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth/session';
import { connectToDatabase } from '@/database/mongoose';
import Payment from '@/database/models/Payment';
import Student from '@/database/models/Student';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const session = await verifySession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const { feeIds, amount, transactionHash, paymentMethod } = await req.json();

    if (!feeIds || !amount || !transactionHash || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    // Create payment record
    const payment = await Payment.create({
      usn: session.usn,
      feeIds,
      amount,
      transactionHash,
      paymentMethod,
      status: 'completed',
      createdAt: new Date(),
    });

    // Update student's paid fees
    await Student.findOneAndUpdate(
      { usn: session.usn },
      { $addToSet: { paidFees: { $each: feeIds } } }
    );

    return NextResponse.json({
      success: true,
      payment,
    });
  } catch (error: any) {
    console.error('Create payment error:', error);
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 });
  }
}