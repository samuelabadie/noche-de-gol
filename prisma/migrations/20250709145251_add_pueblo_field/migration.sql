/*
  Warnings:

  - Added the required column `pueblo` to the `Equipe` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Equipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "pueblo" TEXT NOT NULL,
    "dateInscription" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupeId" INTEGER,
    CONSTRAINT "Equipe_groupeId_fkey" FOREIGN KEY ("groupeId") REFERENCES "Groupe" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Equipe" ("dateInscription", "groupeId", "id", "nom", "whatsapp") SELECT "dateInscription", "groupeId", "id", "nom", "whatsapp" FROM "Equipe";
DROP TABLE "Equipe";
ALTER TABLE "new_Equipe" RENAME TO "Equipe";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
