"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from 'lucide-react'
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { useAppContext } from "@/app/context/AppContext"

export default function ReembolsosPage() {
  const { addNotification } = useAppContext()
  
  const [refunds, setRefunds] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("todas")
  
  
  const [selectedRefund, setSelectedRefund] = useState<any | null>(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertAction, setAlertAction] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      
      let res = await fetch("/api/refund", { credentials: "include" })
      if (!res.ok) res = await fetch("/refund", { credentials: "include" })
      const data = await res.json()
      const list = Array.isArray(data) ? data : data?.data ?? []
      let finalList = Array.isArray(list) ? list : []

      
      try {
        const rawNew = localStorage.getItem('refunds:new')
        if (rawNew) {
          const parsed = JSON.parse(rawNew)
          const exists = finalList.find((f: any) => f.id === parsed.id)
          if (!exists) finalList.unshift(parsed)
        }
      } catch {}

      
      try {
        const empRes = await fetch('/api/employee', { credentials: 'include' })
        if (empRes.ok) {
            const empData = await empRes.json()
            setEmployees(Array.isArray(empData) ? empData : empData.data ?? [])
        }
        
        const catRes = await fetch('/api/category', { credentials: 'include' })
        if (catRes.ok) {
          const catData = await catRes.json()
          setCategories(Array.isArray(catData) ? catData : catData.data ?? [])
        } else {
          // Fallback local de categorias (mesma lista usada no formulário)
          setCategories([
            { id: 1, name: "Combustível" }, { id: 2, name: "Alimentação" },
            { id: 3, name: "Transporte" }, { id: 4, name: "Hospedagem" },
            { id: 5, name: "Material de Escritório" }, { id: 6, name: "Outros" }
          ])
        }
      } catch {}

      setRefunds(finalList)
    } catch (err: any) {
      setError(err?.message ?? "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  
  const getEmployeeName = (r: any) => {
    if (!r) return '—'
    return r.employee?.name || r.employee?.nome || r.employee_name || 
      employees.find((e: any) => String(e.id) === String(r.employee_id))?.name || '—'
  }

  const getCategoryName = (r: any) => {
    if (!r) return '—'
    return r.category?.name || r.category?.nome || r.category_name || 
      categories.find((c: any) => String(c.id) === String(r.category_id))?.name || '—'
  }

  
  const openConfirm = (action: string, r: any) => { 
    setAlertAction(action)
    setSelectedRefund(r)
    setAlertOpen(true)
  }

  const confirmAction = async () => {
    if (!selectedRefund || !alertAction) return
    setActionLoading(true)
    try {
      const id = selectedRefund.id
      if (alertAction === "approve" || alertAction === "deny") {
        const newStatus = alertAction === "approve" ? "Aprovado" : "Rejeitado"
        const res = await fetch(`/api/refund/${id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        })
        if (!res.ok) throw new Error(`Erro`)
        setRefunds(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f))
        addNotification({ type: "success", message: `Status atualizado` })
      }
      if (alertAction === "delete") {
        const res = await fetch(`/api/refund/${id}`, { method: "DELETE", credentials: "include" })
        if (!res.ok) throw new Error(`Erro`)
        setRefunds(prev => prev.filter(f => f.id !== id))
        addNotification({ type: "success", message: "Excluído" })
      }
    } catch (err) {
      addNotification({ type: "error", message: "Erro na operação" })
    } finally {
      setActionLoading(false); setAlertOpen(false); setSelectedRefund(null)
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Reembolsos"
        description="Gerencie solicitações de reembolso"
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Reembolsos" }]}
        actions={
          <Button className="bg-orange-500 hover:bg-orange-600" asChild>
            <Link href="/reembolsos/novo"><Plus className="mr-2 h-4 w-4" />Nova Solicitação</Link>
          </Button>
        }
      />

      <Card className="border-gray-800 bg-black mt-6">
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-gray-950">
              {["todas", "pendentes", "aprovadas", "rejeitadas"].map(v => (
                <TabsTrigger key={v} value={v} className="capitalize data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  {v}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-lg border border-gray-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-950">
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-300 w-[80px]">ID</TableHead>
                      <TableHead className="text-gray-300">Funcionário</TableHead>
                      <TableHead className="text-gray-300">Categoria</TableHead>
                      <TableHead className="text-gray-300">Descrição</TableHead>
                      <TableHead className="text-gray-300">Valor</TableHead>
                      <TableHead className="text-gray-300">Data</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300 text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-400">Carregando...</TableCell></TableRow>}
                    {!loading && refunds.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-400">Nenhum registro.</TableCell></TableRow>}
                    
                    {!loading && refunds.filter(r => {
                        if (activeTab === "todas") return true
                        const s = String(r.status || "").toLowerCase()
                        if (activeTab === "pendentes") return s.includes("pendente")
                        if (activeTab === "aprovadas") return s.includes("aprovado")
                        if (activeTab === "rejeitadas") return s.includes("rejeitado")
                        return true
                      }).map((r) => {
                        const dateVal = r.date || r.created_at || r.createdAt || r.requestDate
                        const dateFormatted = dateVal ? new Date(dateVal).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) : "—"
                        
                        return (
                          <TableRow key={r.id} className="border-gray-800 hover:bg-gray-950">
                            <TableCell className="font-mono text-white font-medium">REM{r.id}</TableCell>
                            <TableCell className="text-white">{getEmployeeName(r)}</TableCell>
                            <TableCell className="text-white capitalize">{getCategoryName(r)}</TableCell>
                            <TableCell className="text-gray-400 truncate max-w-[150px]">{r.description}</TableCell>
                            <TableCell className="text-white font-medium">
                              {Number(r.amount || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </TableCell>
                            <TableCell className="text-gray-400">{dateFormatted}</TableCell>
                            <TableCell><StatusBadge status={r.status} /></TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {String(r.status).toLowerCase() === 'pendente' && (
                                  <>
                                    <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white" onClick={() => openConfirm('approve', r)}>✓</Button>
                                    <Button size="sm" className="h-8 bg-red-600 hover:bg-red-700 text-white" onClick={() => openConfirm('deny', r)}>✕</Button>
                                  </>
                                )}
                                <Link href={`/reembolsos/${r.id}`}>
                                    <Button size="sm" variant="outline" className="h-8 border-gray-700 text-gray-300 hover:bg-gray-800">Ver</Button>
                                </Link>
                                <Button size="sm" variant="ghost" className="h-8 text-red-500 hover:text-red-400" onClick={() => openConfirm('delete', r)}>🗑️</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmação</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Deseja realmente prosseguir com a ação para REM{selectedRefund?.id}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction} className="bg-orange-500 hover:bg-orange-600 text-white">
              {actionLoading ? "..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}