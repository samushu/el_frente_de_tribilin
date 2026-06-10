/* ═══════════════════════════════════════════════════════════════
   Token.js — Manejo de token en localStorage
   Usado por: todos los módulos
═══════════════════════════════════════════════════════════════ */

const Token = (() => {
  const KEY = 'enfermitrack_token';
  const USER_KEY = 'enfermitrack_user';

  function guardar(token, datosUsuario = {}) {
    localStorage.setItem(KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(datosUsuario));
  }

  function obtener() {
    return localStorage.getItem(KEY);
  }

  function obtenerUsuario() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY)) || {};
    } catch {
      return {};
    }
  }

  function existe() {
    return !!localStorage.getItem(KEY);
  }

  function borrar() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(USER_KEY);
  }

  return { guardar, obtener, obtenerUsuario, existe, borrar };
})();