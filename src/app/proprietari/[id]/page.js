// src/app/proprietari/[id]/page.js
import prisma from '@/lib/db';
import Link from 'next/link';
import { aggiornaProprietario } from '@/app/actions';

export default async function DettaglioProprietario({ params }) {
  // Await params per Next.js 15
  const { id: idParam } = await params;
  const id = parseInt(idParam);

  const p = await prisma.proprietario.findUnique({
    where: { id: id },
    include: { immobili: true }
  });

  if (!p) return <div>Proprietario non trovato</div>;

  return (
    <main className="min-h-screen bg-bbro-background p-10">
      <Link href="/" className="text-bbro-element-light hover:text-bbro-element-dark text-sm font-bold tracking-wide mb-4 inline-block">← TORNA ALLA DASHBOARD</Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* COLONNA SINISTRA: FORM */}
        <div className="bg-white p-8 rounded-sm shadow-sm border-t-4 border-bbro-element-dark">
          <h1 className="text-2xl font-bold mb-6 text-bbro-element-dark">Modifica Proprietario</h1>
          
          <form action={aggiornaProprietario} className="space-y-5">
            <input type="hidden" name="id" value={p.id} />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Nome</label>
                <input name="nome" defaultValue={p.nome} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" />
              </div>
              <div>
                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Cognome</label>
                <input name="cognome" defaultValue={p.cognome} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Telefono</label>
              <input name="telefono" defaultValue={p.telefono || ''} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Email Personale</label>
              <input name="emailPersonale" defaultValue={p.emailPersonale || ''} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" />
            </div>

            <button type="submit" className="bg-bbro-element-light text-white px-4 py-3 rounded-sm hover:bg-bbro-element-dark w-full font-bold uppercase tracking-widest text-xs transition mt-4">
              Salva Modifiche
            </button>
          </form>

          {/* CREDENZIALI */}
          <div className="mt-8 bg-bbro-background p-4 rounded-sm border border-bbro-element-light/30">
            <h3 className="font-bold text-bbro-element-light text-xs uppercase tracking-widest mb-3">Credenziali Generate</h3>
            <div className="space-y-2 text-sm text-bbro-foreground">
                <p>Password: <span className="font-mono bg-white px-2 py-0.5 border border-bbro-foreground/10 text-bbro-element-dark">{p.googlePass}</span></p>
                <p>User Booking: <span className="font-mono text-bbro-element-dark">{p.bookingUser}</span></p>
            </div>
          </div>
        </div>

        {/* COLONNA DESTRA: LISTA IMMOBILI */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-bbro-element-dark">Immobili Associati</h2>
          <div className="space-y-4">
            {p.immobili.map((casa) => (
              <Link key={casa.id} href={`/immobili/${casa.id}`} className="block group">
                <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-bbro-element-light group-hover:bg-bbro-element-dark group-hover:border-bbro-element-dark transition cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg text-bbro-element-dark group-hover:text-white transition">🏠 {casa.indirizzo}</h3>
                      <p className="text-bbro-foreground text-sm group-hover:text-bbro-element-light transition">{casa.zona}</p>
                      <div className="text-xs text-bbro-foreground/60 mt-2 flex gap-3 group-hover:text-white/70">
                        <span>📐 {casa.metriQuadri || '-'} mq</span>
                        <span>🛏️ {casa.postiLetto || '-'} Posti</span>
                      </div>
                    </div>
                    <span className="text-bbro-element-light font-bold opacity-0 group-hover:opacity-100 transition">→</span>
                  </div>
                </div>
              </Link>
            ))}
            
            <button disabled className="w-full py-4 border-2 border-dashed border-bbro-element-light/30 text-bbro-element-light/50 rounded-sm uppercase text-xs font-bold tracking-widest cursor-not-allowed">
              + Aggiungi Immobile (Coming Soon)
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}