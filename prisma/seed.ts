import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const equipesExemple = [
  {
    nom: "Los Tigres del Barrio",
    joueurs: [
      { nom: "Carlos Rodríguez", poste: "Portero", estCoach: false },
      { nom: "Miguel Fernández", poste: "Defensa", estCoach: false },
      { nom: "Antonio López", poste: "Defensa", estCoach: false },
      { nom: "David García", poste: "Centrocampista", estCoach: false },
      { nom: "Javier Martínez", poste: "Centrocampista", estCoach: false },
      { nom: "Roberto Sánchez", poste: "Delantero", estCoach: false },
      { nom: "Manuel Jiménez", poste: null, estCoach: true }
    ]
  },
  {
    nom: "Los Leones de la Plaza",
    joueurs: [
      { nom: "Francisco Ruiz", poste: "Portero", estCoach: false },
      { nom: "José Moreno", poste: "Defensa", estCoach: false },
      { nom: "Luis González", poste: "Defensa", estCoach: false },
      { nom: "Pedro Torres", poste: "Centrocampista", estCoach: false },
      { nom: "Juan Carlos Vega", poste: "Centrocampista", estCoach: false },
      { nom: "Diego Morales", poste: "Delantero", estCoach: false },
      { nom: "Fernando Castro", poste: null, estCoach: true }
    ]
  },
  {
    nom: "Los Águilas del Pueblo",
    joueurs: [
      { nom: "Rafael Herrera", poste: "Portero", estCoach: false },
      { nom: "Alberto Mendoza", poste: "Defensa", estCoach: false },
      { nom: "Ricardo Silva", poste: "Defensa", estCoach: false },
      { nom: "Eduardo Vargas", poste: "Centrocampista", estCoach: false },
      { nom: "Héctor Rojas", poste: "Centrocampista", estCoach: false },
      { nom: "Oscar Mendoza", poste: "Delantero", estCoach: false },
      { nom: "Víctor Ortega", poste: null, estCoach: true }
    ]
  },
  {
    nom: "Los Toros de la Calle",
    joueurs: [
      { nom: "Sergio Navarro", poste: "Portero", estCoach: false },
      { nom: "Daniel Flores", poste: "Defensa", estCoach: false },
      { nom: "Andrés Romero", poste: "Defensa", estCoach: false },
      { nom: "Marcos Delgado", poste: "Centrocampista", estCoach: false },
      { nom: "Roberto Cruz", poste: "Centrocampista", estCoach: false },
      { nom: "Alejandro Méndez", poste: "Delantero", estCoach: false },
      { nom: "Guillermo Paredes", poste: null, estCoach: true }
    ]
  },
  {
    nom: "Los Lobos del Campo",
    joueurs: [
      { nom: "Felipe Ramírez", poste: "Portero", estCoach: false },
      { nom: "Cristian Soto", poste: "Defensa", estCoach: false },
      { nom: "Nicolás Valdez", poste: "Defensa", estCoach: false },
      { nom: "Sebastián Reyes", poste: "Centrocampista", estCoach: false },
      { nom: "Gabriel Luna", poste: "Centrocampista", estCoach: false },
      { nom: "Matías Fuentes", poste: "Delantero", estCoach: false },
      { nom: "Adrián Campos", poste: null, estCoach: true }
    ]
  },
  {
    nom: "Los Halcones del Parque",
    joueurs: [
      { nom: "Tomás Mendoza", poste: "Portero", estCoach: false },
      { nom: "Emilio Ríos", poste: "Defensa", estCoach: false },
      { nom: "Federico Acosta", poste: "Defensa", estCoach: false },
      { nom: "Rodrigo Miranda", poste: "Centrocampista", estCoach: false },
      { nom: "Bruno Salazar", poste: "Centrocampista", estCoach: false },
      { nom: "Leonardo Vega", poste: "Delantero", estCoach: false },
      { nom: "Maximiliano Rojas", poste: null, estCoach: true }
    ]
  },
  {
    nom: "Los Jaguares del Centro",
    joueurs: [
      { nom: "Ignacio Ponce", poste: "Portero", estCoach: false },
      { nom: "Felipe Morales", poste: "Defensa", estCoach: false },
      { nom: "Renato Figueroa", poste: "Defensa", estCoach: false },
      { nom: "Camilo Bustos", poste: "Centrocampista", estCoach: false },
      { nom: "Joaquín Tapia", poste: "Centrocampista", estCoach: false },
      { nom: "Benjamín Silva", poste: "Delantero", estCoach: false },
      { nom: "Agustín Herrera", poste: null, estCoach: true }
    ]
  },
  {
    nom: "Los Pumas del Sur",
    joueurs: [
      { nom: "Valentín Castro", poste: "Portero", estCoach: false },
      { nom: "Emiliano Torres", poste: "Defensa", estCoach: false },
      { nom: "Thiago Mendoza", poste: "Defensa", estCoach: false },
      { nom: "Luciano Ríos", poste: "Centrocampista", estCoach: false },
      { nom: "Dante Acosta", poste: "Centrocampista", estCoach: false },
      { nom: "Axel Miranda", poste: "Delantero", estCoach: false },
      { nom: "Zacarías Salazar", poste: null, estCoach: true }
    ]
  },
  {
    nom: "Los Condores del Norte",
    joueurs: [
      { nom: "Mateo Vega", poste: "Portero", estCoach: false },
      { nom: "Liam Ponce", poste: "Defensa", estCoach: false },
      { nom: "Noah Morales", poste: "Defensa", estCoach: false },
      { nom: "Ethan Figueroa", poste: "Centrocampista", estCoach: false },
      { nom: "Mason Bustos", poste: "Centrocampista", estCoach: false },
      { nom: "Logan Tapia", poste: "Delantero", estCoach: false },
      { nom: "Oliver Silva", poste: null, estCoach: true }
    ]
  }
]

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  for (const equipeData of equipesExemple) {
    try {
      const equipe = await prisma.equipe.create({
        data: {
          nom: equipeData.nom,
          joueurs: {
            create: equipeData.joueurs.map(joueur => ({
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

      console.log(`✅ Equipo "${equipe.nom}" creado con ${equipe.joueurs.length} jugadores`)
    } catch (error) {
      console.error(`❌ Error al crear equipo "${equipeData.nom}":`, error)
    }
  }

  console.log('🎉 Seed completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 