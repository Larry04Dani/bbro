// src/app/nuovo/page.js
import { creaProprietario } from '../actions';
import Link from 'next/link';

export default function NuovoProprietario() {
  return (
    <main className="min-h-screen bg-bbro-background p-10 flex justify-center items-start">
      <div className="w-full max-w-md">

        <Link href="/" className="text-bbro-element-light hover:text-bbro-element-dark text-sm font-bold tracking-wide mb-4 inline-block">
          ← TORNA ALLA DASHBOARD
        </Link>

        <div className="bg-white p-8 rounded-sm shadow-sm border-t-4 border-bbro-element-dark">
          <h1 className="text-2xl font-bold mb-6 text-bbro-element-dark">Nuovo Proprietario</h1>

          <form action={creaProprietario} className="space-y-5">

            {/* Dati Proprietario */}
            <div>
              <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Nome</label>
              <input name="nome" type="text" required className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" placeholder="Es. Mario" />
            </div>

            <div>
              <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Cognome</label>
              <input name="cognome" type="text" required className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" placeholder="Es. Rossi" />
            </div>

            <hr className="my-6 border-bbro-element-light/30" />
            <p className="text-xs text-bbro-element-light font-bold uppercase tracking-widest mb-4">Dati Prima Casa (per generare password)</p>

            {/* Dati Casa */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Indirizzo</label>
                <input name="indirizzo" type="text" required className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" placeholder="Es. Via Roma 10" />
                <p className="text-[10px] text-gray-400 mt-1">Il numero civico verrà rilevato automaticamente se presente</p>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Zona (ex Città)</label>
                <input name="zona" type="text" required className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" placeholder="Es. Centro Storico / Milano" />
              </div>

              {/* NUOVI CAMPI NUMERICI */}
              <div>
                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Metri Quadri</label>
                <input name="metriQuadri" type="number" className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" placeholder="mq" />
              </div>

              <div>
                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Bagni</label>
                <input name="bagni" type="number" className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" placeholder="N°" />
              </div>

              <div>
                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Camere Letto</label>
                <input name="camere" type="number" className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" placeholder="N°" />
              </div>

              <div>
                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Posti Letto Std</label>
                <input name="postiLetto" type="number" className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" placeholder="N°" />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Posti Extra (Divano letto)</label>
                <input name="postiLettoExtra" type="number" className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" placeholder="N°" />
              </div>
            </div>

            <button type="submit" className="bg-bbro-element-light text-white px-4 py-3 rounded-sm hover:bg-bbro-element-dark w-full font-bold uppercase tracking-widest text-xs transition mt-6">
              SALVA TUTTO
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}