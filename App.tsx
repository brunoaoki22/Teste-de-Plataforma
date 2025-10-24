import React, { useState, useCallback } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { User, AppData, Task, UserRole, Client, CustomStatus } from './types';
import { INITIAL_APP_DATA } from './constants';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [appData, setAppData] = useState<AppData>(INITIAL_APP_DATA);
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleLogin = useCallback((email: string, password: string) => {
        const user = appData.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (user) {
            setCurrentUser(user);
            setLoginError(null);
        } else {
            setLoginError('Senha ou login incorreto.');
        }
    }, [appData.users]);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
    }, []);

    // Public registration is removed. User creation is now handled by admins inside the Dashboard.
    
    const handleUpdateTask = useCallback((updatedTask: Task) => {
        setAppData(prevData => ({
            ...prevData,
            tasks: prevData.tasks.map(task => task.id === updatedTask.id ? updatedTask : task),
        }));
    }, []);

    const handleAddTask = useCallback((newTask: Task) => {
        setAppData(prevData => ({
            ...prevData,
            tasks: [...prevData.tasks, newTask],
        }));
    }, []);

    // Corrected delete function
    const handleDeleteTask = (taskId: string) => {
        setAppData(prevData => {
            const taskIndex = prevData.tasks.findIndex(task => task.id === taskId);
    
            if (taskIndex === -1) {
                console.error(`[handleDeleteTask] Task with ID "${taskId}" not found. Deletion failed.`);
                // Return the state unchanged to prevent crashes if task not found.
                return prevData;
            }
    
            const newTasks = [...prevData.tasks];
            newTasks.splice(taskIndex, 1); // Remove the item at the found index
    
            return {
                ...prevData,
                tasks: newTasks,
            };
        });
    };
    
    const handleUpdateUser = useCallback((updatedUser: User) => {
        const adminCount = appData.users.filter(u => u.role === 'Admin').length;
        const userBeingUpdated = appData.users.find(u => u.id === updatedUser.id);
        
        if (adminCount === 1 && userBeingUpdated?.role === 'Admin' && updatedUser.role === 'Membro') {
            alert('Não é possível rebaixar o último administrador do sistema.');
            return;
        }

        setAppData(prevData => ({
            ...prevData,
            users: prevData.users.map(user => user.id === updatedUser.id ? updatedUser : user),
        }));
        if (currentUser && currentUser.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
    }, [currentUser, appData.users]);

    const handleAddUser = useCallback((firstName: string, lastName: string, email: string, password: string, role: UserRole) => {
         const newUser: User = {
            id: `user-${Date.now()}`,
            firstName,
            lastName,
            email,
            password,
            role,
            avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
            age: null,
            city: ''
        };
        setAppData(prevData => ({ ...prevData, users: [...prevData.users, newUser] }));
    }, []);

    const handleDeleteUser = useCallback((userId: string) => {
        if (!currentUser || currentUser.role !== 'Admin') return;
        
        const userToDelete = appData.users.find(u => u.id === userId);
        if (!userToDelete) return;
        
        const tasksCreatedByUser = appData.tasks.filter(t => t.creatorId === userId);
        if (tasksCreatedByUser.length > 0) {
             const confirmation = window.confirm(
                `${userToDelete.firstName} ${userToDelete.lastName} é o criador de ${tasksCreatedByUser.length} tarefa(s). Se você excluir este usuário, você se tornará o novo responsável por elas. Deseja continuar?`
            );
            if (!confirmation) return;
        }


        setAppData(prevData => {
            const newTasks = prevData.tasks.map(task => {
                const newAssignees = task.assignees.filter(a => a.id !== userId);
                let newCreatorId = task.creatorId;
                let newOriginalCreator = task.originalCreator;

                if (task.creatorId === userId) {
                    newCreatorId = currentUser.id;
                    if (!task.originalCreator) {
                        newOriginalCreator = userToDelete;
                    }
                }

                return {
                    ...task,
                    assignees: newAssignees,
                    creatorId: newCreatorId,
                    originalCreator: newOriginalCreator,
                };
            });

            return {
                ...prevData,
                users: prevData.users.filter(u => u.id !== userId),
                tasks: newTasks,
            };
        });
    }, [currentUser, appData.users, appData.tasks]);

    const handleAddClient = useCallback((name: string): Client => {
        const newClient: Client = {
            id: `client-${Date.now()}`,
            name,
        };
        setAppData(prev => ({ ...prev, clients: [...prev.clients, newClient] }));
        return newClient;
    }, []);

    const handleUpdateClient = useCallback((updatedClient: Client) => {
        setAppData(prev => ({
            ...prev,
            clients: prev.clients.map(c => (c.id === updatedClient.id ? updatedClient : c)),
            tasks: prev.tasks.map(t =>
                t.client.id === updatedClient.id ? { ...t, client: updatedClient } : t
            ),
        }));
    }, []);

    const handleDeleteClient = useCallback((clientId: string) => {
        const isClientInUse = appData.tasks.some(task => task.client.id === clientId);
        if (isClientInUse) {
            alert('Não é possível excluir este cliente, pois ele está associado a uma ou mais tarefas.');
            return;
        }
        setAppData(prev => ({
            ...prev,
            clients: prev.clients.filter(c => c.id !== clientId),
        }));
    }, [appData.tasks]);

    const handleAddStatus = useCallback((name: string, color: string) => {
        const newStatus: CustomStatus = {
            id: `status-${Date.now()}`,
            name,
            color,
        };
        setAppData(prev => ({...prev, customStatuses: [...prev.customStatuses, newStatus]}));
    }, []);

    const handleUpdateStatus = useCallback((updatedStatus: CustomStatus) => {
        setAppData(prev => ({
            ...prev,
            customStatuses: prev.customStatuses.map(s => s.id === updatedStatus.id ? updatedStatus : s),
            tasks: prev.tasks.map(t => t.status.id === updatedStatus.id ? { ...t, status: updatedStatus } : t)
        }));
    }, []);

    const handleDeleteStatus = useCallback((statusId: string) => {
        const isStatusInUse = appData.tasks.some(t => t.status.id === statusId);
        if (isStatusInUse) {
            alert('Não é possível excluir este status, pois ele está sendo usado em uma ou mais tarefas.');
            return;
        }
        setAppData(prev => ({
            ...prev,
            customStatuses: prev.customStatuses.filter(s => s.id !== statusId)
        }));
    }, [appData.tasks]);


    if (!currentUser) {
        return <Auth onLogin={handleLogin} loginError={loginError} />;
    }

    return (
        <Dashboard
            currentUser={currentUser}
            appData={appData}
            onLogout={handleLogout}
            onUpdateTask={handleUpdateTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onUpdateUser={handleUpdateUser}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onAddClient={handleAddClient}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
            onAddStatus={handleAddStatus}
            onUpdateStatus={handleUpdateStatus}
            onDeleteStatus={handleDeleteStatus}
        />
    );
};

export default App;