import React, { useState, useEffect, useMemo } from 'react';
import { AppData, Task, User, CustomStatus, Subtask, Comment, Attachment, AttachmentType, Priority, Client } from '../types';
import { XIcon, CheckSquareIcon, MessageSquareIcon, TrashIcon, PaperclipIcon, FileTextIcon, ImageIcon, VideoIcon } from './Icons';
import { PRIORITY_OPTIONS } from '../constants';
import AddClientModal from './AddClientModal';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Task) => void;
    taskToEdit: Task | null;
    appData: AppData;
    currentUser: User;
    onDelete: (taskId: string) => void;
    onAddClient: (name: string) => Client;
    defaultStatus?: CustomStatus;
}

const emptyTask = (currentUser: User, clients: AppData['clients'], statuses: AppData['customStatuses'], defaultStatus?: CustomStatus): Task => ({
    id: '',
    title: '',
    description: '',
    status: defaultStatus || statuses[0],
    priority: 'Média',
    assignees: [currentUser], // Rule: Creator is automatically an assignee
    dueDate: null,
    client: clients[0], 
    creatorId: currentUser.id,
    comments: [],
    subtasks: [],
    attachments: [],
    kanbanOrder: 0,
    kanbanColumn: (defaultStatus || statuses[0]).name,
});

