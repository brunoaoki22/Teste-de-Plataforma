import React, { useState, useMemo } from 'react';
import { AppData, Task, User, CustomStatus, Client } from '../types';
import TaskModal from './TaskModal';
import { FlagIcon, CalendarIcon } from './Icons';

interface ArchiveViewProps {
    appData: AppData;
    currentUser: User;
    onUpdateTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
    onAddClient: (name: string) => Client;
}

const ArchiveView: React.FC<ArchiveViewProps> = ({ appData, currentUser, onUpdateTask, onDeleteTask, onAddClient }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('Finalizada');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const filteredTasks = useMemo(() => {
        return appData.tasks
            .filter(task => {
                const matchesAssignee = task.assignees.some(assignee => assignee.id === currentUser.id);
                const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = statusFilter === 'all' || task.status.name === statusFilter;
                return matchesAssignee && matchesSearch && matchesStatus;
            })
            .sort((a, b) => new Date(b.dueDate || 0).getTime() - new Date(a.dueDate || 0).getTime());
    }, [appData.tasks, searchTerm, statusFilter, currentUser.id]);

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const handleSaveTask = (task: Task) => {
        onUpdateTask(task);
        handleCloseModal();
    };


    return (
         <div className="animate-fade-in">
            {isModalOpen && selectedTask && (
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveTask}
                    taskToEdit={selectedTask}
                    appData={appData}
                    currentUser={currentUser}
                    onDelete={onDeleteTask}
                    onAddClient={onAddClient}
                />
            )}

            <header className="mb-8">
                <h2 className="text-3xl font-bold text-text-primary">Arquivo de Tarefas</h2>
                <p className="text-text-secondary">Visualize, pesquise e gerencie todas as tarefas do sistema.</p>
            </header>

            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Pesquisar por título..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="flex-grow p-2 bg-surface border border-border rounded-lg"
                />
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="p-2 bg-surface border border-border rounded-lg"
                >
                    <option value="all">Todos os Status</option>
                    {appData.customStatuses.map(status => (
                        <option key={status.id} value={status.name}>{status.name}</option>
                    ))}
                </select>
            </div>

            <div className="bg-surface rounded-xl border border-border overflow-hidden">
                 {filteredTasks.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="border-b border-border text-sm text-text-secondary bg-secondary">
                            <tr>
                                <th className="p-4 font-semibold">Tarefa</th>
                                <th className="p-4 font-semibold">Cliente</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Responsáveis</th>
                                <th className="p-4 font-semibold">Vencimento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map(task => (
                                <tr key={task.id} onClick={() => handleEditTask(task)} className="border-b border-border last:border-b-0 hover:bg-secondary cursor-pointer">
                                    <td className="p-4 font-medium">{task.title}</td>
                                    <td className="p-4 text-text-secondary">{task.client?.name || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white`} style={{ backgroundColor: task.status.color }}>
                                            {task.status.name}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center -space-x-2">
                                            {task.assignees.slice(0, 3).map(user => (
                                                <img key={user.id} src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} className="w-6 h-6 rounded-full border-2 border-surface" title={`${user.firstName} ${user.lastName}`}/>
                                            ))}
                                            {task.assignees.length > 3 && <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold border-2 border-surface">+{task.assignees.length - 3}</div>}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {task.dueDate ? 
                                            <span className="flex items-center gap-2 text-text-secondary">
                                            <CalendarIcon className="w-4 h-4" />
                                            {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                            : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center p-8 text-text-secondary">
                       Nenhuma tarefa encontrada com os filtros atuais.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArchiveView;