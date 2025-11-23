"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, ArrowLeft, Mail, Phone, Calendar } from 'lucide-react'

export default function VerMembroPage() {
  const params = useParams()
  const id = params.id
  
  const [membro, setMembro] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOne() {
      const tryUrls = [`/api/employee/${id}`, `/employee/${id}`]
      for (const url of tryUrls) {
        try {
          const res = await fetch(url, { credentials: "include" })
          if (res.ok) {
            const data = await res.json()
            setMembro(data)
            setLoading(false)
            return
          }
        } catch { }
      }
      setLoading(false)
    }
    if (id) loadOne()
  }, [id])

  if(loading) return <div className="p-8 text-white">Carregando...</div>
  if(!membro) return <div className="p-8 text-white">Membro não encontrado</div>

  return (
    <DashboardLayout>
      <PageHeader title="Detalhes do Membro" description={`Visualizando: ${membro.name}`} breadcrumbs={[{ label: "Membros", href: "/membros" }, { label: "Detalhes" }]} 
        actions={
          <Link href={`/membros/${id}/editar`}>
            <Button className="bg-orange-500 hover:bg-orange-600"><Edit className="mr-2 h-4 w-4" /> Editar</Button>
          </Link>
        }
      />

      <div className="mt-6 max-w-3xl mx-auto">
        <Card className="border-gray-800 bg-black">
          <CardHeader><CardTitle className="text-xl text-white font-bold">{membro.name}</CardTitle></CardHeader>
          <CardContent className="grid gap-6 pt-4">
             <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-4 rounded-md border border-gray-800 p-4">
                  <Mail className="h-5 w-5 text-orange-500" />
                  <div><p className="text-sm font-medium text-gray-400">Email</p><p className="text-sm font-medium text-white">{membro.email}</p></div>
                </div>
                <div className="flex items-center space-x-4 rounded-md border border-gray-800 p-4">
                  <Phone className="h-5 w-5 text-orange-500" />
                  <div><p className="text-sm font-medium text-gray-400">Telefone</p><p className="text-sm font-medium text-white">{membro.phone || '-'}</p></div>
                </div>
                <div className="flex items-center space-x-4 rounded-md border border-gray-800 p-4">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <div><p className="text-sm font-medium text-gray-400">Aniversário</p><p className="text-sm font-medium text-white">{membro.birthday ? new Date(membro.birthday).toLocaleDateString() : '-'}</p></div>
                </div>
             </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Link href="/membros">
            <Button variant="outline" className="border-gray-700 text-gray-300"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}