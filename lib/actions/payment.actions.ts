'use server';

import { connectToDatabase } from '@/database/mongoose';
import Payment from '@/database/models/Payment';
import Student from '@/database/models/Student';
import { SelectedFees } from '@/types';
import { TOTAL_COLLEGE_FEES, TOTAL_DEVELOPMENT_FEES, EXAMINATION_FEES_TOTAL, HOSTEL_FEES } from '@/lib/utils/feeConstants';

export async function calculateTotalAmount(
  paymentCategory: 'KCET' | 'COMEDK' | 'Management',
  selectedFees: SelectedFees
): Promise<number> {
  let total = 0;

  if (selectedFees.collegeFees) {
    total += TOTAL_COLLEGE_FEES[paymentCategory];
  }

  if (selectedFees.developmentFees) {
    total += TOTAL_DEVELOPMENT_FEES;
  }

  if (selectedFees.examinationFees) {
    total += EXAMINATION_FEES_TOTAL;
  }

  if (selectedFees.hostelFees.selected && selectedFees.hostelFees.blockType) {
    total += HOSTEL_FEES[selectedFees.hostelFees.blockType];
  }

  return total;
}

export async function createPayment(paymentData: {
  studentId: string;
  usn: string;
  feeCategories: SelectedFees;
  totalAmount: number;
  paymentMethod: string;
}) {
  try {
    await connectToDatabase();

    const payment = await Payment.create({
      ...paymentData,
      paymentStatus: 'Pending',
    });

    return { success: true, data: payment };
  } catch (error) {
    console.error('Payment creation error:', error);
    return { success: false, error: 'Failed to create payment' };
  }
}

export async function updatePaymentStatus(
  paymentId: string,
  status: 'Completed' | 'Failed',
  transactionId?: string
) {
  try {
    await connectToDatabase();

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        paymentStatus: status,
        transactionId,
        paidAt: status === 'Completed' ? new Date() : undefined,
      },
      { new: true }
    );

    return { success: true, data: payment };
  } catch (error) {
    console.error('Payment update error:', error);
    return { success: false, error: 'Failed to update payment' };
  }
}

export async function getStudentPayments(usn: string) {
  try {
    await connectToDatabase();

    const payments = await Payment.find({ usn }).sort({ createdAt: -1 });

    return { success: true, data: payments };
  } catch (error) {
    console.error('Get payments error:', error);
    return { success: false, error: 'Failed to get payments' };
  }
}
