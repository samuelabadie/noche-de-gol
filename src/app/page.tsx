'use client'

import { InscriptionForm } from '@/components/InscriptionForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getEquipes } from '@/lib/actions'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [nombreEquipes, setNombreEquipes] = useState(0)

  useEffect(() => {
    const loadEquipes = async () => {
      const equipesData = await getEquipes()
      setNombreEquipes(equipesData.length)
    }
    loadEquipes()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="mb-6">
              <img 
                src="/logo.svg" 
                alt="Logo del Torneo" 
                className="mx-auto h-24 w-auto"
                onError={(e) => {
                  // Fallback if logo doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🏆 Noche de Gol Monteagudo
            </h1>
            <p className="text-xl text-gray-600">
              Inscripción de equipos para el torneo de nuestro pueblo
            </p>
            <div className="mt-4 p-3 bg-blue-100 rounded-lg inline-block">
              <p className="text-lg font-semibold text-blue-800">
                {nombreEquipes}/10 equipos inscritos
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">📝 Inscripción de Equipo</CardTitle>
                <CardDescription>
                  Completa el formulario para registrar tu equipo en el torneo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InscriptionForm nombreEquipes={nombreEquipes} />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">📋 Reglas del Torneo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span>5€ por jugador (pago por bizum)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span>Máximo 10 personas por equipo (9 jugadores + 1 entrenador)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span>Un entrenador obligatorio por equipo</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span>Número de WhatsApp obligatorio para el pago</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">🏆 Premio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-600 font-semibold">🥇</span>
                    <span>Campeón: 100€</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
