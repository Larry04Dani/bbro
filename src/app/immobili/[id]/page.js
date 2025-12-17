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
        <main className="min-h-screen bg-bbro-background p-10 flex justify-center items-start">
            <div className="w-full max-w-2xl">

                <Link href={`/proprietari/${casa.proprietarioId}`} className="text-bbro-element-light hover:text-bbro-element-dark text-sm font-bold tracking-wide mb-4 inline-block">
                    ← TORNA AL PROPRIETARIO
                </Link>

                <div className="bg-white p-8 rounded-sm shadow-sm border-t-4 border-bbro-element-dark">

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-bbro-element-dark">Modifica Immobile</h1>
                        <Link
                            href={`/immobili/${casa.id}/profittabilita`}
                            className="bg-bbro-element-light text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-bbro-element-dark transition shadow-sm flex items-center gap-2"
                        >
                            <span>📊</span> Crea Profittabilità
                        </Link>
                    </div>

                    <form action={aggiornaImmobile} className="space-y-6">
                        <input type="hidden" name="id" value={casa.id} />
                        <input type="hidden" name="proprietarioId" value={casa.proprietarioId} />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 grid grid-cols-4 gap-4">
                                <div className="col-span-3">
                                    <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Nome Immobile</label>
                                    <input name="nome" defaultValue={casa.nome || ''} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" />
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Indirizzo</label>
                                    <input name="indirizzo" defaultValue={casa.indirizzo} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Civico</label>
                                    <input name="civico" defaultValue={casa.civico || ''} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" />
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Zona</label>
                                <input name="zona" defaultValue={casa.zona} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" />
                            </div>

                            {/* DATI CATASTALI & CIN */}
                            <div className="col-span-2 mt-2 bg-bbro-background/30 p-4 rounded-sm border border-bbro-foreground/10">
                                <h3 className="text-xs font-bold text-bbro-element-light uppercase tracking-widest mb-3">Dati Catastali & CIN</h3>

                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    <input name="foglio" defaultValue={casa.foglio || ''} className="p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark text-sm" placeholder="Foglio" />
                                    <input name="particella" defaultValue={casa.particella || ''} className="p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark text-sm" placeholder="Particella" />
                                    <input name="subalterno" defaultValue={casa.subalterno || ''} className="p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark text-sm" placeholder="Sub" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">CIN</label>
                                    <input name="CIN" defaultValue={casa.CIN || ''} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark uppercase" placeholder="Codice Identificativo Nazionale" />
                                </div>
                            </div>

                            {/* ID PORTALI */}
                            <div className="col-span-2 mt-2 bg-bbro-background/30 p-4 rounded-sm border border-bbro-foreground/10">
                                <h3 className="text-xs font-bold text-bbro-element-light uppercase tracking-widest mb-3">ID Portali</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">ID Booking</label>
                                        <input name="idBooking" defaultValue={casa.idBooking || ''} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" placeholder="Es. 123456" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">ID Airbnb</label>
                                        <input name="idAirbnb" defaultValue={casa.idAirbnb || ''} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" placeholder="Es. 1234567890" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">ID CiaoBooking</label>
                                        <input name="idCiaoBooking" defaultValue={casa.idCiaoBooking || ''} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" placeholder="Es. 123" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Metri Quadri</label>
                                <input name="metriQuadri" type="number" defaultValue={casa.metriQuadri || ''} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Bagni</label>
                                <input name="bagni" type="number" defaultValue={casa.bagni || ''} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Camere</label>
                                <input name="camere" type="number" defaultValue={casa.camere || ''} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Posti Letto Std</label>
                                <input name="postiLetto" type="number" defaultValue={casa.postiLetto || ''} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Posti Letto Extra</label>
                                <input name="postiLettoExtra" type="number" defaultValue={casa.postiLettoExtra || ''} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark" />
                            </div>
                        </div>

                        <button type="submit" className="bg-bbro-element-light text-white px-4 py-3 rounded-sm hover:bg-bbro-element-dark w-full font-bold uppercase tracking-widest text-xs transition mt-4">
                            SALVA MODIFICHE IMMOBILE
                        </button>
                    </form>

                </div>
            </div>
        </main>
    );
}