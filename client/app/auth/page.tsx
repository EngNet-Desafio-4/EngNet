"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AuthPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black">
            <Card className="w-full max-w-sm border-gray-800 bg-gray-900 text-white">
                <CardHeader>
                    <CardTitle className="text-center text-xl">Autenticação</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">Usuário</label>
                        <Input
                            placeholder="Digite seu usuário"
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">Senha</label>
                        <Input
                            type="password"
                            placeholder="Digite sua senha"
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                    </div>

                    <div className="flex justify-between gap-2 pt-4">
                        <Button className="w-1/2 bg-orange-600 hover:bg-orange-700">
                            Login
                        </Button>

                        <Button
                            variant="outline"
                            className="w-1/2 border-gray-700 text-gray-200 hover:bg-gray-800"
                        >
                            Registrar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
