import React, { useState } from 'react';
import { User, AppData, Task, UserRole, Client, CustomStatus } from '../types';
import { HomeIcon, ListIcon, UsersIcon, SettingsIcon, LogOutIcon, BarChartIcon, ArchiveIcon, BriefcaseIcon } from './Icons';
import AllTasksView from './AllTasksView';
import MyTasksView from './MyTasksView';
import ProfileModal from './ProfileModal';
import PlatformSettingsView from './PlatformSettingsView';
import ReportsView from './ReportsView';
import UsersView from './UsersView';
import ArchiveView from './ArchiveView';
import ClientsView from './ClientsView';

interface DashboardProps {
    currentUser: User;
    appData: AppData;
    onLogout: () => void;
    onUpdateTask: (task: Task) => void;
    onAddTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
    onUpdateUser: (user: User) => void;
    onAddUser: (firstName: string, lastName: string, email: string, password: string, role: UserRole) => void;
    onDeleteUser: (userId: string) => void;
    onAddClient: (name: string) => Client;
    onUpdateClient: (client: Client) => void;
    onDeleteClient: (clientId: string) => void;
    onAddStatus: (name: string, color: string) => void;
    onUpdateStatus: (status: CustomStatus) => void;
    onDeleteStatus: (statusId: string) => void;
}

type View = 'dashboard' | 'my-tasks' | 'settings' | 'users' | 'reports' | 'archive' | 'clients';

const Dashboard: React.FC<DashboardProps> = ({
    currentUser,
    appData,
    onLogout,
    onUpdateTask,
    onAddTask,
    onDeleteTask,
    onUpdateUser,
    onAddUser,
    onDeleteUser,
    onAddClient,
    onUpdateClient,
    onDeleteClient,
    onAddStatus,
    onUpdateStatus,
    onDeleteStatus,
}) => {
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    
    const isAdmin = currentUser.role === 'Admin';

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <AllTasksView 
                            appData={appData} 
                            onUpdateTask={onUpdateTask} 
                            onAddTask={onAddTask} 
                            onDeleteTask={onDeleteTask}
                            currentUser={currentUser}
                            onAddClient={onAddClient}
                        />;
            case 'my-tasks':
                return <MyTasksView 
                            appData={appData}
                            currentUser={currentUser} 
                            onUpdateTask={onUpdateTask}
                            onDeleteTask={onDeleteTask}
                            onAddClient={onAddClient}
                        />;
            case 'archive':
                return <ArchiveView
                            appData={appData}
                            currentUser={currentUser}
                            onUpdateTask={onUpdateTask}
                            onDeleteTask={onDeleteTask}
                            onAddClient={onAddClient}
                        />;
            case 'clients':
                return isAdmin ? <ClientsView appData={appData} onUpdateClient={onUpdateClient} onDeleteClient={onDeleteClient} /> : <div className="p-8 text-center">Acesso negado.</div>;
            case 'reports':
                 return isAdmin ? <ReportsView appData={appData} /> : <div className="p-8 text-center">Acesso negado.</div>;
            case 'settings':
                return <PlatformSettingsView 
                            appData={appData}
                            onAddStatus={onAddStatus}
                            onUpdateStatus={onUpdateStatus}
                            onDeleteStatus={onDeleteStatus}
                            isAdmin={isAdmin}
                        />;
            case 'users':
                return isAdmin ? <UsersView appData={appData} onAddUser={onAddUser} onDeleteUser={onDeleteUser} onUpdateUser={onUpdateUser} currentUser={currentUser} /> : <div className="p-8 text-center">Acesso negado.</div>;
            default:
                return <AllTasksView 
                            appData={appData} 
                            onUpdateTask={onUpdateTask} 
                            onAddTask={onAddTask} 
                            onDeleteTask={onDeleteTask}
                            currentUser={currentUser}
                            onAddClient={onAddClient}
                        />;
        }
    };

    return (
        <div className="flex h-screen bg-background text-text-primary">
            {isProfileModalOpen && (
                <ProfileModal 
                    user={currentUser} 
                    onClose={() => setIsProfileModalOpen(false)} 
                    onUpdateUser={onUpdateUser} 
                />
            )}
            
            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-border flex flex-col">
                <div className="p-4 flex items-center gap-3 border-b border-border">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">Z</div>
                    <span className="text-xl font-bold">Zenith</span>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    <NavItem icon={<HomeIcon className="w-5 h-5" />} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
                    <NavItem icon={<ListIcon className="w-5 h-5" />} label="Minhas Tarefas" active={activeView === 'my-tasks'} onClick={() => setActiveView('my-tasks')} />
                    <NavItem icon={<ArchiveIcon className="w-5 h-5" />} label="Arquivo" active={activeView === 'archive'} onClick={() => setActiveView('archive')} />

                    {/* Admin only navigation */}
                    {isAdmin && (
                        <>
                            <div className="pt-2 mt-2 border-t border-border/50">
                                <span className="px-2 text-xs font-semibold text-text-secondary uppercase">Admin</span>
                            </div>
                            <NavItem icon={<BarChartIcon className="w-5 h-5" />} label="Relatórios" active={activeView === 'reports'} onClick={() => setActiveView('reports')} />
                            <NavItem icon={<UsersIcon className="w-5 h-5" />} label="Usuários" active={activeView === 'users'} onClick={() => setActiveView('users')} />
                             <NavItem icon={<BriefcaseIcon className="w-5 h-5" />} label="Clientes" active={activeView === 'clients'} onClick={() => setActiveView('clients')} />
                        </>
                    )}
                    
                    <div className="pt-2 mt-2 border-t border-border/50"></div>
                    <NavItem icon={<SettingsIcon className="w-5 h-5" />} label="Configurações" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
                </nav>
                <div className="p-4 border-t border-border flex flex-col space-y-4">
                     <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary text-text-secondary hover:text-text-primary transition-colors">
                        <img src={currentUser.avatarUrl} alt={`${currentUser.firstName} ${currentUser.lastName}`} className="w-8 h-8 rounded-full" />
                        <div className="text-left">
                            <span className="font-semibold text-text-primary">{currentUser.firstName} {currentUser.lastName}</span>
                            <p className="text-xs">{currentUser.role}</p>
                        </div>
                    </button>

                    <button onClick={onLogout} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary text-text-secondary hover:text-text-primary transition-colors">
                        <LogOutIcon className="w-5 h-5" />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-4 border-b border-border bg-surface">
                     {/* Header can be used for breadcrumbs or global search in the future */}
                     <div></div>
                     <div></div>
                </header>
                <div className="flex-1 overflow-y-auto p-8">
                    {renderView()}
                </div>
            </main>
        </div>
    );
};

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
            active ? 'bg-primary text-white' : 'hover:bg-secondary text-text-secondary hover:text-text-primary'
        }`}
    >
        {icon}
        <span className="font-semibold">{label}</span>
    </button>
);


export default Dashboard;
