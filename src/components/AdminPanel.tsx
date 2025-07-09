'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getEquipes, getMatchs, creerMatch, terminerMatch, getClassementParGroupe, supprimerEquipe, genererGroupes, getGroupes, genererMatchsGroupes, terminerMatchAvecButeurs, getMeilleursButeurs, supprimerTousMatchs, genererDemiFinales, verifierMatchsGroupesTermines, resetTournoi, genererEquipesTest, genererResultatsAleatoires } from '@/lib/actions'
import { Equipe, Match, Groupe, Buteur } from '@/types'
import { MatchButeursDialog } from './MatchButeursDialog'

export function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [equipes, setEquipes] = useState<any[]>([])
  const [matchs, setMatchs] = useState<any[]>([])
  const [classementParGroupe, setClassementParGroupe] = useState<any[]>([])
  const [groupes, setGroupes] = useState<any[]>([])
  const [meilleursButeurs, setMeilleursButeurs] = useState<any[]>([])
  const [statusMatchsGroupes, setStatusMatchsGroupes] = useState<any>(null)
  
  const [showCreerMatch, setShowCreerMatch] = useState(false)
  const [equipe1Id, setEquipe1Id] = useState('')
  const [equipe2Id, setEquipe2Id] = useState('')
  
  const [showTerminerMatch, setShowTerminerMatch] = useState(false)
  const [showMatchButeurs, setShowMatchButeurs] = useState(false)
  const [matchATerminer, setMatchATerminer] = useState<Match | null>(null)
  const [matchAButeurs, setMatchAButeurs] = useState<Match | null>(null)
  const [score1, setScore1] = useState('')
  const [score2, setScore2] = useState('')
  
  const [showSupprimerEquipe, setShowSupprimerEquipe] = useState(false)
  const [equipeASupprimer, setEquipeASupprimer] = useState<Equipe | null>(null)
  const [showSupprimerTousMatchs, setShowSupprimerTousMatchs] = useState(false)
  const [showResetTournoi, setShowResetTournoi] = useState(false)

  useEffect(() => {
    if (authenticated) {
      chargerDonnees()
    }
  }, [authenticated])

  const chargerDonnees = async () => {
    const [equipesData, matchsData, classementParGroupeData, groupesData, buteursData, statusData] = await Promise.all([
      getEquipes(),
      getMatchs(),
      getClassementParGroupe(),
      getGroupes(),
      getMeilleursButeurs(),
      verifierMatchsGroupesTermines()
    ])
    setEquipes(equipesData)
    setMatchs(matchsData)
    setClassementParGroupe(classementParGroupeData)
    setGroupes(groupesData)
    setMeilleursButeurs(buteursData)
    setStatusMatchsGroupes(statusData)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      
      if (response.ok) {
        setAuthenticated(true)
        setMessage({ type: 'success', text: 'Acceso concedido' })
      } else {
        setMessage({ type: 'error', text: 'Contraseña incorrecta' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' })
    }
    
    setLoading(false)
  }

  const handleCreerMatch = async () => {
    if (!equipe1Id || !equipe2Id) {
      setMessage({ type: 'error', text: 'Selecciona dos equipos' })
      return
    }

    setLoading(true)
    const result = await creerMatch(parseInt(equipe1Id), parseInt(equipe2Id))
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Partido creado con éxito' })
      setShowCreerMatch(false)
      setEquipe1Id('')
      setEquipe2Id('')
      chargerDonnees()
    } else {
      setMessage({ type: 'error', text: result.error || 'Error al crear partido' })
    }
    
    setLoading(false)
  }

  const handleTerminerMatch = async () => {
    if (!matchATerminer || !score1 || !score2) {
      setMessage({ type: 'error', text: 'Completa todos los campos' })
      return
    }

    setLoading(true)
    const result = await terminerMatch(matchATerminer.id, parseInt(score1), parseInt(score2))
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Partido terminado con éxito' })
      setShowTerminerMatch(false)
      setMatchATerminer(null)
      setScore1('')
      setScore2('')
      chargerDonnees()
    } else {
      setMessage({ type: 'error', text: result.error || 'Error al terminar partido' })
    }
    
    setLoading(false)
  }

  const handleSupprimerEquipe = async () => {
    if (!equipeASupprimer) {
      setMessage({ type: 'error', text: 'No se ha seleccionado ningún equipo' })
      return
    }

    setLoading(true)
    const result = await supprimerEquipe(equipeASupprimer.id)
    
    if (result.success) {
      setMessage({ type: 'success', text: `Equipo "${equipeASupprimer.nom}" eliminado con éxito` })
      setShowSupprimerEquipe(false)
      setEquipeASupprimer(null)
      chargerDonnees()
    } else {
      setMessage({ type: 'error', text: result.error || 'Error al eliminar equipo' })
    }
    
    setLoading(false)
  }

  const handleGenererGroupes = async () => {
    setLoading(true)
    const result = await genererGroupes()
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Grupos generados aleatoriamente con éxito' })
      chargerDonnees()
    } else {
      setMessage({ type: 'error', text: result.error || 'Error al generar grupos' })
    }
    
    setLoading(false)
  }

  const handleGenererMatchsGroupes = async () => {
    setLoading(true)
    const result = await genererMatchsGroupes()
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Partidos de grupos generados con éxito' })
      chargerDonnees()
    } else {
      setMessage({ type: 'error', text: result.error || 'Error al generar partidos' })
    }
    
    setLoading(false)
  }

  const handleMatchButeurs = async (matchId: number, score1: number, score2: number, buteurs1: any[], buteurs2: any[]) => {
    setLoading(true)
    const result = await terminerMatchAvecButeurs(matchId, score1, score2, buteurs1, buteurs2)
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Partido terminado con goleadores con éxito' })
      chargerDonnees()
    } else {
      setMessage({ type: 'error', text: result.error || 'Error al terminar partido' })
    }
    
    setLoading(false)
  }

  const handleSupprimerTousMatchs = async () => {
    setLoading(true)
    const result = await supprimerTousMatchs()
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Todos los partidos eliminados con éxito' })
      setShowSupprimerTousMatchs(false)
      chargerDonnees()
    } else {
      setMessage({ type: 'error', text: result.error || 'Error al eliminar partidos' })
    }
    
    setLoading(false)
  }

  const handleGenererDemiFinales = async () => {
    setLoading(true)
    const result = await genererDemiFinales()
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Semifinales generadas automáticamente con éxito' })
      chargerDonnees()
    } else {
      setMessage({ type: 'error', text: result.error || 'Error al generar semifinales' })
    }
    
    setLoading(false)
  }

  const handleResetTournoi = async () => {
    setLoading(true)
    const result = await resetTournoi()
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Tournoi complètement réinitialisé avec succès' })
      setShowResetTournoi(false)
      chargerDonnees()
    } else {
      setMessage({ type: 'error', text: result.error || 'Error al resetear el torneo' })
    }
    
    setLoading(false)
  }

  const handleGenererEquipesTest = async () => {
    setLoading(true)
    const result = await genererEquipesTest()
    
    if (result.success) {
      setMessage({ type: 'success', text: '10 équipes de test générées avec succès' })
      chargerDonnees()
    } else {
      setMessage({ type: 'error', text: result.error || 'Error al generar equipos de prueba' })
    }
    
    setLoading(false)
  }

  const handleGenererResultatsAleatoires = async () => {
    setLoading(true)
    const result = await genererResultatsAleatoires()
    
    if (result.success) {
      setMessage({ type: 'success', text: `Résultats aléatoires générés pour ${result.resultats?.length || 0} matchs` })
      chargerDonnees()
    } else {
      setMessage({ type: 'error', text: result.error || 'Error al generar resultados aleatorios' })
    }
    
    setLoading(false)
  }

  if (!authenticated) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>🔐 Acceso Administrativo</CardTitle>
          <CardDescription>
            Introduce la contraseña para acceder al panel de administración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {message && (
              <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Verificando...' : 'Acceder'}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {message && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Equipos Inscritos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipes.length}/10</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Partidos Creados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matchs.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Partidos Terminados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matchs.filter(m => m.termine).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Outils de Test */}
      {equipes.length === 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">🧪 Outils de Test</CardTitle>
            <CardDescription className="text-blue-700">
              Générez rapidement des données de test pour expérimenter avec l'application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">⚽ Équipes de Test</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Génère automatiquement 10 équipes célèbres avec leurs joueurs et entraîneurs
                </p>
                <Button 
                  onClick={handleGenererEquipesTest} 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Générant...' : 'Générer 10 Équipes de Test'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reset Tournoi */}
      {(equipes.length > 0 || matchs.length > 0) && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">⚠️ Reset Complet du Tournoi</CardTitle>
            <CardDescription className="text-red-700">
              Attention : Cette action supprimera définitivement tous les équipes, joueurs, matchs et résultats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={showResetTournoi} onOpenChange={setShowResetTournoi}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  🗑️ Reset Complet du Tournoi
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>⚠️ Confirmation de Reset Complet</DialogTitle>
                  <DialogDescription>
                    <div className="space-y-3">
                      <p className="font-semibold text-red-600">
                        Cette action est IRREVERSIBLE et supprimera :
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Tous les équipes inscrites ({equipes.length} équipes)</li>
                        <li>Tous les joueurs ({equipes.reduce((acc, e) => acc + e.joueurs.length, 0)} joueurs)</li>
                        <li>Tous les matchs ({matchs.length} matchs)</li>
                        <li>Tous les résultats et buteurs</li>
                        <li>Tous les groupes</li>
                      </ul>
                      <p className="text-red-600 font-medium">
                        Êtes-vous ABSOLUMENT sûr de vouloir continuer ?
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowResetTournoi(false)}>
                    Annuler
                  </Button>
                  <Button variant="destructive" onClick={handleResetTournoi} disabled={loading}>
                    {loading ? 'Supprimant...' : 'OUI, Reset Complet du Tournoi'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Gestión de Grupos */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 Gestión de Grupos</CardTitle>
          <CardDescription>
            Generar grupos aleatorios para el torneo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {equipes.length}/10 equipos inscritos
              </p>
              {groupes.length > 0 && (
                <p className="text-sm text-green-600">
                  ✅ Grupos generados ({groupes.length} grupos)
                </p>
              )}
            </div>
            <Button 
              onClick={handleGenererGroupes} 
              disabled={loading || equipes.length !== 10}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Generando...' : 'Generar Grupos Aleatorios'}
            </Button>
          </div>

          {groupes.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groupes.map((groupe) => (
                  <div key={groupe.id} className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-purple-700">
                      {groupe.nom} ({groupe.equipes.length} equipos)
                    </h3>
                    <div className="space-y-2">
                      {groupe.equipes.map((equipe: any) => (
                        <div key={equipe.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium">{equipe.nom}</span>
                          <Badge variant="outline" className="text-xs">
                            {equipe.joueurs.length} jugadores
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={handleGenererMatchsGroupes} 
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Generando...' : 'Generar Partidos de Grupos'}
                </Button>
                
                {matchs.filter(m => m.phase === 'grupo' && !m.termine).length > 0 && (
                  <Button 
                    onClick={handleGenererResultatsAleatoires} 
                    disabled={loading}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {loading ? 'Générant...' : '🎲 Générer Résultats Aléatoires'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Equipos */}
      <Card>
        <CardHeader>
          <CardTitle>👥 Equipos Inscritos</CardTitle>
          <CardDescription>
            Lista de todos los equipos registrados en el torneo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {equipes.map((equipe: any) => (
              <div key={equipe.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{equipe.nom}</h3>
                    <p className="text-sm text-gray-600">{equipe.pueblo}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {equipe.groupe && (
                      <Badge variant="default" className="text-xs bg-purple-600">
                        {equipe.groupe.nom}
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      {equipe.joueurs.length} personas
                    </Badge>
                    <Dialog open={showSupprimerEquipe && equipeASupprimer?.id === equipe.id} onOpenChange={(open) => {
                      if (open) {
                        setEquipeASupprimer(equipe)
                        setShowSupprimerEquipe(true)
                      } else {
                        setEquipeASupprimer(null)
                        setShowSupprimerEquipe(false)
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          Eliminar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmar Eliminación</DialogTitle>
                          <DialogDescription>
                            ¿Estás seguro de que quieres eliminar el equipo "{equipe.nom}"? Esta acción no se puede deshacer.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowSupprimerEquipe(false)}>
                            Cancelar
                          </Button>
                          <Button variant="destructive" onClick={handleSupprimerEquipe} disabled={loading}>
                            {loading ? 'Eliminando...' : 'Eliminar Equipo'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {equipe.joueurs.map((joueur: any) => (
                    <div key={joueur.id} className="flex items-center space-x-2 text-sm">
                      <span className="font-medium">{joueur.nom}</span>
                      {joueur.poste && (
                        <Badge variant="outline" className="text-xs">
                          {joueur.poste}
                        </Badge>
                      )}
                      {joueur.estCoach && (
                        <Badge variant="default" className="text-xs bg-blue-600">
                          Entrenador
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gestion des matchs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>⚽ Gestión de Partidos</CardTitle>
            <CardDescription>
              Crear nuevos partidos y gestionar los existentes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog open={showCreerMatch} onOpenChange={setShowCreerMatch}>
              <DialogTrigger asChild>
                <Button className="w-full">Crear Nuevo Partido</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Partido</DialogTitle>
                  <DialogDescription>
                    Selecciona dos equipos para crear un partido
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Equipo 1</Label>
                    <Select value={equipe1Id} onValueChange={setEquipe1Id}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar equipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipes.map((equipe: any) => (
                          <SelectItem key={equipe.id} value={equipe.id.toString()}>
                            {equipe.nom} ({equipe.pueblo})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Equipo 2</Label>
                    <Select value={equipe2Id} onValueChange={setEquipe2Id}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar equipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipes.map((equipe: any) => (
                          <SelectItem key={equipe.id} value={equipe.id.toString()}>
                            {equipe.nom} ({equipe.pueblo})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreerMatch(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreerMatch} disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Partido'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {matchs.length > 0 && (
              <Dialog open={showSupprimerTousMatchs} onOpenChange={setShowSupprimerTousMatchs}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Eliminar Todos los Partidos
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar Eliminación</DialogTitle>
                    <DialogDescription>
                      ¿Estás seguro de que quieres eliminar todos los partidos? Esta acción no se puede deshacer y eliminará todos los resultados y goleadores registrados.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowSupprimerTousMatchs(false)}>
                      Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleSupprimerTousMatchs} disabled={loading}>
                      {loading ? 'Eliminando...' : 'Eliminar Todos los Partidos'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🏆 Clasificación por Grupos</CardTitle>
            <CardDescription>
              Tabla de posiciones en tiempo real para cada grupo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {classementParGroupe.length > 0 ? (
              <div className="space-y-6">
                {classementParGroupe.map((groupe) => (
                  <div key={groupe.groupeId} className="space-y-3">
                    <h3 className="text-lg font-semibold text-purple-700 border-b pb-2">
                      {groupe.groupeNom}
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pos</TableHead>
                          <TableHead>Equipo</TableHead>
                          <TableHead>Pts</TableHead>
                          <TableHead>PJ</TableHead>
                          <TableHead>V</TableHead>
                          <TableHead>E</TableHead>
                          <TableHead>D</TableHead>
                          <TableHead>GF</TableHead>
                          <TableHead>GC</TableHead>
                          <TableHead>DG</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupe.classement.map((equipe: any, index: number) => (
                          <TableRow key={equipe.id}>
                            <TableCell className="font-bold">{index + 1}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{equipe.nom}</div>
                                <div className="text-xs text-gray-500">{equipe.pueblo}</div>
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-blue-600">{equipe.points}</TableCell>
                            <TableCell>{equipe.matchsJoues}</TableCell>
                            <TableCell className="text-green-600">{equipe.victoires}</TableCell>
                            <TableCell className="text-yellow-600">{equipe.nuls}</TableCell>
                            <TableCell className="text-red-600">{equipe.defaites}</TableCell>
                            <TableCell>{equipe.butsPour}</TableCell>
                            <TableCell>{equipe.butsContre}</TableCell>
                            <TableCell className={`font-medium ${equipe.differenceButs > 0 ? 'text-green-600' : equipe.differenceButs < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                              {equipe.differenceButs > 0 ? '+' : ''}{equipe.differenceButs}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No hay grupos generados aún</p>
                <p className="text-sm mt-2">Genera los grupos para ver las clasificaciones</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚽ Mejores Goleadores</CardTitle>
            <CardDescription>
              Top 10 de los máximos goleadores del torneo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pos</TableHead>
                  <TableHead>Jugador</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Goles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meilleursButeurs.map((buteur: any, index: number) => (
                  <TableRow key={buteur.joueur.id}>
                    <TableCell className="font-bold">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div>{buteur.joueur.nom}</div>
                        <div className="text-xs text-gray-500">{buteur.joueur.equipe.pueblo}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{buteur.joueur.equipe.nom}</div>
                        <div className="text-xs text-gray-500">{buteur.joueur.equipe.pueblo}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-green-600">{buteur.buts}</TableCell>
                  </TableRow>
                ))}
                {meilleursButeurs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No hay goles registrados aún
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Matchs de Groupes */}
      {matchs.filter(m => m.phase === 'grupo').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🏆 Partidos de Grupos</CardTitle>
            <CardDescription>
              Partidos de la fase de grupos con gestión de goleadores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Equipo 1</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Equipo 2</TableHead>
                  <TableHead>Goleadores</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matchs.filter(m => m.phase === 'grupo').map((match: any) => (
                  <TableRow key={match.id}>
                    <TableCell>
                      {new Date(match.date).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {match.equipe1.groupe?.nom || match.equipe2.groupe?.nom || 'Sin grupo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{match.equipe1.nom}</div>
                        <div className="text-xs text-gray-500">{match.equipe1.pueblo}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {match.termine ? (
                        <span className="font-bold">
                          {match.scoreEquipe1} - {match.scoreEquipe2}
                        </span>
                      ) : (
                        <span className="text-gray-500">vs</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{match.equipe2.nom}</div>
                        <div className="text-xs text-gray-500">{match.equipe2.pueblo}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {match.termine && match.buteurs.length > 0 ? (
                        <div className="text-xs space-y-1">
                          {match.buteurs.map((buteur: any) => (
                            <div key={buteur.id} className="flex items-center space-x-1">
                              <span className="font-medium">{buteur.joueur.nom}</span>
                              {buteur.minute && (
                                <span className="text-gray-500">({buteur.minute}')</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : match.termine ? (
                        <span className="text-gray-500 text-xs">Sin goleadores</span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={match.termine ? 'default' : 'secondary'}>
                        {match.termine ? 'Terminado' : 'Pendiente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setMatchAButeurs(match)
                          setShowMatchButeurs(true)
                        }}
                      >
                        {match.termine ? 'Editar' : 'Terminar'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Demi-Finales */}
      {statusMatchsGroupes?.tousTermines && (
        <Card>
          <CardHeader>
            <CardTitle>🏆 Demi-Finales</CardTitle>
            <CardDescription>
              {matchs.filter(m => m.phase === 'semifinal').length > 0 
                ? 'Semifinales generadas automáticamente según los clasificaciones de grupos'
                : 'Generar semifinales automáticamente basadas en los clasificaciones de grupos'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {matchs.filter(m => m.phase === 'semifinal').length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-600">
                    <p>✅ Todos los partidos de grupos terminados</p>
                    <p>📊 Semifinales generadas automáticamente:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>1er Grupo A vs 2do Grupo B</li>
                      <li>1er Grupo B vs 2do Grupo A</li>
                    </ul>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Semifinal</TableHead>
                      <TableHead>Equipo 1</TableHead>
                      <TableHead>Resultado</TableHead>
                      <TableHead>Equipo 2</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matchs.filter(m => m.phase === 'semifinal').map((match: any, index: number) => (
                      <TableRow key={match.id}>
                        <TableCell>
                          {new Date(match.date).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="text-xs bg-orange-600">
                            Semifinal {index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{match.equipe1.nom}</div>
                            <div className="text-xs text-gray-500">{match.equipe1.pueblo}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {match.termine ? (
                            <span className="font-bold">
                              {match.scoreEquipe1} - {match.scoreEquipe2}
                            </span>
                          ) : (
                            <span className="text-gray-500">vs</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{match.equipe2.nom}</div>
                            <div className="text-xs text-gray-500">{match.equipe2.pueblo}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={match.termine ? 'default' : 'secondary'}>
                            {match.termine ? 'Terminado' : 'Pendiente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setMatchAButeurs(match)
                              setShowMatchButeurs(true)
                            }}
                          >
                            {match.termine ? 'Editar' : 'Terminar'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">✓</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-blue-900">
                        Listo para generar semifinales
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {statusMatchsGroupes.message}
                      </p>
                      <div className="mt-3 text-xs text-blue-600">
                        <p><strong>Lógica de emparejamiento:</strong></p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>1er lugar Grupo A vs 2do lugar Grupo B</li>
                          <li>1er lugar Grupo B vs 2do lugar Grupo A</li>
                        </ul>
                        <p className="mt-2"><strong>Desempate:</strong> Puntos → Diferencia de goles → Menos goles encajados</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    onClick={handleGenererDemiFinales} 
                    disabled={loading}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {loading ? 'Generando...' : 'Generar Semifinales Automáticamente'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Autres Matchs */}
      {matchs.filter(m => m.phase !== 'grupo' && m.phase !== 'semifinal').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📋 Otros Partidos</CardTitle>
            <CardDescription>
              Partidos de otras fases del torneo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Equipo 1</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Equipo 2</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matchs.filter(m => m.phase !== 'grupo' && m.phase !== 'semifinal').map((match: any) => (
                  <TableRow key={match.id}>
                    <TableCell>
                      {new Date(match.date).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>{match.equipe1.nom}</TableCell>
                    <TableCell>
                      {match.termine ? (
                        <span className="font-bold">
                          {match.scoreEquipe1} - {match.scoreEquipe2}
                        </span>
                      ) : (
                        <span className="text-gray-500">vs</span>
                      )}
                    </TableCell>
                    <TableCell>{match.equipe2.nom}</TableCell>
                    <TableCell>
                      <Badge variant={match.termine ? 'default' : 'secondary'}>
                        {match.termine ? 'Terminado' : 'Pendiente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {!match.termine && (
                        <Dialog open={showTerminerMatch && matchATerminer?.id === match.id} onOpenChange={(open) => {
                          if (open) {
                            setMatchATerminer(match)
                            setShowTerminerMatch(true)
                          } else {
                            setMatchATerminer(null)
                            setShowTerminerMatch(false)
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              Terminar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Terminar Partido</DialogTitle>
                              <DialogDescription>
                                Introduce el resultado del partido
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div className="flex items-center space-x-4">
                                <div className="space-y-2 flex-1">
                                  <Label>{match.equipe1.nom}</Label>
                                  <Input
                                    type="number"
                                    value={score1}
                                    onChange={(e) => setScore1(e.target.value)}
                                    placeholder="0"
                                  />
                                </div>
                                <span className="text-xl font-bold">-</span>
                                <div className="space-y-2 flex-1">
                                  <Label>{match.equipe2.nom}</Label>
                                  <Input
                                    type="number"
                                    value={score2}
                                    onChange={(e) => setScore2(e.target.value)}
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setShowTerminerMatch(false)}>
                                Cancelar
                              </Button>
                              <Button onClick={handleTerminerMatch} disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Resultado'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialog pour les matchs avec buteurs */}
      <MatchButeursDialog
        match={matchAButeurs}
        open={showMatchButeurs}
        onOpenChange={setShowMatchButeurs}
        onSave={handleMatchButeurs}
        loading={loading}
      />
    </div>
  )
} 