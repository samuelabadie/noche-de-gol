'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { inscrireEquipe } from '@/lib/actions'
import { InscriptionEquipe } from '@/types'

interface JoueurForm {
  nom: string
  poste: string
  estCoach: boolean
}

interface InscriptionFormProps {
  nombreEquipes: number
}

export function InscriptionForm({ nombreEquipes }: InscriptionFormProps) {
  const [nomEquipe, setNomEquipe] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [pueblo, setPueblo] = useState('')
  const [joueurs, setJoueurs] = useState<JoueurForm[]>([
    { nom: '', poste: '', estCoach: false },
    { nom: '', poste: '', estCoach: false },
    { nom: '', poste: '', estCoach: false },
    { nom: '', poste: '', estCoach: false },
    { nom: '', poste: '', estCoach: false },
    { nom: '', poste: '', estCoach: false }
  ])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const ajouterJoueur = () => {
    if (joueurs.length < 10) {
      setJoueurs([...joueurs, { nom: '', poste: '', estCoach: false }])
    }
  }

  const supprimerJoueur = (index: number) => {
    if (joueurs.length > 1) {
      const nouveauxJoueurs = joueurs.filter((_, i) => i !== index)
      setJoueurs(nouveauxJoueurs)
    }
  }

  const modifierJoueur = (index: number, field: keyof JoueurForm, value: string | boolean) => {
    const nouveauxJoueurs = [...joueurs]
    nouveauxJoueurs[index] = { ...nouveauxJoueurs[index], [field]: value }
    
    // Si on marque quelqu'un como coach, décocher les autres
    if (field === 'estCoach' && value === true) {
      nouveauxJoueurs.forEach((joueur, i) => {
        if (i !== index) joueur.estCoach = false
      })
    }
    
    setJoueurs(nouveauxJoueurs)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Validation
    if (!nomEquipe.trim()) {
      setMessage({ type: 'error', text: 'El nombre del equipo es obligatorio' })
      setLoading(false)
      return
    }

    if (!whatsapp.trim()) {
      setMessage({ type: 'error', text: 'El número de WhatsApp es obligatorio para el pago por bizum' })
      setLoading(false)
      return
    }

    if (!pueblo.trim()) {
      setMessage({ type: 'error', text: 'El pueblo es obligatorio' })
      setLoading(false)
      return
    }

    const joueursValides = joueurs.filter(j => j.nom.trim())
    if (joueursValides.length < 6) {
      setMessage({ type: 'error', text: 'Mínimo 6 personas por equipo (5 jugadores + 1 entrenador)' })
      setLoading(false)
      return
    }

    const coaches = joueursValides.filter(j => j.estCoach)
    if (coaches.length !== 1) {
      setMessage({ type: 'error', text: 'Debe haber exactamente un entrenador' })
      setLoading(false)
      return
    }

    const joueursNonCoach = joueursValides.filter(j => !j.estCoach)
    if (joueursNonCoach.length < 5) {
      setMessage({ type: 'error', text: 'Debe haber al menos 5 jugadores por equipo' })
      setLoading(false)
      return
    }

    const data: InscriptionEquipe = {
      nom: nomEquipe.trim(),
      whatsapp: whatsapp.trim(),
      pueblo: pueblo.trim(),
      joueurs: joueursValides.map(j => ({
        nom: j.nom.trim(),
        poste: j.poste || undefined,
        estCoach: j.estCoach
      }))
    }

    const result = await inscrireEquipe(data)
    
    if (result.success) {
      setMessage({ type: 'success', text: '¡Equipo inscrito con éxito! Te contactaremos pronto.' })
      setNomEquipe('')
      setWhatsapp('')
      setPueblo('')
      setJoueurs([{ nom: '', poste: '', estCoach: false }])
    } else {
      setMessage({ type: 'error', text: result.error || 'Error al inscribir el equipo' })
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {nombreEquipes >= 10 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            Se ha alcanzado el número máximo de equipos (10). Las inscripciones están cerradas.
          </AlertDescription>
        </Alert>
      )}

      {message && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="nomEquipe">Nombre del Equipo *</Label>
        <Input
          id="nomEquipe"
          value={nomEquipe}
          onChange={(e) => setNomEquipe(e.target.value)}
          placeholder="Ej: Los Tigres del Barrio"
          required
          disabled={nombreEquipes >= 10}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">Número de WhatsApp * (para pago por bizum)</Label>
        <Input
          id="whatsapp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="+34 600 123 456"
          required
          disabled={nombreEquipes >= 10}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pueblo">Pueblo *</Label>
        <Input
          id="pueblo"
          value={pueblo}
          onChange={(e) => setPueblo(e.target.value)}
          placeholder="Ej: El Puerto"
          required
          disabled={nombreEquipes >= 10}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Jugadores y Entrenador</Label>
          <div className="text-sm text-gray-600">
            {joueurs.length}/10 personas
          </div>
        </div>

        {joueurs.map((joueur, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Persona {index + 1}</h4>
                      {joueurs.length > 6 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => supprimerJoueur(index)}
            className="text-red-600 hover:text-red-700"
          >
            Eliminar
          </Button>
        )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor={`nom-${index}`}>Nombre *</Label>
                <Input
                  id={`nom-${index}`}
                  value={joueur.nom}
                  onChange={(e) => modifierJoueur(index, 'nom', e.target.value)}
                  placeholder="Nombre completo"
                  required
                  disabled={nombreEquipes >= 10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`poste-${index}`}>Posición (opcional)</Label>
                <Select value={joueur.poste || "sin-posicion"} onValueChange={(value) => modifierJoueur(index, 'poste', value === "sin-posicion" ? "" : value)}>
                  <SelectTrigger disabled={nombreEquipes >= 10}>
                    <SelectValue placeholder="Seleccionar posición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sin-posicion">Sin posición</SelectItem>
                    <SelectItem value="Portero">Portero</SelectItem>
                    <SelectItem value="Defensa">Defensa</SelectItem>
                    <SelectItem value="Centrocampista">Centrocampista</SelectItem>
                    <SelectItem value="Delantero">Delantero</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`coach-${index}`}
                checked={joueur.estCoach}
                onChange={(e) => modifierJoueur(index, 'estCoach', e.target.checked)}
                className="rounded border-gray-300"
                disabled={nombreEquipes >= 10}
              />
              <Label htmlFor={`coach-${index}`} className="text-sm">
                Es entrenador
              </Label>
            </div>
          </div>
        ))}

        {joueurs.length < 10 && (
          <Button
            type="button"
            variant="outline"
            onClick={ajouterJoueur}
            className="w-full"
            disabled={nombreEquipes >= 10}
          >
            + Añadir otra persona (máximo 10)
          </Button>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading || nombreEquipes >= 10}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {loading ? 'Inscribiendo...' : nombreEquipes >= 10 ? 'Inscripciones Cerradas' : 'Inscribir Equipo'}
      </Button>
    </form>
  )
} 