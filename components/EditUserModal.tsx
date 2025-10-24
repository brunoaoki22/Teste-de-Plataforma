import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { XIcon } from './Icons';

interface EditUserModalProps {
    user: User;
    onClose: () => void;
    onSave: (user: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState<User>(user);

    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold">Editar Usuário</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><XIcon className="w-6 h-6" /></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <main className="p-6 space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-text-secondary mb-1">Nome</label>
                                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full p-2 bg-secondary border border-border rounded-lg" />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-text-secondary mb-1">Sobrenome</label>
                                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full p-2 bg-secondary border border-border rounded-lg" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">E-mail</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 bg-secondary border border-border rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-text-secondary mb-1">Função</label>
                            <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full p-2 bg-secondary border border-border rounded-lg">
                                <option value="Membro">Membro</option>
                                <option value="Admin">Admin</option>
                            </select>
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

export default EditUserModal;
