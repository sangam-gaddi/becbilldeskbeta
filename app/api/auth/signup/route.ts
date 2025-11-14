import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import Student from '@/database/models/Student';
import { hashPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import CryptoJS from 'crypto-js';

export async function POST(req: NextRequest) {
  try {
    const { usn, email, password, recoveryPhrase } = await req.json();

    if (!usn || !email || !password || !recoveryPhrase) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if student exists in database by USN
    const student = await Student.findOne({ usn: usn.toUpperCase() });

    if (!student) {
      return NextResponse.json(
        { error: 'USN not found in college database. Please contact administration.' },
        { status: 404 }
      );
    }

    // Check if already registered
    if (student.isRegistered) {
      return NextResponse.json(
        { error: 'This USN is already registered. Please login instead.' },
        { status: 409 }
      );
    }

    // Check if email is already used by another student
    const emailExists = await Student.findOne({ 
      email: email.toLowerCase(),
      isRegistered: true,
      usn: { $ne: usn.toUpperCase() }
    });

    if (emailExists) {
      return NextResponse.json(
        { error: 'This email is already registered with another account.' },
        { status: 409 }
      );
    }

    // Hash password and recovery phrase
    const hashedPassword = await hashPassword(password);
    const recoveryPhraseHash = CryptoJS.SHA256(recoveryPhrase.trim()).toString();

    // Update student with auth info
    student.email = email.toLowerCase();
    student.password = hashedPassword;
    student.recoveryPhraseHash = recoveryPhraseHash;
    student.isRegistered = true;
    await student.save();

    // Create session
    await createSession(student._id.toString(), student.usn);

    return NextResponse.json({
      success: true,
      student: {
        usn: student.usn,
        studentName: student.studentName,
        email: student.email,
      },
    });

  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'This email is already registered. Please use a different email or login.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Signup failed. Please try again.' },
      { status: 500 }
    );
  }
}