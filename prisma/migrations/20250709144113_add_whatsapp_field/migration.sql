-- CreateTable
CREATE TABLE "Equipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "dateInscription" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupeId" INTEGER,
    CONSTRAINT "Equipe_groupeId_fkey" FOREIGN KEY ("groupeId") REFERENCES "Groupe" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Groupe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Joueur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "poste" TEXT,
    "estCoach" BOOLEAN NOT NULL DEFAULT false,
    "equipeId" INTEGER NOT NULL,
    CONSTRAINT "Joueur_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "equipe1Id" INTEGER NOT NULL,
    "equipe2Id" INTEGER NOT NULL,
    "scoreEquipe1" INTEGER,
    "scoreEquipe2" INTEGER,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "termine" BOOLEAN NOT NULL DEFAULT false,
    "phase" TEXT NOT NULL DEFAULT 'grupo',
    CONSTRAINT "Match_equipe1Id_fkey" FOREIGN KEY ("equipe1Id") REFERENCES "Equipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_equipe2Id_fkey" FOREIGN KEY ("equipe2Id") REFERENCES "Equipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Buteur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "joueurId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "minute" INTEGER,
    CONSTRAINT "Buteur_joueurId_fkey" FOREIGN KEY ("joueurId") REFERENCES "Joueur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Buteur_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
