/* ═══════════════════════════════════════════════════════════════
   Helpers.js — Funciones auxiliares reutilizables
═══════════════════════════════════════════════════════════════ */

const Helpers = (() => {

  // Formato de fecha YYYY-MM-DD → DD/MM/YYYY
  function formatFecha(fecha) {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  // Calcula días entre dos fechas YYYY-MM-DD (inclusivo)
  function calcularDias(fechaInicio, fechaFin) {
    const d1 = new Date(fechaInicio);
    const d2 = new Date(fechaFin);
    const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff + 1 : 0;
  }

  // Badge HTML según estado
  function badgeEstado(estado) {
    const e = (estado || '').toLowerCase().replace(' ', '_');
    return `<span class="badge badge--${e}">${estado || '—'}</span>`;
  }

  // Toast visual
  function toast(msg, tipo = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const t = document.createElement('div');
    t.className = `toast toast--${tipo}`;
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  // Poblar un <select> con opciones únicas de un array
  function poblarSelect(selectId, valores, textoDefault) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const actual = sel.value;
    sel.innerHTML = `<option value="">${textoDefault}</option>`;
    [...new Set(valores.filter(Boolean))].sort().forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      sel.appendChild(opt);
    });
    sel.value = actual;
  }

  // Truncar texto largo
  function truncar(texto, max = 40) {
    if (!texto) return '—';
    return texto.length > max ? texto.slice(0, max) + '…' : texto;
  }

  return { formatFecha, calcularDias, badgeEstado, toast, poblarSelect, truncar };
})();