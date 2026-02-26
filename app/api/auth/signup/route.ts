import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { getUser, getApprovalRequest, createUser } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, grade } = await request.json();

    if (!email || !password || !firstName || !lastName || !grade) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUser(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Check if email is approved
    const approvalRequest = await getApprovalRequest(email);
    if (!approvalRequest || approvalRequest.status !== 'approved') {
      return NextResponse.json(
        { message: 'Your email has not been approved yet' },
        { status: 403 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const user = await createUser(email, passwordHash, firstName, lastName, grade, 'user');

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (error) {
    console.error('[v0] Signup error:', error);
    return NextResponse.json(
      { message: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}
