import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface UserRow {
  id: number;
  username: string;
  password: string;
  role: string;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('mpcs_auth_token')?.value || req.cookies.get('mpcs_admin_token')?.value;

  if (!token) {
    return NextResponse.json({
      isAuthenticated: false,
      isAdmin: false,
      user: null
    });
  }

  try {
    const parts = token.split('_');
    if (parts.length >= 3 && parts[0] === 'session') {
      const username = decodeURIComponent(parts[1]);
      const role = parts[2];
      const isAdmin = role === 'admin';

      return NextResponse.json({
        isAuthenticated: true,
        isAdmin,
        user: {
          username,
          role
        }
      });
    }
  } catch (err) {
    console.error('Error parsing token:', err);
  }

  return NextResponse.json({
    isAuthenticated: false,
    isAdmin: false,
    user: null
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // Logout
    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out' });
      response.cookies.delete('mpcs_auth_token');
      response.cookies.delete('mpcs_admin_token');
      return response;
    }

    // Register
    if (action === 'register') {
      const { username, password, email } = body;
      const cleanUsername = (username || '').trim();
      const cleanPassword = (password || '').trim();
      const cleanEmail = (email || '').trim();

      if (!cleanUsername || !cleanPassword) {
        return NextResponse.json({ success: false, error: 'Username and password required' }, { status: 400 });
      }

      if (cleanUsername.length < 3) {
        return NextResponse.json({ success: false, error: 'Username must be at least 3 characters' }, { status: 400 });
      }

      if (cleanPassword.length < 4) {
        return NextResponse.json({ success: false, error: 'Password must be at least 4 characters' }, { status: 400 });
      }

      const existing = await query<UserRow>(`
        SELECT id FROM users WHERE LOWER(username) = LOWER($1);
      `, [cleanUsername]);

      if (existing.length > 0) {
        return NextResponse.json({ success: false, error: 'Username already exists. Please choose another.' }, { status: 409 });
      }

      const inserted = await query<UserRow>(`
        INSERT INTO users (username, email, password, role)
        VALUES ($1, $2, $3, 'user')
        RETURNING id, username, role;
      `, [cleanUsername, cleanEmail || null, cleanPassword]);

      const newUser = inserted[0];
      const token = `session_${encodeURIComponent(newUser.username)}_${newUser.role}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const response = NextResponse.json({
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
          isAdmin: false
        }
      });

      response.cookies.set({
        name: 'mpcs_auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      return response;
    }

    // Login
    const { username, password } = body;
    const cleanUsername = (username || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanUsername || !cleanPassword) {
      return NextResponse.json({ success: false, error: 'Username and password required' }, { status: 400 });
    }

    let foundUser: UserRow | null = null;
    const users = await query<UserRow>(`
      SELECT id, username, password, role 
      FROM users 
      WHERE LOWER(username) = LOWER($1) OR (email IS NOT NULL AND LOWER(email) = LOWER($1));
    `, [cleanUsername]);

    if (users.length > 0) {
      foundUser = users[0];
    } else {
      const adminUsers = await query<UserRow>(`
        SELECT id, username, password, role 
        FROM admin_users 
        WHERE LOWER(username) = LOWER($1);
      `, [cleanUsername]);

      if (adminUsers.length > 0) {
        foundUser = adminUsers[0];
      }
    }

    if (!foundUser || foundUser.password !== cleanPassword) {
      return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 });
    }

    const isAdmin = foundUser.role === 'admin';
    const token = `session_${encodeURIComponent(foundUser.username)}_${foundUser.role}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const response = NextResponse.json({
      success: true,
      user: {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        isAdmin
      }
    });

    response.cookies.set({
      name: 'mpcs_auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    if (isAdmin) {
      response.cookies.set({
        name: 'mpcs_admin_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
    }

    return response;
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
