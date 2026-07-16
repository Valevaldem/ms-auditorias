export const ASESORAS = ["Fernanda", "Dennise", "Diana", "Mónica"]
export const CANALES  = ["WhatsApp", "Instagram DM", "Facebook DM", "Otro"]
export const AUDITORAS = ["Vale", "Maru", "Otra"]

export const OPCIONES = {
  tricolor:   ["Cumple", "Cumple parcialmente", "No cumple"],
  tricolorNA: ["Cumple", "Cumple parcialmente", "No cumple", "N/A"],
  siNo:       ["Sí", "No"],
  siNoNA:     ["Sí", "No", "N/A"],
  tono:       ["Cálido y cercano", "Amigable", "Neutro", "Frío / Seco", "Deficiente"],
  emojis:     ["Uso correcto", "Excesivo", "Inapropiados", "Casi nada", "Ninguno"],
}

export const PUNTAJES: Record<string, number | null> = {
  "Cumple": 2, "Cumple parcialmente": 1, "No cumple": 0, "N/A": null,
  "Sí": 2, "No": 0,
  "Uso correcto": 2, "Excesivo": 1, "Inapropiados": 0, "Casi nada": 1, "Ninguno": 0,
  "Cálido y cercano": 4, "Amigable": 3, "Neutro": 2, "Frío / Seco": 1, "Deficiente": 0,
}

export interface Item { id: string; label: string; hint: string; opciones: string[] }
export interface Seccion { id: string; titulo: string; color: string; items: Item[] }

export const SECCIONES: Seccion[] = [
  { id: "saludo", titulo: "1. Saludo", color: "#1A5276", items: [
    { id: "tiempo_respuesta",    label: "Tiempo de respuesta",    hint: "Menos de 1h = Cumple · 1–3h = Parcial · Más de 3h o sin respuesta = No cumple", opciones: OPCIONES.tricolor },
    { id: "saludo_presentacion", label: "Saludo y presentación",  hint: "Se presenta con nombre y marca, saluda por nombre si lo tiene",                  opciones: OPCIONES.tricolor },
    { id: "conexion_cliente",    label: "Conexión con el cliente",hint: "Hace sentir al cliente bienvenido, no responde de forma robótica",                opciones: OPCIONES.tricolor },
  ]},
  { id: "cotizacion", titulo: "2. Cotización", color: "#A8842B", items: [
    { id: "preguntas_acertadas",          label: "Preguntas acertadas",             hint: "Hace las preguntas correctas: material, talla, ocasión, presupuesto",              opciones: OPCIONES.tricolor },
    { id: "tiempo_cotizacion",            label: "Tiempo de cotización",            hint: "Piezas de línea ≤2 días · Fully custom ≤1 semana · N/A si no aplica",             opciones: OPCIONES.tricolorNA },
    { id: "seguimiento_espera",           label: "Seguimiento durante la espera",   hint: "Avisa cuánto tardará. Update diario si >1 día. Update c/2 días si >3 días",       opciones: OPCIONES.tricolorNA },
    { id: "cotizacion_completa",          label: "Cotización completa y explícita", hint: "Precio claro, descripción completa, sin preguntas adicionales del cliente",        opciones: OPCIONES.tricolorNA },
    { id: "tiempo_produccion",            label: "Informa tiempo de producción",    hint: "Menciona rango: 3–5 días / 15–20 días / 8–10 semanas",                             opciones: OPCIONES.tricolorNA },
    { id: "tipos_pago",                   label: "Tipos de pago",                   hint: "Menciona opciones (transferencia, TC, MSI) sin que el cliente lo pida",            opciones: OPCIONES.tricolorNA },
    { id: "materiales",                   label: "Materiales",                      hint: "Explica los materiales disponibles o los del producto cotizado",                   opciones: OPCIONES.tricolorNA },
    { id: "terminar_pregunta",            label: "Termina con pregunta",            hint: "No deja la conversación abierta. Ej: '¿Te gustaría que procedamos?'",              opciones: OPCIONES.tricolorNA },
    { id: "seguimiento_post_cotizacion",  label: "Seguimiento post-cotización",     hint: "3 toques: primeras horas · 2 días · 4–5 días",                                     opciones: OPCIONES.tricolorNA },
  ]},
  { id: "cierre", titulo: "3. Cierre de venta", color: "#3A7D44", items: [
    { id: "datos_cliente",     label: "Solicita datos completos del cliente", hint: "Nombre completo, email, teléfono, dirección de envío",                opciones: OPCIONES.tricolorNA },
    { id: "tallas_colores",    label: "Tallas / color de oro / material",     hint: "Confirma especificaciones antes de pasar al pago",                    opciones: OPCIONES.tricolorNA },
    { id: "datos_certificado", label: "Datos para certificado (si aplica)",   hint: "Solo pedidos bajo pedido. N/A para piezas de stock",                  opciones: OPCIONES.tricolorNA },
    { id: "confirmacion_pago", label: "Confirmación del pago",                hint: "Confirma recepción del pago antes de arrancar producción",            opciones: OPCIONES.tricolorNA },
    { id: "ticket_digital",    label: "Envío del ticket digital",             hint: "Manda el comprobante / ticket de la venta al cliente",                opciones: OPCIONES.tricolorNA },
  ]},
  { id: "produccion", titulo: "4. Durante producción", color: "#1A5276", items: [
    { id: "seguimiento_produccion", label: "Seguimiento proactivo durante producción", hint: "Al menos 1 mensaje intermedio sin que el cliente pregunte", opciones: OPCIONES.tricolorNA },
  ]},
  { id: "entrega", titulo: "5. Producto listo / Entrega", color: "#A8842B", items: [
    { id: "foto_video_pieza",           label: "Foto o video de la pieza terminada",    hint: "Comparte imagen/video antes o al momento del envío",              opciones: OPCIONES.tricolorNA },
    { id: "confirmacion_pago_completo", label: "Confirmación de pago completo",         hint: "Verifica que el saldo esté liquidado antes de enviar",            opciones: OPCIONES.tricolorNA },
    { id: "datos_envio",                label: "Confirmación de datos de envío",        hint: "Reconfirma dirección antes de enviar",                            opciones: OPCIONES.tricolorNA },
    { id: "numero_rastreo",             label: "Número de rastreo y tiempo de entrega", hint: "Manda guía con paquetería y rango de días estimado",              opciones: OPCIONES.tricolorNA },
  ]},
  { id: "postventa", titulo: "6. Post-venta", color: "#3A7D44", items: [
    { id: "seguimiento_entrega",   label: "Seguimiento de que llegó bien",            hint: "Mensaje 1–2 días después de la entrega estimada",                   opciones: OPCIONES.tricolorNA },
    { id: "encuesta_enviada",      label: "Encuesta de satisfacción enviada",          hint: "Manda la encuesta una vez confirmada la entrega",                   opciones: OPCIONES.tricolorNA },
    { id: "incentivo_publicacion", label: "Incentiva publicación o etiqueta en redes", hint: "Invita al cliente a publicar foto o etiquetarnos en redes",        opciones: OPCIONES.tricolorNA },
  ]},
]

