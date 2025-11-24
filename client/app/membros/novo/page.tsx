"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function NovoMembroPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [form, setForm] = useState({ name: '', email: '', phone: '', birthday: '' })
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({})

  function isValidEmail(v: string) { return /\S+@\S+\.\S+/.test(v) }
  
  function validate(p: { name?: string; email?: string }) {
    const e: any = {}
    if (!p.name || String(p.name).trim().length < 2) e.name = 'Nome obrigatório (>=2)'
    if (!p.email || !isValidEmail(String(p.email))) e.email = 'Email inválido'
    return e
  }

  async function createMembro() {
    setSaving(true)
    setError(null)
    setFormErrors({})
    
    const v = validate(form)
    if (Object.keys(v).length) { setFormErrors(v); setSaving(false); return }
    
    const tryUrls = ["/api/employee", "/employee"]
    let lastErr: any = null
    
    for (const url of tryUrls) {
      try {
        const res = await fetch(url, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
          body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, birthday: form.birthday || null })
        })
        if (!res.ok) throw new Error(String(res.status))
        
        // Sucesso -> Redireciona
        router.push('/membros')
        return
      } catch (err: any) { lastErr = err }
    }
    setSaving(false)
    setError('Falha ao criar: ' + (lastErr?.message ?? 'erro'))
  }

  return (
    <DashboardLayout>
      <PageHeader title="Novo Membro" description="Adicionar integrante" breadcrumbs={[{ label: "Membros", href: "/membros" }, { label: "Novo" }]} />

      <div className="max-w-2xl mx-auto mt-6">
        <Card className="border-gray-800 bg-black">
          <CardHeader><CardTitle className="text-white">Dados do Membro</CardTitle></CardHeader>
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
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={createMembro} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}