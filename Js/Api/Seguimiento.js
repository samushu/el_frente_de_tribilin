/* ═══════════════════════════════════════════════════════════════
   Seguimiento.js — API calls al microservicio ms-seguimiento
   Base URL: http://127.0.0.1:8003
═══════════════════════════════════════════════════════════════ */

const SeguimientoAPI = (() => {
  const BASE = 'http://127.0.0.1:8003';

  async function getAll() {
    const res = await fetch(`${BASE}/seguimientos`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Error al obtener seguimientos');
    return data;
  }

  async function getById(id) {
    const res = await fetch(`${BASE}/seguimiento/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Seguimiento no encontrado');
    return data;
  }

  async function getPorIncapacidad(incapacidadId) {
    const res = await fetch(`${BASE}/seguimientos/incapacidad/${incapacidadId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Error al obtener seguimientos');
    return data;
  }

  async function crear(payload) {
    const res = await fetch(`${BASE}/seguimiento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Error al crear seguimiento');
    return data;
  }

  async function editar(id, payload) {
    const res = await fetch(`${BASE}/seguimiento/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Error al editar seguimiento');
    return data;
  }

  async function eliminar(id) {
    const res = await fetch(`${BASE}/seguimiento/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Error al eliminar seguimiento');
    return data;
  }

  return { getAll, getById, getPorIncapacidad, crear, editar, eliminar };
})();