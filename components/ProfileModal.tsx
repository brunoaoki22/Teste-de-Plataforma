import React, { useState } from 'react';
import { User } from '../types';
import { XIcon, EditIcon } from './Icons';

interface ProfileModalProps {
    user: User;
    onClose: () => void;
    onUpdateUser: (user: User) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onUpdateUser }) => {
    const [formData, setFormData] = useState(user);
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'age' ? (value ? parseInt(value) : null) : value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateUser(formData);
        setIsSaved(true);
        setTimeout(() => {
            setIsSaved(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold">Editar Perfil</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><XIcon className="w-6 h-6" /></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <main className="p-6">
                        <div className="flex items-center space-x-6 mb-8">
                            <div className="relative group">
                                <img src={formData.avatarUrl} alt={`${formData.firstName} ${formData.lastName}`} className="w-24 h-24 rounded-full object-cover" />
                                <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <EditIcon className="w-6 h-6"/>
                                </label>
                                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold">{formData.firstName} {formData.lastName}</h3>
                                <p className="text-text-secondary">{formData.role}</p>
                            </div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-text-secondary mb-1">Nome</label>
                                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 bg-secondary border border-border rounded-lg" />
                            </div>
                             <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-text-secondary mb-1">Sobrenome</label>
                                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 bg-secondary border border-border rounded-lg" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">E-mail</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 bg-secondary border border-border rounded-lg" />
                            </div>
                             <div>
                                <label htmlFor="age" className="block text-sm font-medium text-text-secondary mb-1">Idade</label>
                                <input type="number" id="age" name="age" value={formData.age || ''} onChange={handleChange} className="w-full p-2 bg-secondary border border-border rounded-lg" />
                            </div>
                             <div>
                                <label htmlFor="city" className="block text-sm font-medium text-text-secondary mb-1">Cidade</label>
                                <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 bg-secondary border border-border rounded-lg" />
                            </div>
                        </div>
                    </main>
                    <footer className="p-4 border-t border-border flex justify-end items-center gap-4">
                        {isSaved && <span className="text-green-400 animate-fade-in text-sm">Perfil salvo com sucesso!</span>}
                        <button type="submit" className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold transition-colors">
                            Salvar Alterações
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
