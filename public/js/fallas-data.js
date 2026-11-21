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
  },

  // --- GILBARCO ENCORE 300 / NA1 / ENCORE 500 ---
  {
    codigo: "GIL-01",
    sistema: "Electrónico",
    sintoma: "Gilbarco Encore 300/NA1/500: Sin lectura de pulsos o no avanza importe/volumen",
    causa: "Falla en pulser (sensor óptico/Hall), cableado flojo o sulfatado, o interferencia/falla en placa electrónica.",
    revision: "Revisar conector del pulser, continuidad del mazo de cables y alimentación en bornera.",
    accion: "Reajustar o limpiar conectores, reemplazar el pulser defectuoso y verificar conteo en prueba de despacho."
  },
  {
    codigo: "GIL-02",
    sistema: "Mecánico e Hidráulico",
    sintoma: "Gilbarco Encore 300/NA1/500: Despacho lento o corte prematuro de caudal",
    causa: "Filtro de entrada obstruido, aire en línea de succión, válvula solenoide abre parcialmente o presión baja de bomba.",
    revision: "Inspeccionar filtro, purgar aire en línea/mirilla y comprobar accionamiento/voltaje de solenoide.",
    accion: "Limpiar o sustituir filtro, purgar sistema hidráulico y reparar/reemplazar solenoide o revisar bomba sumergible."
  },
  {
    codigo: "GIL-03",
    sistema: "Electrónico",
    sintoma: "Gilbarco Encore 300/NA1/500: Error de comunicación con consola o POS",
    causa: "Dirección de dispensador/manguera duplicada o errónea, lazo de datos cortado o ruido eléctrico.",
    revision: "Revisar configuración de dirección (address), continuidad del par de datos y puesta a tierra.",
    accion: "Corregir dirección en configuración, reparar empalme/cable de comunicación y verificar enlace en consola."
  },
  {
    codigo: "GIL-04",
    sistema: "Electrónico",
    sintoma: "Gilbarco Encore 300/NA1/500: Display apagado o segmentos incompletos",
    causa: "Falta de alimentación DC en fuente/tarjeta de display o cable plano (ribbon) desconectado/dañado.",
    revision: "Medir tensión de salida de fuente y revisar estado de cables planos y conectores de pantalla.",
    accion: "Restablecer alimentación, reasentar o reemplazar cable ribbon o módulo de display."
  },
  {
    codigo: "GIL-05",
    sistema: "Mecánico e Hidráulico",
    sintoma: "Gilbarco Encore 300/NA1/500: Fuga en manguera, acople o breakaway",
    causa: "Empaque o junta desgastada, acople flojo o breakaway dañado o mal acoplado.",
    revision: "Revisar con seguridad en acoples, juntas giratorias, breakaway y cuerpo de manguera.",
    accion: "Despresurizar con seguridad, cambiar sellos/empaques o reemplazar breakaway o manguera afectada."
  },

  // --- REALTECH ---
  {
    codigo: "RLT-01",
    sistema: "Eléctrico",
    sintoma: "Realtech: No arranca la bomba o no abre solenoide al levantar pistola",
    causa: "Falla en switch de manguera/boquilla, relé de control pegado/abierto o falta de señal de autorización.",
    revision: "Comprobar accionamiento del switch de pistola, continuidad de relés y señal de habilitación.",
    accion: "Reparar o ajustar switch de manguera, sustituir relé defectuoso o corregir señal de autorización."
  },
  {
    codigo: "RLT-02",
    sistema: "Mecánico e Hidráulico",
    sintoma: "Realtech: Diferencia entre volumen marcado y volumen despachado",
    causa: "Descalibración del medidor/factor K, aire atrapado en línea o desgaste interno del medidor volumétrico.",
    revision: "Realizar prueba volumétrica con jarra patrón certificada y verificar purga de aire.",
    accion: "Purgar aire, recalibrar factor o parámetros según procedimiento autorizado o reparar/sustituir medidor."
  },
  {
    codigo: "RLT-03",
    sistema: "Eléctrico",
    sintoma: "Realtech: Pérdida de datos o reinicios al activar cargas",
    causa: "Caída de tensión en línea por carga inductiva, fuente inestable o mala puesta a tierra.",
    revision: "Medir caída de voltaje al arrancar bomba/solenoides y verificar resistencia de puesta a tierra.",
    accion: "Corregir puesta a tierra, estabilizar alimentación y revisar fuente o reguladores internos."
  },
  {
    codigo: "RLT-04",
    sistema: "Electrónico",
    sintoma: "Realtech: Falla de comunicación o lectura errática en tablero",
    causa: "Falso contacto en borneras, cable de señal cerca de líneas de potencia o conector flojo.",
    revision: "Revisar apretado de bornes, ruteo de cables de señal y continuidad punto a punto.",
    accion: "Separar cableado de control de líneas de fuerza, reapretar borneras y sanear contactos."
  },

  // --- WAYNE 2 VISTA / 3 VISTA (iGEM) ---
  {
    codigo: "WYN-01",
    sistema: "Electrónico",
    sintoma: "Wayne 2/3 Vista (iGEM): Códigos 01–18 (Memoria Flash/RAM/CRC) o Código 80",
    causa: "Corrupción de datos tras corte eléctrico, caída en fuente o fallo en CPU, Identi-PROM o firmware.",
    revision: "Consultar historial con control IR en S21 (Lado A) / S22 (Lado B), medir voltajes DC y observar LEDs de CPU.",
    accion: "Realizar reinicio eléctrico completo; si persiste, reprogramar/actualizar firmware o cambiar Identi-PROM o CPU."
  },
  {
    codigo: "WYN-02",
    sistema: "Electrónico",
    sintoma: "Wayne 2/3 Vista (iGEM): Código 20 (Display) o Códigos 25–28 (Bloqueo inicio de venta)",
    causa: "Cable plano de display flojo/dañado; precio unitario en cero (25), cambio al iniciar (27) o exige preset (28).",
    revision: "Revisar conectores ribbon de pantallas (venta, precio unitario, preset) y precios/configuración en consola.",
    accion: "Reasentar cables de display o corregir precios unitarios y modo de preselección."
  },
  {
    codigo: "WYN-03",
    sistema: "Electrónico",
    sintoma: "Wayne 2/3 Vista (iGEM): Códigos 30–31 (Comunicación POS / DART)",
    causa: "Pérdida de enlace de datos, fallo en Junction Box o dirección mal asignada.",
    revision: "Comprobar continuidad de cableado de datos hacia Junction Box y dirección configurada.",
    accion: "Reparar cableado o empalmes, corregir dirección del punto de despacho y validar enlace."
  },
  {
    codigo: "WYN-04",
    sistema: "Electrónico",
    sintoma: "Wayne 2/3 Vista (iGEM): Códigos 50–56 (WIP) o Códigos 58–59 (Pérdida señal WIP)",
    causa: "Aire en línea, vibración, falla en pulsador WIP o humedad/sulfatación en Barrera Intrínseca (ISB).",
    revision: "Purgar aire del sistema e inspeccionar arnés y conectores en la ISB y pulsador WIP.",
    accion: "Purgar aire, limpiar o reemplazar conectores sulfatados en ISB o sustituir pulsador WIP."
  },
  {
    codigo: "WYN-05",
    sistema: "Eléctrico",
    sintoma: "Wayne 2/3 Vista (iGEM): Códigos 70–73 (Sin flujo / Pérdida de flujo)",
    causa: "No activa bomba o solenoide, fallo en Pump Relay Board, filtro tapado o nivel bajo en tanque.",
    revision: "Revisar fusibles y relés en Pump Relay Board, solenoide, filtros y nivel de combustible.",
    accion: "Cambiar fusible o relé dañado, destrabar/reemplazar solenoide o limpiar filtros y verificar nivel."
  },
  {
    codigo: "WYN-06",
    sistema: "Mecánico e Hidráulico",
    sintoma: "Wayne 2/3 Vista (iGEM): Códigos 96–97 (Puerta de seguridad abierta)",
    causa: "Interruptor magnético o mecánico de bisel electrónico (96) o gabinete hidráulico (97) abierto o desalineado.",
    revision: "Verificar cierre hermético de tapas y alineación/continuidad de interruptores de puerta.",
    accion: "Cerrar bien las compuertas, ajustar interruptores y rearmar seguridad desde modo mantenimiento."
  },

  // --- TOKHEIM SOLGAS (GASOLINA) ---
  {
    codigo: "TOK-01",
    sistema: "Eléctrico",
    sintoma: "Tokheim Solgas (Gasolina): No inicia despacho al levantar manguera o pistola",
    causa: "Sensor o interruptor de boquilla trabado, bloqueo por consola/autorización o corte de seguridad.",
    revision: "Verificar accionamiento del switch de pistola, estado en consola y enclavamientos de seguridad.",
    accion: "Liberar o reemplazar switch de boquilla, destrabar autorización en consola y verificar seguridad."
  },
  {
    codigo: "TOK-02",
    sistema: "Mecánico e Hidráulico",
    sintoma: "Tokheim Solgas (Gasolina): Caudal bajo o intermitente en gasolina",
    causa: "Filtro obstruido, cavitación o aire en línea, válvula de retención pegada o presión insuficiente.",
    revision: "Revisar filtro, válvula de retención, purga de aire y presión de suministro.",
    accion: "Limpiar o reemplazar filtro, purgar aire y verificar válvula de retención y bomba."
  },
  {
    codigo: "TOK-03",
    sistema: "Electrónico",
    sintoma: "Tokheim Solgas (Gasolina): Falla en totalizador o contador de litros o dinero",
    causa: "Pulsador o sensor con fallo o falso contacto, o fallo de comunicación en tarjeta de cómputo/display.",
    revision: "Inspeccionar conectores, cableado del sensor de pulso y alimentación del cabezal.",
    accion: "Limpiar o reajustar conectores, reemplazar sensor de pulso o tarjeta afectada y probar despacho."
  },
  {
    codigo: "TOK-04",
    sistema: "Mecánico e Hidráulico",
    sintoma: "Tokheim Solgas (Gasolina): Goteo o cierre tardío en boquilla o válvula",
    causa: "Asiento de válvula/solenoide sucio o desgastado, o resorte/diafragma fatigado en pistola.",
    revision: "Inspeccionar cierre de solenoide y estado de la pistola dispensadora con línea presurizada.",
    accion: "Limpiar o cambiar kit de sellos o válvula solenoide y reparar o reemplazar pistola."
  },

  // --- EAGLESTAR 424 / 212 ---
  {
    codigo: "EAG-01",
    sistema: "Electrónico",
    sintoma: "EagleStar 424/212: Error en display o fallo de conteo en despacho",
    causa: "Falsa conexión en tarjeta principal/display, sensor de flujo/pulso sucio o dañado, o ruido eléctrico.",
    revision: "Revisar conectores, limpieza y señal del sensor de pulso y estabilidad de alimentación.",
    accion: "Reasentar conectores, limpiar o reemplazar sensor de pulso y corregir ruido o alimentación."
  },
  {
    codigo: "EAG-02",
    sistema: "Eléctrico",
    sintoma: "EagleStar 424/212: Bomba no arranca o se detiene durante el despacho",
    causa: "Protección térmica o breaker disparado, relé/contactor defectuoso, falta de presión o corte por seguridad.",
    revision: "Revisar protecciones eléctricas, relé/contactor, presiones de trabajo y señales de control.",
    accion: "Rearmar o sustituir protección o relé defectuoso y corregir condición hidráulica o de control."
  },
  {
    codigo: "EAG-03",
    sistema: "Electrónico",
    sintoma: "EagleStar 424/212: Falla de comunicación con sistema central o POS",
    causa: "Cable de comunicación suelto o dañado, ID/dirección mal configurada o puerto con falla.",
    revision: "Comprobar continuidad del bus de datos, dirección asignada y conexión en bornera o puerto.",
    accion: "Reemplazar tramo de cable dañado, ajustar dirección o ID y verificar comunicación en línea."
  },
  {
    codigo: "EAG-04",
    sistema: "Mecánico e Hidráulico",
    sintoma: "EagleStar 424/212: Filtración o humedad en gabinete hidráulico o cabezal",
    causa: "Empaques vencidos, racores flojos, condensación o tapa sin sello adecuado.",
    revision: "Inspeccionar visualmente racores, empaques, mangueras y burletes de tapas con luz.",
    accion: "Reapretar racores, cambiar empaques y secar o aislar la zona antes de energizar."
  }
];