export const ITEMS_GENERALES: Item[] = [
  { id: "tono",                     label: "Tono de conversación",                     hint: "Evalúa el tono general de toda la conversación",                                                    opciones: OPCIONES.tono },
  { id: "uso_emojis",               label: "Uso de emojis",                            hint: "Uso correcto = emojis de marca. Excesivo = demasiados. Inapropiados = no van con la imagen de MS", opciones: OPCIONES.emojis },
  { id: "uso_tags",                 label: "Uso de tags (etiquetas)",                  hint: "Usa: cliente potencial, en seguimiento, pagado, canal",                                             opciones: OPCIONES.siNo },
  { id: "uso_app_cotizacion",       label: "Uso de app de cotización",                 hint: "Usa la herramienta interna cuando aplica",                                                          opciones: OPCIONES.siNoNA },
  { id: "uso_stickers",             label: "Uso de stickers (WhatsApp)",               hint: "Usa stickers de marca apropiadamente. N/A si el canal no es WhatsApp",                              opciones: OPCIONES.siNoNA },
  { id: "ortografia",               label: "Ortografía",                               hint: "Sin errores graves que afecten la imagen de la marca",                                              opciones: OPCIONES.siNo },
  { id: "escucha_activa",           label: "Escucha activa / Lectura del cliente",     hint: "Responde a lo que el cliente realmente dijo. No ignora ni malinterpreta",                           opciones: OPCIONES.tricolor },
  { id: "respuesta_acorde",         label: "Respuesta acorde al cliente",              hint: "El tono y contenido es adecuado para el tipo de cliente y su mensaje",                              opciones: OPCIONES.tricolor },
  { id: "elementos_apoyo",          label: "Elementos de apoyo (imágenes o video)",    hint: "Usa recursos visuales cuando ayudan: catálogo, foto de pieza, video",                               opciones: OPCIONES.tricolorNA },
  { id: "personalidad_marca",       label: "¿Se ve personalidad de marca?",            hint: "La conversación refleja el tono y valores de María Salinas",                                        opciones: OPCIONES.tricolor },
  { id: "proporcion_habla",         label: "80% habla cliente / 20% vendedor",         hint: "La asesora escucha más de lo que habla. El cliente lleva la conversación",                          opciones: OPCIONES.tricolor },
  { id: "status_crm",               label: "¿Hay status en CRM?",                      hint: "El contacto está correctamente etiquetado y con status actualizado",                                opciones: OPCIONES.siNo },
  { id: "dio_seguimiento",          label: "¿Dio seguimiento?",                        hint: "Realizó seguimiento después del primer contacto. N/A si es del mismo día",                          opciones: OPCIONES.siNoNA },
  { id: "seguimiento_personalizado",label: "¿El seguimiento fue personalizado?",       hint: "Mensaje específico para ese cliente, no genérico. N/A si no hubo seguimiento",                     opciones: OPCIONES.siNoNA },
]

export function calcScore(respuestas: Record<string, string>): number | null {
  let total = 0, maximo = 0
  const allItems = [...SECCIONES.flatMap(s => s.items), ...ITEMS_GENERALES]
  for (const item of allItems) {
    const val = respuestas[item.id]
    if (!val || val === "N/A") continue
    const pts = PUNTAJES[val]
    if (pts === null || pts === undefined) continue
    const maxPts = Math.max(...item.opciones.filter(o => o !== "N/A").map(o => PUNTAJES[o] ?? 0))
    maximo += maxPts
    total  += pts
  }
  return maximo === 0 ? null : Math.round((total / maximo) * 100)
}

export function getScoreInfo(score: number | null) {
  if (score === null) return { color: "#6B6B6B", label: "" }
  if (score >= 90)   return { color: "#3A7D44", label: "Excelente" }
  if (score >= 75)   return { color: "#2E86C1", label: "Bueno" }
  if (score >= 60)   return { color: "#B8860B", label: "En desarrollo" }
  return               { color: "#B03A2E", label: "Requiere atención" }
}
