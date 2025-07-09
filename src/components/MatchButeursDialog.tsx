'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { Match, Equipe } from '@/types'

interface MatchButeursDialogProps {
  match: Match | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (matchId: number, score1: number, score2: number, buteurs1: any[], buteurs2: any[]) => Promise<void>
  loading?: boolean
}

export function MatchButeursDialog({ match, open, onOpenChange, onSave, loading = false }: MatchButeursDialogProps) {
  const [score1, setScore1] = useState('')
  const [score2, setScore2] = useState('')
  const [buteurs1, setButeurs1] = useState<{ joueurId: number, minute?: number }[]>([])
  const [buteurs2, setButeurs2] = useState<{ joueurId: number, minute?: number }[]>([])
  const [newButeur1, setNewButeur1] = useState({ joueurId: '', minute: '' })
  const [newButeur2, setNewButeur2] = useState({ joueurId: '', minute: '' })

  useEffect(() => {
    if (match) {
      setScore1(match.scoreEquipe1?.toString() || '')
      setScore2(match.scoreEquipe2?.toString() || '')
      setButeurs1(match.buteurs.filter(b => b.joueur.equipeId === match.equipe1Id).map(b => ({ joueurId: b.joueurId, minute: b.minute })))
      setButeurs2(match.buteurs.filter(b => b.joueur.equipeId === match.equipe2Id).map(b => ({ joueurId: b.joueurId, minute: b.minute })))
    }
  }, [match])

  const handleSave = async () => {
    if (!match) return
    
    const s1 = parseInt(score1) || 0
    const s2 = parseInt(score2) || 0
    
    await onSave(match.id, s1, s2, buteurs1, buteurs2)
    onOpenChange(false)
  }

  const addButeur1 = () => {
    if (newButeur1.joueurId && match) {
      setButeurs1([...buteurs1, { 
        joueurId: parseInt(newButeur1.joueurId), 
        minute: newButeur1.minute ? parseInt(newButeur1.minute) : undefined 
      }])
      setNewButeur1({ joueurId: '', minute: '' })
    }
  }

  const addButeur2 = () => {
    if (newButeur2.joueurId && match) {
      setButeurs2([...buteurs2, { 
        joueurId: parseInt(newButeur2.joueurId), 
        minute: newButeur2.minute ? parseInt(newButeur2.minute) : undefined 
      }])
      setNewButeur2({ joueurId: '', minute: '' })
    }
  }

  const removeButeur1 = (index: number) => {
    setButeurs1(buteurs1.filter((_, i) => i !== index))
  }

  const removeButeur2 = (index: number) => {
    setButeurs2(buteurs2.filter((_, i) => i !== index))
  }

  const getJoueurName = (joueurId: number, equipe: Equipe) => {
    return equipe.joueurs.find(j => j.id === joueurId)?.nom || 'Jugador desconocido'
  }

  if (!match) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestionar Partido: {match.equipe1.nom} vs {match.equipe2.nom}</DialogTitle>
          <DialogDescription>
            Introduce el resultado y los goleadores del partido
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Scores */}
          <div className="flex items-center space-x-4">
            <div className="space-y-2 flex-1">
              <Label>{match.equipe1.nom}</Label>
              <Input
                type="number"
                value={score1}
                onChange={(e) => setScore1(e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
            <span className="text-2xl font-bold">-</span>
            <div className="space-y-2 flex-1">
              <Label>{match.equipe2.nom}</Label>
              <Input
                type="number"
                value={score2}
                onChange={(e) => setScore2(e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Goleadores Equipo 1 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Goleadores - {match.equipe1.nom}</Label>
            <div className="space-y-2">
              {buteurs1.map((buteur, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <Badge variant="outline">
                    {getJoueurName(buteur.joueurId, match.equipe1)}
                  </Badge>
                  {buteur.minute && (
                    <Badge variant="secondary">
                      {buteur.minute}'
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeButeur1(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex space-x-2">
                <Select value={newButeur1.joueurId} onValueChange={(value) => setNewButeur1({ ...newButeur1, joueurId: value })}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccionar jugador" />
                  </SelectTrigger>
                  <SelectContent>
                    {match.equipe1.joueurs.filter(j => !j.estCoach).map((joueur) => (
                      <SelectItem key={joueur.id} value={joueur.id.toString()}>
                        {joueur.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Min"
                  value={newButeur1.minute}
                  onChange={(e) => setNewButeur1({ ...newButeur1, minute: e.target.value })}
                  className="w-20"
                  min="1"
                  max="90"
                />
                <Button size="sm" onClick={addButeur1} disabled={!newButeur1.joueurId}>
                  +
                </Button>
              </div>
            </div>
          </div>

          {/* Goleadores Equipo 2 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Goleadores - {match.equipe2.nom}</Label>
            <div className="space-y-2">
              {buteurs2.map((buteur, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <Badge variant="outline">
                    {getJoueurName(buteur.joueurId, match.equipe2)}
                  </Badge>
                  {buteur.minute && (
                    <Badge variant="secondary">
                      {buteur.minute}'
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeButeur2(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex space-x-2">
                <Select value={newButeur2.joueurId} onValueChange={(value) => setNewButeur2({ ...newButeur2, joueurId: value })}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccionar jugador" />
                  </SelectTrigger>
                  <SelectContent>
                    {match.equipe2.joueurs.filter(j => !j.estCoach).map((joueur) => (
                      <SelectItem key={joueur.id} value={joueur.id.toString()}>
                        {joueur.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Min"
                  value={newButeur2.minute}
                  onChange={(e) => setNewButeur2({ ...newButeur2, minute: e.target.value })}
                  className="w-20"
                  min="1"
                  max="90"
                />
                <Button size="sm" onClick={addButeur2} disabled={!newButeur2.joueurId}>
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading || !score1 || !score2}>
            {loading ? 'Guardando...' : 'Guardar Resultado'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 