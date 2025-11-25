"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function EditarMembroPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [form, setForm] = useState({ name: '', email: '', phone: '', birthday: '' })
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({})

  useEffect(() => {
    async function loadOne() {
      const tryUrls = [`/api/employee/${id}`, `/employee/${id}`]
      for (const url of tryUrls) {
        try {
          const res = await fetch(url, { credentials: "include" })
          if (res.ok) {
            const m = await res.json()
            setForm({ 
              name: m.name ?? '', 
              email: m.email ?? '', 
              phone: m.phone ?? '', 
              birthday: m.birthday ? new Date(m.birthday).toISOString().slice(0,10) : '' 
            })
            setLoading(false)
            return
          }
        } catch { }
      }
      setError("Membro não encontrado")
      setLoading(false)
    }
    if(id) loadOne()
  }, [id])

  function isValidEmail(v: string) { return /\S+@\S+\.\S+/.test(v) }
  function validate(p: { name?: string; email?: string }) {
    const e: any = {}
    if (!p.name || String(p.name).trim().length < 2) e.name = 'Nome obrigatório (>=2)'
    if (!p.email || !isValidEmail(String(p.email))) e.email = 'Email inválido'
    return e
  }

  async function updateMembro() {
    setSaving(true); setError(null); setFormErrors({})
    
    const v = validate(form)
    if (Object.keys(v).length) { setFormErrors(v); setSaving(false); return }
    
    const tryUrls = [`/api/employee/${id}`, `/employee/${id}`]
    let lastErr: any = null
    
    for (const url of tryUrls) {
      try {
        const res = await fetch(url, { method: 'PUT', headers:{'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify(form) })
        if (!res.ok) throw new Error(String(res.status))
        
        router.push('/membros')
        return
      } catch (err: any) { lastErr = err }
    }
    setSaving(false)
    setError('Falha ao atualizar: ' + (lastErr?.message ?? 'erro'))
  }

  if(loading) return <div className="p-8 text-white">Carregando...</div>

  return (
    <DashboardLayout>
      <PageHeader title={`Editar Membro ${id}`} description="Atualizar dados" breadcrumbs={[{ label: "Membros", href: "/membros" }, { label: "Editar" }]} />

      <div className="max-w-2xl mx-auto mt-6">
        <Card className="border-gray-800 bg-black">
          <CardHeader><CardTitle className="text-white">Editar Dados</CardTitle></CardHeader>
          <CardContent>
            {error && <div className="mb-4 text-sm text-red-400">{error}</div>}
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Nome</Label>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-gray-900 border-gray-800 text-white"/>
                {formErrors.name && <span className="text-xs text-red-400">{formErrors.name}</span>}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Email</Label>
                <Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="bg-gray-900 border-gray-800 text-white"/>
                {formErrors.email && <span className="text-xs text-red-400">{formErrors.email}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Telefone</Label>
                  <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="bg-gray-900 border-gray-800 text-white"/>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Aniversário</Label>
                  <Input type="date" value={form.birthday} onChange={e => setForm({...form, birthday: e.target.value})} className="bg-gray-900 border-gray-800 text-white"/>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Link href="/membros">
                  <Button variant="outline" className="border-gray-700 text-gray-300">Cancelar</Button>
                </Link>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={updateMembro} disabled={saving}>{saving ? 'Salvando...' : 'Salvar Alterações'}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
