'use server'

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'
import { InscriptionEquipe } from '@/types'

export async function inscrireEquipe(data: InscriptionEquipe) {
  try {
    // Vérifier le nombre maximum d'équipes
    const nombreEquipes = await prisma.equipe.count()
    if (nombreEquipes >= 10) {
      throw new Error('Se ha alcanzado el número máximo de equipos (10)')
    }

    // Vérifier le nombre de joueurs
    if (data.joueurs.length > 10) {
      throw new Error('Máximo 10 personas por equipo')
    }

    if (data.joueurs.length < 6) {
      throw new Error('Mínimo 6 personas por equipo (5 jugadores + 1 entrenador)')
    }

    // Vérifier qu'il y a exactement un coach
    const coaches = data.joueurs.filter(j => j.estCoach)
    if (coaches.length !== 1) {
      throw new Error('Debe haber exactamente un entrenador por equipo')
    }

    // Vérifier qu'il y a au moins 5 joueurs (non-coach)
    const joueursNonCoach = data.joueurs.filter(j => !j.estCoach)
    if (joueursNonCoach.length < 5) {
      throw new Error('Debe haber al menos 5 jugadores por equipo')
    }

    // Créer l'équipe et les joueurs
    const equipe = await prisma.equipe.create({
      data: {
        nom: data.nom,
        whatsapp: data.whatsapp,
        pueblo: data.pueblo,
        joueurs: {
          create: data.joueurs.map(joueur => ({
            nom: joueur.nom,
            poste: joueur.poste,
            estCoach: joueur.estCoach
          }))
        }
      },
      include: {
        joueurs: true
      }
    })

    revalidatePath('/')
    return { success: true, equipe }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

export async function getEquipes() {
  try {
    const equipes = await prisma.equipe.findMany({
      include: {
        joueurs: true,
        _count: {
          select: {
            joueurs: true
          }
        }
      },
      orderBy: {
        dateInscription: 'asc'
      }
    })
    return equipes
  } catch (error) {
    console.error('Error al obtener equipos:', error)
    return []
  }
}

export async function getMatchs() {
  try {
    const matchs = await prisma.match.findMany({
      include: {
        equipe1: {
          include: {
            joueurs: true,
            groupe: true
          }
        },
        equipe2: {
          include: {
            joueurs: true,
            groupe: true
          }
        },
        buteurs: {
          include: {
            joueur: {
              include: {
                equipe: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })
    return matchs
  } catch (error) {
    console.error('Error al obtener partidos:', error)
    return []
  }
}

export async function creerMatch(equipe1Id: number, equipe2Id: number) {
  try {
    if (equipe1Id === equipe2Id) {
      throw new Error('No se puede crear un partido entre el mismo equipo')
    }

    const match = await prisma.match.create({
      data: {
        equipe1Id,
        equipe2Id
      },
      include: {
        equipe1: true,
        equipe2: true
      }
    })

    revalidatePath('/admin')
    return { success: true, match }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

export async function terminerMatch(matchId: number, scoreEquipe1: number, scoreEquipe2: number) {
  try {
    const match = await prisma.match.update({
      where: { id: matchId },
      data: {
        scoreEquipe1,
        scoreEquipe2,
        termine: true
      },
      include: {
        equipe1: true,
        equipe2: true
      }
    })

    revalidatePath('/admin')
    return { success: true, match }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

export async function getClassement() {
  try {
    const equipes = await prisma.equipe.findMany({
      include: {
        matchsEquipe1: {
          where: { termine: true }
        },
        matchsEquipe2: {
          where: { termine: true }
        },
        groupe: true
      }
    })

    const classement = equipes.map(equipe => {
      const matchsJoues = [...equipe.matchsEquipe1, ...equipe.matchsEquipe2]
      let points = 0
      let victoires = 0
      let nuls = 0
      let defaites = 0
      let butsPour = 0
      let butsContre = 0

      matchsJoues.forEach(match => {
        const estEquipe1 = match.equipe1Id === equipe.id
        const scoreEquipe = estEquipe1 ? match.scoreEquipe1! : match.scoreEquipe2!
        const scoreAdversaire = estEquipe1 ? match.scoreEquipe2! : match.scoreEquipe1!

        butsPour += scoreEquipe
        butsContre += scoreAdversaire

        if (scoreEquipe > scoreAdversaire) {
          points += 3
          victoires++
        } else if (scoreEquipe === scoreAdversaire) {
          points += 1
          nuls++
        } else {
          defaites++
        }
      })

      return {
        id: equipe.id,
        nom: equipe.nom,
        groupeId: equipe.groupeId,
        groupeNom: equipe.groupe?.nom || 'Sin grupo',
        points,
        matchsJoues: matchsJoues.length,
        victoires,
        nuls,
        defaites,
        butsPour,
        butsContre,
        differenceButs: butsPour - butsContre
      }
    })

    return classement.sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points
      if (a.differenceButs !== b.differenceButs) return b.differenceButs - a.differenceButs
      return b.butsPour - a.butsPour
    })
  } catch (error) {
    console.error('Error al obtener clasificación:', error)
    return []
  }
}

export async function getClassementParGroupe() {
  try {
    const equipes = await prisma.equipe.findMany({
      include: {
        matchsEquipe1: {
          where: { termine: true, phase: 'grupo' }
        },
        matchsEquipe2: {
          where: { termine: true, phase: 'grupo' }
        },
        groupe: true
      }
    })

    // Grouper les équipes par groupe
    const equipesParGroupe = equipes.reduce((acc, equipe) => {
      const groupeId = equipe.groupeId || 'sans-groupe'
      if (!acc[groupeId]) {
        acc[groupeId] = {
          groupeId,
          groupeNom: equipe.groupe?.nom || 'Sin grupo',
          equipes: []
        }
      }
      acc[groupeId].equipes.push(equipe)
      return acc
    }, {} as Record<string, { groupeId: string | number, groupeNom: string, equipes: any[] }>)

    // Calculer le classement pour chaque groupe
    const classements = Object.values(equipesParGroupe).map(groupe => {
      const classement = groupe.equipes.map(equipe => {
        const matchsJoues = [...equipe.matchsEquipe1, ...equipe.matchsEquipe2]
        let points = 0
        let victoires = 0
        let nuls = 0
        let defaites = 0
        let butsPour = 0
        let butsContre = 0

        matchsJoues.forEach(match => {
          const estEquipe1 = match.equipe1Id === equipe.id
          const scoreEquipe = estEquipe1 ? match.scoreEquipe1! : match.scoreEquipe2!
          const scoreAdversaire = estEquipe1 ? match.scoreEquipe2! : match.scoreEquipe1!

          butsPour += scoreEquipe
          butsContre += scoreAdversaire

          if (scoreEquipe > scoreAdversaire) {
            points += 3
            victoires++
          } else if (scoreEquipe === scoreAdversaire) {
            points += 1
            nuls++
          } else {
            defaites++
          }
        })

        return {
          id: equipe.id,
          nom: equipe.nom,
          points,
          matchsJoues: matchsJoues.length,
          victoires,
          nuls,
          defaites,
          butsPour,
          butsContre,
          differenceButs: butsPour - butsContre
        }
      })

      return {
        groupeId: groupe.groupeId,
        groupeNom: groupe.groupeNom,
        classement: classement.sort((a, b) => {
          if (a.points !== b.points) return b.points - a.points
          if (a.differenceButs !== b.differenceButs) return b.differenceButs - a.differenceButs
          return b.butsPour - a.butsPour
        })
      }
    })

    return classements
  } catch (error) {
    console.error('Error al obtener clasificación por grupos:', error)
    return []
  }
}

export async function supprimerEquipe(equipeId: number) {
  try {
    // Vérifier si l'équipe a des matchs
    const matchs = await prisma.match.findMany({
      where: {
        OR: [
          { equipe1Id: equipeId },
          { equipe2Id: equipeId }
        ]
      }
    })

    if (matchs.length > 0) {
      throw new Error('No se puede eliminar un equipo que ya tiene partidos programados')
    }

    // Supprimer d'abord tous les joueurs de l'équipe
    await prisma.joueur.deleteMany({
      where: { equipeId: equipeId }
    })

    // Puis supprimer l'équipe
    await prisma.equipe.delete({
      where: { id: equipeId }
    })

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

export async function genererGroupes() {
  try {
    // Vérifier qu'il y a exactement 10 équipes
    const equipes = await prisma.equipe.findMany()
    if (equipes.length !== 10) {
      throw new Error(`Se necesitan exactamente 10 equipos. Actualmente hay ${equipes.length}`)
    }

    // Supprimer les groupes existants
    await prisma.groupe.deleteMany()

    // Créer les deux groupes
    const groupeA = await prisma.groupe.create({
      data: { nom: "Grupo A" }
    })

    const groupeB = await prisma.groupe.create({
      data: { nom: "Grupo B" }
    })

    // Mélanger aléatoirement les équipes
    const equipesMelangees = [...equipes].sort(() => Math.random() - 0.5)

    // Assigner les 5 premières équipes au groupe A
    for (let i = 0; i < 5; i++) {
      await prisma.equipe.update({
        where: { id: equipesMelangees[i].id },
        data: { groupeId: groupeA.id }
      })
    }

    // Assigner les 5 dernières équipes au groupe B
    for (let i = 5; i < 10; i++) {
      await prisma.equipe.update({
        where: { id: equipesMelangees[i].id },
        data: { groupeId: groupeB.id }
      })
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

export async function getGroupes() {
  try {
    const groupes = await prisma.groupe.findMany({
      include: {
        equipes: {
          include: {
            joueurs: true,
            _count: {
              select: {
                joueurs: true
              }
            }
          }
        }
      },
      orderBy: {
        nom: 'asc'
      }
    })
    return groupes
  } catch (error) {
    console.error('Error al obtener grupos:', error)
    return []
  }
}

export async function genererMatchsGroupes() {
  try {
    const groupes = await prisma.groupe.findMany({
      include: {
        equipes: true
      }
    })

    if (groupes.length !== 2) {
      throw new Error('Se necesitan exactamente 2 grupos para generar partidos')
    }

    // Supprimer les matchs de groupes existants
    await prisma.match.deleteMany({
      where: { phase: 'grupo' }
    })

    const matchs = []
    const groupeA = groupes.find(g => g.nom === 'Grupo A')
    const groupeB = groupes.find(g => g.nom === 'Grupo B')

    if (!groupeA || !groupeB) {
      throw new Error('No se encontraron los grupos A y B')
    }

    // Générer tous les matchs possibles dans chaque groupe
    const matchsGroupeA = []
    const matchsGroupeB = []

    // Matchs du groupe A
    for (let i = 0; i < groupeA.equipes.length; i++) {
      for (let j = i + 1; j < groupeA.equipes.length; j++) {
        matchsGroupeA.push({
          equipe1Id: groupeA.equipes[i].id,
          equipe2Id: groupeA.equipes[j].id
        })
      }
    }

    // Matchs du groupe B
    for (let i = 0; i < groupeB.equipes.length; i++) {
      for (let j = i + 1; j < groupeB.equipes.length; j++) {
        matchsGroupeB.push({
          equipe1Id: groupeB.equipes[i].id,
          equipe2Id: groupeB.equipes[j].id
        })
      }
    }

    // Alterner entre les groupes pour créer les matchs
    const maxMatchs = Math.max(matchsGroupeA.length, matchsGroupeB.length)
    
    for (let i = 0; i < maxMatchs; i++) {
      // Commencer par le groupe A
      if (i < matchsGroupeA.length) {
        const match = await prisma.match.create({
          data: {
            ...matchsGroupeA[i],
            phase: 'grupo'
          }
        })
        matchs.push(match)
      }
      
      // Puis le groupe B
      if (i < matchsGroupeB.length) {
        const match = await prisma.match.create({
          data: {
            ...matchsGroupeB[i],
            phase: 'grupo'
          }
        })
        matchs.push(match)
      }
    }

    revalidatePath('/admin')
    return { success: true, matchs }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

export async function terminerMatchAvecButeurs(
  matchId: number, 
  scoreEquipe1: number, 
  scoreEquipe2: number,
  buteursEquipe1: { joueurId: number, minute?: number }[],
  buteursEquipe2: { joueurId: number, minute?: number }[]
) {
  try {
    // Mettre à jour le match
    await prisma.match.update({
      where: { id: matchId },
      data: {
        scoreEquipe1,
        scoreEquipe2,
        termine: true
      }
    })

    // Supprimer les buteurs existants
    await prisma.buteur.deleteMany({
      where: { matchId }
    })

    // Ajouter les nouveaux buteurs
    const tousButeurs = [
      ...buteursEquipe1.map(b => ({ ...b, equipe: 1 })),
      ...buteursEquipe2.map(b => ({ ...b, equipe: 2 }))
    ]

    for (const buteur of tousButeurs) {
      await prisma.buteur.create({
        data: {
          joueurId: buteur.joueurId,
          matchId: matchId,
          minute: buteur.minute
        }
      })
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

export async function getMeilleursButeurs() {
  try {
    const buteurs = await prisma.buteur.groupBy({
      by: ['joueurId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    })

    const buteursAvecDetails = await Promise.all(
      buteurs.map(async (buteur) => {
        const joueur = await prisma.joueur.findUnique({
          where: { id: buteur.joueurId },
          include: {
            equipe: true
          }
        })
        return {
          joueur,
          buts: buteur._count.id
        }
      })
    )

    return buteursAvecDetails.filter(b => b.joueur !== null)
  } catch (error) {
    console.error('Error al obtener mejores goleadores:', error)
    return []
  }
}

export async function supprimerTousMatchs() {
  try {
    // Supprimer d'abord tous les buteurs (car ils référencent les matchs)
    await prisma.buteur.deleteMany()
    
    // Puis supprimer tous les matchs
    await prisma.match.deleteMany()
    
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

export async function genererDemiFinales() {
  try {
    // Vérifier que tous les matchs de groupes sont terminés
    const matchsGroupes = await prisma.match.findMany({
      where: { phase: 'grupo' }
    })

    const matchsGroupesTermines = matchsGroupes.filter(m => m.termine)
    
    if (matchsGroupesTermines.length !== matchsGroupes.length) {
      throw new Error('Todos los partidos de grupos deben estar terminados para generar las semifinales')
    }

    // Obtenir les classements par groupe
    const classementsParGroupe = await getClassementParGroupe()
    
    if (classementsParGroupe.length !== 2) {
      throw new Error('Se necesitan exactamente 2 grupos para generar las semifinales')
    }

    // Supprimer les demi-finales existantes
    await prisma.match.deleteMany({
      where: { phase: 'semifinal' }
    })

    const demiFinales = []

    // Générer les demi-finales selon la logique :
    // 1er Groupe A vs 2ème Groupe B
    // 1er Groupe B vs 2ème Groupe A
    
    const groupeA = classementsParGroupe.find(g => g.groupeNom === 'Grupo A')
    const groupeB = classementsParGroupe.find(g => g.groupeNom === 'Grupo B')

    if (!groupeA || !groupeB || groupeA.classement.length < 2 || groupeB.classement.length < 2) {
      throw new Error('Cada grupo debe tener al menos 2 equipos para generar las semifinales')
    }

    // Demi-finale 1: 1er Groupe A vs 2ème Groupe B
    const demiFinale1 = await prisma.match.create({
      data: {
        equipe1Id: groupeA.classement[0].id,
        equipe2Id: groupeB.classement[1].id,
        phase: 'semifinal'
      }
    })
    demiFinales.push(demiFinale1)

    // Demi-finale 2: 1er Groupe B vs 2ème Groupe A
    const demiFinale2 = await prisma.match.create({
      data: {
        equipe1Id: groupeB.classement[0].id,
        equipe2Id: groupeA.classement[1].id,
        phase: 'semifinal'
      }
    })
    demiFinales.push(demiFinale2)

    revalidatePath('/admin')
    return { success: true, demiFinales }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

export async function verifierMatchsGroupesTermines() {
  try {
    const matchsGroupes = await prisma.match.findMany({
      where: { phase: 'grupo' }
    })

    if (matchsGroupes.length === 0) {
      return { tousTermines: false, message: 'No hay partidos de grupos generados' }
    }

    const matchsTermines = matchsGroupes.filter(m => m.termine)
    const tousTermines = matchsTermines.length === matchsGroupes.length

    return { 
      tousTermines, 
      matchsTotal: matchsGroupes.length,
      matchsTermines: matchsTermines.length,
      message: tousTermines 
        ? 'Todos los partidos de grupos están terminados' 
        : `${matchsTermines.length}/${matchsGroupes.length} partidos terminados`
    }
  } catch (error) {
    return { tousTermines: false, message: 'Error al verificar partidos' }
  }
}

export async function resetTournoi() {
  try {
    // Supprimer dans l'ordre pour respecter les contraintes de clés étrangères
    // 1. Supprimer tous les buteurs
    await prisma.buteur.deleteMany()
    
    // 2. Supprimer tous les matchs
    await prisma.match.deleteMany()
    
    // 3. Supprimer tous les joueurs
    await prisma.joueur.deleteMany()
    
    // 4. Supprimer tous les groupes
    await prisma.groupe.deleteMany()
    
    // 5. Supprimer toutes les équipes
    await prisma.equipe.deleteMany()
    
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

export async function genererEquipesTest() {
  try {
    // Vérifier qu'il n'y a pas déjà des équipes
    const equipesExistantes = await prisma.equipe.findMany()
    if (equipesExistantes.length > 0) {
      throw new Error('Ya hay equipos inscritos. No se pueden generar equipos de prueba.')
    }

    const equipesTest = [
      {
        nom: "Real Madrid",
        joueurs: [
          { nom: "Vinicius Jr", poste: "Delantero", estCoach: false },
          { nom: "Bellingham", poste: "Centrocampista", estCoach: false },
          { nom: "Modric", poste: "Centrocampista", estCoach: false },
          { nom: "Alaba", poste: "Defensa", estCoach: false },
          { nom: "Carlo Ancelotti", poste: "Entrenador", estCoach: true }
        ]
      },
      {
        nom: "Barcelona",
        joueurs: [
          { nom: "Lewandowski", poste: "Delantero", estCoach: false },
          { nom: "De Jong", poste: "Centrocampista", estCoach: false },
          { nom: "Gavi", poste: "Centrocampista", estCoach: false },
          { nom: "Koundé", poste: "Defensa", estCoach: false },
          { nom: "Xavi Hernández", poste: "Entrenador", estCoach: true }
        ]
      },
      {
        nom: "Manchester City",
        joueurs: [
          { nom: "Haaland", poste: "Delantero", estCoach: false },
          { nom: "De Bruyne", poste: "Centrocampista", estCoach: false },
          { nom: "Foden", poste: "Centrocampista", estCoach: false },
          { nom: "Dias", poste: "Defensa", estCoach: false },
          { nom: "Pep Guardiola", poste: "Entrenador", estCoach: true }
        ]
      },
      {
        nom: "Bayern Munich",
        joueurs: [
          { nom: "Kane", poste: "Delantero", estCoach: false },
          { nom: "Musiala", poste: "Centrocampista", estCoach: false },
          { nom: "Kimmich", poste: "Centrocampista", estCoach: false },
          { nom: "Upamecano", poste: "Defensa", estCoach: false },
          { nom: "Thomas Tuchel", poste: "Entrenador", estCoach: true }
        ]
      },
      {
        nom: "PSG",
        joueurs: [
          { nom: "Mbappé", poste: "Delantero", estCoach: false },
          { nom: "Vitinha", poste: "Centrocampista", estCoach: false },
          { nom: "Zaire-Emery", poste: "Centrocampista", estCoach: false },
          { nom: "Marquinhos", poste: "Defensa", estCoach: false },
          { nom: "Luis Enrique", poste: "Entrenador", estCoach: true }
        ]
      },
      {
        nom: "Liverpool",
        joueurs: [
          { nom: "Salah", poste: "Delantero", estCoach: false },
          { nom: "Mac Allister", poste: "Centrocampista", estCoach: false },
          { nom: "Szoboszlai", poste: "Centrocampista", estCoach: false },
          { nom: "Van Dijk", poste: "Defensa", estCoach: false },
          { nom: "Jürgen Klopp", poste: "Entrenador", estCoach: true }
        ]
      },
      {
        nom: "Arsenal",
        joueurs: [
          { nom: "Saka", poste: "Delantero", estCoach: false },
          { nom: "Ødegaard", poste: "Centrocampista", estCoach: false },
          { nom: "Rice", poste: "Centrocampista", estCoach: false },
          { nom: "Saliba", poste: "Defensa", estCoach: false },
          { nom: "Mikel Arteta", poste: "Entrenador", estCoach: true }
        ]
      },
      {
        nom: "Inter Milan",
        joueurs: [
          { nom: "Lautaro", poste: "Delantero", estCoach: false },
          { nom: "Barella", poste: "Centrocampista", estCoach: false },
          { nom: "Calhanoglu", poste: "Centrocampista", estCoach: false },
          { nom: "Bastoni", poste: "Defensa", estCoach: false },
          { nom: "Simone Inzaghi", poste: "Entrenador", estCoach: true }
        ]
      },
      {
        nom: "AC Milan",
        joueurs: [
          { nom: "Leão", poste: "Delantero", estCoach: false },
          { nom: "Reijnders", poste: "Centrocampista", estCoach: false },
          { nom: "Loftus-Cheek", poste: "Centrocampista", estCoach: false },
          { nom: "Tomori", poste: "Defensa", estCoach: false },
          { nom: "Stefano Pioli", poste: "Entrenador", estCoach: true }
        ]
      },
      {
        nom: "Atlético Madrid",
        joueurs: [
          { nom: "Griezmann", poste: "Delantero", estCoach: false },
          { nom: "De Paul", poste: "Centrocampista", estCoach: false },
          { nom: "Koke", poste: "Centrocampista", estCoach: false },
          { nom: "Giménez", poste: "Defensa", estCoach: false },
          { nom: "Diego Simeone", poste: "Entrenador", estCoach: true }
        ]
      }
    ]

    // Créer les équipes et leurs joueurs
    for (const equipeData of equipesTest) {
      const equipe = await prisma.equipe.create({
        data: {
          nom: equipeData.nom
        }
      })

      for (const joueurData of equipeData.joueurs) {
        await prisma.joueur.create({
          data: {
            nom: joueurData.nom,
            poste: joueurData.poste,
            estCoach: joueurData.estCoach,
            equipeId: equipe.id
          }
        })
      }
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error generating test teams:', error)
    return { success: false, error: 'Error desconocido' }
  }
}

export async function genererResultatsAleatoires() {
  try {
    // Récupérer tous les matchs de groupes non terminés
    const matchsGroupes = await prisma.match.findMany({
      where: { 
        phase: 'grupo',
        termine: false
      },
      include: {
        equipe1: {
          include: {
            joueurs: true
          }
        },
        equipe2: {
          include: {
            joueurs: true
          }
        }
      }
    })

    if (matchsGroupes.length === 0) {
      throw new Error('No hay partidos de grupos pendientes para generar resultados')
    }

    const resultats = []

    for (const match of matchsGroupes) {
      // Générer des scores aléatoires (0-4 buts par équipe)
      const score1 = Math.floor(Math.random() * 5)
      const score2 = Math.floor(Math.random() * 5)

      // Générer des buteurs aléatoires
      const buteurs1 = []
      const buteurs2 = []

      // Buteurs pour l'équipe 1
      for (let i = 0; i < score1; i++) {
        const joueursDisponibles = match.equipe1.joueurs.filter(j => !j.estCoach)
        if (joueursDisponibles.length > 0) {
          const joueurAleatoire = joueursDisponibles[Math.floor(Math.random() * joueursDisponibles.length)]
          const minute = Math.floor(Math.random() * 90) + 1
          buteurs1.push({
            joueurId: joueurAleatoire.id,
            minute: minute
          })
        }
      }

      // Buteurs pour l'équipe 2
      for (let i = 0; i < score2; i++) {
        const joueursDisponibles = match.equipe2.joueurs.filter(j => !j.estCoach)
        if (joueursDisponibles.length > 0) {
          const joueurAleatoire = joueursDisponibles[Math.floor(Math.random() * joueursDisponibles.length)]
          const minute = Math.floor(Math.random() * 90) + 1
          buteurs2.push({
            joueurId: joueurAleatoire.id,
            minute: minute
          })
        }
      }

      // Terminer le match avec les résultats générés
      const resultat = await terminerMatchAvecButeurs(
        match.id,
        score1,
        score2,
        buteurs1,
        buteurs2
      )

      if (resultat.success) {
        resultats.push({
          matchId: match.id,
          equipe1: match.equipe1.nom,
          equipe2: match.equipe2.nom,
          score: `${score1}-${score2}`,
          buteurs1: buteurs1.length,
          buteurs2: buteurs2.length
        })
      }
    }

    revalidatePath('/admin')
    return { success: true, resultats }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
} 