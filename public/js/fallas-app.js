// Lógica principal para consulta de fallas y enlace a Google Modo IA

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

function enviarAlReporte(falla) {
  const resumen = `[${falla.codigo}] ${falla.sintoma} -> Acción: ${falla.accion}`;
  sessionStorage.setItem("fallaSugerida", resumen);
  window.location.href = "reporte.html";
}

function renderizarFallas(lista) {
  const contenedor = document.getElementById("contenedorFallas");
  const contador = document.getElementById("contadorFallas");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  if (contador) {
    contador.textContent = `${lista.length} ${lista.length === 1 ? "falla" : "fallas"}`;
  }

  if (lista.length === 0) {
    contenedor.innerHTML = `<p style="grid-column: 1 / -1; color: #475569;">No se encontraron coincidencias en el catálogo local. Usa el botón de <strong>Google Modo IA</strong> arriba para consultar el caso.</p>`;
    return;
  }

  lista.forEach((falla) => {
    const consultaTarjeta = `${falla.sintoma} ${falla.causa}`;
    const urlIA = construirUrlGoogleIA(armarConsultaIA(consultaTarjeta));
    const fallaJson = JSON.stringify(falla).replace(/'/g, "&#39;");

    const card = document.createElement("div");
    card.className = "falla-card";
    card.innerHTML = `
      <div class="falla-header">
        <h3 class="falla-titulo">${falla.codigo} — ${falla.sintoma}</h3>
        <span class="badge">${falla.sistema}</span>
      </div>
      <p class="falla-detalle"><strong>Causa probable:</strong> ${falla.causa}</p>
      <p class="falla-detalle"><strong>Qué revisar:</strong> ${falla.revision}</p>
      <p class="falla-detalle"><strong>Acción correctiva:</strong> ${falla.accion}</p>
      <div class="falla-acciones">
        <button type="button" class="btn-sm btn-reporte" onclick='enviarAlReporte(${fallaJson})'>
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

  const base = typeof CATALOGO_FALLAS !== "undefined" ? CATALOGO_FALLAS : [];

  const filtradas = base.filter((item) => {
    const coincideSistema = !sistema || item.sistema === sistema;
    const contenido = `${item.codigo} ${item.sistema} ${item.sintoma} ${item.causa} ${item.revision} ${item.accion}`.toLowerCase();
    const coincideTexto = !texto || contenido.includes(texto);
    return coincideSistema && coincideTexto;
  });

  renderizarFallas(filtradas);
  actualizarEnlaceIA();
}

document.addEventListener("DOMContentLoaded", () => {
  const base = typeof CATALOGO_FALLAS !== "undefined" ? CATALOGO_FALLAS : [];
  renderizarFallas(base);
  actualizarEnlaceIA();
});
