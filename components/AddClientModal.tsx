import React, { useState } from 'react';
import { XIcon } from './Icons';

interface AddClientModalProps {
    onClose: () => void;
    onAddClient: (name: string) => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ onClose, onAddClient }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAddClient(name.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[51]" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold">Adicionar Novo Cliente</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><XIcon className="w-6 h-6" /></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <main className="p-6">
                        <div>
                            <label htmlFor="client-name" className="block text-sm font-medium text-text-secondary mb-1">Nome do Cliente</label>
                            <input
                                type="text"
                                id="client-name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                autoFocus
                                className="w-full p-2 bg-secondary border border-border rounded-lg"
                            />
                        </div>
                    </main>
                    <footer className="p-4 border-t border-border flex justify-end items-center gap-4">
                        <button type="button" onClick={onClose} className="px-5 py-2 bg-secondary text-text-primary rounded-lg hover:bg-border font-semibold transition-colors">Cancelar</button>
                        <button type="submit" className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold transition-colors">
                            Salvar Cliente
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default AddClientModal;