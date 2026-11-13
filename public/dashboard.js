let equiposDB = [];
let rolActual = 'admin';
let userIdActual = '';
let userNameActual = '';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  rolActual = urlParams.get('role') || sessionStorage.getItem('userRole') || 'admin';
  userIdActual = sessionStorage.getItem('userId') || '';
  userNameActual = sessionStorage.getItem('userName') || 'Administrador';

  const subtitle = document.getElementById('userRoleSubtitle');
  if(rolActual === 'tecnico') {
    subtitle.textContent = `Perfil: Técnico de Campo (${userNameActual}) - Historial Personal`;
    const cardEq = document.getElementById('cardRegistroEquipo');
    const cardCat = document.getElementById('cardCatalogoFallas');
    if(cardEq) cardEq.style.display = 'none';
    if(cardCat) cardCat.style.display = 'none';
  } else {
    subtitle.textContent = "Perfil: Administrador del Sistema (Vista Global de Historiales)";
    const cardTec = document.getElementById('cardRegistroTecnico');
    if(cardTec) cardTec.style.display = 'block';
    await cargarTecnicos();
  }

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const trabajoFecha = document.getElementById('trabajoFecha');
  if(trabajoFecha) trabajoFecha.value = now.toISOString().slice(0, 16);
  
  await cargarEquiposDesdeBD();

  // Inputs de Imagen
  const setupImageInput = (fileId, urlId) => {
    const input = document.getElementById(fileId);
    if(input) {
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const urlInput = document.getElementById(urlId);
            if(urlInput) urlInput.value = reader.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };
  setupImageInput('eqImagenFile', 'eqImagenUrl');
  setupImageInput('editEqImagenFile', 'editEqImagenUrl');
});

async function cargarEquiposDesdeBD() {
  try {
    const res = await fetch('/api/equipos');
    equiposDB = await res.json();
    actualizarSelects();
    const selectConsulta = document.getElementById('selectConsultaEquipo');
    if(selectConsulta && selectConsulta.value) mostrarDetallesEquipo();
  } catch (err) {
    console.error('Error al cargar equipos:', err);
  }
}

// Guardar Equipo (Admin)
const formEquipo = document.getElementById('formEquipo');
if(formEquipo) {
  formEquipo.addEventListener('submit', async (e) => {
    e.preventDefault();
    const urlInput = document.getElementById('eqImagenUrl');
    const nuevoEquipo = {
      codigoEquipo: document.getElementById('eqCodigo').value,
      tipo: document.getElementById('eqTipo').value,
      marca: document.getElementById('eqMarca').value,
      modelo: document.getElementById('eqModelo').value,
      anio: Number(document.getElementById('eqAnio').value),
      imagenUrl: (urlInput && urlInput.value) ? urlInput.value : 'https://via.placeholder.com/150?text=COQUIVACOA',
      catalogosFallas: [],
      historialTrabajos: []
    };

    try {
      const res = await fetch('/api/equipos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoEquipo)
      });
      if(res.ok) {
        alert('¡Equipo guardado con éxito!');
        e.target.reset();
        if(urlInput) urlInput.value = '';
        await cargarEquiposDesdeBD();
      } else {
        const err = await res.json();
        alert('Error: ' + (err.error || 'Verifique los datos'));
      }
    } catch { alert('Error de conexión.'); }
  });
}

// Guardar Falla en Catálogo (Admin)
const formFalla = document.getElementById('formFalla');
if(formFalla) {
  formFalla.addEventListener('submit', async (e) => {
    e.preventDefault();
    const eqId = document.getElementById('selectEquipoFallas').value;
    if(!eqId) return alert('Seleccione un equipo');

    const falla = {
      codigo: document.getElementById('fallaCodigo').value,
      descripcion: document.getElementById('fallaDesc').value,
      solucion: document.getElementById('fallaSolucion').value,
      observaciones: document.getElementById('fallaObs').value
    };

    try {
      const res = await fetch(`/api/equipos/${eqId}/fallas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(falla)
      });
      if(res.ok) {
        alert('Falla agregada correctamente.');
        e.target.reset();
        await cargarEquiposDesdeBD();
        document.getElementById('selectConsultaEquipo').value = eqId;
        mostrarDetallesEquipo();
      }
    } catch { alert('Error al registrar la falla.'); }
  });
}

// Editar y Eliminar Fallas del Catálogo
async function editarFalla(fallaId) {
  const eqId = document.getElementById('selectConsultaEquipo').value;
  const eq = equiposDB.find(x => x._id === eqId);
  if(!eq) return;
  const falla = eq.catalogosFallas.find(f => f._id === fallaId);
  if(!falla) return;

  const codigo = prompt('Código de Falla:', falla.codigo);
  if(codigo === null) return;
  const descripcion = prompt('Descripción:', falla.descripcion);
  if(descripcion === null) return;
  const solucion = prompt('Solución Sugerida:', falla.solucion);
  if(solucion === null) return;
  const observaciones = prompt('Observaciones:', falla.observaciones || '');
  if(observaciones === null) return;

  try {
    const res = await fetch(`/api/equipos/${eqId}/fallas/${fallaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo, descripcion, solucion, observaciones })
    });
    if(res.ok) {
      alert('Falla actualizada.');
      await cargarEquiposDesdeBD();
      document.getElementById('selectConsultaEquipo').value = eqId;
      mostrarDetallesEquipo();
    } else { alert('Error al actualizar.'); }
  } catch { alert('Error de conexión.'); }
}

