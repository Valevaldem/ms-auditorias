"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { SECCIONES, ITEMS_GENERALES, getScoreInfo, PUNTAJES } from "@/lib/criterios"
import Link from "next/link"

interface Auditoria {
  id: string
  asesora: string
  canal: string
  semana: string
  mes: string
  score: number | null
  notas: string
  respuestas: Record<string, string>
  created_at: string
}

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

export default function AuditoriaDetail() {
  const { id } = useParams()
  const router  = useRouter()
  const [data, setData] = useState<Auditoria | null>(null)
  const [loading, setLoading] = useState(true)
  const [printing, setPrinting] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("ms_auth")) { router.push("/login"); return }
    fetchAuditoria()
  }, [id])

  async function fetchAuditoria() {
    const { data } = await supabase.from("auditorias").select("*").eq("id", id).single()
    setData(data)
    setLoading(false)
  }

  if (loading) return <div className="min-h-screen bg-ms-bg flex items-center justify-center text-ms-mid">Cargando...</div>
  if (!data)   return <div className="min-h-screen bg-ms-bg flex items-center justify-center text-ms-mid">No encontrada</div>

  const { color: scoreColor, label: scoreLabel } = getScoreInfo(data.score)
  const [y, m] = data.mes.split("-")
  const mesNombre = `${MESES[parseInt(m)-1]} ${y}`

  const allSecs = [
    ...SECCIONES.map(s => ({ titulo: s.titulo, color: s.color, items: s.items })),
    { titulo: "7. Evaluación general", color: "#1A1A1A", items: ITEMS_GENERALES },
  ]

  const valColor = (v: string) => {
    if (!v || v === "—") return "#aaa"
    if (["Cumple","Sí","Uso correcto","Cálido y cercano","Amigable"].includes(v)) return "#3A7D44"
    if (["No cumple","No","Deficiente","Inapropiados"].includes(v)) return "#B03A2E"
    return "#6B6B6B"
  }

  // Score por sección
  function secScore(items: typeof ITEMS_GENERALES) {
    let total = 0, max = 0
    for (const item of items) {
      const val = data!.respuestas[item.id]
      if (!val || val === "N/A") continue
      const pts = PUNTAJES[val]
      if (pts === null || pts === undefined) continue
      const mx = Math.max(...item.opciones.filter(o => o !== "N/A").map(o => PUNTAJES[o] ?? 0))
      max += mx; total += pts
    }
    return max === 0 ? null : Math.round((total / max) * 100)
  }

  function handlePrint() {
    setPrinting(true)
    setTimeout(() => { window.print(); setPrinting(false) }, 300)
  }

  return (
    <div className="min-h-screen bg-ms-bg">
      {/* Toolbar - no print */}
      <div className="no-print bg-ms-dark px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <p className="text-xs font-bold text-gold tracking-widest">MARÍA SALINAS</p>
          <h1 className="text-white text-lg font-bold">Resultado de auditoría</h1>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={handlePrint}
            className="bg-gold text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-gold-light transition-colors">
            🖨️ Imprimir / PDF
          </button>
          <Link href="/" className="text-white/60 text-sm hover:text-white">← Inicio</Link>
        </div>
      </div>

      {/* Print content */}
      <div className="max-w-3xl mx-auto px-4 py-6 print:px-8 print:py-6 print:max-w-none">

        {/* Header */}
        <div className="mb-5 pb-4 border-b-2 border-gold">
          <p className="text-xs font-bold text-gold tracking-widest mb-0.5">MARÍA SALINAS</p>
          <h1 className="text-2xl font-bold text-ms-dark">Auditoría de Conversaciones</h1>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[["ASESORA", data.asesora], ["CANAL", data.canal], ["MES", mesNombre]].map(([l, v]) => (
            <div key={l}>
              <p className="text-xs font-bold text-ms-mid tracking-wide mb-1">{l}</p>
              <p className="text-sm font-semibold text-ms-dark border-b border-ms-light pb-1">{v}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[["SEMANA", data.semana], ["FECHA", new Date(data.created_at).toLocaleDateString("es-MX")], ["", ""]].map(([l, v]) => (
            <div key={l}>
              {l && <>
                <p className="text-xs font-bold text-ms-mid tracking-wide mb-1">{l}</p>
                <p className="text-sm font-semibold text-ms-dark border-b border-ms-light pb-1">{v}</p>
              </>}
            </div>
          ))}
        </div>

        {/* Score banner */}
        {data.score !== null && (
          <div className="rounded-xl p-4 mb-6 text-center text-white" style={{ background: scoreColor }}>
            <p className="text-4xl font-bold">{data.score}%</p>
            <p className="text-lg font-semibold mt-1">{scoreLabel}</p>
          </div>
        )}

        {/* Resumen por sección */}
        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm print:shadow-none print:border print:border-ms-light">
          <p className="text-xs font-bold text-ms-mid tracking-widest mb-4">RESUMEN POR SECCIÓN</p>
          <div className="space-y-2">
            {allSecs.map(sec => {
              const ss = secScore(sec.items as any)
              const { color } = getScoreInfo(ss)
              return (
                <div key={sec.titulo} className="flex justify-between items-center py-2 border-b border-ms-light last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: sec.color }} />
                    <span className="text-sm font-medium text-ms-dark">{sec.titulo}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: ss !== null ? color : "#ccc" }}>
                    {ss !== null ? `${ss}%` : "N/A"}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detalle por sección */}
        {allSecs.map(sec => (
          <div key={sec.titulo} className="mb-5">
            <div className="text-white text-xs font-bold tracking-widest px-4 py-2 rounded-t-lg" style={{ background: sec.color }}>
              {sec.titulo.toUpperCase()}
            </div>
            <div className="bg-white rounded-b-2xl shadow-sm print:shadow-none print:border print:border-t-0 print:border-ms-light overflow-hidden">
              {(sec.items as typeof ITEMS_GENERALES).map((item, i) => {
                const val = data.respuestas[item.id] || "—"
                return (
                  <div key={item.id} className={`flex justify-between items-start px-4 py-3 gap-4 ${i > 0 ? "border-t border-ms-light/50" : ""}`}>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ms-dark">{item.label}</p>
                      <p className="text-xs text-ms-mid mt-0.5">{item.hint}</p>
                    </div>
                    <span className="text-sm font-bold whitespace-nowrap" style={{ color: valColor(val) }}>{val}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Notas */}
        {data.notas && (
          <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm print:shadow-none border-l-4 border-gold">
            <p className="text-xs font-bold text-ms-mid tracking-widest mb-3">NOTAS Y OBSERVACIONES</p>
            <p className="text-sm text-ms-dark leading-relaxed">{data.notas}</p>
          </div>
        )}

        {/* Firmas */}
        <div className="flex justify-between mt-10 pt-6 border-t border-ms-light">
          {["Firma asesora", "Firma gerencia"].map(l => (
            <div key={l} className="text-center w-5/12">
              <div className="border-b border-ms-dark h-8 mb-2" />
              <p className="text-xs text-ms-mid">{l}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-ms-mid mt-6 pt-4 border-t border-ms-light/50">
          María Salinas · Auditoría de Conversaciones · Uso interno
        </p>
      </div>
    </div>
  )
}
