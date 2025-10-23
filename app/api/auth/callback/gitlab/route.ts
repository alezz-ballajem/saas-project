import { NextRequest, NextResponse } from 'next/server';
import { GitLabAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=${error}`);
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=missing_code`);
    }

    // Exchange code for token
    const tokenData = await GitLabAuth.exchangeCodeForToken(code);
    
    // Get user info from GitLab
    const gitlabUser = await GitLabAuth.getUserInfo(tokenData.access_token);
    
    // Create or update user in database
    const user = await GitLabAuth.createOrUpdateUser(gitlabUser);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('session-token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
  } catch (error) {
    console.error('Error in GitLab callback:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=callback_failed`);
  }
}