async function eliminarFalla(fallaId) {
  if(!confirm('¿Eliminar esta falla del catálogo?')) return;
  const eqId = document.getElementById('selectConsultaEquipo').value;
  try {
    const res = await fetch(`/api/equipos/${eqId}/fallas/${fallaId}`, { method: 'DELETE' });
    if(res.ok) {
      alert('Falla eliminada.');
      await cargarEquiposDesdeBD();
      document.getElementById('selectConsultaEquipo').value = eqId;
      mostrarDetallesEquipo();
    } else { alert('Error al eliminar.'); }
  } catch { alert('Error de conexión.'); }
}

// CRUD Técnicos (Admin)
async function cargarTecnicos() {
  try {
    const res = await fetch('/api/tecnicos');
    const tecnicos = await res.json();
    const tbody = document.querySelector('#tablaTecnicos tbody');
    if(!tbody) return;
    tbody.innerHTML = tecnicos.length ? '' : `<tr><td colspan="4" style="text-align:center; color:#666;">No hay técnicos.</td></tr>`;
    tecnicos.forEach(t => {
      tbody.innerHTML += `
        <tr>
          <td>${t.nombre}</td><td>${t.cedula}</td><td>${t.email}</td>
          <td>
            <button type="button" onclick='prepararEdicionTecnico(${JSON.stringify(t)})' style="padding:4px 8px; font-size:0.8rem; background:#2563EB; width:auto; margin:0;">✏️</button>
            <button type="button" onclick="eliminarTecnico('${t._id}')" style="padding:4px 8px; font-size:0.8rem; background:#DC2626; width:auto; margin:0; margin-left:5px;">🗑️</button>
          </td>
        </tr>`;
    });
  } catch (err) { console.error(err); }
}

const formTecnico = document.getElementById('formTecnico');
if(formTecnico) {
  formTecnico.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('tecId').value;
    const data = {
      nombre: document.getElementById('tecNombre').value,
      cedula: document.getElementById('tecCedula').value,
      email: document.getElementById('tecEmail').value,
      password: document.getElementById('tecPassword').value
    };
    const res = await fetch(id ? `/api/tecnicos/${id}` : '/api/tecnicos', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if(res.ok) {
      alert(id ? 'Técnico actualizado' : 'Técnico registrado');
      limpiarFormTecnico();
      await cargarTecnicos();
    } else { alert('Error al guardar técnico.'); }
  });
}

function prepararEdicionTecnico(t) {
  document.getElementById('tecId').value = t._id;
  document.getElementById('tecNombre').value = t.nombre;
  document.getElementById('tecCedula').value = t.cedula;
  document.getElementById('tecEmail').value = t.email;
  document.getElementById('tecPassword').value = t.password;
  document.getElementById('btnGuardarTecnico').textContent = 'Actualizar';
  document.getElementById('btnCancelarEdicion').style.display = 'inline-block';
}

function limpiarFormTecnico() {
  document.getElementById('formTecnico').reset();
  document.getElementById('tecId').value = '';
  document.getElementById('btnGuardarTecnico').textContent = 'Registrar Técnico';
  document.getElementById('btnCancelarEdicion').style.display = 'none';
}

async function eliminarTecnico(id) {
  if(confirm('¿Eliminar técnico?')) {
    const res = await fetch(`/api/tecnicos/${id}`, { method: 'DELETE' });
    if(res.ok) { alert('Eliminado'); await cargarTecnicos(); }
  }
}

