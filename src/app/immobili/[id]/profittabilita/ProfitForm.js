'use client';

import { useState, useEffect } from 'react';
import { salvaProfittabilita } from '@/app/actions';

export default function ProfitForm({ casa }) {
    // Initialize state from DB or defaults
    const [tagliItems, setTagliItems] = useState(() => {
        if (casa.tagli) {
            try {
                return JSON.parse(casa.tagli);
            } catch (e) {
                return [{ id: 1, valore: '' }];
            }
        }
        return [{ id: 1, valore: '' }];
    });

    const [facilitiesItems, setFacilitiesItems] = useState(() => {
        if (casa.facilities) {
            try {
                return JSON.parse(casa.facilities);
            } catch (e) {
                return [{ id: 1, valore: '' }];
            }
        }
        return [{ id: 1, valore: '' }];
    });

    // State for seasonal prices
    const [prezzoBassa, setPrezzoBassa] = useState(casa.prezzoBassa || '');
    const [prezzoMedia, setPrezzoMedia] = useState(casa.prezzoMedia || '');
    const [prezzoAlta, setPrezzoAlta] = useState(casa.prezzoAlta || '');
    const [extraPax, setExtraPax] = useState(casa.extraPax || '');

    // State for occupancy percentages
    const [percBassa, setPercBassa] = useState(casa.percBassa || 63.4);
    const [percMedia, setPercMedia] = useState(casa.percMedia || 68.9);
    const [percAlta, setPercAlta] = useState(casa.percAlta || 77.6);

    const [lordoAnnuo, setLordoAnnuo] = useState(casa.lordoAnnuo || '');
    const [guadagnoExtra, setGuadagnoExtra] = useState(casa.guadagnoExtra || '');
    const [lordoTotale, setLordoTotale] = useState(casa.lordoTotale || '');

    // Constants for total season days
    const TOTAL_DAYS_BASSA = 134;
    const TOTAL_DAYS_MEDIA = 61;
    const TOTAL_DAYS_ALTA = 170;
    const INCIDENZA_EXTRA = 0.30;

    const addTaglio = () => {
        const newId = Math.max(...tagliItems.map(item => item.id), 0) + 1;
        setTagliItems([...tagliItems, { id: newId, valore: '' }]);
    };

    const removeTaglio = (id) => {
        if (tagliItems.length > 1) {
            setTagliItems(tagliItems.filter(item => item.id !== id));
        }
    };

    const updateTaglio = (id, value) => {
        setTagliItems(tagliItems.map(item =>
            item.id === id ? { ...item, valore: value } : item
        ));
    };

    const addFacility = () => {
        const newId = Math.max(...facilitiesItems.map(item => item.id), 0) + 1;
        setFacilitiesItems([...facilitiesItems, { id: newId, valore: '' }]);
    };

    const removeFacility = (id) => {
        if (facilitiesItems.length > 1) {
            setFacilitiesItems(facilitiesItems.filter(item => item.id !== id));
        }
    };

    const updateFacility = (id, value) => {
        setFacilitiesItems(facilitiesItems.map(item =>
            item.id === id ? { ...item, valore: value } : item
        ));
    };

    // Calculate Lordo Annuo and Guadagno Extra whenever prices or percentages change
    const calculateTotals = (bassa, media, alta, extra, pBassa, pMedia, pAlta) => {
        const priceBassa = parseFloat(bassa) || 0;
        const priceMedia = parseFloat(media) || 0;
        const priceAlta = parseFloat(alta) || 0;
        const priceExtra = parseFloat(extra) || 0;

        const percB = parseFloat(pBassa) || 0;
        const percM = parseFloat(pMedia) || 0;
        const percA = parseFloat(pAlta) || 0;

        const daysBassa = Math.round(TOTAL_DAYS_BASSA * (percB / 100));
        const daysMedia = Math.round(TOTAL_DAYS_MEDIA * (percM / 100));
        const daysAlta = Math.round(TOTAL_DAYS_ALTA * (percA / 100));
        const totalDays = daysBassa + daysMedia + daysAlta;

        const totalLordo = (priceBassa * daysBassa) + (priceMedia * daysMedia) + (priceAlta * daysAlta);
        setLordoAnnuo(totalLordo.toFixed(2));

        const totalExtra = priceExtra * totalDays * INCIDENZA_EXTRA;
        setGuadagnoExtra(totalExtra.toFixed(2));

        const grandTotal = totalLordo + totalExtra;
        setLordoTotale(grandTotal.toFixed(2));
    };

    const handleInputChange = (setter, value, type) => {
        setter(value);

        // Use current values for other fields, but the new value for the changed field
        const currentBassa = type === 'bassa' ? value : prezzoBassa;
        const currentMedia = type === 'media' ? value : prezzoMedia;
        const currentAlta = type === 'alta' ? value : prezzoAlta;
        const currentExtra = type === 'extra' ? value : extraPax;

        const currentPercBassa = type === 'percBassa' ? value : percBassa;
        const currentPercMedia = type === 'percMedia' ? value : percMedia;
        const currentPercAlta = type === 'percAlta' ? value : percAlta;

        calculateTotals(currentBassa, currentMedia, currentAlta, currentExtra, currentPercBassa, currentPercMedia, currentPercAlta);
    };

    const handleLordoChange = (value) => {
        setLordoAnnuo(value);
        const targetLordo = parseFloat(value);

        if (!targetLordo || targetLordo <= 0) return;

        // Calculate effective days
        const daysBassa = Math.round(TOTAL_DAYS_BASSA * (percBassa / 100));
        const daysMedia = Math.round(TOTAL_DAYS_MEDIA * (percMedia / 100));
        const daysAlta = Math.round(TOTAL_DAYS_ALTA * (percAlta / 100));

        // Determine ratios
        let ratioMedia = 1.4;
        let ratioAlta = 1.9;

        const currentPriceBassa = parseFloat(prezzoBassa) || 0;
        const currentPriceMedia = parseFloat(prezzoMedia) || 0;
        const currentPriceAlta = parseFloat(prezzoAlta) || 0;

        if (currentPriceBassa > 0 && currentPriceMedia > 0 && currentPriceAlta > 0) {
            ratioMedia = currentPriceMedia / currentPriceBassa;
            ratioAlta = currentPriceAlta / currentPriceBassa;
        }

        // Calculate base price (Price Bassa)
        const denominator = daysBassa + (ratioMedia * daysMedia) + (ratioAlta * daysAlta);

        if (denominator === 0) return;

        const newPriceBassa = targetLordo / denominator;
        const newPriceMedia = newPriceBassa * ratioMedia;
        const newPriceAlta = newPriceBassa * ratioAlta;

        setPrezzoBassa(newPriceBassa.toFixed(2));
        setPrezzoMedia(newPriceMedia.toFixed(2));
        setPrezzoAlta(newPriceAlta.toFixed(2));

        // Update total immediately
        const currentExtraRevenue = parseFloat(guadagnoExtra) || 0;
        const newGrandTotal = targetLordo + currentExtraRevenue;
        setLordoTotale(newGrandTotal.toFixed(2));
    };

    const handleSaveDraft = async () => {
        const form = document.querySelector('form');
        const formData = new FormData(form);

        // Helper to get form value
        const getVal = (name) => formData.get(name) || '';

        // Determine commission value
        let commissioneVal = getVal('commissione');
        if (commissioneVal === 'custom') {
            commissioneVal = getVal('commissioneCustom');
        }

        const dataToSave = {
            id: casa.id,
            facilities: JSON.stringify(facilitiesItems),
            tagli: JSON.stringify(tagliItems),
            modificheStrutturali: getVal('modificheStrutturali'),
            migliorieImmobiliari: getVal('migliorieImmobiliari'),
            camereDisponibili: getVal('camereDisponibili'),
            bagniAnalisi: getVal('bagniAnalisi'),
            posizionamento: getVal('posizionamento'),
            postiLettoTotali: getVal('postiLettoTotali'),
            considerazioni: getVal('considerazioni'),
            commissione: commissioneVal,
            prezzoBassa, prezzoMedia, prezzoAlta, extraPax,
            percBassa, percMedia, percAlta,
            lordoAnnuo, guadagnoExtra, lordoTotale
        };

        try {
            await salvaProfittabilita(dataToSave);
            alert('Bozza salvata con successo!');
        } catch (error) {
            console.error('Errore salvataggio bozza:', error);
            alert('Errore durante il salvataggio della bozza.');
        }
    };

    const handleGeneratePDF = async (e) => {
        e.preventDefault();
        const form = e.target.closest('form');
        const formData = new FormData(form);

        // Helper to get form value
        const getVal = (name) => formData.get(name) || '';

        // Calculate days and totals again for consistency
        const pBassa = parseFloat(percBassa) || 0;
        const pMedia = parseFloat(percMedia) || 0;
        const pAlta = parseFloat(percAlta) || 0;

        const daysBassa = Math.round(TOTAL_DAYS_BASSA * (pBassa / 100));
        const daysMedia = Math.round(TOTAL_DAYS_MEDIA * (pMedia / 100));
        const daysAlta = Math.round(TOTAL_DAYS_ALTA * (pAlta / 100));
        const totalDays = daysBassa + daysMedia + daysAlta;
        const avgOccupancy = Math.round((totalDays / 365) * 100);

        // Commissione
        let commissioneVal = getVal('commissione');
        if (commissioneVal === 'custom') {
            commissioneVal = getVal('commissioneCustom');
        }
        const commissionePerc = parseFloat(commissioneVal) || 25;

        // Financials
        const lordo = parseFloat(lordoTotale) || 0;

        // Netto calculation based on user formula:
        // 1. LORDO - 22% (Commissione Portale)
        // 2. Remove Management Fee (Commissione Gestione) from the result
        // 3. Remove 21% Taxes from the result

        const afterPortal = lordo * (1 - 0.22);
        const afterMgmt = afterPortal * (1 - (commissionePerc / 100));
        const nettoEstimated = afterMgmt * (1 - 0.21);

        const nettoMensile = nettoEstimated / 12;
        const lordoMensile = lordo / 12;

        // Wheelchart Percentages Calculation
        // Base: Lordo Totale = 100%
        // Portale: 22% fixed
        const percPortale = 22;

        // Gestione: Commissione% of (Lordo - Portale)
        // Value = Lordo * (1 - 0.22) * (Commissione/100)
        // Percentage relative to Lordo = (1 - 0.22) * Commissione
        const valGestione = lordo * (1 - 0.22) * (commissionePerc / 100);
        const percGestione = (valGestione / lordo) * 100;

        // Tasse: 21% of (Lordo - Portale - Gestione)
        // Value = (Lordo - Portale - Gestione) * 0.21
        const valTasse = (lordo * (1 - 0.22) - valGestione) * 0.21;
        const percTasse = (valTasse / lordo) * 100;

        // Netto: Remainder
        const percNetto = 100 - percPortale - percGestione - percTasse;

        const data = {
            NOME: getVal('nome'),
            COGNOME: getVal('cognome'),
            INDIRIZZO: getVal('indirizzo'),
            ZONA: getVal('zona'),
            METRI_QUADRI: getVal('metriQuadri'),
            BAGNI: getVal('bagni'),
            CAMERE: getVal('camere'),
            POSTI_LETTO: getVal('postiLetto'),
            POSTI_LETTO_EXTRA: getVal('postiLettoExtra'),

            FACILITIES: facilitiesItems.length > 0 ? `\\begin{itemize}\n${facilitiesItems.map(i => `\\item ${i.valore}`).join('\n')}\n\\end{itemize}` : '',
            TAGLI: `\\begin{itemize}
\\item Mq: ${getVal('metriQuadri')}
\\item Bagni: ${getVal('bagni')}
${tagliItems.filter(i => i.valore && i.valore.trim() !== '').map(i => `\\item ${i.valore}`).join('\n')}
\\end{itemize}`,

            MODIFICHE_STRUTTURALI: getVal('modificheStrutturali'),
            MIGLIORIE_IMMOBILIARI: getVal('migliorieImmobiliari'),

            CAMERE_DISPONIBILI: getVal('camereDisponibili'),
            BAGNI_ANALISI: getVal('bagniAnalisi'),
            POSTI_LETTO_TOTALI: getVal('postiLettoTotali'),
            POSIZIONAMENTO: getVal('posizionamento'),
            CONSIDERAZIONI: getVal('considerazioni'),

            PREZZO_BASSA: prezzoBassa,
            PREZZO_MEDIA: prezzoMedia,
            PREZZO_ALTA: prezzoAlta,
            EXTRA_PAX: extraPax,

            DAYS_BASSA: daysBassa,
            DAYS_MEDIA: daysMedia,
            DAYS_ALTA: daysAlta,

            PERC_BASSA: percBassa,
            PERC_MEDIA: percMedia,
            PERC_ALTA: percAlta,

            TOTAL_DAYS: totalDays,
            AVG_OCCUPANCY: avgOccupancy,

            LORDO_ANNUO: lordoAnnuo,
            GUADAGNO_EXTRA: guadagnoExtra,
            LORDO_TOTALE: lordoTotale,
            LORDO_MENSILE: lordoMensile.toFixed(2),

            COMMISSIONE: commissionePerc,
            NETTO_ESTIMATED: nettoEstimated.toFixed(2),
            NETTO_MENSILE: nettoMensile.toFixed(2),

            // Wheelchart Data
            PERC_PORTALE: percPortale.toFixed(1),
            PERC_GESTIONE: percGestione.toFixed(1),
            PERC_TASSE: percTasse.toFixed(1),
            PERC_NETTO: percNetto.toFixed(1),

            DATA_OGGI: getVal('data')
        };


        try {
            const response = await fetch('/api/generate-tex', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            console.log('API Response status:', response.status, response.statusText);

            if (response.ok) {
                const blob = await response.blob();
                console.log('TEX file size:', blob.size);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Profittabilita_${data.COGNOME || 'Cliente'}.tex`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
                alert('File LaTeX scaricato! Puoi compilarlo su Overleaf o localmente.');
            } else {
                const errorData = await response.json();
                console.error('API Error:', response.status, errorData);
                alert(`Errore nella generazione del file (${response.status}). Controlla la console per i dettagli.`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Errore di connessione: ' + error.message);
        }
    };

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    return (
        <form className="space-y-8">

            {/* SEZIONE 1: DATI PROPRIETARIO & IMMOBILE */}
            <section>
                <h2 className="text-sm font-bold text-bbro-element-light uppercase tracking-widest mb-4">1. Dati Proprietario & Immobile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-bbro-background/30 p-6 rounded-sm border border-bbro-element-light/10">

                    <div>
                        <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Nome Proprietario</label>
                        <input name="nome" defaultValue={casa.proprietario.nome} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Cognome Proprietario</label>
                        <input name="cognome" defaultValue={casa.proprietario.cognome} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Indirizzo Immobile</label>
                        <input name="indirizzo" defaultValue={casa.indirizzo} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Zona</label>
                        <input name="zona" defaultValue={casa.zona} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 col-span-2">
                        <div>
                            <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Mq</label>
                            <input name="metriQuadri" type="number" defaultValue={casa.metriQuadri} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Bagni</label>
                            <input name="bagni" type="number" defaultValue={casa.bagni} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Camere</label>
                            <input name="camere" type="number" defaultValue={casa.camere} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 col-span-2">
                        <div>
                            <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Posti Letto Std</label>
                            <input name="postiLetto" type="number" defaultValue={casa.postiLetto} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Posti Extra</label>
                            <input name="postiLettoExtra" type="number" defaultValue={casa.postiLettoExtra} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white" />
                        </div>
                    </div>
                </div>
            </section>

            {/* SEZIONE 2: TIPOLOGIA E SPAZI */}
            <section>
                <div className="mb-2">
                    <h2 className="text-sm font-bold text-bbro-element-light uppercase tracking-widest mb-1">2. Tipologia e Spazi</h2>
                    <p className="text-xs text-bbro-foreground/70 italic mb-4">Se vuoi specificare aspetti come il piano, la tipologia, quanti locali ha...</p>
                </div>

                <div className="flex justify-end mb-4">
                    <button
                        type="button"
                        onClick={addTaglio}
                        className="px-4 py-2 bg-bbro-element-light text-white rounded-sm text-xs font-bold uppercase tracking-wide hover:bg-bbro-element-dark transition"
                    >
                        + Aggiungi Caratteristica
                    </button>
                </div>

                <div className="space-y-3">
                    {tagliItems.map((item, index) => (
                        <div key={item.id} className="flex gap-3 items-center bg-bbro-background/20 p-4 rounded-sm border border-bbro-element-light/20">
                            <input
                                type="text"
                                value={item.valore}
                                onChange={(e) => updateTaglio(item.id, e.target.value)}
                                placeholder="es. Piano 3, Bilocale, 2 locali..."
                                className="flex-1 p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white"
                            />
                            {tagliItems.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeTaglio(item.id)}
                                    className="text-red-600 hover:text-red-800 text-sm font-bold px-2"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>



            {/* SEZIONE 3: FACILITIES E SERVIZI */}
            <section>
                <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-bbro-element-light uppercase tracking-widest mb-1">3. Facilities e Servizi</h2>
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(casa.zona)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-bbro-element-light hover:text-bbro-element-dark underline font-medium"
                    >
                        📍 Vedi zona su Maps
                    </a>
                </div>

                <div className="flex justify-end mb-4">
                    <button
                        type="button"
                        onClick={addFacility}
                        className="px-4 py-2 bg-bbro-element-light text-white rounded-sm text-xs font-bold uppercase tracking-wide hover:bg-bbro-element-dark transition"
                    >
                        + Aggiungi Facility
                    </button>
                </div>

                <div className="space-y-3">
                    {facilitiesItems.map((item, index) => (
                        <div key={item.id} className="flex gap-3 items-center bg-bbro-background/20 p-4 rounded-sm border border-bbro-element-light/20">
                            <input
                                type="text"
                                value={item.valore}
                                onChange={(e) => updateFacility(item.id, e.target.value)}
                                placeholder="es. Wi-Fi, Aria condizionata, Parcheggio..."
                                className="flex-1 p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white"
                            />
                            {facilitiesItems.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeFacility(item.id)}
                                    className="text-red-600 hover:text-red-800 text-sm font-bold px-2"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* SEZIONE 4: MODIFICHE E MIGLIORIE */}
            <section>
                <h2 className="text-sm font-bold text-bbro-element-light uppercase tracking-widest mb-4">4. Modifiche e Migliorie</h2>
                <div className="space-y-4 bg-bbro-background/30 p-6 rounded-sm border border-bbro-element-light/10">
                    <div>
                        <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Modifiche Strutturali</label>
                        <input
                            name="modificheStrutturali"
                            defaultValue={casa.modificheStrutturali || "Nessuna"}
                            className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Migliorie Immobiliari</label>
                        <textarea
                            name="migliorieImmobiliari"
                            defaultValue={casa.migliorieImmobiliari || "In base al tipo di attivazione, si valuterà la situazione"}
                            rows="2"
                            className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white"
                        />
                    </div>
                </div>
            </section>

            {/* SEZIONE 5: ANALISI IMMOBILI CON CARATTERISTICHE SIMILI */}
            <section>
                <h2 className="text-sm font-bold text-bbro-element-light uppercase tracking-widest mb-4">5. Analisi Immobili con Caratteristiche Simili</h2>
                <div className="bg-bbro-background/30 p-6 rounded-sm border border-bbro-element-light/10 space-y-6">

                    {/* Sottosezione: Parametri di ricerca */}
                    <div>
                        <h3 className="text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-3 border-b border-bbro-foreground/10 pb-1">Parametri di ricerca</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Camere Disponibili</label>
                                <input name="camereDisponibili" type="number" defaultValue={casa.camereDisponibili} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white" placeholder="0" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Bagni</label>
                                <input name="bagniAnalisi" type="number" defaultValue={casa.bagniAnalisi} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white" placeholder="0" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Posizionamento</label>
                                <input name="posizionamento" type="text" defaultValue={casa.posizionamento} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white" placeholder="es. Centro Storico" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Posti Letto Totali</label>
                                <input name="postiLettoTotali" type="number" defaultValue={casa.postiLettoTotaliAnalisi} className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white" placeholder="0" />
                            </div>
                        </div>
                    </div>

                    {/* Sottosezione: Considerazioni */}
                    <div>
                        <h3 className="text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-3 border-b border-bbro-foreground/10 pb-1">Considerazioni</h3>
                        <div>
                            <textarea
                                name="considerazioni"
                                rows="3"
                                defaultValue={casa.considerazioni}
                                className="w-full p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white"
                                placeholder="Inserisci qui le tue considerazioni..."
                            />
                        </div>
                    </div>

                </div>
            </section>

            {/* SEZIONE 6: PARAMETRI GESTIONE */}
            <section>
                <h2 className="text-sm font-bold text-bbro-element-light uppercase tracking-widest mb-4">6. Parametri di Gestione</h2>
                <div className="bg-white p-6 rounded-sm border border-bbro-foreground/10">
                    <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-3">Commissione Agenzia</label>
                    <div className="flex gap-6 items-center flex-wrap">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="commissione" value="20" defaultChecked={casa.commissione === 20} className="accent-bbro-element-light w-4 h-4" />
                            <span className="text-bbro-element-dark font-medium">20%</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="commissione" value="25" defaultChecked={!casa.commissione || casa.commissione === 25} className="accent-bbro-element-light w-4 h-4" />
                            <span className="text-bbro-element-dark font-medium">25% (Standard)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="commissione" value="custom" defaultChecked={casa.commissione && casa.commissione !== 20 && casa.commissione !== 25} className="accent-bbro-element-light w-4 h-4" />
                            <span className="text-bbro-element-dark font-medium">Personalizzata</span>
                        </label>
                        <input
                            type="number"
                            name="commissioneCustom"
                            defaultValue={casa.commissione && casa.commissione !== 20 && casa.commissione !== 25 ? casa.commissione : ''}
                            placeholder="%"
                            className="w-20 p-1 border-b border-bbro-foreground/30 focus:border-bbro-element-light outline-none text-center text-bbro-element-dark"
                        />
                    </div>
                </div>
            </section>

            {/* SEZIONE 7: PREVISIONE STAGIONALE */}
            <section>
                <h2 className="text-sm font-bold text-bbro-element-light uppercase tracking-widest mb-4">7. Previsione Stagionale (Prezzi Medi Notte)</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-start">

                    {/* BASSA STAGIONE */}
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-sm border border-blue-100">
                            <label className="block text-xs font-bold text-blue-800 uppercase tracking-wide mb-2">Bassa Stagione</label>
                            <div className="flex items-center">
                                <span className="text-blue-800 mr-2">€</span>
                                <input
                                    name="prezzoBassa"
                                    type="number"
                                    value={prezzoBassa}
                                    onChange={(e) => handleInputChange(setPrezzoBassa, e.target.value, 'bassa')}
                                    className="w-full p-2 border border-blue-200 rounded-sm focus:outline-none focus:border-blue-400 text-blue-900 font-bold"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-sm border border-blue-100">
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={percBassa}
                                    onChange={(e) => handleInputChange(setPercBassa, e.target.value, 'percBassa')}
                                    className="w-full p-2 border border-blue-200 rounded-sm focus:outline-none focus:border-blue-400 text-blue-900 font-bold text-right"
                                />
                                <span className="text-blue-800 ml-2 font-bold">%</span>
                            </div>
                        </div>
                    </div>

                    {/* MEDIA STAGIONE */}
                    <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-sm border border-green-100">
                            <label className="block text-xs font-bold text-green-800 uppercase tracking-wide mb-2">Media Stagione</label>
                            <div className="flex items-center">
                                <span className="text-green-800 mr-2">€</span>
                                <input
                                    name="prezzoMedia"
                                    type="number"
                                    value={prezzoMedia}
                                    onChange={(e) => handleInputChange(setPrezzoMedia, e.target.value, 'media')}
                                    className="w-full p-2 border border-green-200 rounded-sm focus:outline-none focus:border-green-400 text-green-900 font-bold"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-sm border border-green-100">
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={percMedia}
                                    onChange={(e) => handleInputChange(setPercMedia, e.target.value, 'percMedia')}
                                    className="w-full p-2 border border-green-200 rounded-sm focus:outline-none focus:border-green-400 text-green-900 font-bold text-right"
                                />
                                <span className="text-green-800 ml-2 font-bold">%</span>
                            </div>
                        </div>
                    </div>

                    {/* ALTA STAGIONE */}
                    <div className="space-y-4">
                        <div className="bg-orange-50 p-4 rounded-sm border border-orange-100">
                            <label className="block text-xs font-bold text-orange-800 uppercase tracking-wide mb-2">Alta Stagione</label>
                            <div className="flex items-center">
                                <span className="text-orange-800 mr-2">€</span>
                                <input
                                    name="prezzoAlta"
                                    type="number"
                                    value={prezzoAlta}
                                    onChange={(e) => handleInputChange(setPrezzoAlta, e.target.value, 'alta')}
                                    className="w-full p-2 border border-orange-200 rounded-sm focus:outline-none focus:border-orange-400 text-orange-900 font-bold"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-sm border border-orange-100">
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={percAlta}
                                    onChange={(e) => handleInputChange(setPercAlta, e.target.value, 'percAlta')}
                                    className="w-full p-2 border border-orange-200 rounded-sm focus:outline-none focus:border-orange-400 text-orange-900 font-bold text-right"
                                />
                                <span className="text-orange-800 ml-2 font-bold">%</span>
                            </div>
                        </div>
                    </div>

                    {/* EXTRA PAX */}
                    <div className="bg-purple-50 p-4 rounded-sm border border-purple-100">
                        <label className="block text-xs font-bold text-purple-800 uppercase tracking-wide mb-2">Extra Pax</label>
                        <div className="flex items-center">
                            <span className="text-purple-800 mr-2">€</span>
                            <input
                                name="extraPax"
                                type="number"
                                value={extraPax}
                                onChange={(e) => handleInputChange(setExtraPax, e.target.value, 'extra')}
                                className="w-full p-2 border border-purple-200 rounded-sm focus:outline-none focus:border-purple-400 text-purple-900 font-bold"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Lordo Annuo e Guadagno Extra */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide">Lordo Annuo</label>
                            <a href="/calcolo-lordo" target="_blank" rel="noopener noreferrer" className="text-xs text-bbro-element-light hover:underline">Come viene calcolato?</a>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-800 mr-2">€</span>
                            <input
                                name="lordoAnnuo"
                                type="number"
                                value={lordoAnnuo}
                                onChange={(e) => handleLordoChange(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-sm focus:outline-none bg-white text-gray-900 font-bold focus:border-bbro-element-light"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-sm border border-purple-100">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-purple-800 uppercase tracking-wide">Guadagno Ospiti Extra</label>
                            <span className="text-xs text-purple-600 italic">Stima 30% occupazione</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-purple-800 mr-2">€</span>
                            <input
                                name="guadagnoExtra"
                                type="number"
                                value={guadagnoExtra}
                                readOnly
                                className="w-full p-2 border border-purple-200 rounded-sm focus:outline-none bg-purple-100 text-purple-900 font-bold cursor-not-allowed"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-sm border border-indigo-100">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-indigo-800 uppercase tracking-wide">Lordo Annuo Totale</label>
                        </div>
                        <div className="flex items-center">
                            <span className="text-indigo-800 mr-2">€</span>
                            <input
                                name="lordoTotale"
                                type="number"
                                value={lordoTotale}
                                readOnly
                                className="w-full p-2 border border-indigo-200 rounded-sm focus:outline-none bg-indigo-100 text-indigo-900 font-bold cursor-not-allowed"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* DATA */}
            <div className="bg-bbro-background/20 p-6 rounded-sm border border-bbro-element-light/20">
                <label className="block text-xs font-bold text-bbro-foreground uppercase tracking-wide mb-1">Data</label>
                <input name="data" type="date" defaultValue={today} className="w-full md:w-64 p-2 border border-bbro-foreground/20 rounded-sm focus:border-bbro-element-light focus:outline-none text-bbro-element-dark bg-white" />
            </div>

            <div className="mt-16 pt-12 border-t border-bbro-element-light/20 flex justify-center gap-10">
                <button type="button" onClick={handleGeneratePDF} className="px-12 py-5 bg-bbro-element-light text-white rounded-sm font-bold uppercase tracking-widest hover:bg-bbro-element-dark transition shadow-md">
                    Scarica File LaTeX
                </button>
                <button type="button" onClick={handleSaveDraft} className="px-12 py-5 border border-bbro-foreground/20 text-bbro-foreground rounded-sm font-bold uppercase tracking-widest hover:bg-bbro-background transition">
                    Salva Bozza
                </button>
            </div>

        </form>
    );
}
