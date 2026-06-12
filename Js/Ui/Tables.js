/* ═══════════════════════════════════════════════════════════════
   Tables.js — Renderizado de tablas y filtros en el DOM
═══════════════════════════════════════════════════════════════ */

const Tables = (() => {

  /* ── EMPLEADOS ─────────────────────────────────────────────── */
  let _empleados = [];

  function renderEmpleados(lista) {
    const tbody = document.querySelector('#tablaEmpleados tbody');
    if (!tbody) return;
    if (!lista || lista.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="table__empty">No hay empleados registrados.</td></tr>';
      return;
    }
    tbody.innerHTML = lista.map(emp => `
      <tr>
        <td>${emp.id || '—'}</td>
        <td><strong>${emp.nombres || ''} ${emp.apellidos || ''}</strong></td>
        <td>${emp.documento || '—'}</td>
        <td>${emp.correo || '—'}</td>
        <td>${emp.cargo || '—'}</td>
        <td>${emp.area || '—'}</td>
        <td>${Helpers.badgeEstado(emp.estado || 'activo')}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn--icon btn--edit" title="Editar"
              onclick="Forms.abrirEditarEmpleado(${emp.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="btn btn--icon btn--delete" title="Eliminar"
              onclick="Forms.confirmarEliminarEmpleado(${emp.id}, '${(emp.nombres||'')+' '+(emp.apellidos||'')}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function cargarEmpleados() {
    const tbody = document.querySelector('#tablaEmpleados tbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="8" class="table__empty">Cargando empleados…</td></tr>';

    EmpleadosAPI.getAll()
      .then(data => {
        // Soporta respuesta array directa o { empleados: [] }
        _empleados = Array.isArray(data) ? data : (data.empleados || data.data || []);
        renderEmpleados(_empleados);
        Helpers.poblarSelect('filterEmpleadoArea', _empleados.map(e => e.area), 'Todas las áreas');
        Dashboards.actualizarStatsEmpleados(_empleados);
        renderDashEmpleados(_empleados.slice(0, 5));
      })
      .catch(err => {
        Helpers.toast('Error al cargar empleados: ' + err.message, 'error');
        if (tbody) tbody.innerHTML = '<tr><td colspan="8" class="table__empty">Error al cargar datos. Verifica que el servidor esté activo.</td></tr>';
      });
  }

  function filtrarEmpleados() {
    const nombre = (document.getElementById('filterEmpleadoNombre')?.value || '').toLowerCase();
    const area   = (document.getElementById('filterEmpleadoArea')?.value || '').toLowerCase();
    const estado = (document.getElementById('filterEmpleadoEstado')?.value || '').toLowerCase();

    const filtrados = _empleados.filter(emp => {
      const texto = `${emp.nombres||''} ${emp.apellidos||''} ${emp.documento||''}`.toLowerCase();
      const matchNombre = !nombre || texto.includes(nombre);
      const matchArea   = !area   || (emp.area||'').toLowerCase() === area;
      const matchEstado = !estado || (emp.estado||'activo').toLowerCase() === estado;
      return matchNombre && matchArea && matchEstado;
    });
    renderEmpleados(filtrados);
  }

  /* ── INCAPACIDADES ─────────────────────────────────────────── */
  let _incapacidades = [];

  function renderIncapacidades(lista) {
    const tbody = document.querySelector('#tablaIncapacidades tbody');
    if (!tbody) return;
    if (!lista || lista.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="table__empty">No hay incapacidades registradas.</td></tr>';
      return;
    }
    tbody.innerHTML = lista.map(inc => `
      <tr>
        <td>${inc.id || '—'}</td>
        <td>${inc.empleado_id || '—'}</td>
        <td>${(inc.tipo||'').replace(/_/g,' ')}</td>
        <td>${Helpers.formatFecha(inc.fecha_inicio)}</td>
        <td>${Helpers.formatFecha(inc.fecha_fin)}</td>
        <td>${inc.dias_incapacidad || '—'}</td>
        <td>${Helpers.truncar(inc.entidad_medica, 25)}</td>
        <td>${Helpers.badgeEstado(inc.estado || 'registrada')}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn--icon btn--edit" title="Editar"
              onclick="Forms.abrirEditarIncapacidad(${inc.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="btn btn--icon btn--delete" title="Eliminar"
              onclick="Forms.confirmarEliminarIncapacidad(${inc.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function cargarIncapacidades() {
    const tbody = document.querySelector('#tablaIncapacidades tbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="9" class="table__empty">Cargando incapacidades…</td></tr>';

    IncapacidadesAPI.getAll()
      .then(data => {
        _incapacidades = Array.isArray(data) ? data : (data.incapacidades || data.data || []);
        renderIncapacidades(_incapacidades);
        Dashboards.actualizarStatsIncapacidades(_incapacidades);
        renderDashIncapacidades(_incapacidades.slice(0, 5));
      })
      .catch(err => {
        Helpers.toast('Error al cargar incapacidades: ' + err.message, 'error');
        if (tbody) tbody.innerHTML = '<tr><td colspan="9" class="table__empty">Error al cargar datos.</td></tr>';
      });
  }

  function filtrarIncapacidades() {
    const estado = (document.getElementById('filterIncapEstado')?.value || '').toLowerCase();
    const tipo   = (document.getElementById('filterIncapTipo')?.value || '').toLowerCase();
    const filtrados = _incapacidades.filter(inc => {
      const matchEstado = !estado || (inc.estado||'').toLowerCase() === estado;
      const matchTipo   = !tipo   || (inc.tipo||'').toLowerCase() === tipo;
      return matchEstado && matchTipo;
    });
    renderIncapacidades(filtrados);
  }

  /* ── SEGUIMIENTOS ──────────────────────────────────────────── */
  let _seguimientos = [];

  function renderSeguimientos(lista) {
    const tbody = document.querySelector('#tablaSeguimientos tbody');
    if (!tbody) return;
    if (!lista || lista.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="table__empty">No hay seguimientos registrados.</td></tr>';
      return;
    }
    tbody.innerHTML = lista.map(seg => `
      <tr>
        <td>${seg.id || '—'}</td>
        <td>${seg.incapacidad_id || '—'}</td>
        <td>${Helpers.formatFecha(seg.fecha)}</td>
        <td>${Helpers.truncar(seg.comentario, 50)}</td>
        <td>${Helpers.badgeEstado(seg.estado || '—')}</td>
        <td>${seg.usuario_responsable || '—'}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn--icon btn--edit" title="Editar"
              onclick="Forms.abrirEditarSeguimiento(${seg.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="btn btn--icon btn--delete" title="Eliminar"
              onclick="Forms.confirmarEliminarSeguimiento(${seg.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function cargarSeguimientos() {
    const tbody = document.querySelector('#tablaSeguimientos tbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="table__empty">Cargando seguimientos…</td></tr>';

    SeguimientoAPI.getAll()
      .then(data => {
        _seguimientos = Array.isArray(data) ? data : (data.seguimientos || data.data || []);
        renderSeguimientos(_seguimientos);
      })
      .catch(err => {
        Helpers.toast('Error al cargar seguimientos: ' + err.message, 'error');
        if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="table__empty">Error al cargar datos.</td></tr>';
      });
  }

  /* ── TABLAS RESUMEN DASHBOARD ──────────────────────────────── */
  function renderDashEmpleados(lista) {
    const tbody = document.querySelector('#dashTableEmpleados tbody');
    if (!tbody) return;
    if (!lista || lista.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="table__empty">Sin datos.</td></tr>';
      return;
    }
    tbody.innerHTML = lista.map(emp => `
      <tr>
        <td><strong>${emp.nombres||''} ${emp.apellidos||''}</strong></td>
        <td>${emp.cargo||'—'}</td>
        <td>${emp.area||'—'}</td>
        <td>${Helpers.badgeEstado(emp.estado||'activo')}</td>
      </tr>
    `).join('');
  }

  function renderDashIncapacidades(lista) {
    const tbody = document.querySelector('#dashTableIncapacidades tbody');
    if (!tbody) return;
    if (!lista || lista.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="table__empty">Sin datos.</td></tr>';
      return;
    }
    tbody.innerHTML = lista.map(inc => `
      <tr>
        <td>${inc.empleado_id||'—'}</td>
        <td>${(inc.tipo||'').replace(/_/g,' ')}</td>
        <td>${inc.dias_incapacidad||'—'}</td>
        <td>${Helpers.badgeEstado(inc.estado||'registrada')}</td>
      </tr>
    `).join('');
  }

  function getEmpleados()     { return _empleados; }
  function getIncapacidades() { return _incapacidades; }
  function getSeguimientos()  { return _seguimientos; }

  return {
    cargarEmpleados, filtrarEmpleados, renderEmpleados,
    cargarIncapacidades, filtrarIncapacidades, renderIncapacidades,
    cargarSeguimientos, renderSeguimientos,
    renderDashEmpleados, renderDashIncapacidades,
    getEmpleados, getIncapacidades, getSeguimientos
  };
})();