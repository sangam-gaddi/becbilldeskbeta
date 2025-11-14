import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import Student from '@/database/models/Student';
import CryptoJS from 'crypto-js';

export async function POST(req: NextRequest) {
  try {
    const { usn, recoveryPhrase } = await req.json();

    if (!usn || !recoveryPhrase) {
      return NextResponse.json(
        { error: 'USN and recovery phrase are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const student = await Student.findOne({ 
      usn: usn.toUpperCase(),
      isRegistered: true 
    });

    if (!student || !student.recoveryPhraseHash) {
      return NextResponse.json(
        { error: 'Invalid USN or account not found' },
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

    return NextResponse.json({
      success: true,
      student: {
        usn: student.usn,
        email: student.email,
        studentName: student.studentName,
      },
    });

  } catch (error) {
    console.error('Recovery verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
