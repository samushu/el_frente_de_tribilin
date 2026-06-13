/* ═══════════════════════════════════════════════════════════════
   Dashboards.js — Navegación entre vistas, stats y sesión
═══════════════════════════════════════════════════════════════ */

/* ── Stats del dashboard (declarado primero) ─────────────────── */
const Dashboards = (() => {
  function actualizarStatsEmpleados(lista) {
    const total   = lista.length;
    const activos = lista.filter(e => (e.estado || 'activo').toLowerCase() === 'activo').length;
    const elTotal  = document.getElementById('statTotalEmpleados');
    const elActivo = document.getElementById('statEmpleadosActivos');
    if (elTotal)  elTotal.textContent  = total;
    if (elActivo) elActivo.textContent = activos;
  }

  function actualizarStatsIncapacidades(lista) {
    const total    = lista.length;
    const revision = lista.filter(i => (i.estado || '').toLowerCase() === 'en_revision').length;
    const elTotal    = document.getElementById('statTotalIncapacidades');
    const elRevision = document.getElementById('statIncapacidadesPendientes');
    if (elTotal)    elTotal.textContent    = total;
    if (elRevision) elRevision.textContent = revision;
  }

  return { actualizarStatsEmpleados, actualizarStatsIncapacidades };
})();

function cargarDashboard() {
  Tables.cargarEmpleados();
  Tables.cargarIncapacidades();
}

/* ── Inicialización de la app ────────────────────────────────── */
(async function initDashboard() {

  // ── Validar token: si no existe, redirigir al login ─────────
  if (!Token.existe()) {
    window.location.href = '../Index.html';
    return;
  }

  // ── Validar token contra el backend ─────────────────────────
  // Si el backend no responde o el token es inválido → logout
  try {
    await AuthAPI.validarToken(Token.obtener());
  } catch (err) {
    console.warn('Token inválido o servidor auth no disponible:', err.message);
    Token.borrar();
    window.location.href = '../Index.html';
    return;
  }

  // ── Info usuario en topbar ──────────────────────────────────

  // ── Logout ───────────────────────────────────────────────────
  document.getElementById('btnLogout')?.addEventListener('click', async () => {
    try { await AuthAPI.logout(Token.obtener()); } catch {}
    Token.borrar();
    window.location.href = '../Index.html';
  });

  // ── Navegación entre vistas ──────────────────────────────────
  const vistas = {
    dashboard:     { titulo: 'Dashboard',     carga: cargarDashboard },
    empleados:     { titulo: 'Empleados',     carga: () => Tables.cargarEmpleados() },
    incapacidades: { titulo: 'Incapacidades', carga: () => Tables.cargarIncapacidades() },
    seguimientos:  { titulo: 'Seguimientos',  carga: () => Tables.cargarSeguimientos() }
  };

  function navegarA(nombre) {
    if (!vistas[nombre]) return;
    // Ocultar todas las vistas
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    // Mostrar la activa
    const viewEl = document.getElementById(`view-${nombre}`);
    if (viewEl) viewEl.classList.remove('hidden');
    // Activar link sidebar
    document.querySelectorAll('.sidebar__link').forEach(l => {
      l.classList.toggle('active', l.dataset.view === nombre);
    });
    // Título topbar
    const topbarTitle = document.getElementById('topbarTitle');
    if (topbarTitle) topbarTitle.textContent = vistas[nombre].titulo;
    // Cargar datos
    vistas[nombre].carga();
    // Cerrar sidebar mobile
    document.getElementById('sidebar')?.classList.remove('open');
  }

  // Clicks en sidebar
  document.querySelectorAll('.sidebar__link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navegarA(link.dataset.view);
    });
  });

  // Links "ver todos" del dashboard
  document.querySelectorAll('[data-view]').forEach(el => {
    if (!el.classList.contains('sidebar__link')) {
      el.addEventListener('click', e => {
        e.preventDefault();
        navegarA(el.dataset.view);
      });
    }
  });

  // Botones "nuevo"
  document.getElementById('btnNuevoEmpleado')?.addEventListener('click',    () => Forms.abrirCrearEmpleado());
  document.getElementById('btnNuevaIncapacidad')?.addEventListener('click', () => Forms.abrirCrearIncapacidad());
  document.getElementById('btnNuevoSeguimiento')?.addEventListener('click', () => Forms.abrirCrearSeguimiento());

  // Filtros empleados
  document.getElementById('filterEmpleadoNombre')?.addEventListener('input',  () => Tables.filtrarEmpleados());
  document.getElementById('filterEmpleadoArea')?.addEventListener('change',   () => Tables.filtrarEmpleados());
  document.getElementById('filterEmpleadoEstado')?.addEventListener('change', () => Tables.filtrarEmpleados());

  // Filtros incapacidades
  document.getElementById('filterIncapEstado')?.addEventListener('change', () => Tables.filtrarIncapacidades());
  document.getElementById('filterIncapTipo')?.addEventListener('change',   () => Tables.filtrarIncapacidades());

  // Cerrar modal
  document.getElementById('modalClose')?.addEventListener('click', () => Forms.cerrarModal());
  document.getElementById('modalBackdrop')?.addEventListener('click', e => {
    if (e.target.id === 'modalBackdrop') Forms.cerrarModal();
  });

  // Menú mobile
  document.getElementById('btnMenuMobile')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open');
  });

  // ── Carga inicial ────────────────────────────────────────────
  navegarA('dashboard');

})();