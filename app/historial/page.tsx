"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { ASESORAS, getScoreInfo } from "@/lib/criterios"
import Link from "next/link"

interface Auditoria {
  id: string; asesora: string; canal: string
  semana: string; mes: string; score: number | null; created_at: string
}

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

export default function Historial() {
  const router = useRouter()
  const [auditorias, setAuditorias] = useState<Auditoria[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroAsesora, setFiltroAsesora] = useState("Todas")

  useEffect(() => {
    if (!localStorage.getItem("ms_auth")) { router.push("/login"); return }
    fetchAll()
  }, [])

  async function fetchAll() {
    const { data } = await supabase.from("auditorias")
      .select("id, asesora, canal, semana, mes, score, created_at")
      .order("created_at", { ascending: false })
    setAuditorias(data || [])
    setLoading(false)
  }

  const filtradas = filtroAsesora === "Todas" ? auditorias : auditorias.filter(a => a.asesora === filtroAsesora)
  const mesesUnicos: string[] = []
  filtradas.forEach(a => { if (!mesesUnicos.includes(a.mes)) mesesUnicos.push(a.mes) })
  const meses = mesesUnicos.sort().reverse()

  return (
    <div className="min-h-screen bg-ms-bg">
      <div className="bg-ms-dark px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <p className="text-xs font-bold text-gold tracking-widest">MARÍA SALINAS</p>
          <h1 className="text-white text-lg font-bold">Historial de auditorías</h1>
        </div>
        <div className="flex gap-3 items-center">
          <Link href="/auditoria" className="bg-gold text-white text-sm font-bold px-4 py-2 rounded-lg">+ Nueva</Link>
          <Link href="/" className="text-white/60 text-sm hover:text-white">← Inicio</Link>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          {["Todas", ...ASESORAS].map(a => (
            <button key={a} onClick={() => setFiltroAsesora(a)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${filtroAsesora === a ? "bg-gold text-white border-gold" : "bg-white text-ms-mid border-ms-light"}`}>
              {a}
            </button>
          ))}
        </div>
        {loading ? <p className="text-ms-mid text-sm">Cargando...</p>
        : meses.length === 0 ? <div className="bg-white rounded-xl p-8 text-center text-ms-mid text-sm">No hay auditorías aún.</div>
        : meses.map(mes => {
            const [y, m] = mes.split("-")
            const mesNombre = `${MESES[parseInt(m)-1]} ${y}`
            const delMes = filtradas.filter(a => a.mes === mes)
            return (
              <div key={mes} className="mb-8">
                <h2 className="text-sm font-bold text-ms-mid tracking-widest mb-3">{mesNombre.toUpperCase()}</h2>
                <div className="space-y-2">
                  {delMes.map(a => {
                    const { color } = getScoreInfo(a.score)
                    return (
                      <Link key={a.id} href={`/auditoria/${a.id}`}
                        className="bg-white rounded-xl px-5 py-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow block">
                        <div>
                          <p className="font-semibold text-ms-dark">{a.asesora}</p>
                          <p className="text-xs text-ms-mid">{a.canal} · Semana {a.semana} · {new Date(a.created_at).toLocaleDateString("es-MX")}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          {a.score !== null && <span className="text-xl font-bold" style={{ color }}>{a.score}%</span>}
                          <span className="text-gold text-xs font-semibold">Ver →</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
