export interface Joueur {
  id: number
  nom: string
  poste: string | null
  estCoach: boolean
  equipeId: number
}

export interface Groupe {
  id: number
  nom: string
  equipes: Equipe[]
}

export interface Equipe {
  id: number
  nom: string
  whatsapp: string
  pueblo: string
  dateInscription: Date
  groupeId: number | null
  groupe: Groupe | null
  joueurs: Joueur[]
  _count?: {
    joueurs: number
  }
}

export interface Buteur {
  id: number
  joueurId: number
  matchId: number
  minute: number | null
  joueur: Joueur
}

export interface Match {
  id: number
  equipe1Id: number
  equipe2Id: number
  scoreEquipe1: number | null
  scoreEquipe2: number | null
  date: Date
  termine: boolean
  phase: string
  equipe1: Equipe
  equipe2: Equipe
  buteurs: Buteur[]
}

export interface InscriptionEquipe {
  nom: string
  whatsapp: string
  pueblo: string
  joueurs: {
    nom: string
    poste?: string
    estCoach: boolean
  }[]
} 