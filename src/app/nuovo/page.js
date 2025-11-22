// src/app/nuovo/page.js
import { creaProprietario } from '../actions';

export default function NuovoProprietario() {
  return (
    <main className="min-h-screen bg-gray-100 p-10 flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Nuovo Proprietario</h1>
        
        <form action={creaProprietario} className="space-y-4">
          
          {/* Dati Proprietario */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input name="nome" type="text" required className="w-full p-2 border border-gray-300 rounded mt-1 text-black" placeholder="Es. Mario" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cognome</label>
            <input name="cognome" type="text" required className="w-full p-2 border border-gray-300 rounded mt-1 text-black" placeholder="Es. Rossi" />
          </div>

          <hr className="my-4" />
          <p className="text-sm text-gray-500 font-bold">Dati Prima Casa (per generare password)</p>

          {/* Dati Casa */}
          <hr className="my-6 border-gray-300" />
          <h2 className="text-lg font-bold text-gray-800 mb-4">Dati Immobile</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
               <label className="block text-sm font-medium text-gray-700">Indirizzo</label>
               <input name="indirizzo" type="text" required className="w-full p-2 border border-gray-300 rounded mt-1 text-black" placeholder="Es. Via Roma 10" />
            </div>

            <div className="col-span-2">
               <label className="block text-sm font-medium text-gray-700">Zona (ex Città)</label>
               <input name="zona" type="text" required className="w-full p-2 border border-gray-300 rounded mt-1 text-black" placeholder="Es. Centro Storico / Milano" />
            </div>

            {/* NUOVI CAMPI NUMERICI */}
            <div>
               <label className="block text-sm font-medium text-gray-700">Metri Quadri</label>
               <input name="metriQuadri" type="number" className="w-full p-2 border border-gray-300 rounded mt-1 text-black" placeholder="mq" />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700">Bagni</label>
               <input name="bagni" type="number" className="w-full p-2 border border-gray-300 rounded mt-1 text-black" placeholder="N°" />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700">Camere Letto</label>
               <input name="camere" type="number" className="w-full p-2 border border-gray-300 rounded mt-1 text-black" placeholder="N°" />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700">Posti Letto Std</label>
               <input name="postiLetto" type="number" className="w-full p-2 border border-gray-300 rounded mt-1 text-black" placeholder="N°" />
            </div>
            
            <div className="col-span-2">
               <label className="block text-sm font-medium text-gray-700">Posti Extra (Divano letto)</label>
               <input name="postiLettoExtra" type="number" className="w-full p-2 border border-gray-300 rounded mt-1 text-black" placeholder="N°" />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition mt-6">
            SALVA TUTTO
          </button>
          
        </form>
      </div>
    </main>
  );
}