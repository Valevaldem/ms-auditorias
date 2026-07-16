"use client"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { ASESORAS, CANALES, SECCIONES, ITEMS_GENERALES, calcScore } from "@/lib/criterios"

export default function NuevaAuditoria() {
  const router = useRouter()
  const [asesora, setAsesora]     = useState("")
  const [canal, setCanal]         = useState("")
  const [referencia, setReferencia]       = useState("")
  const [notas, setNotas]         = useState("")
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})
  const [saving, setSaving]       = useState(false)

  const score = useMemo(() => calcScore(respuestas), [respuestas])
  const auditora = typeof window !== "undefined" ? localStorage.getItem("ms_auditora") || "" : ""
  const totalItems = SECCIONES.flatMap(s => s.items).length + ITEMS_GENERALES.length
  const respondidos = Object.keys(respuestas).length
  const progreso = Math.round((respondidos / totalItems) * 100)
  const canSave = asesora && canal && referencia

  function set(id: string, val: string) {
    setRespuestas(prev => ({ ...prev, [id]: val }))
  }

  async function handleGuardar() {
    if (!canSave) return
    setSaving(true)
    const [y, m] = referencia.split("-W")[0] ? referencia.split("-") : ["", ""]
    const mes = referencia.includes("-W")
      ? (() => {
          const d = new Date(referencia + "-1")
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        })()
      : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`

    const { data, error } = await supabase.from("auditorias").insert({
      asesora, canal, referencia, mes, notas, respuestas, score,
      auditora, // stored in DB but never shown in print
    }).select("id").single()

    setSaving(false)
    if (!error && data) router.push(`/auditoria/${data.id}`)
  }

  const scoreColor = score === null ? "#6B6B6B"
    : score >= 90 ? "#3A7D44" : score >= 75 ? "#2E86C1" : score >= 60 ? "#B8860B" : "#B03A2E"
  const scoreLabel = score === null ? "" : score >= 90 ? "Excelente" : score >= 75 ? "Bueno" : score >= 60 ? "En desarrollo" : "Requiere atención"

  return (
    <div className="min-h-screen bg-ms-bg">
      {/* Header */}
      <div className="bg-ms-dark px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <p className="text-xs font-bold text-gold tracking-widest">MARÍA SALINAS</p>
          <h1 className="text-white text-lg font-bold">Nueva auditoría</h1>
        </div>
        <div className="flex items-center gap-4">
          {score !== null && (
            <span className="font-bold text-2xl" style={{ color: scoreColor }}>{score}%</span>
          )}
          <button onClick={() => router.push("/")} className="text-white/60 text-sm hover:text-white">← Inicio</button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Datos */}
        <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
          <p className="text-xs font-bold text-gold tracking-widest mb-4">DATOS DE LA AUDITORÍA</p>
          <div className="grid grid-cols-2 gap-4">
            {([
              ["ASESORA", asesora, setAsesora, ASESORAS],
              ["CANAL",   canal,   setCanal,   CANALES],
            ] as const).map(([label, val, setter, opts]) => (
              <div key={label}>
                <label className="text-xs font-semibold text-ms-mid block mb-1.5">{label}</label>
                <select value={val} onChange={e => (setter as any)(e.target.value)}
                  className="w-full border border-ms-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold bg-white">
                  <option value="">Seleccionar...</option>
                  {(opts as string[]).map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold text-ms-mid block mb-1.5">REFERENCIA</label>
              <input type="text" value={referencia} onChange={e => setReferencia(e.target.value)}
                className="w-full border border-ms-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
            </div>
            <div className="flex items-end">
              <p className="text-xs text-ms-mid">Auditora: <span className="font-semibold text-ms-dark">{auditora}</span></p>
            </div>
          </div>
        </div>

        {/* Progreso */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-ms-mid mb-1.5">
            <span>Progreso</span>
            <span className="font-semibold text-gold">{respondidos}/{totalItems} ítems</span>
          </div>
          <div className="bg-ms-light rounded-full h-1.5">
            <div className="bg-gold h-1.5 rounded-full transition-all duration-300" style={{ width: `${progreso}%` }} />
          </div>
        </div>

        {/* Secciones */}
        {SECCIONES.map(sec => (
          <div key={sec.id} className="bg-white rounded-2xl p-5 mb-4 shadow-sm" style={{ borderLeft: `4px solid ${sec.color}` }}>
            <p className="text-xs font-bold tracking-widest mb-4" style={{ color: sec.color }}>{sec.titulo.toUpperCase()}</p>
            {sec.items.map(item => (
              <ItemRow key={item.id} item={item} valor={respuestas[item.id]} onChange={v => set(item.id, v)} color={sec.color} />
            ))}
          </div>
        ))}

        {/* General */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border-l-4 border-ms-dark">
          <p className="text-xs font-bold tracking-widest text-ms-dark mb-4">7. EVALUACIÓN GENERAL</p>
          {ITEMS_GENERALES.map(item => (
            <ItemRow key={item.id} item={item} valor={respuestas[item.id]} onChange={v => set(item.id, v)} color="#1A1A1A" />
          ))}
        </div>

        {/* Notas */}
        <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
          <label className="text-xs font-bold text-ms-mid tracking-widest block mb-3">NOTAS Y OBSERVACIONES</label>
          <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={4}
            placeholder="Comentarios específicos sobre la conversación auditada..."
            className="w-full border border-ms-light rounded-lg p-3 text-sm focus:outline-none focus:border-gold resize-y" />
        </div>

        {/* Footer */}
        <div className="bg-ms-dark rounded-2xl p-5 mb-12 flex justify-between items-center flex-wrap gap-4">
          <div>
            {score !== null ? (
              <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5">
                <span className="text-3xl font-bold" style={{ color: scoreColor }}>{score}%</span>
                <span className="text-sm font-semibold" style={{ color: scoreColor }}>{scoreLabel}</span>
              </div>
            ) : (
              <span className="text-white/40 text-sm">Completa la evaluación para ver el score</span>
            )}
          </div>
          <button onClick={handleGuardar} disabled={!canSave || saving}
            className={`font-bold text-sm px-6 py-3 rounded-lg transition-colors ${canSave && !saving ? "bg-gold text-white hover:bg-gold-light" : "bg-white/20 text-white/40 cursor-not-allowed"}`}>
            {saving ? "Guardando..." : "Guardar auditoría"}
          </button>
        </div>
      </div>
    </div>
  )
}

function ItemRow({ item, valor, onChange, color }: {
  item: { id: string; label: string; hint: string; opciones: string[] }
  valor: string
  onChange: (v: string) => void
  color: string
}) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-ms-dark mb-0.5">{item.label}</p>
      <p className="text-xs text-ms-mid mb-2">{item.hint}</p>
      <div className="flex flex-wrap gap-2">
        {item.opciones.map(op => (
          <button key={op} onClick={() => onChange(op)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all border"
            style={valor === op
              ? { background: color, color: "white", borderColor: color }
              : { background: "white", color: "#6B6B6B", borderColor: "#D9D9D5" }}>
            {op}
          </button>
        ))}
      </div>
    </div>
  )
}
