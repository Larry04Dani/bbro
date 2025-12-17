'use server'

import prisma from '@/lib/db';
import { redirect } from 'next/navigation';

export async function creaProprietario(formData) {
  const nome = formData.get('nome');
  const cognome = formData.get('cognome');

  // Dati Immobile
  const indirizzo = formData.get('indirizzo');
  const zona = formData.get('zona'); // Prima era citta

  // Convertiamo i numeri (perché dal form arrivano come testo "100")
  // Se il campo è vuoto, salviamo null
  const mq = formData.get('metriQuadri') ? parseInt(formData.get('metriQuadri')) : null;
  const posti = formData.get('postiLetto') ? parseInt(formData.get('postiLetto')) : null;
  const postiExtra = formData.get('postiLettoExtra') ? parseInt(formData.get('postiLettoExtra')) : null;
  const camere = formData.get('camere') ? parseInt(formData.get('camere')) : null;
  const bagni = formData.get('bagni') ? parseInt(formData.get('bagni')) : null;

  // --- LOGICA GENERAZIONE ---
  const nomeClean = nome.toLowerCase().trim();
  const indirizzoNoSpazi = indirizzo.replace(/\s+/g, '');

  const passwordGenerata = `${indirizzoNoSpazi}!`;
  const usernameGenerato = `${nomeClean}.${indirizzoNoSpazi}`;
  const emailGoogleGenerata = `${nomeClean}.${indirizzoNoSpazi}@gmail.com`;

  // --- SALVATAGGIO ---
  await prisma.proprietario.create({
    data: {
      nome,
      cognome,
      googleEmail: emailGoogleGenerata,
      googlePass: passwordGenerata,
      bookingUser: usernameGenerato,
      bookingPass: passwordGenerata,
      airbnbUser: usernameGenerato,
      airbnbPass: passwordGenerata,
      ciaoBookingUser: usernameGenerato,
      ciaoBookingPass: passwordGenerata,

      immobili: {
        create: {
          indirizzo: indirizzo,
          zona: zona,           // Aggiornato
          metriQuadri: mq,      // Nuovo
          postiLetto: posti,    // Nuovo
          postiLettoExtra: postiExtra, // Nuovo
          camere: camere,       // Nuovo
          bagni: bagni          // Nuovo
        }
      }
    }
  });

  redirect('/');
}

// AZIONE: Modifica Proprietario
export async function aggiornaProprietario(formData) {
  const id = parseInt(formData.get('id')); // L'ID nascosto nel form

  await prisma.proprietario.update({
    where: { id: id },
    data: {
      nome: formData.get('nome'),
      cognome: formData.get('cognome'),
      telefono: formData.get('telefono'),
      emailPersonale: formData.get('emailPersonale'),
      // Qui potresti aggiungere anche la logica per rigenerare le password se cambiano indirizzo, 
      // ma per ora teniamo solo i dati anagrafici semplici.
    }
  });

  redirect(`/proprietari/${id}`); // Ricarica la stessa pagina
}

// AZIONE: Modifica Immobile
export async function aggiornaImmobile(formData) {
  const id = parseInt(formData.get('id'));
  const proprietarioId = parseInt(formData.get('proprietarioId'));

  await prisma.immobile.update({
    where: { id: id },
    data: {
      indirizzo: formData.get('indirizzo'),
      zona: formData.get('zona'),
      metriQuadri: parseInt(formData.get('metriQuadri')) || null,
      bagni: parseInt(formData.get('bagni')) || null,
      camere: parseInt(formData.get('camere')) || null,
      postiLetto: parseInt(formData.get('postiLetto')) || null,
      postiLettoExtra: parseInt(formData.get('postiLettoExtra')) || null,
    }
  });

  // Dopo aver salvato la casa, torniamo alla pagina del proprietario
  redirect(`/proprietari/${proprietarioId}`);
}

// AZIONE: Salva Profittabilità (Bozza)
export async function salvaProfittabilita(data) {
  const id = parseInt(data.id);

  if (!id) throw new Error("ID immobile mancante");

  await prisma.immobile.update({
    where: { id: id },
    data: {
      // Dati Profittabilità
      facilities: data.facilities,
      tagli: data.tagli,
      modificheStrutturali: data.modificheStrutturali,
      migliorieImmobiliari: data.migliorieImmobiliari,

      // Analisi Simili
      camereDisponibili: parseInt(data.camereDisponibili) || null,
      bagniAnalisi: parseInt(data.bagniAnalisi) || null,
      posizionamento: data.posizionamento,
      postiLettoTotaliAnalisi: parseInt(data.postiLettoTotali) || null,
      considerazioni: data.considerazioni,

      // Parametri Gestione
      commissione: parseFloat(data.commissione) || null,

      // Previsione Stagionale
      prezzoBassa: parseFloat(data.prezzoBassa) || null,
      prezzoMedia: parseFloat(data.prezzoMedia) || null,
      prezzoAlta: parseFloat(data.prezzoAlta) || null,
      extraPax: parseFloat(data.extraPax) || null,

      percBassa: parseFloat(data.percBassa) || null,
      percMedia: parseFloat(data.percMedia) || null,
      percAlta: parseFloat(data.percAlta) || null,

      lordoAnnuo: parseFloat(data.lordoAnnuo) || null,
      guadagnoExtra: parseFloat(data.guadagnoExtra) || null,
      lordoTotale: parseFloat(data.lordoTotale) || null,
    }
  });

  // Non facciamo redirect, rimaniamo sulla pagina
  return { success: true };
}