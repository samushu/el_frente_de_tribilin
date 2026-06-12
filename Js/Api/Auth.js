/* ═══════════════════════════════════════════════════════════════
   Auth.js — Llamadas al microservicio de autenticación
   Base URL: http://127.0.0.1:8000
═══════════════════════════════════════════════════════════════ */

const AuthAPI = (() => {
  const BASE = 'http://127.0.0.1:8000';

  async function login(usuario, contrasena) {
    const res = await fetch(`${BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, contrasena })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Credenciales incorrectas');
    return data; // { msg, token, usuario, rol }
  }

  async function validarToken(token) {
    const res = await fetch(`${BASE}/validar-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || 'Token inválido');
    return data;
  }

  async function logout(token) {
    const res = await fetch(`${BASE}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || 'Error al cerrar sesión');
    return data;
  }

  return { login, validarToken, logout };
})();