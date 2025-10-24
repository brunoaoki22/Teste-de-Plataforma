import React, { useState, useMemo } from 'react';
import { AppData, Task, User, Client } from '../types';
import { ChevronDownIcon, FlagIcon, CalendarIcon } from './Icons';
import TaskModal from './TaskModal';

interface MyTasksViewProps {
    appData: AppData;
    currentUser: User;
    onUpdateTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
    onAddClient: (name: string) => Client;
}

const getPriorityClass = (priority: Task['priority']) => {
    switch (priority) {
        case 'Alta': return 'text-red-500';
        case 'Média': return 'text-yellow-500';
        case 'Baixa': return 'text-green-500';
        default: return 'text-gray-500';
    }
};


const MyTasksView: React.FC<MyTasksViewProps> = ({ appData, currentUser, onUpdateTask, onDeleteTask, onAddClient }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const myTasks = useMemo(() => 
        appData.tasks
            .filter(task => task.assignees.some(assignee => assignee.id === currentUser.id))
            .sort((a, b) => new Date(b.dueDate || 0).getTime() - new Date(a.dueDate || 0).getTime()),
        [appData.tasks, currentUser.id]
    );

    const groupedTasksByClient = useMemo(() => {
        const groups: { [clientName: string]: { client: Client, tasks: Task[] } } = {};
        myTasks.forEach(task => {
            const clientName = task.client.name;
            if (!groups[clientName]) {
                groups[clientName] = { client: task.client, tasks: [] };
            }
            groups[clientName].tasks.push(task);
        });
        return Object.values(groups).sort((a, b) => a.client.name.localeCompare(b.client.name));
    }, [myTasks]);

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
            {isModalOpen && (
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
                <h2 className="text-3xl font-bold text-text-primary">Minhas Tarefas</h2>
                <p className="text-text-secondary">Todas as tarefas atribuídas a você, agrupadas por cliente.</p>
            </header>

            <div className="space-y-6">
                {groupedTasksByClient.map(({ client, tasks }) => (
                    <ClientTaskGroup 
                        key={client.id} 
                        clientName={client.name} 
                        tasks={tasks} 
                        onEditTask={handleEditTask}
                    />
                ))}
                {myTasks.length === 0 && (
                     <div className="text-center p-8 text-text-secondary bg-surface rounded-xl border border-border">
                        Você não tem nenhuma tarefa atribuída.
                    </div>
                )}
            </div>
        </div>
    );
};

interface ClientTaskGroupProps {
    clientName: string;
    tasks: Task[];
    onEditTask: (task: Task) => void;
}

const ClientTaskGroup: React.FC<ClientTaskGroupProps> = ({ clientName, tasks, onEditTask }) => {
    const [isOpen, setIsOpen] = useState(false); // Start closed by default

    return (
        <div className="bg-surface rounded-xl border border-border">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4">
                <h3 className="text-lg font-semibold">{clientName} ({tasks.length})</h3>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="border-t border-border divide-y divide-border">
                    {tasks.map(task => (
                         <button 
                            key={task.id} 
                            onClick={() => onEditTask(task)}
                            className="w-full text-left p-4 hover:bg-secondary/50 group"
                         >
                            <p className="font-semibold text-text-primary">{task.title}</p>
                            <div className="flex items-center gap-4 text-sm text-text-secondary mt-1">
                                <span className={`flex items-center gap-1.5 ${getPriorityClass(task.priority)}`}>
                                    <FlagIcon className="w-4 h-4" />
                                    {task.priority}
                                </span>
                                {task.dueDate && (
                                    <span className="flex items-center gap-1.5">
                                        <CalendarIcon className="w-4 h-4" />
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyTasksView;