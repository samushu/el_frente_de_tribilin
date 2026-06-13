/* ═══════════════════════════════════════════════════════════════
   Main.js — Inicializa la app en Index.html (login/landing)
═══════════════════════════════════════════════════════════════ */

(async function init() {

  // Si hay token guardado, validarlo contra el backend
  // Solo redirigir si el backend confirma que es válido
  if (Token.existe()) {
    try {
      await AuthAPI.validarToken(Token.obtener());
      // Token válido → ir al dashboard
      window.location.href = 'Paginas/Dashboard.html';
      return;
    } catch {
      // Token inválido o backend no disponible → limpiar y mostrar login
      Token.borrar();
    }
  }

  // ── Toggle mostrar/ocultar contraseña ──────────────────────
  const togglePw = document.getElementById('togglePw');
  const inputPw  = document.getElementById('contrasena');
  if (togglePw && inputPw) {
    togglePw.addEventListener('click', () => {
      const visible = inputPw.type === 'text';
      inputPw.type  = visible ? 'password' : 'text';
      togglePw.setAttribute('aria-label', visible ? 'Ver contraseña' : 'Ocultar contraseña');
    });
  }

  // ── Formulario de login ────────────────────────────────────
  const form      = document.getElementById('loginForm');
  const feedback  = document.getElementById('loginFeedback');
  const btnLogin  = document.getElementById('loginBtn');
  const btnText   = btnLogin?.querySelector('.btn__text');
  const btnLoader = btnLogin?.querySelector('.btn__loader');

  function mostrarFeedback(msg, tipo) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className   = `form-feedback ${tipo === 'error' ? 'is-error' : 'is-success'}`;
  }

  function setLoading(loading) {
    if (!btnLogin) return;
    btnLogin.disabled  = loading;
    if (btnText)   btnText.hidden   = loading;
    if (btnLoader) btnLoader.hidden = !loading;
  }

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (feedback) feedback.className = 'form-feedback'; // limpiar

    const usuario    = document.getElementById('usuario')?.value.trim();
    const contrasena = document.getElementById('contrasena')?.value;

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