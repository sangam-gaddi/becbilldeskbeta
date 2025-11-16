import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import Student from '@/database/models/Student';
import { hashPassword } from '@/lib/auth/password';
import CryptoJS from 'crypto-js';

export async function POST(req: NextRequest) {
  try {
    const { email, recoveryPhrase, newPassword } = await req.json();

    if (!email || !recoveryPhrase || !newPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const student = await Student.findOne({ 
      email: email.toLowerCase(),
      isRegistered: true 
    });

    if (!student || !student.recoveryPhraseHash) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Verify recovery phrase
    const submittedHash = CryptoJS.SHA256(recoveryPhrase.trim()).toString();

    if (submittedHash !== student.recoveryPhraseHash) {
      return NextResponse.json(
        { error: 'Invalid recovery phrase' },
        { status: 401 }
      );
    }

    // Update password
    student.password = await hashPassword(newPassword);
    await student.save();

    return NextResponse.json({
      success: true,
      message: 'Password reset successful',
    });

  } catch (error) {
    console.error('Recovery error:', error);
    return NextResponse.json(
      { error: 'Recovery failed' },
      { status: 500 }
    );
  }
}
