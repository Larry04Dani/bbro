-- AlterTable
ALTER TABLE "Immobile" ADD COLUMN "CIN" TEXT;
ALTER TABLE "Immobile" ADD COLUMN "bagniAnalisi" INTEGER;
ALTER TABLE "Immobile" ADD COLUMN "camereDisponibili" INTEGER;
ALTER TABLE "Immobile" ADD COLUMN "civico" TEXT;
ALTER TABLE "Immobile" ADD COLUMN "commissione" REAL;
ALTER TABLE "Immobile" ADD COLUMN "considerazioni" TEXT;
ALTER TABLE "Immobile" ADD COLUMN "extraPax" REAL;
ALTER TABLE "Immobile" ADD COLUMN "facilities" TEXT;
ALTER TABLE "Immobile" ADD COLUMN "foglio" TEXT;
ALTER TABLE "Immobile" ADD COLUMN "guadagnoExtra" REAL;
ALTER TABLE "Immobile" ADD COLUMN "lordoAnnuo" REAL;
ALTER TABLE "Immobile" ADD COLUMN "lordoTotale" REAL;
ALTER TABLE "Immobile" ADD COLUMN "migliorieImmobiliari" TEXT;
ALTER TABLE "Immobile" ADD COLUMN "modificheStrutturali" TEXT;
ALTER TABLE "Immobile" ADD COLUMN "particella" TEXT;
ALTER TABLE "Immobile" ADD COLUMN "percAlta" REAL;
ALTER TABLE "Immobile" ADD COLUMN "percBassa" REAL;
ALTER TABLE "Immobile" ADD COLUMN "percMedia" REAL;
ALTER TABLE "Immobile" ADD COLUMN "posizionamento" TEXT;
ALTER TABLE "Immobile" ADD COLUMN "postiLettoTotaliAnalisi" INTEGER;
ALTER TABLE "Immobile" ADD COLUMN "prezzoAlta" REAL;
ALTER TABLE "Immobile" ADD COLUMN "prezzoBassa" REAL;
ALTER TABLE "Immobile" ADD COLUMN "prezzoMedia" REAL;
ALTER TABLE "Immobile" ADD COLUMN "subalterno" TEXT;
ALTER TABLE "Immobile" ADD COLUMN "tagli" TEXT;

-- AlterTable
ALTER TABLE "Proprietario" ADD COLUMN "codiceFiscale" TEXT;
