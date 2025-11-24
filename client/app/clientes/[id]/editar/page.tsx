"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation" 
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function EditarClientePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id 

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [form, setForm] = useState({ name: '', email: '', phone: '', status: 'Novo' })
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  
  useEffect(() => {
    async function loadOne() {
      const tryUrls = [`/api/customer/${id}`, `/customer/${id}`]
      for (const url of tryUrls) {
        try {
          const res = await fetch(url, { credentials: "include" })
          if (res.ok) {
            const data = await res.json()
            
            setForm({
              name: data.name ?? data.nome ?? '',
              email: data.email ?? '',
              phone: data.phone ?? data.telefone ?? '',
              status: data.status ?? 'Novo'
            })
            setLoading(false)
            return
          }
        } catch (err) { }
      }
      setError("Cliente não encontrado.")
      setLoading(false)
    }
    if (id) loadOne()
  }, [id])

  function validatePayload(payload: any) {
    const errs: any = {}
    if (!payload.name || String(payload.name).trim().length < 2) errs.name = 'Nome obrigatório'
    if (!payload.email || !/\S+@\S+\.\S+/.test(String(payload.email))) errs.email = 'Email inválido'
    return errs
  }

  async function updateCliente() {
    setSaving(true)
    setError(null)
    setErrors({})

    const validation = validatePayload(form)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      setSaving(false)
      return
    }

    const tryUrls = [`/api/customer/${id}`, `/customer/${id}`]
    let lastErr: any = null

    for (const url of tryUrls) {
      try {
        const res = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        })

        if (!res.ok) throw new Error(await res.text())
        
        router.push('/clientes')
        return
      } catch (err: any) {
        lastErr = err
      }
    }
    setSaving(false)
    setError('Falha ao atualizar: ' + (lastErr?.message ?? 'erro desconhecido'))
  }

  if (loading) return <div className="p-8 text-white">Carregando...</div>

  return (
    <DashboardLayout>
      <PageHeader
        title={`Editar Cliente ${id}`}
        description="Atualize as informações"
        breadcrumbs={[{ label: "Clientes", href: "/clientes" }, { label: "Editar" }]}
      />

      <div className="max-w-2xl mx-auto mt-6">
        <Card className="border-gray-800 bg-black">
          <CardHeader><CardTitle className="text-white">Editar Dados</CardTitle></CardHeader>
          <CardContent>
            {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Nome</Label>
                <Input 
                  value={form.name} 
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  className="bg-gray-900 border-gray-800 text-white" 
                />
                {errors.name && <span className="text-red-400 text-xs">{errors.name}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Email</Label>
                  <Input 
                    value={form.email} 
                    onChange={(e) => setForm({...form, email: e.target.value})} 
                    className="bg-gray-900 border-gray-800 text-white" 
                  />
                  {errors.email && <span className="text-red-400 text-xs">{errors.email}</span>}
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Telefone</Label>
                  <Input 
                    value={form.phone} 
                    onChange={(e) => setForm({...form, phone: e.target.value})} 
                    className="bg-gray-900 border-gray-800 text-white" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Status</Label>
                <Select value={form.status} onValueChange={(val) => setForm({...form, status: val})}>
                  <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
                    <SelectItem value="Novo">Novo</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Link href="/clientes">
                  <Button variant="outline" className="border-gray-700 text-gray-300">Cancelar</Button>
                </Link>
                <Button onClick={updateCliente} className="bg-orange-500 hover:bg-orange-600" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