// Modal Editar Equipo
function abrirModalEdicionEquipo() {
  const eqId = document.getElementById('selectConsultaEquipo').value;
  const eq = equiposDB.find(x => x._id === eqId);
  if(!eq) return alert('Seleccione un equipo');
  document.getElementById('editEqId').value = eq._id;
  document.getElementById('editEqCodigo').value = eq.codigoEquipo;
  document.getElementById('editEqTipo').value = eq.tipo;
  document.getElementById('editEqMarca').value = eq.marca;
  document.getElementById('editEqModelo').value = eq.modelo;
  document.getElementById('editEqAnio').value = eq.anio;
  document.getElementById('editEqImagenUrl').value = eq.imagenUrl;
  document.getElementById('modalEditarEquipo').style.display = 'flex';
}

function cerrarModalEdicionEquipo() {
  document.getElementById('modalEditarEquipo').style.display = 'none';
  document.getElementById('formEditarEquipo').reset();
}

const formEditarEquipo = document.getElementById('formEditarEquipo');
if(formEditarEquipo) {
  formEditarEquipo.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editEqId').value;
    const datos = {
      codigoEquipo: document.getElementById('editEqCodigo').value,
      tipo: document.getElementById('editEqTipo').value,
      marca: document.getElementById('editEqMarca').value,
      modelo: document.getElementById('editEqModelo').value,
      anio: Number(document.getElementById('editEqAnio').value),
      imagenUrl: document.getElementById('editEqImagenUrl').value
    };
    const res = await fetch(`/api/equipos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if(res.ok) {
      alert('Equipo actualizado');
      cerrarModalEdicionEquipo();
      await cargarEquiposDesdeBD();
      document.getElementById('selectConsultaEquipo').value = id;
      mostrarDetallesEquipo();
    } else { alert('Error al actualizar'); }
  });
}

// Formulario Trabajo Técnico
function cargarCodigosFallaEquipo() {
  const eqId = document.getElementById('selectEquipoTrabajo').value;
  const selectFalla = document.getElementById('selectFallaCatalogo');
  selectFalla.innerHTML = '<option value="">-- Seleccione código --</option>';
  const eq = equiposDB.find(x => x._id === eqId);
  if(eq && eq.catalogosFallas) {
    eq.catalogosFallas.forEach(f => {
      selectFalla.innerHTML += `<option value="${f.codigo}">${f.codigo} - ${f.descripcion}</option>`;
    });
  }
}

function completarDatosFalla() {
  const eqId = document.getElementById('selectEquipoTrabajo').value;
  const codigo = document.getElementById('selectFallaCatalogo').value;
  const eq = equiposDB.find(x => x._id === eqId);
  if(eq && eq.catalogosFallas) {
    const f = eq.catalogosFallas.find(x => x.codigo === codigo);
    if(f) document.getElementById('trabajoSolucion').value = f.solucion || '';
  }
}

const formTrabajoTecnico = document.getElementById('formTrabajoTecnico');
if(formTrabajoTecnico) {
  formTrabajoTecnico.addEventListener('submit', async (e) => {
    e.preventDefault();
    const eqId = document.getElementById('selectEquipoTrabajo').value;
    const codigo = document.getElementById('selectFallaCatalogo').value;
    if(!eqId || !codigo) return alert('Seleccione equipo y falla');

    const trabajo = {
      fechaHora: document.getElementById('trabajoFecha').value,
      fallasReportadas: [codigo],
      solucionAplicada: document.getElementById('trabajoSolucion').value,
      estadoFinal: document.getElementById('trabajoEstado').value,
      tecnicoId: rolActual === 'tecnico' ? userIdActual : 'admin',
      tecnicoNombre: userNameActual
    };

    const res = await fetch(`/api/equipos/${eqId}/mantenimiento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trabajo)
    });
    if(res.ok) {
      alert('Intervención registrada');
      e.target.reset();
      await cargarEquiposDesdeBD();
      document.getElementById('selectConsultaEquipo').value = eqId;
      mostrarDetallesEquipo();
    }
  });
}

function actualizarSelects() {
  ['selectEquipoFallas', 'selectConsultaEquipo', 'selectEquipoTrabajo'].forEach(id => {
    const s = document.getElementById(id);
    if(!s) return;
    const val = s.value;
    s.innerHTML = '<option value="">-- Seleccionar --</option>';
    equiposDB.forEach(eq => {
      s.innerHTML += `<option value="${eq._id}">${eq.codigoEquipo} - ${eq.marca} ${eq.modelo}</option>`;
    });
    s.value = val;
  });
}

