import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function AutoLogout({ token, onLogout }) {
  useEffect(() => {
    if (!token) return;

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      onLogout();
      return;
    }

    const now = Date.now();
    const expTime = decoded.exp * 1000;
    const timeout = expTime - now;

    if (timeout <= 0) {
      onLogout();
    } else {
      const timer = setTimeout(() => {
        onLogout();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [token, onLogout]);

  return null;
}
