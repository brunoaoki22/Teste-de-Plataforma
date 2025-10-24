import React, { useState } from 'react';
import { UserRole } from '../types';
import { XIcon } from './Icons';

interface AddUserModalProps {
    onClose: () => void;
    onAddUser: (firstName: string, lastName: string, email: string, password: string, role: UserRole) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onAddUser }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('Membro');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (firstName.trim() && lastName.trim() && email.trim() && password.trim()) {
            onAddUser(firstName, lastName, email, password, role);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold">Adicionar Novo Usuário</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><XIcon className="w-6 h-6" /></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <main className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-text-secondary mb-1">Nome</label>
                                <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full p-2 bg-secondary border border-border rounded-lg" />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-text-secondary mb-1">Sobrenome</label>
                                <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full p-2 bg-secondary border border-border rounded-lg" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">E-mail</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 bg-secondary border border-border rounded-lg" />
                        </div>
                         <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">Senha</label>
                            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 bg-secondary border border-border rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-text-secondary mb-1">Função</label>
                            <select id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full p-2 bg-secondary border border-border rounded-lg">
                                <option value="Membro">Membro</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    </main>
                    <footer className="p-4 border-t border-border flex justify-end items-center gap-4">
                        <button type="button" onClick={onClose} className="px-5 py-2 bg-secondary text-text-primary rounded-lg hover:bg-border font-semibold transition-colors">Cancelar</button>
                        <button type="submit" className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold transition-colors">
                            Adicionar Usuário
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
