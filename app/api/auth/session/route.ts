import { NextRequest, NextResponse } from 'next/server';
import { GitLabAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session-token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ user: null, session: null });
    }

    const session = await GitLabAuth.getSession(sessionToken);
    
    if (!session) {
      return NextResponse.json({ user: null, session: null });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json({ user: null, session: null });
  }
}