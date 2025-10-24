import React, { useState } from 'react';
import { AppData, Client } from '../types';
import { TrashIcon, EditIcon } from './Icons';
import EditClientModal from './EditClientModal';

interface ClientsViewProps {
    appData: AppData;
    onUpdateClient: (client: Client) => void;
    onDeleteClient: (clientId: string) => void;
}

const ClientsView: React.FC<ClientsViewProps> = ({ appData, onUpdateClient, onDeleteClient }) => {
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

    const handleSaveClient = (client: Client) => {
        onUpdateClient(client);
        setClientToEdit(null);
    }
    
    const handleDelete = (clientId: string, clientName: string) => {
        const confirmation = window.confirm(`Tem certeza que deseja excluir o cliente "${clientName}"? Esta ação não pode ser desfeita.`);
        if(confirmation) {
            onDeleteClient(clientId);
        }
    }

    return (
        <div className="animate-fade-in">
            {clientToEdit && <EditClientModal client={clientToEdit} onClose={() => setClientToEdit(null)} onSave={handleSaveClient} />}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Gerenciamento de Clientes</h2>
                    <p className="text-text-secondary">Edite e remova clientes existentes no sistema.</p>
                </div>
            </header>
            
            <div className="bg-surface rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="border-b border-border text-sm text-text-secondary bg-secondary">
                        <tr>
                            <th className="p-4 font-semibold">Nome do Cliente</th>
                            <th className="p-4 font-semibold">Nº de Tarefas</th>
                            <th className="p-4 font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appData.clients.map(client => {
                            const taskCount = appData.tasks.filter(t => t.client.id === client.id).length;
                            return (
                                <tr key={client.id} className="border-b border-border last:border-b-0 hover:bg-secondary">
                                    <td className="p-4 font-medium">{client.name}</td>
                                    <td className="p-4 text-text-secondary">{taskCount}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setClientToEdit(client)} className="text-text-secondary hover:text-primary p-1 rounded-md hover:bg-primary/10">
                                                <EditIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(client.id, client.name)} className="text-text-secondary hover:text-red-500 p-1 rounded-md hover:bg-red-500/10">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                 {appData.clients.length === 0 && (
                     <div className="text-center p-8 text-text-secondary">
                       Nenhum cliente cadastrado. Adicione um ao criar uma nova tarefa.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientsView;