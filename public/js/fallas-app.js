// Lógica principal para consulta de fallas, enlace a Google Modo IA y gestión local

let _fallasMostradasActuales = [];

function obtenerFallasLocales() {
  try {
    const data = JSON.parse(localStorage.getItem("fallasGuardadasReporte") || "[]");
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function obtenerTodasLasFallas() {
  const base = typeof CATALOGO_FALLAS !== "undefined" && Array.isArray(CATALOGO_FALLAS)
    ? CATALOGO_FALLAS
    : [];
  const locales = obtenerFallasLocales();
  return [...locales, ...base];
}

function armarConsultaIA(textoBase = "") {
  const inputBusqueda = document.getElementById("buscarTexto");
  const selectSistema = document.getElementById("filtroSistema");
  const inputModelo = document.getElementById("modeloEquipo");

  const busqueda = (textoBase || (inputBusqueda ? inputBusqueda.value : "")).trim();
  const sistema = selectSistema ? selectSistema.value.trim() : "";
  const modelo = inputModelo ? inputModelo.value.trim() : "";

  const partes = [
    "dispensador surtidor combustible",
    busqueda,
    modelo,
    sistema ? `sistema ${sistema}` : "",
    "diagnostico falla solucion"
  ].filter(Boolean);

  return partes.join(" ");
}

function construirUrlGoogleIA(consulta) {
  return `https://www.google.com/search?udm=50&q=${encodeURIComponent(consulta)}`;
}

function actualizarEnlaceIA(consultaPersonalizada = "") {
  const enlace = document.getElementById("enlaceGoogleIA");
  const texto = document.getElementById("textoConsultaIA");
  if (!enlace || !texto) return;

  const consulta = armarConsultaIA(consultaPersonalizada);
  enlace.href = construirUrlGoogleIA(consulta);
  texto.textContent = `Consulta lista: "${consulta}"`;
}

function enviarAlReportePorIndice(indice) {
  const falla = _fallasMostradasActuales[indice];
  if (!falla) return;

  const resumen = `[${falla.codigo}] ${falla.sintoma} -> Acción: ${falla.accion}`;
  sessionStorage.setItem("fallaSugerida", resumen);
  window.location.href = "reporte.html";
}

function renderizarFallas(lista) {
  const contenedor = document.getElementById("contenedorFallas");
  const contador = document.getElementById("contadorFallas");
  if (!contenedor) return;

  _fallasMostradasActuales = lista;
  contenedor.innerHTML = "";

  if (contador) {
    contador.textContent = `${lista.length} ${lista.length === 1 ? "falla" : "fallas"}`;
  }

  if (lista.length === 0) {
    contenedor.innerHTML = `<p style="grid-column: 1 / -1; color: #475569;">No se encontraron coincidencias en el catálogo local. Usa el botón de <strong>Google Modo IA</strong> arriba o pega un diagnóstico aquí mismo.</p>`;
    return;
  }

  lista.forEach((falla, idx) => {
    const consultaTarjeta = `${falla.sintoma || ""} ${falla.causa || ""}`.trim();
    const urlIA = construirUrlGoogleIA(armarConsultaIA(consultaTarjeta));

    const card = document.createElement("div");
    card.className = "falla-card";
    card.innerHTML = `
      <div class="falla-header">
        <h3 class="falla-titulo">${falla.codigo || `FL-${idx + 1}`} — ${falla.sintoma || "Sin título"}</h3>
        <span class="badge">${falla.sistema || "General"}</span>
      </div>
      <p class="falla-detalle"><strong>Causa probable:</strong> ${falla.causa || "No especificada"}</p>
      <p class="falla-detalle"><strong>Qué revisar:</strong> ${falla.revision || "No especificada"}</p>
      <p class="falla-detalle"><strong>Acción correctiva:</strong> ${(falla.accion || "").replace(/\n/g, "<br>")}</p>
      <div class="falla-acciones">
        <button type="button" class="btn-sm btn-reporte" onclick="enviarAlReportePorIndice(${idx})">
          📋 Pasar al reporte
        </button>
        <a href="${urlIA}" target="_blank" rel="noopener noreferrer" class="btn-sm btn-buscar-ia">
          🤖 Modo IA ↗
        </a>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function filtrarFallas() {
  const inputBusqueda = document.getElementById("buscarTexto");
  const selectSistema = document.getElementById("filtroSistema");

  const texto = inputBusqueda ? inputBusqueda.value.toLowerCase().trim() : "";
  const sistema = selectSistema ? selectSistema.value : "";

  const base = obtenerTodasLasFallas();

  const filtradas = base.filter((item) => {
    const coincideSistema = !sistema || item.sistema === sistema;
    const contenido = `${item.codigo || ""} ${item.sistema || ""} ${item.sintoma || ""} ${item.causa || ""} ${item.revision || ""} ${item.accion || ""}`.toLowerCase();
    const coincideTexto = !texto || contenido.includes(texto);
    return coincideSistema && coincideTexto;
  });

  renderizarFallas(filtradas);
  actualizarEnlaceIA();
}

function guardarDiagnosticoIA() {
  const sistemaEl = document.getElementById("iaSistema");
  const sintomaEl = document.getElementById("iaSintoma");
  const textoEl = document.getElementById("iaTextoPegado");

  const sistema = sistemaEl ? sistemaEl.value : "Electrónico";
  const sintoma = sintomaEl ? sintomaEl.value.trim() : "";
  const textoCrudo = textoEl ? textoEl.value.trim() : "";

  if (!sintoma || !textoCrudo) {
    alert("Escribe un título/síntoma y pega el texto de Google Modo IA antes de guardar.");
    return;
  }

  // Limpia citas tipo [1] (https://...) copiadas de Google Modo IA
  const textoLimpio = textoCrudo
    .replace(/\[\d+\]\s*\(https?:\/\/[^\s)]+\)/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const guardadas = obtenerFallasLocales();
  const nuevaFalla = {
    codigo: `IA-${String(guardadas.length + 1).padStart(2, "0")}`,
    sistema,
    sintoma,
    causa: "Diagnóstico técnico guardado desde Google Modo IA en campo.",
    revision: "Verificar códigos, mediciones y pasos descritos en la acción recomendada.",
    accion: textoLimpio
  };

  guardadas.unshift(nuevaFalla);
  localStorage.setItem("fallasGuardadasReporte", JSON.stringify(guardadas));

  if (sintomaEl) sintomaEl.value = "";
  if (textoEl) textoEl.value = "";

  filtrarFallas();
  alert(`¡Guardado como ${nuevaFalla.codigo}! Ya aparece en la lista y puedes copiarlo para fallas-data.js.`);
}

function copiarFallasParaCatalogo() {
  const guardadas = obtenerFallasLocales();
  if (guardadas.length === 0) {
    alert("No hay fallas guardadas en este dispositivo.");
    return;
  }

  const bloqueJS = guardadas
    .map((item) => JSON.stringify(item, null, 2))
    .join(",\n  ");

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(bloqueJS).then(() => {
      alert(`Se copiaron ${guardadas.length} falla(s) al portapapeles. Pégalas dentro de CATALOGO_FALLAS en public/js/fallas-data.js.`);
    }).catch(() => {
      prompt("Copia este bloque y pégalo dentro de CATALOGO_FALLAS en fallas-data.js:", bloqueJS);
    });
  } else {
    prompt("Copia este bloque y pégalo dentro de CATALOGO_FALLAS en fallas-data.js:", bloqueJS);
  }
}

function limpiarFallasGuardadas() {
  const guardadas = obtenerFallasLocales();
  if (guardadas.length === 0) {
    alert("No hay fallas guardadas en este dispositivo para borrar.");
    return;
  }

  const confirmar = confirm(`¿Seguro que deseas borrar las ${guardadas.length} falla(s) guardadas localmente en este navegador? Hazlo solo si ya las pasaste a fallas-data.js.`);
  if (confirmar) {
    localStorage.removeItem("fallasGuardadasReporte");
    filtrarFallas();
    alert("Fallas locales eliminadas.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  filtrarFallas();
});
