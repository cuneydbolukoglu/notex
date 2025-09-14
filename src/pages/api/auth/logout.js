export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const isProd = process.env.NODE_ENV === 'production';

    // Clear all authentication cookies
    res.setHeader('Set-Cookie', [
      'notex_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax; ' + (isProd ? 'Secure;' : ''),
      'token=; Max-Age=0; Path=/; SameSite=Lax; ' + (isProd ? 'Secure;' : ''),
      'notex_refresh=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax; ' + (isProd ? 'Secure;' : ''),
      'refreshToken=; Max-Age=0; Path=/; SameSite=Lax; ' + (isProd ? 'Secure;' : ''),
    ]);

    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

