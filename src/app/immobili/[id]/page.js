// src/app/immobili/[id]/page.js
import prisma from '@/lib/db';
import Link from 'next/link';
import { aggiornaImmobile } from '@/app/actions';

export default async function DettaglioImmobile({ params }) {
  // --- CORREZIONE QUI SOTTO ---
  const { id: idParam } = await params;
  const id = parseInt(idParam);
  // ----------------------------

  const casa = await prisma.immobile.findUnique({
    where: { id: id },
    include: { proprietario: true }
  });

  if (!casa) return <div>Immobile non trovato</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-10 flex justify-center items-start">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Modifica Immobile</h1>
            <Link href={`/proprietari/${casa.proprietarioId}`} className="text-sm text-blue-600 hover:underline">
                Annulla e torna al proprietario
            </Link>
        </div>

        <form action={aggiornaImmobile} className="space-y-6">
            <input type="hidden" name="id" value={casa.id} />
            <input type="hidden" name="proprietarioId" value={casa.proprietarioId} />

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700">Indirizzo</label>
                    <input name="indirizzo" defaultValue={casa.indirizzo} className="w-full p-2 border rounded" />
                </div>
                
                <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700">Zona</label>
                    <input name="zona" defaultValue={casa.zona} className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700">Metri Quadri</label>
                    <input name="metriQuadri" type="number" defaultValue={casa.metriQuadri || ''} className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700">Bagni</label>
                    <input name="bagni" type="number" defaultValue={casa.bagni || ''} className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700">Camere</label>
                    <input name="camere" type="number" defaultValue={casa.camere || ''} className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700">Posti Letto Std</label>
                    <input name="postiLetto" type="number" defaultValue={casa.postiLetto || ''} className="w-full p-2 border rounded" />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700">Posti Letto Extra</label>
                    <input name="postiLettoExtra" type="number" defaultValue={casa.postiLettoExtra || ''} className="w-full p-2 border rounded" />
                </div>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 transition">
                SALVA MODIFICHE IMMOBILE
            </button>
        </form>

      </div>
    </main>
  );
}