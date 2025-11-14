'use server';

import { connectToDatabase } from '@/database/mongoose';
import Student from '@/database/models/Student';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long'
);

// STEP 1: Verify USN exists in database
export async function verifyUSN(usn: string) {
  try {
    await connectToDatabase();

    const student = await Student.findOne({ usn: usn.toUpperCase() });

    if (!student) {
      return { 
        success: false, 
        error: 'USN not found in college database. Please contact administration.' 
      };
    }

    if (student.isRegistered) {
      return { 
        success: false, 
        error: 'This USN is already registered. Please login instead.' 
      };
    }

    return { 
      success: true, 
      data: { 
        usn: student.usn, 
        studentName: student.studentName,
        department: student.department,
        paymentCategory: student.paymentCategory
      } 
    };
  } catch (error) {
    console.error('USN verification error:', error);
    return { success: false, error: 'Verification failed' };
  }
}

// STEP 2: Complete registration
export async function signUp(formData: {
  usn: string;
  email: string;
  password: string;
}) {
  try {
    await connectToDatabase();

    const student = await Student.findOne({ 
      usn: formData.usn.toUpperCase(),
      isRegistered: false 
    });

    if (!student) {
      return { 
        success: false, 
        error: 'Invalid USN or already registered' 
      };
    }

    const emailExists = await Student.findOne({ 
      email: formData.email.toLowerCase() 
    });

    if (emailExists) {
      return { 
        success: false, 
        error: 'Email already registered' 
      };
    }

    const hashedPassword = await bcrypt.hash(formData.password, 10);

    student.email = formData.email.toLowerCase();
    student.password = hashedPassword;
    student.isRegistered = true;
    await student.save();

    return { 
      success: true, 
      data: { usn: student.usn, studentName: student.studentName } 
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Signup failed' };
  }
}

export async function signIn(formData: {
  usn: string;
  password: string;
}) {
  try {
    await connectToDatabase();

    const student = await Student.findOne({ 
      usn: formData.usn.toUpperCase(),
      isRegistered: true 
    });

    if (!student || !student.password) {
      return { 
        success: false, 
        error: 'Invalid credentials or not registered yet' 
      };
    }

    const isPasswordValid = await bcrypt.compare(formData.password, student.password);

    if (!isPasswordValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    const token = await new SignJWT({ 
      studentId: student._id.toString(), 
      usn: student.usn 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(SECRET_KEY);

    (await cookies()).set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, data: { usn: student.usn } };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
}

export async function signOut() {
  (await cookies()).delete('auth-token');
  return { success: true };
}

export async function getCurrentStudent() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) return null;

    const { payload } = await jwtVerify(token.value, SECRET_KEY);
    
    await connectToDatabase();
    const student = await Student.findById(payload.studentId).select('-password');

    return student;
  } catch (error) {
    return null;
  }
}