function mostrarDetallesEquipo() {
  const eqId = document.getElementById('selectConsultaEquipo').value;
  const area = document.getElementById('detalleArea');
  const eq = equiposDB.find(x => x._id === eqId);

  if(!eq) {
    if(area) area.style.display = 'none';
    const cont = document.getElementById('arbolFallasContenedor');
    if(cont) cont.innerHTML = '<p>Seleccione un equipo.</p>';
    return;
  }
  if(area) area.style.display = 'block';

  const adminAcciones = document.getElementById('adminAccionesEquipo');
  if(adminAcciones) adminAcciones.style.display = (rolActual === 'admin') ? 'block' : 'none';

  const ficha = document.getElementById('fichaTecnica');
  if(ficha) {
    ficha.innerHTML = `
      <div style="display:flex; gap:1rem; align-items:center;">
        <img src="${eq.imagenUrl}" class="thumb" alt="Equipo" style="max-width:100px; border-radius:6px;">
        <div>
          <p><strong>Código:</strong> ${eq.codigoEquipo} | <strong>Tipo:</strong> ${eq.tipo}</p>
          <p><strong>Marca/Modelo:</strong> ${eq.marca} ${eq.modelo} (${eq.anio})</p>
        </div>
      </div>`;
  }

  const tbody = document.querySelector('#tablaFallas tbody');
  if(tbody) {
    tbody.innerHTML = '';
    if(eq.catalogosFallas && eq.catalogosFallas.length > 0) {
      eq.catalogosFallas.forEach(f => {
        const acciones = rolActual === 'admin' ? `
          <td>
            <button type="button" onclick="editarFalla('${f._id}')" style="padding:4px 8px; font-size:0.8rem; background:#2563EB; width:auto; margin:0;">✏️</button>
            <button type="button" onclick="eliminarFalla('${f._id}')" style="padding:4px 8px; font-size:0.8rem; background:#DC2626; width:auto; margin:0; margin-left:5px;">🗑️</button>
          </td>` : `<td>-</td>`;
        tbody.innerHTML += `
          <tr>
            <td><strong>${f.codigo}</strong></td><td>${f.descripcion}</td><td>${f.solucion}</td><td>${f.observaciones || '-'}</td>${acciones}
          </tr>`;
      });
    } else {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#666;">No hay fallas en el catálogo.</td></tr>`;
    }
  }
  renderizarArbol(eq);
}

function renderizarArbol(eq) {
  const cont = document.getElementById('arbolFallasContenedor');
  if(!cont) return;
  if(!eq.historialTrabajos || eq.historialTrabajos.length === 0) {
    cont.innerHTML = '<p>No hay intervenciones registradas.</p>';
    return;
  }

  let trabajos = eq.historialTrabajos;
  if(rolActual === 'tecnico') trabajos = eq.historialTrabajos.filter(t => t.tecnicoId === userIdActual);

  if(!trabajos.length) {
    cont.innerHTML = '<p>No tiene intervenciones en este equipo.</p>';
    return;
  }

  let html = `<div class="tree"><div class="tree-node"><strong>🌳 Árbol de Diagnóstico - ${eq.codigoEquipo}</strong></div>`;
  trabajos.forEach((t, i) => {
    const badge = t.estadoFinal === 'Operativo' ? 'status-operativo' : 'status-falla';
    const tecTag = rolActual === 'admin' ? `<p>👤 <strong>Técnico:</strong> ${t.tecnicoNombre || 'N/D'}</p>` : '';
    html += `
      <div class="tree-node tree-child" style="margin-top:10px; padding:10px; border-left:4px solid #10B981; background:#f9fafb;">
        <p><strong>Intervención #${i+1}</strong> - ${new Date(t.fechaHora).toLocaleString()}</p>
        ${tecTag}
        <p>❌ <strong>Falla(s):</strong> ${t.fallasReportadas ? t.fallasReportadas.join(', ') : '-'}</p>
        <p>🛠️ <strong>Solución:</strong> ${t.solucionAplicada}</p>
        <p>📌 <strong>Estatus:</strong> <span class="status-badge ${badge}">${t.estadoFinal}</span></p>
      </div>`;
  });
  html += `</div>`;
  cont.innerHTML = html;
}