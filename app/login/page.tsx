"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD || "msjoyeria2024"

export default function Login() {
  const [pass, setPass] = useState("")
  const [nombre, setNombre] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = () => {
    if (!nombre.trim()) { setError("Escribe tu nombre"); return }
    if (pass !== PASSWORD) { setError("Contraseña incorrecta"); return }
    localStorage.setItem("ms_auditora", nombre.trim())
    localStorage.setItem("ms_auth", "1")
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ms-bg px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">
        <p className="text-xs font-bold text-gold tracking-widest mb-1">MARÍA SALINAS</p>
        <h1 className="text-2xl font-bold text-ms-dark mb-1">Auditorías</h1>
        <p className="text-sm text-ms-mid mb-8">Sistema interno de evaluación</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ms-mid block mb-2 tracking-wide">TU NOMBRE</label>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Vale"
              className="w-full border border-ms-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ms-mid block mb-2 tracking-wide">CONTRASEÑA</label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              className="w-full border border-ms-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-gold text-white font-bold py-2.5 rounded-lg text-sm hover:bg-gold-light transition-colors"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  )
}
