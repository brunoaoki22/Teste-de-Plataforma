import React, { useState } from 'react';
import { AppData, User, UserRole } from '../types';
import { UserPlusIcon, TrashIcon, EditIcon } from './Icons';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';

interface UsersViewProps {
    appData: AppData;
    onAddUser: (firstName: string, lastName: string, email: string, password: string, role: UserRole) => void;
    onDeleteUser: (userId: string) => void;
    onUpdateUser: (user: User) => void;
    currentUser: User;
}

const UsersView: React.FC<UsersViewProps> = ({ appData, onAddUser, onDeleteUser, onUpdateUser, currentUser }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

    const handleSaveUser = (user: User) => {
        onUpdateUser(user);
        setUserToEdit(null);
    }

    return (
        <div className="animate-fade-in">
            {isAddModalOpen && <AddUserModal onClose={() => setIsAddModalOpen(false)} onAddUser={onAddUser} />}
            {userToEdit && <EditUserModal user={userToEdit} onClose={() => setUserToEdit(null)} onSave={handleSaveUser} />}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Gerenciamento de Usuários</h2>
                    <p className="text-text-secondary">Adicione, remova e gerencie os membros da sua equipe.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors">
                    <UserPlusIcon className="w-5 h-5" />
                    <span>Adicionar Usuário</span>
                </button>
            </header>
            
            <div className="bg-surface rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="border-b border-border text-sm text-text-secondary bg-secondary">
                        <tr>
                            <th className="p-4 font-semibold">Usuário</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Função</th>
                            <th className="p-4 font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appData.users.map(user => (
                            <tr key={user.id} className="border-b border-border last:border-b-0 hover:bg-secondary">
                                <td className="p-4 font-medium">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} className="w-8 h-8 rounded-full" />
                                        <span>{user.firstName} {user.lastName}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-text-secondary">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Admin' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {currentUser.id !== user.id && (
                                            <>
                                                <button onClick={() => setUserToEdit(user)} className="text-text-secondary hover:text-primary p-1 rounded-md hover:bg-primary/10">
                                                    <EditIcon className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => onDeleteUser(user.id)} className="text-text-secondary hover:text-red-500 p-1 rounded-md hover:bg-red-500/10">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersView;
