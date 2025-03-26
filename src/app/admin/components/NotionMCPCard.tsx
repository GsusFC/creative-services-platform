'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function NotionMCPCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <Link href="/admin/notion-mcp-demo" className="block group">
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-950/95 border border-white/10 hover:border-emerald-500/50 hover:bg-gray-900/80 transition-all duration-300 shadow-xl h-full">
          <CardHeader className="pb-4 border-b border-white/5 bg-black/20">
            <CardTitle className="flex items-center gap-3 text-xl text-white group-hover:text-emerald-400 transition-colors">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24"
                  className="text-emerald-400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 9h16v7.8c0
                    1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C18.48
                    20 17.92 20 16.8 20H7.2c-1.12 0-1.68 0-2.108-.218a2
                    2 0 0 1-.874-.874C4 18.48 4 17.92 4 16.8V9z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 4H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M2 9h20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              Integración MCP con Notion
            </CardTitle>
            <CardDescription className="text-gray-400">
              Sincroniza y publica case studies directamente desde Notion
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="text-gray-300 space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Sincronización automática de contenido
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Publicación condicional basada en estado
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Descarga inteligente de imágenes y videos
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Potenciado por el protocolo MCP
              </li>
            </ul>
            <div className="flex justify-end">
              <div className="flex items-center gap-2 text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                <span className="text-sm font-medium">Probar demo</span>
                <ArrowRightIcon className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
