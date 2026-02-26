import { NextRequest, NextResponse } from 'next/server';
import { createApprovalRequest, getApprovalRequest } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, grade } = await request.json();

    if (!email || !firstName || !lastName || !grade) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if already requested
    const existing = await getApprovalRequest(email);
    if (existing) {
      return NextResponse.json(
        { message: `Your request is already ${existing.status}. Please wait for admin approval.` },
        { status: 400 }
      );
    }

    // Create approval request
    const approvalRequest = await createApprovalRequest(email, firstName, lastName, grade);

    return NextResponse.json({
      success: true,
      message: 'Approval request submitted. Please wait for admin review.',
      request: approvalRequest,
    });
  } catch (error) {
    console.error('[v0] Approval request error:', error);
    return NextResponse.json(
      { message: 'An error occurred during approval request' },
      { status: 500 }
    );
  }
}
