/* ═══════════════════════════════════════════════════════════════
   Incapacidades.js — API calls al microservicio ms-incapacidades
   Base URL: http://127.0.0.1:8002
═══════════════════════════════════════════════════════════════ */

const IncapacidadesAPI = (() => {
  const BASE = 'http://127.0.0.1:8002';

  async function getAll() {
    const res = await fetch(`${BASE}/incapacidades`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Error al obtener incapacidades');
    return data;
  }

  async function getById(id) {
    const res = await fetch(`${BASE}/incapacidad/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Incapacidad no encontrada');
    return data;
  }

  async function filtrarPorEstado(estado) {
    const res = await fetch(`${BASE}/incapacidades/filtrar?estado=${encodeURIComponent(estado)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Error al filtrar');
    return data;
  }

  async function crear(payload) {
    const res = await fetch(`${BASE}/incapacidad`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Error al crear incapacidad');
    return data;
  }

  async function editar(id, payload) {
    const res = await fetch(`${BASE}/incapacidad/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Error al editar incapacidad');
    return data;
  }

  async function eliminar(id) {
    const res = await fetch(`${BASE}/incapacidad/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Error al eliminar incapacidad');
    return data;
  }

  return { getAll, getById, filtrarPorEstado, crear, editar, eliminar };
})();