export default function CalcoloLordoPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
                    Come viene calcolato il Lordo Annuo?
                </h1>

                <div className="space-y-6 text-gray-700">
                    <p>
                        Il <strong>Lordo Annuo</strong> è una stima del fatturato potenziale generato dall'immobile, calcolata sommando i ricavi previsti per le tre stagionalità (Alta, Media, Bassa).
                    </p>

                    <div className="bg-blue-50 p-6 rounded-md border border-blue-100">
                        <h2 className="text-lg font-bold text-blue-900 mb-4">La Formula</h2>
                        <p className="font-mono text-sm bg-white p-3 rounded border border-blue-200 mb-4">
                            Lordo Annuo = (Prezzo Alta × Giorni Alta) + (Prezzo Media × Giorni Media) + (Prezzo Bassa × Giorni Bassa)
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-3">Parametri di Occupazione</h2>
                        <p className="mb-4">
                            Il calcolo si basa su una stima statistica dei giorni di occupazione per ogni stagione, derivata dai dati storici di occupazione media:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-orange-50 p-4 rounded border border-orange-100">
                                <h3 className="font-bold text-orange-800 mb-2">Alta Stagione</h3>
                                <ul className="text-sm space-y-1">
                                    <li>Giorni totali: <strong>170</strong></li>
                                    <li>Occupazione stimata: <strong>77,6%</strong></li>
                                    <li className="pt-2 border-t border-orange-200 mt-2">Giorni effettivi: <strong>132</strong></li>
                                </ul>
                            </div>

                            <div className="bg-green-50 p-4 rounded border border-green-100">
                                <h3 className="font-bold text-green-800 mb-2">Media Stagione</h3>
                                <ul className="text-sm space-y-1">
                                    <li>Giorni totali: <strong>61</strong></li>
                                    <li>Occupazione stimata: <strong>68,9%</strong></li>
                                    <li className="pt-2 border-t border-green-200 mt-2">Giorni effettivi: <strong>42</strong></li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 p-4 rounded border border-blue-100">
                                <h3 className="font-bold text-blue-800 mb-2">Bassa Stagione</h3>
                                <ul className="text-sm space-y-1">
                                    <li>Giorni totali: <strong>134</strong></li>
                                    <li>Occupazione stimata: <strong>63,4%</strong></li>
                                    <li className="pt-2 border-t border-blue-200 mt-2">Giorni effettivi: <strong>85</strong></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-md border border-purple-100">
                        <h2 className="text-lg font-bold text-purple-900 mb-4">Guadagno Ospiti Extra</h2>
                        <p className="mb-4 text-sm">
                            Il calcolo stima che nel <strong>30%</strong> delle occupazioni totali ci siano ospiti extra paganti.
                        </p>
                        <p className="font-mono text-sm bg-white p-3 rounded border border-purple-200 mb-4">
                            Guadagno Extra = Prezzo Extra Pax × (Giorni Totali Occupazione × 0,30)
                        </p>
                        <ul className="text-sm space-y-1">
                            <li>Giorni Totali Occupazione: <strong>259</strong> (132 + 42 + 85)</li>
                            <li>Incidenza Ospiti Extra: <strong>30%</strong></li>
                        </ul>
                    </div>

                    <div className="text-sm text-gray-500 italic pt-4 border-t">
                        * I giorni effettivi sono arrotondati all'intero più vicino.
                    </div>
                </div>
            </div>
        </div>
    );
}
