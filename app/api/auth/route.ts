import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { User } from '../../../lib/sequelize'; // 3 levels up

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, avatarUrl } = body;

    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
    }

    // Check if user exists (Sign In)
    let user = await User.findOne({ where: { email } });

    // If not, create a new user (Sign Up)
    if (!user) {
      user = await User.create({
        email,
        name,
        avatarUrl: avatarUrl || null,
        bio: '',
        tags: [],
        socialLinks: {},
      });
    }

    // Generate JWT for session management
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set JWT in HTTP-Only Cookie to secure the session
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      message: 'Authentication successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });

  } catch (error) {
    console.error('Auth endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
