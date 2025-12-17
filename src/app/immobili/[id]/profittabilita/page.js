import prisma from '@/lib/db';
import Link from 'next/link';
import ProfitForm from './ProfitForm';

export default async function ProfittabilitaPage({ params }) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const casa = await prisma.immobile.findUnique({
        where: { id: id },
        include: { proprietario: true }
    });

    if (!casa) return <div>Immobile non trovato</div>;

    return (
        <main className="min-h-screen bg-bbro-background p-8 md:p-12 flex justify-center items-start">
            <div className="w-full max-w-2xl my-4">

                <Link href={`/immobili/${id}`} className="text-bbro-element-light hover:text-bbro-element-dark text-sm font-bold tracking-wide mb-6 inline-block">
                    ← TORNA ALL'IMMOBILE
                </Link>

                <div className="bg-white p-8 md:p-10 rounded-sm shadow-lg border-t-4 border-bbro-element-dark">

                    <h1 className="text-2xl font-bold mb-8 text-bbro-element-dark border-b border-bbro-element-light/20 pb-4">
                        Genera Analisi di Profittabilità
                    </h1>

                    <ProfitForm casa={casa} />

                </div>
            </div>
        </main>
    );
}
