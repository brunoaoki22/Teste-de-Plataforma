import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { XIcon } from './Icons';

interface EditClientModalProps {
    client: Client;
    onClose: () => void;
    onSave: (client: Client) => void;
}

const EditClientModal: React.FC<EditClientModalProps> = ({ client, onClose, onSave }) => {
    const [name, setName] = useState(client.name);

    useEffect(() => {
        setName(client.name);
    }, [client]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave({ ...client, name: name.trim() });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold">Editar Cliente</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><XIcon className="w-6 h-6" /></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <main className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Nome do Cliente</label>
                            <input type="text" id="name" name="name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 bg-secondary border border-border rounded-lg" />
                        </div>
                    </main>
                    <footer className="p-4 border-t border-border flex justify-end items-center gap-4">
                        <button type="button" onClick={onClose} className="px-5 py-2 bg-secondary text-text-primary rounded-lg hover:bg-border font-semibold transition-colors">Cancelar</button>
                        <button type="submit" className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold transition-colors">
                            Salvar Alterações
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default EditClientModal;