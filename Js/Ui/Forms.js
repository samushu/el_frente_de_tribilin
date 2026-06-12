/* ═══════════════════════════════════════════════════════════════
   Forms.js — Modales y formularios CRUD para todos los módulos
═══════════════════════════════════════════════════════════════ */

const Forms = (() => {

  /* ── HELPERS MODAL ─────────────────────────────────────────── */
  function abrirModal(titulo, bodyHTML, footerHTML) {
    document.getElementById('modalTitle').textContent = titulo;
    document.getElementById('modalBody').innerHTML   = bodyHTML;
    document.getElementById('modalFooter').innerHTML = footerHTML;
    document.getElementById('modalBackdrop').classList.remove('hidden');
  }

  function cerrarModal() {
    document.getElementById('modalBackdrop').classList.add('hidden');
    document.getElementById('modalBody').innerHTML   = '';
    document.getElementById('modalFooter').innerHTML = '';
  }

  function setLoadingBtn(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? 'Guardando…' : btn.dataset.text || 'Guardar';
  }

  /* ════════════════════════════════════════════════════════════
     EMPLEADOS
  ════════════════════════════════════════════════════════════ */

  function abrirCrearEmpleado() {
    const body = `
      <form class="modal-form" id="formEmpleado" novalidate>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="emp_nombres">Nombres *</label>
            <input class="form-input" id="emp_nombres" type="text" placeholder="Juan" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="emp_apellidos">Apellidos *</label>
            <input class="form-input" id="emp_apellidos" type="text" placeholder="Pérez" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="emp_documento">Documento *</label>
            <input class="form-input" id="emp_documento" type="text" placeholder="1051676765" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="emp_telefono">Teléfono</label>
            <input class="form-input" id="emp_telefono" type="text" placeholder="3128937162" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="emp_correo">Correo *</label>
          <input class="form-input" id="emp_correo" type="email" placeholder="juan@empresa.com" required />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="emp_cargo">Cargo *</label>
            <input class="form-input" id="emp_cargo" type="text" placeholder="Analista" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="emp_area">Área *</label>
            <input class="form-input" id="emp_area" type="text" placeholder="Tecnología" required />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="emp_fecha_ingreso">Fecha de ingreso *</label>
          <input class="form-input" id="emp_fecha_ingreso" type="date" required />
        </div>
        <div id="formEmpFeedback" class="form-feedback"></div>
      </form>`;

    const footer = `
      <button class="btn btn--secondary" onclick="Forms.cerrarModal()">Cancelar</button>
      <button class="btn btn--primary" id="btnGuardarEmpleado" data-text="Guardar" onclick="Forms.guardarEmpleado()">Guardar</button>`;

    abrirModal('Nuevo empleado', body, footer);
  }

  async function abrirEditarEmpleado(id) {
    try {
      const emp = await EmpleadosAPI.getById(id);
      const body = `
        <form class="modal-form" id="formEmpleado" novalidate>
          <input type="hidden" id="emp_id" value="${emp.id}" />
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="emp_nombres">Nombres *</label>
              <input class="form-input" id="emp_nombres" type="text" value="${emp.nombres || ''}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="emp_apellidos">Apellidos *</label>
              <input class="form-input" id="emp_apellidos" type="text" value="${emp.apellidos || ''}" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="emp_documento">Documento *</label>
              <input class="form-input" id="emp_documento" type="text" value="${emp.documento || ''}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="emp_telefono">Teléfono</label>
              <input class="form-input" id="emp_telefono" type="text" value="${emp.telefono || ''}" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="emp_correo">Correo *</label>
            <input class="form-input" id="emp_correo" type="email" value="${emp.correo || ''}" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="emp_cargo">Cargo *</label>
              <input class="form-input" id="emp_cargo" type="text" value="${emp.cargo || ''}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="emp_area">Área *</label>
              <input class="form-input" id="emp_area" type="text" value="${emp.area || ''}" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="emp_fecha_ingreso">Fecha de ingreso *</label>
              <input class="form-input" id="emp_fecha_ingreso" type="date" value="${emp.fecha_ingreso || ''}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="emp_estado">Estado</label>
              <select class="form-input" id="emp_estado">
                <option value="activo"   ${(emp.estado || 'activo') === 'activo'   ? 'selected' : ''}>Activo</option>
                <option value="inactivo" ${(emp.estado || '') === 'inactivo' ? 'selected' : ''}>Inactivo</option>
              </select>
            </div>
          </div>
          <div id="formEmpFeedback" class="form-feedback"></div>
        </form>`;

      const footer = `
        <button class="btn btn--secondary" onclick="Forms.cerrarModal()">Cancelar</button>
        <button class="btn btn--primary" id="btnGuardarEmpleado" data-text="Actualizar" onclick="Forms.guardarEmpleado(true)">Actualizar</button>`;

      abrirModal('Editar empleado', body, footer);
    } catch (err) {
      Helpers.toast('Error al cargar empleado: ' + err.message, 'error');
    }
  }

  async function guardarEmpleado(esEdicion = false) {
    const fb = document.getElementById('formEmpFeedback');
    const nombres       = document.getElementById('emp_nombres')?.value.trim();
    const apellidos     = document.getElementById('emp_apellidos')?.value.trim();
    const documento     = document.getElementById('emp_documento')?.value.trim();
    const correo        = document.getElementById('emp_correo')?.value.trim();
    const telefono      = document.getElementById('emp_telefono')?.value.trim();
    const cargo         = document.getElementById('emp_cargo')?.value.trim();
    const area          = document.getElementById('emp_area')?.value.trim();
    const fecha_ingreso = document.getElementById('emp_fecha_ingreso')?.value;
    const estado        = document.getElementById('emp_estado')?.value || 'activo';

    if (!nombres || !apellidos || !documento || !correo || !cargo || !area || !fecha_ingreso) {
      fb.textContent = 'Completa todos los campos obligatorios.';
      fb.className = 'form-feedback is-error';
      return;
    }

    const payload = { nombres, apellidos, documento, correo, telefono, cargo, area, fecha_ingreso, estado };
    setLoadingBtn('btnGuardarEmpleado', true);

    try {
      if (esEdicion) {
        const id = document.getElementById('emp_id').value;
        await EmpleadosAPI.editar(id, payload);
        Helpers.toast('Empleado actualizado correctamente.', 'success');
      } else {
        await EmpleadosAPI.crear(payload);
        Helpers.toast('Empleado creado correctamente.', 'success');
      }
      cerrarModal();
      Tables.cargarEmpleados();
    } catch (err) {
      fb.textContent = err.message;
      fb.className = 'form-feedback is-error';
      setLoadingBtn('btnGuardarEmpleado', false);
    }
  }

  function confirmarEliminarEmpleado(id, nombre) {
    const body   = `<p>¿Seguro que deseas eliminar al empleado <strong>${nombre}</strong>? Esta acción no se puede deshacer.</p>`;
    const footer = `
      <button class="btn btn--secondary" onclick="Forms.cerrarModal()">Cancelar</button>
      <button class="btn btn--danger" id="btnConfElimEmp" data-text="Eliminar" onclick="Forms.eliminarEmpleado(${id})">Eliminar</button>`;
    abrirModal('Eliminar empleado', body, footer);
  }

  async function eliminarEmpleado(id) {
    setLoadingBtn('btnConfElimEmp', true);
    try {
      await EmpleadosAPI.eliminar(id);
      Helpers.toast('Empleado eliminado.', 'success');
      cerrarModal();
      Tables.cargarEmpleados();
    } catch (err) {
      Helpers.toast('Error al eliminar: ' + err.message, 'error');
      setLoadingBtn('btnConfElimEmp', false);
    }
  }

  /* ════════════════════════════════════════════════════════════
     INCAPACIDADES
  ════════════════════════════════════════════════════════════ */

  function abrirCrearIncapacidad() {
    const hoy = new Date().toISOString().split('T')[0];
    const body = `
      <form class="modal-form" id="formIncapacidad" novalidate>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="inc_empleado_id">ID Empleado *</label>
            <input class="form-input" id="inc_empleado_id" type="number" min="1" placeholder="1" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="inc_tipo">Tipo *</label>
            <select class="form-input" id="inc_tipo" required>
              <option value="">Seleccionar…</option>
              <option value="enfermedad_general">Enfermedad general</option>
              <option value="accidente_laboral">Accidente laboral</option>
              <option value="licencia_medica">Licencia médica</option>
              <option value="incapacidad_temporal">Incapacidad temporal</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="inc_fecha_inicio">Fecha inicio *</label>
            <input class="form-input" id="inc_fecha_inicio" type="date" value="${hoy}" required oninput="Forms.calcularDiasInc()" />
          </div>
          <div class="form-group">
            <label class="form-label" for="inc_fecha_fin">Fecha fin *</label>
            <input class="form-input" id="inc_fecha_fin" type="date" required oninput="Forms.calcularDiasInc()" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Días de incapacidad</label>
          <input class="form-input" id="inc_dias" type="number" readonly placeholder="Se calcula automáticamente" style="background:#f4f4f4;cursor:default" />
        </div>
        <div class="form-group">
          <label class="form-label" for="inc_entidad_medica">Entidad médica *</label>
          <input class="form-input" id="inc_entidad_medica" type="text" placeholder="Clínica Central" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="inc_diagnostico">Diagnóstico general</label>
          <input class="form-input" id="inc_diagnostico" type="text" placeholder="Infección respiratoria" />
        </div>
        <div id="formIncFeedback" class="form-feedback"></div>
      </form>`;

    const footer = `
      <button class="btn btn--secondary" onclick="Forms.cerrarModal()">Cancelar</button>
      <button class="btn btn--primary" id="btnGuardarInc" data-text="Guardar" onclick="Forms.guardarIncapacidad()">Guardar</button>`;

    abrirModal('Nueva incapacidad', body, footer);
  }

  function calcularDiasInc() {
    const inicio = document.getElementById('inc_fecha_inicio')?.value;
    const fin    = document.getElementById('inc_fecha_fin')?.value;
    const campo  = document.getElementById('inc_dias');
    if (!campo) return;
    if (inicio && fin) {
      const dias = Helpers.calcularDias(inicio, fin);
      campo.value = dias > 0 ? dias : '';
    } else {
      campo.value = '';
    }
  }

  async function abrirEditarIncapacidad(id) {
    try {
      const inc = await IncapacidadesAPI.getById(id);
      const body = `
        <form class="modal-form" id="formIncapacidad" novalidate>
          <input type="hidden" id="inc_id" value="${inc.id}" />
          <div class="form-group">
            <label class="form-label" for="inc_estado">Estado *</label>
            <select class="form-input" id="inc_estado" required>
              <option value="registrada"   ${inc.estado === 'registrada'   ? 'selected':''}>Registrada</option>
              <option value="en_revision"  ${inc.estado === 'en_revision'  ? 'selected':''}>En revisión</option>
              <option value="aprobada"     ${inc.estado === 'aprobada'     ? 'selected':''}>Aprobada</option>
              <option value="rechazada"    ${inc.estado === 'rechazada'    ? 'selected':''}>Rechazada</option>
              <option value="finalizada"   ${inc.estado === 'finalizada'   ? 'selected':''}>Finalizada</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="inc_fecha_inicio">Fecha inicio</label>
              <input class="form-input" id="inc_fecha_inicio" type="date" value="${inc.fecha_inicio || ''}" oninput="Forms.calcularDiasInc()" />
            </div>
            <div class="form-group">
              <label class="form-label" for="inc_fecha_fin">Fecha fin</label>
              <input class="form-input" id="inc_fecha_fin" type="date" value="${inc.fecha_fin || ''}" oninput="Forms.calcularDiasInc()" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Días</label>
            <input class="form-input" id="inc_dias" type="number" value="${inc.dias_incapacidad || ''}" readonly style="background:#f4f4f4;cursor:default" />
          </div>
          <div id="formIncFeedback" class="form-feedback"></div>
        </form>`;

      const footer = `
        <button class="btn btn--secondary" onclick="Forms.cerrarModal()">Cancelar</button>
        <button class="btn btn--primary" id="btnGuardarInc" data-text="Actualizar" onclick="Forms.guardarIncapacidad(true)">Actualizar</button>`;

      abrirModal('Editar incapacidad', body, footer);
    } catch (err) {
      Helpers.toast('Error al cargar incapacidad: ' + err.message, 'error');
    }
  }

  async function guardarIncapacidad(esEdicion = false) {
    const fb = document.getElementById('formIncFeedback');

    if (esEdicion) {
      const id     = document.getElementById('inc_id').value;
      const estado = document.getElementById('inc_estado')?.value;
      const fi     = document.getElementById('inc_fecha_inicio')?.value;
      const ff     = document.getElementById('inc_fecha_fin')?.value;
      const dias   = fi && ff ? Helpers.calcularDias(fi, ff) : undefined;

      const payload = { estado };
      if (fi) payload.fecha_inicio = fi;
      if (ff) payload.fecha_fin    = ff;
      if (dias !== undefined) payload.dias_incapacidad = dias;

      setLoadingBtn('btnGuardarInc', true);
      try {
        await IncapacidadesAPI.editar(id, payload);
        Helpers.toast('Incapacidad actualizada.', 'success');
        cerrarModal();
        Tables.cargarIncapacidades();
      } catch (err) {
        fb.textContent = err.message;
        fb.className = 'form-feedback is-error';
        setLoadingBtn('btnGuardarInc', false);
      }
    } else {
      const empleado_id       = document.getElementById('inc_empleado_id')?.value;
      const tipo              = document.getElementById('inc_tipo')?.value;
      const fecha_inicio      = document.getElementById('inc_fecha_inicio')?.value;
      const fecha_fin         = document.getElementById('inc_fecha_fin')?.value;
      const entidad_medica    = document.getElementById('inc_entidad_medica')?.value.trim();
      const diagnostico_general = document.getElementById('inc_diagnostico')?.value.trim();

      if (!empleado_id || !tipo || !fecha_inicio || !fecha_fin || !entidad_medica) {
        fb.textContent = 'Completa todos los campos obligatorios.';
        fb.className = 'form-feedback is-error';
        return;
      }
      if (new Date(fecha_fin) < new Date(fecha_inicio)) {
        fb.textContent = 'La fecha fin no puede ser menor a la fecha inicio.';
        fb.className = 'form-feedback is-error';
        return;
      }

      const dias_incapacidad = Helpers.calcularDias(fecha_inicio, fecha_fin);
      const payload = { empleado_id: parseInt(empleado_id), tipo, fecha_inicio, fecha_fin, entidad_medica, diagnostico_general, dias_incapacidad };

      setLoadingBtn('btnGuardarInc', true);
      try {
        await IncapacidadesAPI.crear(payload);
        Helpers.toast('Incapacidad registrada.', 'success');
        cerrarModal();
        Tables.cargarIncapacidades();
      } catch (err) {
        fb.textContent = err.message;
        fb.className = 'form-feedback is-error';
        setLoadingBtn('btnGuardarInc', false);
      }
    }
  }

  function confirmarEliminarIncapacidad(id) {
    const body   = `<p>¿Seguro que deseas eliminar la incapacidad <strong>#${id}</strong>? Esta acción no se puede deshacer.</p>`;
    const footer = `
      <button class="btn btn--secondary" onclick="Forms.cerrarModal()">Cancelar</button>
      <button class="btn btn--danger" id="btnConfElimInc" data-text="Eliminar" onclick="Forms.eliminarIncapacidad(${id})">Eliminar</button>`;
    abrirModal('Eliminar incapacidad', body, footer);
  }

  async function eliminarIncapacidad(id) {
    setLoadingBtn('btnConfElimInc', true);
    try {
      await IncapacidadesAPI.eliminar(id);
      Helpers.toast('Incapacidad eliminada.', 'success');
      cerrarModal();
      Tables.cargarIncapacidades();
    } catch (err) {
      Helpers.toast('Error: ' + err.message, 'error');
      setLoadingBtn('btnConfElimInc', false);
    }
  }

  /* ════════════════════════════════════════════════════════════
     SEGUIMIENTOS
  ════════════════════════════════════════════════════════════ */

  function abrirCrearSeguimiento() {
    const hoy = new Date().toISOString().split('T')[0];
    const usuario = Token.obtenerUsuario().usuario || '';
    const body = `
      <form class="modal-form" id="formSeguimiento" novalidate>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="seg_incapacidad_id">ID Incapacidad *</label>
            <input class="form-input" id="seg_incapacidad_id" type="number" min="1" placeholder="1" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="seg_fecha">Fecha *</label>
            <input class="form-input" id="seg_fecha" type="date" value="${hoy}" required />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="seg_estado">Estado *</label>
          <select class="form-input" id="seg_estado" required>
            <option value="registrada">Registrada</option>
            <option value="en_revision">En revisión</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
            <option value="finalizada">Finalizada</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="seg_comentario">Comentario *</label>
          <input class="form-input" id="seg_comentario" type="text" placeholder="Describe el seguimiento…" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="seg_usuario">Usuario responsable *</label>
          <input class="form-input" id="seg_usuario" type="text" value="${usuario}" placeholder="gestionhumana" required />
        </div>
        <div id="formSegFeedback" class="form-feedback"></div>
      </form>`;

    const footer = `
      <button class="btn btn--secondary" onclick="Forms.cerrarModal()">Cancelar</button>
      <button class="btn btn--primary" id="btnGuardarSeg" data-text="Guardar" onclick="Forms.guardarSeguimiento()">Guardar</button>`;

    abrirModal('Nuevo seguimiento', body, footer);
  }

  async function abrirEditarSeguimiento(id) {
    try {
      const seg = await SeguimientoAPI.getById(id);
      const body = `
        <form class="modal-form" id="formSeguimiento" novalidate>
          <input type="hidden" id="seg_id" value="${seg.id}" />
          <div class="form-group">
            <label class="form-label" for="seg_estado">Estado *</label>
            <select class="form-input" id="seg_estado" required>
              <option value="registrada"  ${seg.estado === 'registrada'  ? 'selected':''}>Registrada</option>
              <option value="en_revision" ${seg.estado === 'en_revision' ? 'selected':''}>En revisión</option>
              <option value="aprobada"    ${seg.estado === 'aprobada'    ? 'selected':''}>Aprobada</option>
              <option value="rechazada"   ${seg.estado === 'rechazada'   ? 'selected':''}>Rechazada</option>
              <option value="finalizada"  ${seg.estado === 'finalizada'  ? 'selected':''}>Finalizada</option>
              <option value="cerrado"     ${seg.estado === 'cerrado'     ? 'selected':''}>Cerrado</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="seg_comentario">Comentario *</label>
            <input class="form-input" id="seg_comentario" type="text" value="${seg.comentario || ''}" required />
          </div>
          <div id="formSegFeedback" class="form-feedback"></div>
        </form>`;

      const footer = `
        <button class="btn btn--secondary" onclick="Forms.cerrarModal()">Cancelar</button>
        <button class="btn btn--primary" id="btnGuardarSeg" data-text="Actualizar" onclick="Forms.guardarSeguimiento(true)">Actualizar</button>`;

      abrirModal('Editar seguimiento', body, footer);
    } catch (err) {
      Helpers.toast('Error al cargar seguimiento: ' + err.message, 'error');
    }
  }

  async function guardarSeguimiento(esEdicion = false) {
    const fb = document.getElementById('formSegFeedback');

    if (esEdicion) {
      const id         = document.getElementById('seg_id').value;
      const estado     = document.getElementById('seg_estado')?.value;
      const comentario = document.getElementById('seg_comentario')?.value.trim();
      if (!comentario) {
        fb.textContent = 'El comentario es obligatorio.';
        fb.className = 'form-feedback is-error';
        return;
      }
      setLoadingBtn('btnGuardarSeg', true);
      try {
        await SeguimientoAPI.editar(id, { estado, comentario });
        Helpers.toast('Seguimiento actualizado.', 'success');
        cerrarModal();
        Tables.cargarSeguimientos();
      } catch (err) {
        fb.textContent = err.message;
        fb.className = 'form-feedback is-error';
        setLoadingBtn('btnGuardarSeg', false);
      }
    } else {
      const incapacidad_id       = document.getElementById('seg_incapacidad_id')?.value;
      const fecha                = document.getElementById('seg_fecha')?.value;
      const estado               = document.getElementById('seg_estado')?.value;
      const comentario           = document.getElementById('seg_comentario')?.value.trim();
      const usuario_responsable  = document.getElementById('seg_usuario')?.value.trim();

      if (!incapacidad_id || !fecha || !comentario || !usuario_responsable) {
        fb.textContent = 'Completa todos los campos obligatorios.';
        fb.className = 'form-feedback is-error';
        return;
      }
      setLoadingBtn('btnGuardarSeg', true);
      try {
        await SeguimientoAPI.crear({ incapacidad_id: parseInt(incapacidad_id), fecha, estado, comentario, usuario_responsable });
        Helpers.toast('Seguimiento registrado.', 'success');
        cerrarModal();
        Tables.cargarSeguimientos();
      } catch (err) {
        fb.textContent = err.message;
        fb.className = 'form-feedback is-error';
        setLoadingBtn('btnGuardarSeg', false);
      }
    }
  }

  function confirmarEliminarSeguimiento(id) {
    const body   = `<p>¿Seguro que deseas eliminar el seguimiento <strong>#${id}</strong>?</p>`;
    const footer = `
      <button class="btn btn--secondary" onclick="Forms.cerrarModal()">Cancelar</button>
      <button class="btn btn--danger" id="btnConfElimSeg" data-text="Eliminar" onclick="Forms.eliminarSeguimiento(${id})">Eliminar</button>`;
    abrirModal('Eliminar seguimiento', body, footer);
  }

  async function eliminarSeguimiento(id) {
    setLoadingBtn('btnConfElimSeg', true);
    try {
      await SeguimientoAPI.eliminar(id);
      Helpers.toast('Seguimiento eliminado.', 'success');
      cerrarModal();
      Tables.cargarSeguimientos();
    } catch (err) {
      Helpers.toast('Error: ' + err.message, 'error');
      setLoadingBtn('btnConfElimSeg', false);
    }
  }

  return {
    cerrarModal,
    abrirCrearEmpleado, abrirEditarEmpleado, guardarEmpleado,
    confirmarEliminarEmpleado, eliminarEmpleado,
    abrirCrearIncapacidad, abrirEditarIncapacidad, guardarIncapacidad,
    confirmarEliminarIncapacidad, eliminarIncapacidad, calcularDiasInc,
    abrirCrearSeguimiento, abrirEditarSeguimiento, guardarSeguimiento,
    confirmarEliminarSeguimiento, eliminarSeguimiento
  };
})();