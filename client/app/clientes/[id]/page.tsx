"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Edit, ArrowLeft, Mail, Phone, Calendar, DollarSign } from 'lucide-react'

export default function DetalhesClientePage() {
  const params = useParams()
  const id = params.id
  
  const [cliente, setCliente] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOne() {
      const tryUrls = [`/api/customer/${id}`, `/customer/${id}`]
      for (const url of tryUrls) {
        try {
          const res = await fetch(url, { credentials: "include" })
          if (res.ok) {
            const data = await res.json()
            setCliente(data)
            setLoading(false)
            return
          }
        } catch (err) { }
      }
      setLoading(false)
    }
    if (id) loadOne()
  }, [id])

  if (loading) return <div className="p-8 text-white">Carregando...</div>
  if (!cliente) return <div className="p-8 text-white">Cliente não encontrado</div>

  return (
    <DashboardLayout>
      <PageHeader
        title="Detalhes do Cliente"
        description={`Visualizando informações de ${cliente.name ?? cliente.nome}`}
        breadcrumbs={[{ label: "Clientes", href: "/clientes" }, { label: "Detalhes" }]}
        actions={
          <Link href={`/clientes/${id}/editar`}>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card className="border-gray-800 bg-black md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl text-white font-bold">{cliente.name ?? cliente.nome}</CardTitle>
            <Badge className="bg-purple-500/15 text-purple-400">{cliente.status}</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="flex items-center space-x-4 rounded-md border border-gray-800 p-4">
                <Mail className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-400">Email</p>
                  <p className="text-sm font-medium text-white">{cliente.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-md border border-gray-800 p-4">
                <Phone className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-400">Telefone</p>
                  <p className="text-sm font-medium text-white">{cliente.phone ?? cliente.telefone ?? '-'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader><CardTitle className="text-white text-base">Financeiro</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-gray-400">Total Compras</span>
              </div>
              <span className="text-white font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(cliente.totalPurchases ?? cliente.total ?? 0))}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Link href="/clientes">
          <Button variant="outline" className="border-gray-700 text-gray-300">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>
    </DashboardLayout>
  )
}