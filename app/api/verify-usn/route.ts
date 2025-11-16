import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import Student from '@/database/models/Student';

export async function POST(req: NextRequest) {
  try {
    const { usn } = await req.json();

    if (!usn) {
      return NextResponse.json(
        { error: 'USN is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const student = await Student.findOne({ 
      usn: usn.toUpperCase() 
    }).lean();

    if (!student) {
      return NextResponse.json(
        { error: 'USN not found in college database. Please contact administration.' },
        { status: 404 }
      );
    }

    // Check if already registered
    if (student.isRegistered) {
      return NextResponse.json(
        { error: 'This USN is already registered. Please use the login page.' },
        { status: 409 }
      );
    }

    // Return student info (without password)
    return NextResponse.json({
      success: true,
      student: {
        usn: student.usn,
        studentName: student.studentName,
        department: student.department,
        semester: student.semester,
        paymentCategory: student.paymentCategory,
        csn: student.csn,
        idNo: student.idNo,
        admissionID: student.admissionID,
      },
    });

  } catch (error: any) {
    console.error('USN verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed: ' + error.message },
      { status: 500 }
    );
  }
}
