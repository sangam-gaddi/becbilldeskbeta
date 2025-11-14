import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import Student from '@/database/models/Student';
import { verifyPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'USN/Email and password are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find student by USN or email
    const student = await Student.findOne({
      $or: [
        { usn: identifier.toUpperCase() },
        { email: identifier.toLowerCase() }
      ],
      isRegistered: true
    });

    if (!student || !student.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, student.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

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

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
