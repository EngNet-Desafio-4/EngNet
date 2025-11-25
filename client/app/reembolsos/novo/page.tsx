"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext } from "@/app/context/AppContext"

export default function NovoReembolsoPage() {
  const router = useRouter()
  const { addNotification, userInfo } = useAppContext()

  const [employees, setEmployees] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)
  
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    employee_id: "",
    category_id: "",
    description: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10)
  })

  useEffect(() => {
    async function loadAuxiliaryData() {
      try {
        const resEmp = await fetch("/api/employee", { credentials: "include" })
        if (resEmp.ok) {
            const d = await resEmp.json()
            setEmployees(Array.isArray(d) ? d : d.data ?? [])
        }
        
        const resCat = await fetch("/api/category", { credentials: "include" })
        if (resCat.ok) {
            const d = await resCat.json()
            setCategories(Array.isArray(d) ? d : d.data ?? [])
        } else {
            setCategories([{id:1, name:"Combustível"}, {id:2, name:"Alimentação"}, {id:3, name:"Transporte"}, {id:4, name:"Hospedagem"}, {id:5, name:"Outros"}])
        }
      } finally { setLoadingData(false) }
    }
    loadAuxiliaryData()
  }, [])

  const totalFormatado = useMemo(() => {
    const val = parseFloat(form.amount.replace(',', '.') || "0")
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 })
  }, [form.amount])

  const categoriaSelecionadaNome = useMemo(() => {
    const cat = categories.find(c => String(c.id) === form.category_id)
    return cat ? (cat.name || cat.nome) : "—"
  }, [form.category_id, categories])

  const funcionarioSelecionadoNome = useMemo(() => {
    const emp = employees.find(e => String(e.id) === form.employee_id)
    return emp ? (emp.name || emp.nome) : (userInfo?.name || "—")
  }, [form.employee_id, employees, userInfo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.employee_id || !form.category_id || !form.amount) {
      addNotification({ type: "error", message: "Preencha os campos obrigatórios" })
      return
    }
    setSaving(true)

    const payload = {
      employee_id: Number(form.employee_id),
      category_id: Number(form.category_id),
      description: form.description,
      amount: parseFloat(form.amount.replace(',', '.')),
      status: "Pendente",
      date: form.date
    }

    try {
        const res = await fetch("/api/refund", {
          method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error()
        const createdData = await res.json()
        
        const optimisticData = {
            ...createdData,
            id: createdData.id || Date.now(),
            employee: { name: funcionarioSelecionadoNome }, 
            employee_name: funcionarioSelecionadoNome,
            category: { name: categoriaSelecionadaNome },
            category_name: categoriaSelecionadaNome,
            created_at: form.date,
            amount: payload.amount,
            description: payload.description,
            status: "Pendente"
        }
        localStorage.setItem('refunds:new', JSON.stringify(optimisticData))
        if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('refunds:created', { detail: optimisticData }))

        addNotification({ type: "success", message: "Sucesso!" })
        router.push("/reembolsos")
    } catch {
      addNotification({ type: "error", message: "Erro ao enviar" })
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <PageHeader title="Nova Solicitação" description="Preencha os dados" breadcrumbs={[{ label: "Início", href: "/" }, { label: "Reembolsos", href: "/reembolsos" }, { label: "Nova" }]} />
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3 mt-6">
        <div className="lg:col-span-2">
          <Card className="border-gray-800 bg-black">
            <CardHeader><CardTitle className="text-white">Dados</CardTitle><CardDescription className="text-gray-400">Informe os detalhes</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label className="text-gray-300">Funcionário</Label><Select value={form.employee_id} onValueChange={(v) => setForm({ ...form, employee_id: v })} disabled={loadingData}><SelectTrigger className="bg-gray-950 border-gray-800 text-white"><SelectValue placeholder={loadingData ? "..." : "Selecione"} /></SelectTrigger><SelectContent className="bg-gray-900 border-gray-800 text-white">{employees.map((emp: any) => (<SelectItem key={emp.id} value={String(emp.id)}>{emp.name || emp.nome}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-2"><Label className="text-gray-300">Data</Label><Input type="date" className="bg-gray-950 border-gray-800 text-white" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label className="text-gray-300">Categoria</Label><Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })} disabled={loadingData}><SelectTrigger className="bg-gray-950 border-gray-800 text-white"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent className="bg-gray-900 border-gray-800 text-white">{categories.map((cat: any) => (<SelectItem key={cat.id} value={String(cat.id)}>{cat.name || cat.nome}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-2"><Label className="text-gray-300">Valor</Label><Input type="number" step="0.01" className="bg-gray-950 border-gray-800 text-white" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label className="text-gray-300">Descrição</Label><Textarea className="bg-gray-950 border-gray-800 text-white min-h-[120px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <Card className="border-gray-800 bg-black">
              <CardHeader><CardTitle className="text-white">Resumo</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm border-b border-gray-800 pb-3"><span className="text-gray-400">Funcionário</span><span className="text-white font-medium truncate w-32 text-right">{funcionarioSelecionadoNome}</span></div>
                <div className="flex justify-between text-sm border-b border-gray-800 pb-3"><span className="text-gray-400">Categoria</span><span className="text-white capitalize truncate w-32 text-right">{categoriaSelecionadaNome}</span></div>
                <div className="flex justify-between text-sm pt-1"><span className="text-gray-400">Total</span><span className="font-bold text-xl text-green-500">{totalFormatado}</span></div>
                <div className="pt-4"><Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={saving}>{saving ? '...' : 'Enviar'}</Button></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </DashboardLayout>
  )
}