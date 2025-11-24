"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { ArrowUp, Users, UserPlus, Star, MapPin } from 'lucide-react'
import Link from "next/link"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      const tryUrls = ["/api/customer", "/customer"]
      let data: any = null

      for (const url of tryUrls) {
        try {
          const res = await fetch(url, { credentials: "include" })
          if (!res.ok) throw new Error(`status:${res.status}`)
          data = await res.json()
          break
        } catch (err) { }
      }

      if (!data) {
        setError("Não foi possível obter os dados.")
        setClientes([])
      } else {
        const list = Array.isArray(data) ? data : data.data ?? []
        setClientes(list)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function deleteCliente(id: number) {
    setDeleting(true)
    setDeleteError(null)
    const tryUrls = [`/api/customer/${id}`, `/customer/${id}`]
    
    for (const url of tryUrls) {
      try {
        const res = await fetch(url, { method: 'DELETE', credentials: 'include' })
        if (!res.ok) throw new Error(`status:${res.status}`)
        setClientes((prev) => prev.filter((c) => c.id !== id))
        setDeleteId(null)
        setDeleting(false)
        return
      } catch (err) { }
    }
    setDeleting(false)
    setDeleteError('Falha ao deletar.')
  }

  const total = clientes.length
  const ativos = clientes.filter((c) => (c.status || '').toString().toLowerCase().includes('ativo')).length
  const vips = clientes.filter((c) => (c.status || '').toString().toLowerCase().includes('vip')).length
  const novosHoje = clientes.filter((c) => {
    if (!c.createdAt) return false
    try {
      const d = new Date(c.createdAt)
      const today = new Date()
      return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
    } catch { return false }
  }).length

  const getBadgeStyle = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("vip")) return "bg-purple-500/15 text-purple-400 border-purple-500/20 hover:bg-purple-500/25";
    if (s.includes("ativo")) return "bg-green-500/15 text-green-400 border-green-500/20 hover:bg-green-500/25";
    if (s.includes("novo")) return "bg-blue-500/15 text-blue-400 border-blue-500/20 hover:bg-blue-500/25";
    return "bg-red-500/15 text-red-400 border-red-500/20 hover:bg-red-500/25"; // Inativo ou outros
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Clientes"
        description="Gerencie e acompanhe todos os clientes"
        actions={
          <div className="flex gap-2">
            <Link href="/clientes/novo">
              <Button className="bg-orange-500 hover:bg-orange-600">Novo Cliente</Button>
            </Link>
          </div>
        }
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Clientes" }]}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{loading ? '...' : total}</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +12 novos este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Clientes Ativos</CardTitle>
              <UserPlus className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{loading ? '...' : ativos}</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +8% desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Clientes VIP</CardTitle>
              <Star className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{loading ? '...' : vips}</div>
            <p className="mt-1 flex items-center text-xs text-blue-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +3 este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Novos Hoje</CardTitle>
              <MapPin className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{loading ? '...' : novosHoje}</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +2 que ontem
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-800 bg-black">
        <CardContent>
          {error && <div className="text-red-400 mb-4">{error}</div>}
          
          {loading ? <div className="text-gray-300 py-4">Carregando...</div> : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-300">ID</TableHead>
                  <TableHead className="text-gray-300">Nome</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Telefone</TableHead>
                  <TableHead className="text-gray-300">Total Compras</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id} className="border-gray-800 hover:bg-gray-900">
                    <TableCell className="text-white font-medium">CLI{cliente.id}</TableCell>
                    <TableCell className="text-white">{cliente.name ?? cliente.nome}</TableCell>
                    <TableCell className="text-gray-300">{cliente.email}</TableCell>
                    <TableCell className="text-gray-300">{cliente.phone ?? cliente.telefone}</TableCell>
                    <TableCell className="text-white font-medium">
                       {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(cliente.totalPurchases ?? cliente.total ?? 0))}
                    </TableCell>
                    <TableCell>
                      
                      <Badge className={`${getBadgeStyle(cliente.status)} border`}>
                        {cliente.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/clientes/${cliente.id}`}>
                          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">Ver</Button>
                        </Link>
                        <Link href={`/clientes/${cliente.id}/editar`}>
                          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">Editar</Button>
                        </Link>
                        <Button size="sm" variant="destructive" className="border-gray-700" onClick={() => setDeleteId(cliente.id)}>Excluir</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {deleteId !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-gray-900 p-6 rounded border border-gray-800 w-full max-w-sm">
                <h3 className="text-white text-lg font-semibold mb-4">Confirmar exclusão</h3>
                <p className="text-gray-300 text-sm mb-4">Tem certeza que deseja excluir este cliente?</p>
                {deleteError && <p className="text-red-400 text-sm mb-2">{deleteError}</p>}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDeleteId(null)} className="border-gray-700 text-gray-300">Cancelar</Button>
                  <Button className="bg-red-600 hover:bg-red-700" onClick={() => deleteCliente(deleteId)} disabled={deleting}>
                    {deleting ? 'Excluindo...' : 'Excluir'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
