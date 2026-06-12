/* ═══════════════════════════════════════════════════════════════
   Empleados.js — API calls al microservicio ms-empleados
   Base URL: http://127.0.0.1:8001
═══════════════════════════════════════════════════════════════ */

const EmpleadosAPI = (() => {
  const BASE = 'http://127.0.0.1:8001';

  async function getAll() {
    const res = await fetch(`${BASE}/empleados`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Error al obtener empleados');
    return data;
  }

  async function getById(id) {
    const res = await fetch(`${BASE}/empleado/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Empleado no encontrado');
    return data;
  }

  async function crear(payload) {
    const res = await fetch(`${BASE}/empleado`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Error al crear empleado');
    return data;
  }

  async function editar(id, payload) {
    const res = await fetch(`${BASE}/empleado/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Error al editar empleado');
    return data;
  }

  async function eliminar(id) {
    const res = await fetch(`${BASE}/empleado/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.detail || 'Error al eliminar empleado');
    return data;
  }

  return { getAll, getById, crear, editar, eliminar };
})();