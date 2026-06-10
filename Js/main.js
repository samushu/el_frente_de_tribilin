/* ═══════════════════════════════════════════════════════════════
   Main.js — Inicializa la app en Index.html (login/landing)
═══════════════════════════════════════════════════════════════ */

(async function init() {
  // Si ya hay token válido, redirigir directo al dashboard
  if (Token.existe()) {
    try {
      await AuthAPI.validarToken(Token.obtener());
      window.location.href = 'Paginas/Dashboard.html';
      return;
    } catch {
      Token.borrar(); // token inválido → limpiar y mostrar login
    }
  }

  // ── Toggle mostrar/ocultar contraseña ──────────────────────
  const togglePw  = document.getElementById('togglePw');
  const inputPw   = document.getElementById('contrasena');
  if (togglePw && inputPw) {
    togglePw.addEventListener('click', () => {
      const visible = inputPw.type === 'text';
      inputPw.type = visible ? 'password' : 'text';
      togglePw.setAttribute('aria-label', visible ? 'Ver contraseña' : 'Ocultar contraseña');
    });
  }

  // ── Formulario de login ────────────────────────────────────
  const form     = document.getElementById('loginForm');
  const feedback = document.getElementById('loginFeedback');
  const btnText  = document.querySelector('#loginBtn .btn__text');
  const btnLoader = document.querySelector('#loginBtn .btn__loader');
  const btnLogin = document.getElementById('loginBtn');

  function mostrarFeedback(msg, tipo) {
    feedback.textContent = msg;
    feedback.className = `form-feedback ${tipo === 'error' ? 'is-error' : 'is-success'}`;
  }

  function setLoading(loading) {
    btnLogin.disabled = loading;
    btnText.hidden    = loading;
    btnLoader.hidden  = !loading;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.className = 'form-feedback'; // limpiar feedback

    const usuario   = document.getElementById('usuario').value.trim();
    const contrasena = document.getElementById('contrasena').value;

    if (!usuario || !contrasena) {
      mostrarFeedback('Completa usuario y contraseña.', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await AuthAPI.login(usuario, contrasena);
      Token.guardar(data.token, { usuario: data.usuario, rol: data.rol });
      mostrarFeedback('Acceso correcto. Redirigiendo…', 'success');
      setTimeout(() => {
        window.location.href = 'Paginas/Dashboard.html';
      }, 800);
    } catch (err) {
      mostrarFeedback(err.message || 'No se pudo iniciar sesión.', 'error');
      setLoading(false);
    }
  });
})();