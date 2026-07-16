"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { ASESORAS, getScoreInfo } from "@/lib/criterios"
import Link from "next/link"

interface Auditoria {
  id: string
  asesora: string
  canal: string
  semana: string
  mes: string
  score: number | null
  created_at: string
}

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

export default function Home() {
  const router = useRouter()
  const [auditorias, setAuditorias] = useState<Auditoria[]>([])
  const [loading, setLoading]       = useState(true)
  const [mesActual, setMesActual]   = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })

  useEffect(() => {
    if (!localStorage.getItem("ms_auth")) { router.push("/login"); return }
    fetchAuditorias()
  }, [])

  async function fetchAuditorias() {
    const { data } = await supabase
      .from("auditorias")
      .select("id, asesora, canal, semana, mes, score, created_at")
      .order("created_at", { ascending: false })
    setAuditorias(data || [])
    setLoading(false)
  }

  const mesesDisponibles = [...new Set(auditorias.map(a => a.mes))].sort().reverse()
  const delMes = auditorias.filter(a => a.mes === mesActual)

  function promedioAsesora(asesora: string) {
    const scores = delMes.filter(a => a.asesora === asesora && a.score !== null).map(a => a.score as number)
    if (!scores.length) return null
    return Math.round(scores.reduce((s, n) => s + n, 0) / scores.length)
  }

  const [mesLabel, anioLabel] = mesActual.split("-")
  const labelMes = `${MESES[parseInt(mesLabel.split("-")[1] || mesLabel) - 1] || ""} ${anioLabel || mesLabel}`

  const mesNombre = (() => {
    const [y, m] = mesActual.split("-")
    return `${MESES[parseInt(m) - 1]} ${y}`
  })()

  function logout() {
    localStorage.removeItem("ms_auth")
    localStorage.removeItem("ms_auditora")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-ms-bg">
      {/* Header */}
      <div className="bg-ms-dark px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <p className="text-xs font-bold text-gold tracking-widest">MARÍA SALINAS</p>
          <h1 className="text-white text-lg font-bold">Auditorías</h1>
        </div>
        <div className="flex gap-3 items-center">
          <Link href="/historial" className="text-white/60 text-xs hover:text-white transition-colors">Historial</Link>
          <Link href="/auditoria" className="bg-gold text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-gold-light transition-colors">
            + Nueva auditoría
          </Link>
          <button onClick={logout} className="text-white/40 text-xs hover:text-white/70 transition-colors ml-1">Salir</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Selector de mes */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-lg font-bold text-ms-dark">Resumen mensual</h2>
          <select
            value={mesActual}
            onChange={e => setMesActual(e.target.value)}
            className="border border-ms-light rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-gold"
          >
            {mesesDisponibles.length === 0
              ? <option value={mesActual}>{mesNombre}</option>
              : mesesDisponibles.map(m => {
                  const [y, mo] = m.split("-")
                  return <option key={m} value={m}>{MESES[parseInt(mo)-1]} {y}</option>
                })
            }
          </select>
        </div>

        {/* Promedios por asesora */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {ASESORAS.map(asesora => {
            const avg = promedioAsesora(asesora)
            const total = delMes.filter(a => a.asesora === asesora).length
            const { color, label } = getScoreInfo(avg)
            return (
              <div key={asesora} className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-bold text-ms-mid tracking-wide mb-3">{asesora.toUpperCase()}</p>
                {avg !== null ? (
                  <>
                    <p className="text-4xl font-bold mb-1" style={{ color }}>{avg}%</p>
                    <p className="text-xs font-semibold mb-2" style={{ color }}>{label}</p>
                  </>
                ) : (
                  <p className="text-3xl font-bold text-ms-light mb-3">—</p>
                )}
                <p className="text-xs text-ms-mid">{total} auditoría{total !== 1 ? "s" : ""}</p>
              </div>
            )
          })}
        </div>

        {/* Lista de auditorías del mes */}
        <div>
          <h3 className="text-sm font-bold text-ms-mid tracking-wide mb-4">AUDITORÍAS — {mesNombre.toUpperCase()}</h3>
          {loading ? (
            <p className="text-ms-mid text-sm">Cargando...</p>
          ) : delMes.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-ms-mid text-sm">
              No hay auditorías este mes.{" "}
              <Link href="/auditoria" className="text-gold font-semibold hover:underline">Crear la primera</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {delMes.map(a => {
                const { color } = getScoreInfo(a.score)
                return (
                  <Link key={a.id} href={`/auditoria/${a.id}`}
                    className="bg-white rounded-xl px-5 py-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow block">
                    <div>
                      <p className="font-semibold text-ms-dark">{a.asesora}</p>
                      <p className="text-xs text-ms-mid">{a.canal} · Semana {a.semana}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {a.score !== null && (
                        <span className="text-xl font-bold" style={{ color }}>{a.score}%</span>
                      )}
                      <span className="text-gold text-xs font-semibold">Ver →</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
