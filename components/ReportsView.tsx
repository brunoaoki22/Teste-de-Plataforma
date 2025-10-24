import React, { useState, useMemo } from 'react';
import { AppData, Task, User } from '../types';
import { FlagIcon, CalendarIcon } from './Icons';

const getPriorityClass = (priority: Task['priority']) => {
    switch (priority) {
        case 'Alta': return 'text-red-500';
        case 'Média': return 'text-yellow-500';
        case 'Baixa': return 'text-green-500';
        default: return 'text-gray-500';
    }
};

const ReportsView: React.FC<{ appData: AppData }> = ({ appData }) => {
    const members = useMemo(() => appData.users.sort((a, b) => a.firstName.localeCompare(b.firstName)), [appData.users]);
    const [selectedUserId, setSelectedUserId] = useState<string>(members[0]?.id || '');

    const selectedUser = useMemo(() => members.find(u => u.id === selectedUserId), [members, selectedUserId]);

    const userTasks = useMemo(() => {
        if (!selectedUserId) return [];
        return appData.tasks
            .filter(task => task.assignees.some(assignee => assignee.id === selectedUserId))
            .sort((a, b) => new Date(b.dueDate || 0).getTime() - new Date(a.dueDate || 0).getTime());
    }, [appData.tasks, selectedUserId]);

    const stats = useMemo(() => {
        const total = userTasks.length;
        const completed = userTasks.filter(t => t.status.name === (appData.customStatuses[2]?.name || 'Concluído')).length;
        const inProgress = userTasks.filter(t => t.status.name === (appData.customStatuses[1]?.name || 'Em Progresso')).length;
        const pending = userTasks.filter(t => t.status.name === (appData.customStatuses[0]?.name || 'A Fazer')).length;
        return { total, completed, inProgress, pending };
    }, [userTasks, appData.customStatuses]);

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-text-primary">Relatórios de Desempenho</h2>
                <p className="text-text-secondary">Analise o desempenho individual de cada membro da equipe.</p>
            </header>

            <div className="mb-6">
                <label htmlFor="member-select" className="block text-sm font-medium text-text-secondary mb-2">
                    Selecione um membro da equipe:
                </label>
                <select
                    id="member-select"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full max-w-sm p-2 bg-surface border border-border rounded-lg"
                >
                    {members.map(member => (
                        <option key={member.id} value={member.id}>{member.firstName} {member.lastName}</option>
                    ))}
                </select>
            </div>
            
            {selectedUser && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Total de Tarefas" value={stats.total} />
                        <StatCard title="Concluídas" value={stats.completed} />
                        <StatCard title="Em Progresso" value={stats.inProgress} />
                        <StatCard title="Pendentes (A Fazer)" value={stats.pending} />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-4">Tarefas Atribuídas a {selectedUser.firstName} {selectedUser.lastName}</h3>

                    <div className="bg-surface rounded-xl border border-border overflow-hidden">
                        {userTasks.length > 0 ? (
                             <table className="w-full text-left">
                                <thead className="border-b border-border text-sm text-text-secondary bg-secondary">
                                    <tr>
                                        <th className="p-4 font-semibold">Tarefa</th>
                                        <th className="p-4 font-semibold">Cliente</th>
                                        <th className="p-4 font-semibold">Status</th>
                                        <th className="p-4 font-semibold">Prioridade</th>
                                        <th className="p-4 font-semibold">Vencimento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userTasks.map(task => (
                                        <tr key={task.id} className="border-b border-border last:border-b-0 hover:bg-secondary">
                                            <td className="p-4 font-medium">{task.title}</td>
                                            <td className="p-4 text-text-secondary">{task.client.name}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white`} style={{ backgroundColor: task.status.color }}>
                                                    {task.status.name}
                                                </span>
                                            </td>
                                            <td className={`p-4 font-medium ${getPriorityClass(task.priority)}`}>
                                                <span className="flex items-center gap-2">
                                                    <FlagIcon className="w-4 h-4" />
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="p-4 text-text-secondary">
                                                {task.dueDate ? 
                                                    <span className="flex items-center gap-2">
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
                                {selectedUser.firstName} {selectedUser.lastName} não tem tarefas atribuídas.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: number | string }> = ({ title, value }) => (
    <div className="bg-surface p-6 rounded-xl border border-border">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
);

export default ReportsView;
