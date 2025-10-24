import React, { useState, useMemo } from 'react';
import { AppData, Task, User, CustomStatus, Priority, Client } from '../types';
import TaskModal from './TaskModal';
import { PlusIcon, CalendarIcon, CheckSquareIcon, MessageSquareIcon, PaperclipIcon } from './Icons';

interface AllTasksViewProps {
    appData: AppData;
    currentUser: User;
    onUpdateTask: (task: Task) => void;
    onAddTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
    onAddClient: (name: string) => Client;
}

const getPriorityClass = (priority: Priority) => {
    switch (priority) {
        case 'Alta': return 'border-l-4 border-red-500';
        case 'Média': return 'border-l-4 border-yellow-500';
        case 'Baixa': return 'border-l-4 border-green-500';
        default: return 'border-l-4 border-border';
    }
};

const TaskCard: React.FC<{ task: Task, onEdit: (task: Task) => void }> = ({ task, onEdit }) => {
    const subtaskProgress = task.subtasks.length > 0 ? task.subtasks.filter(st => st.completed).length : 0;

    return (
        <div 
            onClick={() => onEdit(task)}
            className={`bg-surface p-3 rounded-lg border border-border shadow-sm hover:shadow-lg hover:border-primary/50 cursor-pointer transition-all flex flex-col gap-3 ${getPriorityClass(task.priority)}`}
        >
            <div>
                <p className="font-bold text-text-primary leading-tight">{task.title}</p>
                <p className="text-xs text-text-secondary mt-1">{task.client.name}</p>
            </div>
            
             <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: task.status.color, color: '#fff' }}>
                    {task.status.name}
                </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-text-secondary">
                {task.subtasks.length > 0 && (
                    <div className="flex items-center gap-1.5" title={`${subtaskProgress} de ${task.subtasks.length} subtarefas concluídas`}>
                        <CheckSquareIcon className="w-4 h-4" />
                        <span>{subtaskProgress}/{task.subtasks.length}</span>
                    </div>
                )}
                 {task.comments.length > 0 && (
                    <div className="flex items-center gap-1.5">
                        <MessageSquareIcon className="w-4 h-4" />
                        <span>{task.comments.length}</span>
                    </div>
                )}
                 {task.attachments.length > 0 && (
                    <div className="flex items-center gap-1.5">
                        <PaperclipIcon className="w-4 h-4" />
                        <span>{task.attachments.length}</span>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center mt-auto pt-2 border-t border-border/50">
                <div className="flex items-center -space-x-2">
                    {task.assignees.slice(0, 3).map(user => (
                        <img key={user.id} src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} className="w-7 h-7 rounded-full border-2 border-surface" title={`${user.firstName} ${user.lastName}`}/>
                    ))}
                    {task.assignees.length > 3 && <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold border-2 border-surface">+{task.assignees.length - 3}</div>}
                </div>
                {task.dueDate && (
                    <div className="flex items-center text-xs text-text-secondary bg-secondary px-2 py-1 rounded">
                        <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                        <span>{new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                    </div>
                )}
            </div>
        </div>
    );
};


const AllTasksView: React.FC<AllTasksViewProps> = ({ appData, currentUser, onUpdateTask, onAddTask, onDeleteTask, onAddClient }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [statusForNewTask, setStatusForNewTask] = useState<CustomStatus>(appData.customStatuses[0]);

    const KANBAN_STATUSES = useMemo(() => appData.customStatuses.slice(0, 3).map(s => s.name), [appData.customStatuses]);

    const visibleTasks = useMemo(() =>
        appData.tasks.filter(task =>
            task.assignees.some(assignee => assignee.id === currentUser.id) && task.status.name !== 'Finalizada'
        ), [appData.tasks, currentUser.id]);

    const handleOpenModalForEdit = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleOpenModalForCreate = (statusName: string) => {
        const status = appData.customStatuses.find(s => s.name === statusName) || appData.customStatuses[0];
        setSelectedTask(null);
        setStatusForNewTask(status);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const handleSaveTask = (task: Task) => {
        if (task.id) {
            onUpdateTask(task);
        } else {
            const columnTasks = visibleTasks.filter(t => t.kanbanColumn === task.kanbanColumn);
            const maxOrder = columnTasks.length > 0 ? Math.max(...columnTasks.map(t => t.kanbanOrder)) : 0;
            const newTask = { ...task, id: `task-${Date.now()}`, kanbanOrder: maxOrder + 1000 };
            onAddTask(newTask);
        }
        handleCloseModal();
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
        e.dataTransfer.setData("taskId", taskId);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatusName: string) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        const taskToMove = visibleTasks.find(t => t.id === taskId);
        if (!taskToMove) return;

        const newStatus = appData.customStatuses.find(s => s.name === newStatusName);
        if (!newStatus) return;
    
        const columnTasks = visibleTasks
            .filter(t => t.kanbanColumn === newStatusName && t.id !== taskId)
            .sort((a, b) => a.kanbanOrder - b.kanbanOrder);
    
        let targetElement = e.target as HTMLElement;
        while (targetElement && !targetElement.getAttribute('data-task-id')) {
            targetElement = targetElement.parentElement as HTMLElement;
        }
    
        let newOrder: number;
    
        if (targetElement) {
            const targetTaskId = targetElement.getAttribute('data-task-id');
            const targetTaskIndex = columnTasks.findIndex(t => t.id === targetTaskId);
    
            if (targetTaskIndex !== -1) {
                const rect = targetElement.getBoundingClientRect();
                const isDroppedOnUpperHalf = e.clientY < rect.top + rect.height / 2;
                
                if (isDroppedOnUpperHalf) {
                    const prevTask = columnTasks[targetTaskIndex - 1];
                    const targetTaskOrder = columnTasks[targetTaskIndex].kanbanOrder;
                    const prevTaskOrder = prevTask ? prevTask.kanbanOrder : 0;
                    newOrder = (prevTaskOrder + targetTaskOrder) / 2;
                } else {
                    const nextTask = columnTasks[targetTaskIndex + 1];
                    const targetTaskOrder = columnTasks[targetTaskIndex].kanbanOrder;
                    const nextTaskOrder = nextTask ? nextTask.kanbanOrder : targetTaskOrder + 2000;
                    newOrder = (targetTaskOrder + nextTaskOrder) / 2;
                }
            } else {
                const lastTask = columnTasks[columnTasks.length - 1];
                newOrder = lastTask ? lastTask.kanbanOrder + 1000 : 1000;
            }
        } else {
            const lastTask = columnTasks[columnTasks.length - 1];
            newOrder = lastTask ? lastTask.kanbanOrder + 1000 : 1000;
        }
        
        onUpdateTask({ ...taskToMove, status: newStatus, kanbanColumn: newStatusName, kanbanOrder: newOrder });
        e.currentTarget.classList.remove('bg-secondary/50');
    };
    
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-secondary/50');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
         e.currentTarget.classList.remove('bg-secondary/50');
    }

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
                    defaultStatus={statusForNewTask}
                    onAddClient={onAddClient}
                />
            )}
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Dashboard de Tarefas</h2>
                    <p className="text-text-secondary">Visualize o progresso das tarefas em um quadro Kanban.</p>
                </div>
                 <button onClick={() => handleOpenModalForCreate('A Fazer')} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Nova Tarefa</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {KANBAN_STATUSES.map(statusName => (
                    <div 
                        key={statusName} 
                        className="bg-background rounded-xl p-4 transition-colors"
                        onDrop={(e) => handleDrop(e, statusName)}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-text-primary">{statusName} ({visibleTasks.filter(t => t.kanbanColumn === statusName).length})</h3>
                        </div>
                        <div className="space-y-4 h-[calc(100vh-250px)] overflow-y-auto pr-2">
                           {visibleTasks.filter(t => t.kanbanColumn === statusName)
                           .sort((a,b) => a.kanbanOrder - b.kanbanOrder)
                           .map(task => (
                                <div 
                                    key={task.id} 
                                    draggable 
                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                    data-task-id={task.id}
                                >
                                    <TaskCard task={task} onEdit={handleOpenModalForEdit} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllTasksView;
