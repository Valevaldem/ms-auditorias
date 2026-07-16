import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "MS Auditorías",
  description: "Sistema de auditoría de conversaciones — María Salinas",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
