"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { ArrowUp, Users, UserPlus, Calendar } from 'lucide-react'
import Link from "next/link"

export default function MembrosPage() {
  const [membros, setMembros] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Delete states
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Carregar dados
  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      const tryUrls = ["/api/employee", "/employee"]
      let data: any = null
      for (const url of tryUrls) {
        try {
          const res = await fetch(url, { credentials: 'include' })
          if (!res.ok) throw new Error(`status:${res.status}`)
          data = await res.json()
          break
        } catch { }
      }
      if (!data) {
        setError('Não foi possível carregar membros.')
        setMembros([])
      } else {
        const list = Array.isArray(data) ? data : data.data ?? []
        setMembros(list)
      }
      setLoading(false)
    }
    load()
  }, [])

  // Lógica de Delete
  async function deleteMember(id: number | null) {
    if (id === null) return
    setDeleting(true)
    setDeleteError(null)
    const tryUrls = [`/api/employee/${id}`, `/employee/${id}`]
    
    for (const url of tryUrls) {
      try {
        const res = await fetch(url, { method: 'DELETE', credentials: 'include' })
        if (!res.ok) throw new Error(String(res.status))
        setMembros(prev => prev.filter(p => p.id !== id))
        setDeleteId(null)
        setDeleting(false)
        return
      } catch (err) { }
    }
    setDeleting(false)
    setDeleteError('Falha ao excluir membro.')
  }

  // Métricas
  const total = membros.length
  const withPhone = membros.filter(m => m.phone).length
  const withoutPhone = total - withPhone
  const birthdaysToday = membros.filter(m => {
    if (!m.birthday) return false
    try { const d = new Date(m.birthday); const t = new Date(); return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() }
    catch { return false }
  }).length

  // Função auxiliar para estilos das Badges de Membros
  const getBadgeStyle = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("ativo")) return "bg-green-500/15 text-green-400 border-green-500/20 hover:bg-green-500/25";
    return "bg-red-500/15 text-red-400 border-red-500/20 hover:bg-red-500/25";
  }

  return (
    <DashboardLayout>
      <PageHeader 
        title="Membros" 
        description="Gestão de membros (Engnet)" 
        actions={
          <div className="flex gap-2">
            <Link href="/membros/novo">
              <Button className="bg-orange-500 hover:bg-orange-600">Novo Membro</Button>
            </Link>
          </div>
        } 
        breadcrumbs={[{label:'Início', href:'/'},{label:'Membros'}]} 
      />

      {/* Métricas com Ícones e Texto de Crescimento Restaurados */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Total de Membros</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{loading ? '...' : total}</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3"/>
              {loading ? '...' : `${total} cadastrados`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Com Telefone</CardTitle>
              <UserPlus className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{loading ? '...' : withPhone}</div>
            <p className="mt-1 text-xs text-green-400">{loading ? '...' : `+${withPhone} verificados`}</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Sem Telefone</CardTitle>
              <UserPlus className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{loading ? '...' : withoutPhone}</div>
            <p className="mt-1 text-xs text-yellow-400">{loading ? '...' : `Pendentes: ${withoutPhone}`}</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Aniversariantes Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{loading ? '...' : birthdaysToday}</div>
            <p className="mt-1 text-xs text-blue-400">{loading ? '...' : `${birthdaysToday} parabéns hoje`}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-800 bg-black">
        <CardContent>
          {error && <div className="mb-4 text-sm text-red-400">{error}</div>}

          {loading ? (
            <div className="py-8 text-center text-gray-300">Carregando membros...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-300">ID</TableHead>
                  <TableHead className="text-gray-300">Nome</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Telefone</TableHead>
                  <TableHead className="text-gray-300">Aniversário</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membros.map(m => (
                  <TableRow key={m.id} className="border-gray-800 hover:bg-gray-900">
                    <TableCell className="text-white font-medium">{`MEM${m.id}`}</TableCell>
                    <TableCell className="text-white">{m.name}</TableCell>
                    <TableCell className="text-gray-300">{m.email}</TableCell>
                    <TableCell className="text-gray-300">{m.phone ?? '-'}</TableCell>
                    <TableCell className="text-gray-300">{m.birthday ? new Date(m.birthday).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      {/* Badge corrigida */}
                      <Badge className={`${getBadgeStyle(m.status || 'Ativo')} border`}>
                        {m.status || 'Ativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/membros/${m.id}`}>
                          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">Ver</Button>
                        </Link>
                        <Link href={`/membros/${m.id}/editar`}>
                          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">Editar</Button>
                        </Link>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => setDeleteId(m.id)}>Excluir</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Modal de Exclusão */}
          {deleteId !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="w-full max-w-sm bg-gray-900 border border-gray-800 p-6 rounded">
                <h4 className="text-lg font-medium mb-4 text-white">Confirmar exclusão</h4>
                <p className="text-sm text-gray-300 mb-4">Tem certeza que deseja excluir este membro?</p>
                {deleteError && <p className="text-xs text-red-400 mb-2">{deleteError}</p>}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDeleteId(null)} className="border-gray-700 text-gray-300">Cancelar</Button>
                  <Button className="bg-red-600 hover:bg-red-700" onClick={() => deleteMember(deleteId)} disabled={deleting}>{deleting ? '...' : 'Excluir'}</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}