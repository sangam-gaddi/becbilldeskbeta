import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import Payment from '@/database/models/Payment';
import Student from '@/database/models/Student';
import { getSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify user session
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await req.json();
    const { transactionHash, walletAddress, amount } = body;

    // 3. Validate inputs
    if (!transactionHash || !walletAddress || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 4. Validate transaction hash format
    if (!/^0x[a-fA-F0-9]{64}$/.test(transactionHash)) {
      return NextResponse.json(
        { success: false, error: 'Invalid transaction hash format' },
        { status: 400 }
      );
    }

    // 5. Connect to database
    await connectToDatabase();

    // 6. Get student record
    const student = await Student.findOne({ usn: session.usn });

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student record not found' },
        { status: 404 }
      );
    }

    // 7. Check for duplicate transaction
    const existingPayment = await Payment.findOne({ transactionHash });

    if (existingPayment) {
      return NextResponse.json(
        { success: false, error: 'Payment already recorded' },
        { status: 409 }
      );
    }

    // 8. Create payment record
    const payment = await Payment.create({
      studentId: student._id,
      usn: student.usn,
      feeCategories: {
        collegeFees: true,
        developmentFees: false,
        examinationFees: false,
        hostelFees: {
          selected: false
        }
      },
      totalAmount: amount,
      paymentMethod: 'crypto',
      paymentStatus: 'Completed',
      transactionHash,
      walletAddress: walletAddress.toLowerCase(),
      network: 'sepolia',
      paidAt: new Date(),
    });

    // 9. Return success response
    return NextResponse.json({
      success: true,
      payment: {
        id: payment._id.toString(),
        transactionHash: payment.transactionHash,
        amount: payment.totalAmount,
        status: payment.paymentStatus,
        paidAt: payment.paidAt,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Crypto payment recording error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to record payment',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve payment history
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

    const payments = await Payment.find({ 
      usn: session.usn,
      paymentMethod: 'crypto'
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

    return NextResponse.json({
      success: true,
      payments: payments.map(p => ({
        id: p._id.toString(),
        transactionHash: p.transactionHash,
        amount: p.totalAmount,
        status: p.paymentStatus,
        paidAt: p.paidAt,
        createdAt: p.createdAt,
      })),
    });

  } catch (error: any) {
    console.error('❌ Error fetching payments:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
