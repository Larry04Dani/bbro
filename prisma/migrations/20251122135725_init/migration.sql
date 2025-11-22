-- CreateTable
CREATE TABLE "Proprietario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "telefono" TEXT,
    "emailPersonale" TEXT,
    "docIdentita" TEXT,
    "googleEmail" TEXT,
    "googlePass" TEXT,
    "bookingUser" TEXT,
    "bookingPass" TEXT,
    "airbnbUser" TEXT,
    "airbnbPass" TEXT,
    "ciaoBookingUser" TEXT,
    "ciaoBookingPass" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Immobile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "indirizzo" TEXT NOT NULL,
    "citta" TEXT NOT NULL,
    "proprietarioId" INTEGER NOT NULL,
    CONSTRAINT "Immobile_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "Proprietario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
