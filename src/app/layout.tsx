import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import Navigation from "./components/Navigation"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Task Management App",
  description: "Manage your tasks efficiently",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className={`h-full ${inter.className}`}>
        <Providers>
          <div className="min-h-full">
            <Navigation />
            <main className="mx-auto">
              {children}
            </main>
          </div>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  )
}

