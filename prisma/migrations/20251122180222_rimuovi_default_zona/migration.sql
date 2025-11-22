/*
  Warnings:

  - You are about to drop the column `citta` on the `Immobile` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Immobile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "indirizzo" TEXT NOT NULL,
    "zona" TEXT NOT NULL DEFAULT 'Da Aggiornare',
    "metriQuadri" INTEGER,
    "postiLetto" INTEGER,
    "postiLettoExtra" INTEGER,
    "camere" INTEGER,
    "bagni" INTEGER,
    "proprietarioId" INTEGER NOT NULL,
    CONSTRAINT "Immobile_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "Proprietario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Immobile" ("id", "indirizzo", "proprietarioId") SELECT "id", "indirizzo", "proprietarioId" FROM "Immobile";
DROP TABLE "Immobile";
ALTER TABLE "new_Immobile" RENAME TO "Immobile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
