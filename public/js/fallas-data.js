// Catálogo de fallas frecuentes para dispensadores y surtidores (COQUIVACOA C.A.)
const CATALOGO_FALLAS = [
  {
    codigo: "MEC-01",
    sistema: "Mecánico e Hidráulico",
    sintoma: "Caudal lento o corte intermitente al despachar",
    causa: "Aire en la línea de succión, filtro obstruido, válvula de retención pegada o manguera colapsada.",
    revision: "Verificar nivel/estado de filtros, revisar purga de aire y comprobar que break away/swivel no estrangulen el paso.",
    accion: "Limpiar o reemplazar filtro, purgar línea y verificar estanqueidad de acoples."
  },
  {
    codigo: "MEC-02",
    sistema: "Mecánico e Hidráulico",
    sintoma: "Goteo o fuga en pico, manguera o contenedor",
    causa: "Sellos desgastados, abrazaderas flojas o fisura en manguera/conexión.",
    revision: "Inspeccionar visualmente el pico, swivel, break away y el interior del contenedor con linterna y buena ventilación.",
    accion: "Reemplazar empaques, ajustar conexiones o cambiar manguera/componente dañado."
  },
  {
    codigo: "ELE-01",
    sistema: "Eléctrico",
    sintoma: "La bomba o solenoide no activa al levantar el pico",
    causa: "Falla en micro interruptor de pico, falta de alimentación/voltaje o solenoide averiada.",
    revision: "Medir voltaje de entrada, probar continuidad en micro interruptor y verificar bobina de válvula solenoide.",
    accion: "Reemplazar micro interruptor, corregir conexión en caja de empalme o cambiar solenoide."
  },
  {
    codigo: "ELE-02",
    sistema: "Eléctrico",
    sintoma: "Disparo de protección o variación de voltaje/amperaje",
    causa: "Sobrecarga en bomba, corto/humedad en acometida o inestabilidad en fuente (red pública / planta).",
    revision: "Medir Hz, voltaje y amperaje en carga; revisar caja de empalme y acometida por humedad o sulfatación.",
    accion: "Aislar humedad, corregir empalmes y verificar estado eléctrico de la unidad bomba."
  },
  {
    codigo: "ELC-01",
    sistema: "Electrónico",
    sintoma: "El display no marca litros o marca pulsos erráticos",
    causa: "Falla en generador de pulsos (pulser), cableado con ruido/falso contacto o placa electrónica.",
    revision: "Revisar conexiones del pulser, barrera de seguridad intrínseca y estado de borneras en cabezal/placa.",
    accion: "Reajustar cableado blindado, limpiar contactos o sustituir pulser/placa según prueba."
  },
  {
    codigo: "ELC-02",
    sistema: "Electrónico",
    sintoma: "Pantalla apagada o reinicios al arrancar equipo",
    causa: "Batería agotada, caída de tensión en alimentación o falla en cabezal electrónico.",
    revision: "Comprobar estado de batería de respaldo y estabilidad de alimentación en el cabezal.",
    accion: "Reemplazar batería o corregir alimentación del cabezal electrónico."
  }
];
