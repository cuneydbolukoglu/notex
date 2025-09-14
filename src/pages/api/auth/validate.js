export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // HTTP-only cookie'den token'ı al
    const token = req.cookies.notex_token || req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: 'No token found', valid: false });
    }

    // Token'ı decode et ve temel validasyon yap
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Token süresi kontrolü
      if (payload.exp && payload.exp < currentTime) {
        return res.status(401).json({ error: 'Token expired', valid: false });
      }

      return res.status(200).json({ 
        valid: true, 
        user: {
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        }
      });
    } catch (decodeError) {
      console.error('Token decode error:', decodeError);
      return res.status(401).json({ error: 'Invalid token format', valid: false });
    }
  } catch (err) {
    console.error('Token validation error:', err);
    return res.status(500).json({ error: 'Internal Server Error', valid: false });
  }
}

