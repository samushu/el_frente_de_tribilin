/* ═══════════════════════════════════════════════════════════════
   Dashboards.js — Navegación, stats y sesión
═══════════════════════════════════════════════════════════════ */

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

(async function initDashboard() {

  // Validar sesión
  if (!Token.existe()) { window.location.href = '../Index.html'; return; }
  try {
    await AuthAPI.validarToken(Token.obtener());
  } catch {
    Token.borrar();
    window.location.href = '../Index.html';
    return;
  }

  // ── Navegación ───────────────────────────────────────────────
  const vistas = {
    dashboard:     { titulo: 'Dashboard',     carga: cargarDashboard },
    empleados:     { titulo: 'Empleados',     carga: () => Tables.cargarEmpleados() },
    incapacidades: { titulo: 'Incapacidades', carga: () => Tables.cargarIncapacidades() },
    seguimientos:  { titulo: 'Seguimientos',  carga: () => Tables.cargarSeguimientos() }
  };

  function setLinksActivos(nombre) {
    document.querySelectorAll('.app-navbar__link, .app-dropdown__link').forEach(l => {
      l.classList.toggle('active', l.dataset.view === nombre);
    });
  }

  function cerrarDropdown() {
    document.getElementById('appDropdown')?.classList.add('hidden');
  }

  function navegarA(nombre) {
    if (!vistas[nombre]) return;
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(`view-${nombre}`)?.classList.remove('hidden');
    setLinksActivos(nombre);
    vistas[nombre].carga();
    cerrarDropdown();
  }

  // Links navbar y dropdown
  document.querySelectorAll('.app-navbar__link, .app-dropdown__link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navegarA(link.dataset.view);
    });
  });

  // Links "ver todos" del dashboard
  document.querySelectorAll('[data-view]').forEach(el => {
    if (!el.classList.contains('app-navbar__link') && !el.classList.contains('app-dropdown__link')) {
      el.addEventListener('click', e => { e.preventDefault(); navegarA(el.dataset.view); });
    }
  });

  // Hamburguesa
  document.getElementById('btnHamburger')?.addEventListener('click', () => {
    document.getElementById('appDropdown')?.classList.toggle('hidden');
  });

  // Cerrar dropdown al hacer click fuera
  document.addEventListener('click', e => {
    const dropdown   = document.getElementById('appDropdown');
    const hamburger  = document.getElementById('btnHamburger');
    if (dropdown && !dropdown.contains(e.target) && !hamburger.contains(e.target)) {
      cerrarDropdown();
    }
  });

  // Logout
  async function hacerLogout() {
    try { await AuthAPI.logout(Token.obtener()); } catch {}
    Token.borrar();
    window.location.href = '../Index.html';
  }
  document.getElementById('btnLogout')?.addEventListener('click', hacerLogout);
  document.getElementById('btnLogoutMobile')?.addEventListener('click', hacerLogout);

  // Botones nuevo
  document.getElementById('btnNuevoEmpleado')?.addEventListener('click',    () => Forms.abrirCrearEmpleado());
  document.getElementById('btnNuevaIncapacidad')?.addEventListener('click', () => Forms.abrirCrearIncapacidad());
  document.getElementById('btnNuevoSeguimiento')?.addEventListener('click', () => Forms.abrirCrearSeguimiento());

  // Filtros empleados
  document.getElementById('filterEmpleadoNombre')?.addEventListener('input',  () => Tables.filtrarEmpleados());
  document.getElementById('filterEmpleadoArea')?.addEventListener('change',   () => Tables.filtrarEmpleados());
  document.getElementById('filterEmpleadoEstado')?.addEventListener('change', () => Tables.filtrarEmpleados());

  // Filtros incapacidades
  document.getElementById('filterIncapEmpleado')?.addEventListener('input',  () => Tables.filtrarIncapacidades());
  document.getElementById('filterIncapFecha')?.addEventListener('change',    () => Tables.filtrarIncapacidades());
  document.getElementById('filterIncapEstado')?.addEventListener('change',   () => Tables.filtrarIncapacidades());
  document.getElementById('filterIncapTipo')?.addEventListener('change',     () => Tables.filtrarIncapacidades());

  // Filtros seguimientos
  document.getElementById('filterSegEmpleado')?.addEventListener('input',  () => Tables.filtrarSeguimientos());
  document.getElementById('filterSegFecha')?.addEventListener('change',    () => Tables.filtrarSeguimientos());
  document.getElementById('filterSegEstado')?.addEventListener('change',   () => Tables.filtrarSeguimientos());

  // Modal
  document.getElementById('modalClose')?.addEventListener('click', () => Forms.cerrarModal());
  document.getElementById('modalBackdrop')?.addEventListener('click', e => {
    if (e.target.id === 'modalBackdrop') Forms.cerrarModal();
  });

  // Carga inicial
  navegarA('dashboard');
})();