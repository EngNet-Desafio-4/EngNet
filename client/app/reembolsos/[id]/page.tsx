"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, User, Tag, DollarSign, Calendar, FileText } from 'lucide-react'
import { StatusBadge } from "@/components/status-badge"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { useAppContext } from "@/app/context/AppContext"

export default function DetalhesReembolsoPage() {
    const params = useParams()
    const { addNotification } = useAppContext()
    const id = params.id

    const [refund, setRefund] = useState<any>(null)
    const [loading, setLoading] = useState(true)


    const [employees, setEmployees] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])


    const [alertOpen, setAlertOpen] = useState(false)
    const [alertAction, setAlertAction] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        async function loadData() {
            try {

                const res = await fetch(`/api/refund/${id}`, { credentials: "include" })
                if (res.ok) {
                    const data = await res.json()
                    setRefund(data)
                }


                const empRes = await fetch('/api/employee', { credentials: 'include' })
                if (empRes.ok) {
                    const d = await empRes.json()
                    setEmployees(Array.isArray(d) ? d : d.data ?? [])
                }
                const catRes = await fetch('/api/category', { credentials: 'include' })
                if (catRes.ok) {
                    const d = await catRes.json()
                    setCategories(Array.isArray(d) ? d : d.data ?? [])
                }
            } finally {
                setLoading(false)
            }
        }
        if (id) loadData()
    }, [id])


    const getEmployeeName = () => {
        if (!refund) return "—"
        return refund.employee?.name || refund.employee_name ||
            employees.find((e: any) => String(e.id) === String(refund.employee_id))?.name || "—"
    }

    const getCategoryName = () => {
        if (!refund) return "—"
        return refund.category?.name || refund.category_name ||
            categories.find((c: any) => String(c.id) === String(refund.category_id))?.name || "—"
    }

    const confirmAction = async () => {
        if (!alertAction) return
        setActionLoading(true)
        try {
            const newStatus = alertAction === "approve" ? "Aprovado" : "Rejeitado"
            const res = await fetch(`/api/refund/${id}`, {
                method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
                body: JSON.stringify({ status: newStatus }),
            })
            if (!res.ok) throw new Error()

            setRefund({ ...refund, status: newStatus })
            addNotification({ type: "success", message: "Status atualizado" })
        } catch {
            addNotification({ type: "error", message: "Erro ao atualizar" })
        } finally {
            setActionLoading(false); setAlertOpen(false)
        }
    }

    if (loading) return <div className="p-8 text-white">Carregando...</div>
    if (!refund) return <div className="p-8 text-white">Não encontrado</div>

    const dateFormatted = refund.date || refund.created_at ? new Date(refund.date || refund.created_at).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) : "—"

    return (
        <DashboardLayout>
            <PageHeader title="Detalhes da Solicitação" description={`Visualizando REM${id}`} breadcrumbs={[{ label: "Reembolsos", href: "/reembolsos" }, { label: "Detalhes" }]} />

            <div className="mt-6 max-w-3xl mx-auto space-y-6">
                <Card className="border-gray-800 bg-black">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xl text-white font-bold">Resumo</CardTitle>
                        <StatusBadge status={refund.status} />
                    </CardHeader>
                    <CardContent className="grid gap-6 pt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-4 rounded-md border border-gray-800 p-4">
                                <User className="h-5 w-5 text-orange-500" />
                                <div><p className="text-sm font-medium text-gray-400">Funcionário</p><p className="text-sm font-medium text-white">{getEmployeeName()}</p></div>
                            </div>
                            <div className="flex items-center space-x-4 rounded-md border border-gray-800 p-4">
                                <Tag className="h-5 w-5 text-orange-500" />
                                <div><p className="text-sm font-medium text-gray-400">Categoria</p><p className="text-sm font-medium text-white capitalize">{getCategoryName()}</p></div>
                            </div>
                            <div className="flex items-center space-x-4 rounded-md border border-gray-800 p-4">
                                <DollarSign className="h-5 w-5 text-green-500" />
                                <div><p className="text-sm font-medium text-gray-400">Valor</p><p className="text-lg font-bold text-green-400">{Number(refund.amount || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p></div>
                            </div>
                            <div className="flex items-center space-x-4 rounded-md border border-gray-800 p-4">
                                <Calendar className="h-5 w-5 text-blue-500" />
                                <div><p className="text-sm font-medium text-gray-400">Data</p><p className="text-sm font-medium text-white">{dateFormatted}</p></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400"><FileText className="h-4 w-4" /> <span className="text-sm font-medium">Descrição</span></div>
                            <div className="bg-gray-950 p-4 rounded border border-gray-800 text-white text-sm">{refund.description}</div>
                        </div>

                        {String(refund.status).toLowerCase() === 'pendente' && (
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { setAlertAction('approve'); setAlertOpen(true) }}>Aprovar</Button>
                                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => { setAlertAction('deny'); setAlertOpen(true) }}>Recusar</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div>
                    <Link href="/reembolsos">
                        <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>
                    </Link>
                </div>
            </div>

            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent className="bg-gray-900 border-gray-800">
                    <AlertDialogHeader><AlertDialogTitle className="text-white">Confirmação</AlertDialogTitle><AlertDialogDescription className="text-gray-400">Deseja atualizar o status desta solicitação?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmAction} className="bg-orange-500 hover:bg-orange-600 text-white">{actionLoading ? "..." : "Confirmar"}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    )
}