const getPriorityClass = (priority: Priority) => {
    switch (priority) {
        case 'Alta': return 'text-red-500 bg-red-500/10';
        case 'Média': return 'text-yellow-500 bg-yellow-500/10';
        case 'Baixa': return 'text-green-500 bg-green-500/10';
        default: return 'text-gray-500 bg-gray-500/10';
    }
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, taskToEdit, appData, currentUser, onDelete, onAddClient, defaultStatus }) => {
    
    const [task, setTask] = useState<Task>(taskToEdit || emptyTask(currentUser, appData.clients, appData.customStatuses, defaultStatus));
    const [selectedClientId, setSelectedClientId] = useState<string>(taskToEdit?.client.id ?? (appData.clients[0]?.id || ''));
    const [newComment, setNewComment] = useState('');
    const [newSubtask, setNewSubtask] = useState('');
    const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);
    const [attachmentPreview, setAttachmentPreview] = useState<Attachment | null>(null);
    const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
    
    useEffect(() => {
        const initialTask = taskToEdit || emptyTask(currentUser, appData.clients, appData.customStatuses, defaultStatus);
        setTask(initialTask);
        setSelectedClientId(initialTask.client?.id ?? '');
    }, [taskToEdit, currentUser, appData.clients, appData.customStatuses, defaultStatus]);

    if (!isOpen) return null;

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'statusId') {
            const newStatus = appData.customStatuses.find(s => s.id === value);
            if (newStatus) {
                const isNewStatusKanban = appData.customStatuses.slice(0, 3).some(s => s.id === newStatus.id);
                setTask(prev => ({ 
                    ...prev, 
                    status: newStatus,
                    // Only update kanbanColumn if the new status is a Kanban status
                    kanbanColumn: isNewStatusKanban ? newStatus.name : prev.kanbanColumn
                }));
            }
        } else {
            setTask(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleClientChange = (value: string) => {
        if (value === '__add_new__') {
            setIsAddClientModalOpen(true);
        } else {
            setSelectedClientId(value);
            if (!taskToEdit) {
                 const client = appData.clients.find(c => c.id === value);
                 if(client) {
                    setTask(prev => ({ ...prev, title: `${client.name} - ` }));
                 }
            }
        }
    };

    const handleAddNewClient = (name: string) => {
        const newClient = onAddClient(name);
        setSelectedClientId(newClient.id);
        if (!taskToEdit) {
            setTask(prev => ({ ...prev, title: `${newClient.name} - ` }));
        }
        setIsAddClientModalOpen(false);
    };


    const handleAddAssignee = (user: User) => {
        setTask(prev => ({ ...prev, assignees: [...prev.assignees, user] }));
        setAssigneeDropdownOpen(false);
    };

    const handleRemoveAssignee = (userId: string) => {
        setTask(prev => ({ ...prev, assignees: prev.assignees.filter(a => a.id !== userId) }));
    };

    const handleSubtaskChange = (subtaskId: string, completed: boolean) => {
         setTask(prev => ({
            ...prev,
            subtasks: prev.subtasks.map(st => st.id === subtaskId ? { ...st, completed } : st)
        }));
    }
    
    const handleAddSubtask = () => {
        if (newSubtask.trim()) {
            const subtask: Subtask = {
                id: `subtask-${Date.now()}`,
                title: newSubtask,
                completed: false
            };
            setTask(prev => ({ ...prev, subtasks: [...prev.subtasks, subtask] }));
            setNewSubtask('');
        }
    };

    const handleDeleteSubtask = (subtaskId: string) => {
        setTask(prev => ({ ...prev, subtasks: prev.subtasks.filter(st => st.id !== subtaskId)}));
    };
    
    const handleAddComment = () => {
        if (newComment.trim()) {
            const comment: Comment = {
                id: `comment-${Date.now()}`,
                author: currentUser,
                timestamp: new Date().toISOString(),
                content: newComment
            };
            setTask(prev => ({ ...prev, comments: [...prev.comments, comment] }));
            setNewComment('');
        }
    };

    const handleDeleteComment = (commentId: string) => {
        setTask(prev => ({...prev, comments: prev.comments.filter(c => c.id !== commentId)}));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newAttachments: Attachment[] = files.map((file: File) => {
                let type: AttachmentType = 'document';
                if (file.type.startsWith('image/')) type = 'image';
                if (file.type.startsWith('video/')) type = 'video';
                if (file.type.includes('zip') || file.type.includes('rar')) type = 'archive';
                
                return {
                    id: `att-${Date.now()}-${file.name}`,
                    name: file.name,
                    type: type,
                    url: URL.createObjectURL(file), // Use blob URL for preview
                    size: file.size,
                }
            });
            setTask(prev => ({ ...prev, attachments: [...prev.attachments, ...newAttachments]}));
        }
    };

    const handleRemoveAttachment = (attachmentId: string) => {
        setTask(prev => ({...prev, attachments: prev.attachments.filter(a => a.id !== attachmentId)}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (task.assignees.length === 0) {
            alert('É necessário selecionar pelo menos um responsável para criar a tarefa.');
            return;
        }
        if (!selectedClientId) {
            alert('Por favor, selecione um cliente.');
            return;
        }
        const finalClient = appData.clients.find(c => c.id === selectedClientId);
        if (finalClient) {
            onSave({ ...task, client: finalClient });
        }
    };
    
    const subtaskProgress = useMemo(() => {
        if (task.subtasks.length === 0) return 0;
        const completed = task.subtasks.filter(st => st.completed).length;
        return Math.round((completed / task.subtasks.length) * 100);
    }, [task.subtasks]);

    const availableUsers = appData.users.filter(u => !task.assignees.some(a => a.id === u.id));
    
    const creator = taskToEdit?.originalCreator ?? appData.users.find(u => u.id === taskToEdit?.creatorId);
    const isCreator = taskToEdit ? currentUser.id === taskToEdit.creatorId : true;
    
    const isAssignee = task.assignees.some(a => a.id === currentUser.id);
    const canManageSubtasksAndAssignees = isCreator || isAssignee;
    const canEditSensitiveFields = isCreator || isAssignee;
    const canEditCollaborativeFields = isCreator || isAssignee;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            {attachmentPreview && <AttachmentPreviewModal attachment={attachmentPreview} onClose={() => setAttachmentPreview(null)} />}
            {isAddClientModalOpen && <AddClientModal onAddClient={handleAddNewClient} onClose={() => setIsAddClientModalOpen(false)} />}
            
            <div className="bg-surface rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-border flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold">
                        {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
                    </h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><XIcon className="w-6 h-6" /></button>
                </header>

                <main className="flex-1 overflow-y-auto p-6 grid grid-cols-3 gap-8">
                    {/* Left Column - Details */}
                    <div className="col-span-2 space-y-6">
                         <div>
                            <input type="text" name="title" placeholder="Título da Tarefa" value={task.title} onChange={handleFormChange} disabled={!canEditCollaborativeFields} className="w-full text-2xl font-bold bg-transparent focus:outline-none disabled:opacity-70" />
                            {creator && <p className="text-xs text-text-secondary mt-1">Criado por: {creator.firstName} {creator.lastName} {taskToEdit?.originalCreator ? '(Original)' : ''}</p>}
                         </div>
                         <div>
                            <textarea name="description" placeholder="Adicione uma descrição mais detalhada..." value={task.description} onChange={handleFormChange} rows={5} disabled={!canEditCollaborativeFields} className="w-full p-2 bg-secondary border border-border rounded-lg text-sm disabled:opacity-70"></textarea>
                         </div>
                         
                         <AttachmentSection 
                            attachments={task.attachments}
                            onFileChange={handleFileChange}
                            onRemove={handleRemoveAttachment}
                            onPreview={setAttachmentPreview}
                            canManage={canEditCollaborativeFields}
                         />
                         
                         <SubtaskSection
                            subtasks={task.subtasks}
                            subtaskProgress={subtaskProgress}
                            newSubtask={newSubtask}
                            setNewSubtask={setNewSubtask}
                            onSubtaskChange={handleSubtaskChange}
                            onAddSubtask={handleAddSubtask}
                            onDeleteSubtask={handleDeleteSubtask}
                            canManage={canManageSubtasksAndAssignees}
                         />
                         
                         <CommentSection
                            comments={task.comments}
                            newComment={newComment}
                            setNewComment={setNewComment}
                            onAddComment={handleAddComment}
                            onDeleteComment={handleDeleteComment}
                            currentUser={currentUser}
                            taskCreatorId={taskToEdit?.creatorId ?? task.creatorId}
                         />
                    </div>
                    
                    {/* Right Column - Metadata */}
                    <aside className="col-span-1 space-y-6">
                        <div>
                             <label className="block text-sm font-medium text-text-secondary mb-2">Status</label>
                             <select name="statusId" value={task.status.id} onChange={handleFormChange} className="w-full p-2 bg-secondary border border-border rounded-lg disabled:opacity-70" disabled={!canEditSensitiveFields}>
                                {appData.customStatuses.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                             </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-text-secondary mb-2">Cliente</label>
                             <select name="clientId" value={selectedClientId} onChange={(e) => handleClientChange(e.target.value)} className="w-full p-2 bg-secondary border border-border rounded-lg" disabled={!!taskToEdit}>
                                <option value="" disabled>Selecione o cliente</option>
                                {appData.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                <option value="__add_new__" className="text-primary font-semibold">Adicionar cliente novo...</option>
                             </select>
                        </div>
                        {/* Assignees */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-text-secondary mb-2">Responsáveis</label>
                             <div className="flex flex-wrap gap-2 p-2 bg-secondary border border-border rounded-lg min-h-[40px]">
                                {task.assignees.map(user => (
                                    <div key={user.id} className="flex items-center gap-2 bg-surface px-2 py-1 rounded-full">
                                        <img src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} className="w-5 h-5 rounded-full" />
                                        <span className="text-sm">{user.firstName} {user.lastName}</span>
                                        {canManageSubtasksAndAssignees && 
                                            <button onClick={() => handleRemoveAssignee(user.id)} className="text-text-secondary hover:text-white">
                                                <XIcon className="w-3 h-3"/>
                                            </button>
                                        }
                                    </div>
                                ))}
                                {canManageSubtasksAndAssignees &&
                                    <button onClick={() => setAssigneeDropdownOpen(true)} className="text-sm text-primary hover:underline">
                                        + Adicionar
                                    </button>
                                }
                            </div>
                            {assigneeDropdownOpen && canManageSubtasksAndAssignees && (
                                <>
                                <div onClick={() => setAssigneeDropdownOpen(false)} className="fixed inset-0"></div>
                                <div className="absolute z-10 w-full mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {availableUsers.map(user => (
                                        <div key={user.id} onClick={() => handleAddAssignee(user)} className="flex items-center gap-3 p-2 hover:bg-secondary cursor-pointer">
                                             <img src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} className="w-6 h-6 rounded-full" />
                                             <span className="text-sm">{user.firstName} {user.lastName}</span>
                                        </div>
                                    ))}
                                    {availableUsers.length === 0 && <p className="p-2 text-sm text-text-secondary">Nenhum usuário disponível.</p>}
                                </div>
                                </>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Prioridade</label>
                            <div className="flex gap-2">
                                {PRIORITY_OPTIONS.map(p => (
                                    <button key={p} type="button" onClick={() => canEditSensitiveFields && setTask(prev => ({...prev, priority: p}))} disabled={!canEditSensitiveFields} className={`flex-1 text-sm p-2 rounded-lg border-2 ${task.priority === p ? 'border-primary' : 'border-transparent'} ${getPriorityClass(p)} ${!canEditSensitiveFields ? 'cursor-not-allowed opacity-60' : ''}`}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-text-secondary mb-2">Data de Vencimento</label>
                            <input type="date" id="dueDate" name="dueDate" value={task.dueDate ? task.dueDate.split('T')[0] : ''} onChange={handleFormChange} className="w-full p-2 bg-secondary border border-border rounded-lg disabled:opacity-70" disabled={!canEditSensitiveFields} />
                        </div>
                    </aside>
                </main>
                
                <footer className="p-4 border-t border-border flex justify-between items-center flex-shrink-0">
                    <div>
                        {taskToEdit && isCreator && (
                            <button 
                                onClick={() => {
                                    if (taskToEdit && window.confirm("Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.")) {
                                        onDelete(taskToEdit.id);
                                        onClose();
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-red-500 rounded-lg font-semibold hover:bg-red-500/10 transition-colors"
                            >
                                <TrashIcon className="w-5 h-5" />
                                Excluir Tarefa
                            </button>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button type="button" onClick={onClose} className="px-5 py-2 bg-secondary text-text-primary rounded-lg hover:bg-border font-semibold transition-colors">Cancelar</button>
                        <button onClick={handleSubmit} className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold transition-colors">
                            {taskToEdit ? 'Salvar Alterações' : 'Criar Tarefa'}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

// Extracted Components for Readability

const AttachmentSection: React.FC<{attachments: Attachment[], onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onRemove: (id: string) => void, onPreview: (att: Attachment) => void, canManage: boolean}> = ({ attachments, onFileChange, onRemove, onPreview, canManage }) => {
    const getIcon = (type: AttachmentType) => {
        switch(type) {
            case 'image': return <ImageIcon className="w-5 h-5 text-blue-400"/>;
            case 'video': return <VideoIcon className="w-5 h-5 text-purple-400"/>;
            default: return <FileTextIcon className="w-5 h-5 text-gray-400"/>;
        }
    };
    
    return (
        <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2"><PaperclipIcon className="w-5 h-5" /> Anexos</h3>
            <div className="grid grid-cols-2 gap-2">
                {attachments.map(att => (
                    <div key={att.id} className="bg-secondary p-2 rounded-lg flex items-center justify-between text-sm group">
                        <div className="flex items-center gap-2 overflow-hidden" onClick={(e) => { e.stopPropagation(); onPreview(att); }}>
                           {getIcon(att.type)}
                           <span className="truncate cursor-pointer hover:underline">{att.name}</span>
                        </div>
                        {canManage && 
                            <button onClick={() => onRemove(att.id)} className="opacity-0 group-hover:opacity-100 text-red-500">
                               <XIcon className="w-4 h-4" />
                            </button>
                        }
                    </div>
                ))}
            </div>
            {canManage && 
                <label className="w-full text-center p-2 mt-2 bg-primary/10 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-primary/20 block">
                    <span className="text-primary font-semibold text-sm">Adicionar Anexo</span>
                    <input type="file" multiple onChange={onFileChange} className="hidden" />
                </label>
            }
        </div>
    );
};

const SubtaskSection: React.FC<{subtasks: Subtask[], subtaskProgress: number, newSubtask: string, setNewSubtask: (v:string) => void, onSubtaskChange: (id: string, completed: boolean) => void, onAddSubtask: () => void, onDeleteSubtask: (id: string) => void, canManage: boolean }> = ({ subtasks, subtaskProgress, newSubtask, setNewSubtask, onSubtaskChange, onAddSubtask, onDeleteSubtask, canManage }) => (
    <div className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2"><CheckSquareIcon className="w-5 h-5" /> Subtarefas ({subtasks.filter(st => st.completed).length}/{subtasks.length})</h3>
        {subtasks.length > 0 && (
            <div className="w-full bg-secondary rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${subtaskProgress}%` }}></div>
            </div>
        )}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {subtasks.map(subtask => (
                <div key={subtask.id} className="flex items-center gap-3 p-2 rounded hover:bg-secondary group">
                    <input type="checkbox" checked={subtask.completed} onChange={(e) => canManage && onSubtaskChange(subtask.id, e.target.checked)} disabled={!canManage} className="form-checkbox h-4 w-4 rounded bg-secondary text-primary focus:ring-primary border-border" />
                    <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-text-secondary' : ''}`}>{subtask.title}</span>
                    {canManage && 
                        <button onClick={() => onDeleteSubtask(subtask.id)} className="opacity-0 group-hover:opacity-100 text-red-500">
                           <TrashIcon className="w-4 h-4" />
                        </button>
                    }
                </div>
            ))}
        </div>
        {canManage && 
            <div className="flex gap-2">
                <input type="text" value={newSubtask} onChange={e => setNewSubtask(e.target.value)} placeholder="Adicionar nova subtarefa..." className="flex-1 p-2 bg-secondary border border-border rounded-lg text-sm" />
                <button onClick={onAddSubtask} className="px-4 py-2 bg-primary/80 text-white rounded-lg text-sm font-semibold hover:bg-primary">Adicionar</button>
            </div>
        }
    </div>
);


const CommentSection: React.FC<{comments: Comment[], newComment: string, setNewComment: (v: string) => void, onAddComment: () => void, onDeleteComment: (id: string) => void, currentUser: User, taskCreatorId: string}> = ({ comments, newComment, setNewComment, onAddComment, onDeleteComment, currentUser, taskCreatorId }) => (
    <div className="space-y-3">
         <h3 className="font-semibold flex items-center gap-2"><MessageSquareIcon className="w-5 h-5" /> Comentários</h3>
         <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {comments.map(comment => {
                const canDeleteComment = currentUser.id === comment.author.id || currentUser.id === taskCreatorId;
                return (
                    <div key={comment.id} className="flex items-start gap-3 group">
                        <img src={comment.author.avatarUrl} alt={`${comment.author.firstName} ${comment.author.lastName}`} className="w-8 h-8 rounded-full" />
                        <div className="flex-1 bg-secondary p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-sm">{comment.author.firstName} {comment.author.lastName} <span className="text-xs text-text-secondary font-normal ml-2">{new Date(comment.timestamp).toLocaleString()}</span></p>
                                {canDeleteComment && 
                                    <button onClick={() => onDeleteComment(comment.id)} className="opacity-0 group-hover:opacity-100 text-red-500">
                                       <TrashIcon className="w-4 h-4" />
                                    </button>
                                }
                            </div>
                            <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                    </div>
                )
            })}
         </div>
         <div className="flex gap-3">
             <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Adicionar um comentário..." className="flex-1 p-2 bg-secondary border border-border rounded-lg" />
             <button onClick={onAddComment} className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover">Enviar</button>
         </div>
     </div>
);

const AttachmentPreviewModal: React.FC<{attachment: Attachment, onClose: () => void}> = ({ attachment, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60]" onClick={onClose}>
            <div className="max-w-4xl max-h-[80vh] bg-surface p-4 rounded-lg relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5"><XIcon className="w-5 h-5" /></button>
                {attachment.type === 'image' && <img src={attachment.url} alt={attachment.name} className="max-w-full max-h-[75vh] object-contain" />}
                {attachment.type === 'video' && <video src={attachment.url} controls autoPlay className="max-w-full max-h-[75vh]" />}
                {(attachment.type === 'document' || attachment.type === 'archive') && (
                    <div className="text-center p-8">
                        <p className="mb-4">Pré-visualização não disponível para este tipo de arquivo.</p>
                        <a href={attachment.url} download={attachment.name} className="px-4 py-2 bg-primary text-white rounded-lg">Baixar Arquivo</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskModal;