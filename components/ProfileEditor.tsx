// Fix: Implementing the ProfileEditor component.
import React from 'react';
import { User } from '../types';
import { XIcon } from './Icons';

interface ProfileEditorProps {
    user: User;
    onClose: () => void;
    onSave: (user: User) => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, onClose, onSave }) => {
    // Basic state for editing
    const [name, setName] = React.useState(user.name);

    const handleSave = () => {
        onSave({ ...user, name });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Editar Perfil</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Nome Completo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 bg-background border border-border rounded-lg"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditor;
