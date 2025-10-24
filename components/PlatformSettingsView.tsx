import React, { useState } from 'react';
import { AppData, CustomStatus } from '../types';
import { XIcon, TrashIcon, EditIcon, PlusIcon } from './Icons';

interface PlatformSettingsViewProps {
    appData: AppData;
    onAddStatus: (name: string, color: string) => void;
    onUpdateStatus: (status: CustomStatus) => void;
    onDeleteStatus: (statusId: string) => void;
    isAdmin: boolean;
}

const PlatformSettingsView: React.FC<PlatformSettingsViewProps> = ({ appData, onAddStatus, onUpdateStatus, onDeleteStatus, isAdmin }) => {
    const [editingStatus, setEditingStatus] = useState<CustomStatus | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const handleSaveStatus = (status: CustomStatus) => {
        if (isCreating) {
            onAddStatus(status.name, status.color);
        } else {
            onUpdateStatus(status);
        }
        setEditingStatus(null);
        setIsCreating(false);
    };
    
    const handleOpenCreate = () => {
        setIsCreating(true);
        setEditingStatus({ id: '', name: '', color: '#808080' });
    }

    const handleCloseModal = () => {
        setEditingStatus(null);
        setIsCreating(false);
    }

    return (
        <div className="animate-fade-in">
             {editingStatus && (
                <StatusEditorModal
                    status={editingStatus}
                    onClose={handleCloseModal}
                    onSave={handleSaveStatus}
                    isCreating={isCreating}
                />
            )}
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-text-primary">Configurações da Plataforma</h2>
                <p className="text-text-secondary">Gerencie as configurações gerais do Zenith.</p>
            </header>
            <div className="space-y-8">
                {isAdmin && (
                    <div className="bg-surface p-6 rounded-xl border border-border">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-xl font-semibold">Gerenciar Status</h3>
                             <button onClick={handleOpenCreate} className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm rounded-lg font-semibold hover:bg-primary-hover transition-colors">
                                <PlusIcon className="w-4 h-4" />
                                <span>Novo Status</span>
                            </button>
                        </div>
                        <p className="text-sm text-text-secondary mb-4">Crie e edite os status das tarefas. Os 3 primeiros da lista definirão as colunas do seu dashboard Kanban.</p>
                        <div className="space-y-2">
                           {appData.customStatuses.map((status, index) => (
                               <div key={status.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary">
                                   <div className="flex items-center gap-3">
                                       <span className="w-4 h-4 rounded-full" style={{ backgroundColor: status.color }}></span>
                                       <span className="font-medium">{status.name}</span>
                                       {index < 3 && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Coluna Kanban</span>}
                                   </div>
                                   <div className="flex items-center gap-2">
                                       <button onClick={() => setEditingStatus(status)} className="text-text-secondary hover:text-primary"><EditIcon className="w-5 h-5"/></button>
                                       <button onClick={() => onDeleteStatus(status.id)} className="text-text-secondary hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                   </div>
                               </div>
                           ))}
                        </div>
                    </div>
                )}

                <div className="bg-surface p-6 rounded-xl border border-border">
                    <h3 className="text-xl font-semibold mb-4">Notificações</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label htmlFor="email-notif" className="text-text-primary">Notificações por E-mail</label>
                            <input type="checkbox" id="email-notif" className="form-checkbox h-5 w-5 rounded bg-secondary text-primary focus:ring-primary border-border" defaultChecked />
                        </div>
                         <div className="flex items-center justify-between">
                            <label htmlFor="push-notif" className="text-text-primary">Notificações Push no Navegador</label>
                            <input type="checkbox" id="push-notif" className="form-checkbox h-5 w-5 rounded bg-secondary text-primary focus:ring-primary border-border" />
                        </div>
                         <div className="flex items-center justify-between">
                            <label htmlFor="activity-summary" className="text-text-primary">Resumos de atividade semanais</label>
                            <input type="checkbox" id="activity-summary" className="form-checkbox h-5 w-5 rounded bg-secondary text-primary focus:ring-primary border-border" defaultChecked />
                        </div>
                    </div>
                </div>
                
                 <div className="bg-surface p-6 rounded-xl border border-border">
                    <h3 className="text-xl font-semibold mb-4">Tema da Interface</h3>
                    <div className="flex space-x-4">
                        <button className="flex-1 p-4 rounded-lg border-2 border-primary text-center">
                            <div className="w-full h-8 bg-background rounded mb-2"></div>
                            <p>Escuro (Atual)</p>
                        </button>
                         <button className="flex-1 p-4 rounded-lg border border-border hover:border-primary text-center text-text-secondary">
                            <div className="w-full h-8 bg-gray-200 rounded mb-2"></div>
                            <p>Claro</p>
                        </button>
                         <button className="flex-1 p-4 rounded-lg border border-border hover:border-primary text-center text-text-secondary">
                            <div className="w-full h-8 bg-blue-900 rounded mb-2"></div>
                            <p>Azul</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


interface StatusEditorModalProps {
    status: CustomStatus;
    onClose: () => void;
    onSave: (status: CustomStatus) => void;
    isCreating: boolean;
}

const StatusEditorModal: React.FC<StatusEditorModalProps> = ({ status, onClose, onSave, isCreating }) => {
    const [name, setName] = useState(status.name);
    const [color, setColor] = useState(status.color);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...status, name, color });
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold">{isCreating ? 'Criar Novo Status' : 'Editar Status'}</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><XIcon className="w-6 h-6" /></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <main className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Nome do Status</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 bg-secondary border border-border rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="color" className="block text-sm font-medium text-text-secondary mb-1">Cor</label>
                            <div className="flex items-center gap-3">
                                <input type="color" id="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 p-1 bg-secondary border border-border rounded-lg cursor-pointer"/>
                                <span className="p-2 rounded-lg text-white" style={{ backgroundColor: color }}>{name || 'Exemplo'}</span>
                            </div>
                        </div>
                    </main>
                    <footer className="p-4 border-t border-border flex justify-end items-center gap-4">
                        <button type="button" onClick={onClose} className="px-5 py-2 bg-secondary text-text-primary rounded-lg hover:bg-border font-semibold transition-colors">Cancelar</button>
                        <button type="submit" className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold transition-colors">
                            Salvar
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default PlatformSettingsView;