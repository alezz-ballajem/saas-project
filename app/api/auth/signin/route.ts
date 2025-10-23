import { NextRequest, NextResponse } from 'next/server';
import { GitLabAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authUrl = GitLabAuth.getAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}