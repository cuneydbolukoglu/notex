export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { idToken, refreshToken, expiresIn } = req.body || {};
    if (!idToken) {
      return res.status(400).json({ error: 'Missing idToken' });
    }

    // Cookie ömrü (saniye). Varsayılan 1 saat.
    const maxAgeSec = Number(expiresIn) || 60 * 60;
    const isProd = process.env.NODE_ENV === 'production';

    // HTTP-only cookie set et (XSS'e karşı güvenli)
    res.setHeader('Set-Cookie', [
      `notex_token=${encodeURIComponent(idToken)}; Max-Age=${maxAgeSec}; Path=/; HttpOnly; SameSite=Lax; ${isProd ? 'Secure;' : ''}`,
      `token=${encodeURIComponent(idToken)}; Max-Age=${maxAgeSec}; Path=/; SameSite=Lax; ${isProd ? 'Secure;' : ''}`,
      refreshToken ? `notex_refresh=${encodeURIComponent(refreshToken)}; Max-Age=${60 * 60 * 24 * 30}; Path=/; HttpOnly; SameSite=Lax; ${isProd ? 'Secure;' : ''}` : '',
      refreshToken ? `refreshToken=${encodeURIComponent(refreshToken)}; Max-Age=${60 * 60 * 24 * 30}; Path=/; SameSite=Lax; ${isProd ? 'Secure;' : ''}` : '',
    ].filter(Boolean));

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Set session cookie error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}



