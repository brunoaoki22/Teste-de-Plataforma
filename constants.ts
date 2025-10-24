import { AppData, Priority, CustomStatus, User } from './types';

// Mock data for initial state
const USERS: User[] = [
    { id: 'user-1', firstName: 'Alice', lastName: 'Santos', password: 'password123', role: 'Admin' as const, avatarUrl: 'https://i.pravatar.cc/150?u=user-1', email: 'alice@zenith.com', age: 34, city: 'São Paulo' },
    { id: 'user-2', firstName: 'Bruno', lastName: 'Costa', password: 'password123', role: 'Membro' as const, avatarUrl: 'https://i.pravatar.cc/150?u=user-2', email: 'bruno@zenith.com', age: 28, city: 'Rio de Janeiro' },
    { id: 'user-3', firstName: 'Carla', lastName: 'Dias', password: 'password123', role: 'Membro' as const, avatarUrl: 'https://i.pravatar.cc/150?u=user-3', email: 'carla@zenith.com', age: 25, city: 'Belo Horizonte' },
    { id: 'user-4', firstName: 'Daniel', lastName: 'Alves', password: 'password123', role: 'Membro' as const, avatarUrl: 'https://i.pravatar.cc/150?u=user-4', email: 'daniel@zenith.com', age: 31, city: 'São Paulo' },
    { id: 'user-5', firstName: 'Bruno', lastName: 'Aoki', password: 'cajati2012', role: 'Admin' as const, avatarUrl: 'https://i.pravatar.cc/150?u=brunoaoki22@gmail.com', email: 'brunoaoki22@gmail.com', age: null, city: '' },
];

const CLIENTS = [
    { id: 'client-1', name: 'InovaTech' },
    { id: 'client-2', name: 'Soluções Criativas' },
];

export const INITIAL_CUSTOM_STATUSES: CustomStatus[] = [
    { id: 'status-1', name: 'A Fazer', color: '#9CA3AF' },
    { id: 'status-2', name: 'Em Progresso', color: '#60A5FA' },
    { id: 'status-3', name: 'Concluído', color: '#4ADE80' },
    { id: 'status-4', name: 'Pendência do cliente', color: '#FBBF24' },
    { id: 'status-5', name: 'Pendência de vídeo', color: '#F472B6' },
    { id: 'status-6', name: 'Pendência de arte', color: '#F472B6' },
    { id: 'status-7', name: 'Pendência de foto', color: '#F472B6' },
    { id: 'status-8', name: 'Finalizada', color: '#A78BFA' },
];

const TASKS = [
    {
        id: 'task-1',
        title: 'InovaTech - Desenvolver a nova landing page',
        description: 'Criar uma landing page responsiva e moderna para o lançamento do produto X.',
        status: INITIAL_CUSTOM_STATUSES[1], // Em Progresso
        priority: 'Alta' as const,
        assignees: [USERS[1], USERS[2], USERS[0]],
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        client: CLIENTS[0],
        creatorId: 'user-1',
        comments: [
            { id: 'comment-1', author: USERS[0], timestamp: new Date().toISOString(), content: 'Precisamos garantir que o SEO esteja otimizado.' }
        ],
        subtasks: [
            { id: 'sub-1-1', title: 'Estrutura HTML e CSS', completed: true },
            { id: 'sub-1-2', title: 'Implementar formulário de contato', completed: false },
            { id: 'sub-1-3', title: 'Testar em múltiplos navegadores', completed: false },
        ],
        attachments: [],
        kanbanOrder: 1000,
        kanbanColumn: 'Em Progresso',
    },
    {
        id: 'task-2',
        title: 'Soluções Criativas - Atualização do sistema de login',
        description: 'Implementar autenticação de dois fatores (2FA) para maior segurança.',
        status: INITIAL_CUSTOM_STATUSES[0], // A Fazer
        priority: 'Alta' as const,
        assignees: [USERS[3], USERS[0]],
        dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
        client: CLIENTS[1],
        creatorId: 'user-1',
        comments: [],
        subtasks: [],
        attachments: [],
        kanbanOrder: 2000,
        kanbanColumn: 'A Fazer',
    },
    {
        id: 'task-3',
        title: 'InovaTech - Criar wireframes para o aplicativo móvel',
        description: 'Desenhar os wireframes de baixa fidelidade para as principais telas do app.',
        status: INITIAL_CUSTOM_STATUSES[2], // Concluído
        priority: 'Média' as const,
        assignees: [USERS[2]],
        dueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
        client: CLIENTS[0],
        creatorId: 'user-2',
        comments: [],
        subtasks: [
             { id: 'sub-3-1', title: 'Tela de login', completed: true },
             { id: 'sub-3-2', title: 'Tela inicial', completed: true },
             { id: 'sub-3-3', title: 'Tela de perfil', completed: true },
        ],
        attachments: [],
        kanbanOrder: 3000,
        kanbanColumn: 'Concluído',
    },
    {
        id: 'task-4',
        title: 'Soluções Criativas - Configurar CI/CD pipeline',
        description: 'Automatizar o processo de build e deploy da aplicação.',
        status: INITIAL_CUSTOM_STATUSES[0], // A Fazer
        priority: 'Média' as const,
        assignees: [USERS[1], USERS[3]],
        dueDate: null,
        client: CLIENTS[1],
        creatorId: 'user-1',
        comments: [],
        subtasks: [],
        attachments: [],
        kanbanOrder: 4000,
        kanbanColumn: 'A Fazer',
    },
    {
        id: 'task-5',
        title: 'InovaTech - Corrigir bug no carrinho de compras',
        description: 'Itens não estão sendo somados corretamente no total.',
        status: INITIAL_CUSTOM_STATUSES[3], // Pendência do cliente
        priority: 'Baixa' as const,
        assignees: [USERS[1], USERS[0]],
        dueDate: null,
        client: CLIENTS[0],
        creatorId: 'user-2',
        comments: [
            { id: 'comment-2', author: USERS[1], timestamp: new Date().toISOString(), content: 'Aguardando as regras de negócio atualizadas do cliente.' }
        ],
        subtasks: [],
        attachments: [],
        kanbanOrder: 5000,
        kanbanColumn: 'Em Progresso', // Example: Was in progress, now waiting for client
    },
];

export const INITIAL_APP_DATA: AppData = {
    users: USERS,
    tasks: TASKS,
    clients: CLIENTS,
    customStatuses: INITIAL_CUSTOM_STATUSES,
};

export const KANBAN_STATUSES = () => INITIAL_APP_DATA.customStatuses.slice(0, 3).map(s => s.name);
export const PRIORITY_OPTIONS: readonly Priority[] = ['Baixa', 'Média', 'Alta'];