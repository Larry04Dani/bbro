'use client';

import { eliminaProprietario } from '@/app/actions';
import { useState } from 'react';

export default function DeleteOwnerButton({ id }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!confirm('SEI SICURO? QUESTA AZIONE È IRREVERSIBILE.\n\nVerranno eliminati:\n- Il proprietario\n- Tutte le sue proprietà\n- Tutti i documenti e file caricati')) {
            return;
        }

        setIsDeleting(true);

        const formData = new FormData();
        formData.append('id', id);

        try {
            await eliminaProprietario(formData);
        } catch (err) {
            alert("Errore durante l'eliminazione: " + err.message);
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white px-4 py-2 rounded-sm uppercase font-bold text-xs tracking-widest hover:bg-red-800 transition disabled:opacity-50"
        >
            {isDeleting ? 'Eliminazione...' : 'Elimina Proprietario'}
        </button>
    );
}
