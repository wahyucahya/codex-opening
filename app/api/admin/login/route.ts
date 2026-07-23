import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const correctPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (password !== correctPassword) {
      return NextResponse.json(
        { error: 'Password salah. Silakan coba lagi.' },
        { status: 401 }
      );
    }

    const token = await signToken({ role: 'admin' });

    // Set cookie httpOnly secure untuk autentikasi JWT
    const response = NextResponse.json({ success: true, message: 'Login berhasil' });
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 hari
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server.' },
      { status: 500 }
    );
  }
}
