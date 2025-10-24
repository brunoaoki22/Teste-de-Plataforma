import React, { useState } from 'react';

interface AuthProps {
    onLogin: (email: string, password: string) => void;
    loginError: string | null;
}

const Auth: React.FC<AuthProps> = ({ onLogin, loginError }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryMessage, setRecoveryMessage] = useState('');
    const [view, setView] = useState<'login' | 'forgotPassword'>('login');

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    const handleRecoverySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setRecoveryMessage('Se uma conta com este e-mail existir, um link de recuperação foi enviado.');
        // In a real app, you would call an API here.
    };

    const switchToLoginView = () => {
        setView('login');
        setRecoveryMessage('');
        setRecoveryEmail('');
    }
    
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-xl shadow-lg">
                <div className="flex flex-col items-center justify-center gap-3 mb-4">
                     <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">Z</div>
                     <h1 className="text-3xl font-bold text-text-primary">Bem-vindo ao Zenith</h1>
                </div>

                {view === 'login' ? (
                    <>
                        <h2 className="text-center text-xl text-text-secondary">Faça login para continuar</h2>
                        
                        <form onSubmit={handleLoginSubmit} className="space-y-6 animate-fade-in">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-text-secondary">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-primary focus:border-primary"
                                />
                            </div>
                             <div>
                                   <label className="block mb-2 text-sm font-medium text-text-secondary">Senha</label>
                                   <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 bg-background border border-border rounded-lg" />
                                </div>
                            {loginError && <p className="text-red-500 text-center text-sm animate-fade-in">{loginError}</p>}
                            <button type="submit" className="w-full p-3 text-white bg-primary rounded-lg font-semibold hover:bg-primary-hover transition-colors">
                                Entrar
                            </button>
                        </form>
                         <div className="text-center">
                            <button type="button" onClick={() => setView('forgotPassword')} className="text-sm text-primary hover:underline">
                                Perdeu a senha?
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-center text-xl text-text-secondary">Recuperar Senha</h2>
                        <p className="text-center text-sm text-text-secondary">Insira seu e-mail para receber um link de recuperação.</p>
                        
                        <form onSubmit={handleRecoverySubmit} className="space-y-6 animate-fade-in">
                            <div>
                                <label htmlFor="recovery-email" className="block mb-2 text-sm font-medium text-text-secondary">Email</label>
                                <input
                                    type="email"
                                    id="recovery-email"
                                    value={recoveryEmail}
                                    onChange={(e) => setRecoveryEmail(e.target.value)}
                                    required
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-primary focus:border-primary"
                                />
                            </div>
                            {recoveryMessage && <p className="text-green-500 text-center text-sm animate-fade-in">{recoveryMessage}</p>}
                            <button type="submit" className="w-full p-3 text-white bg-primary rounded-lg font-semibold hover:bg-primary-hover transition-colors">
                                Enviar e-mail de recuperação
                            </button>
                        </form>
                         <div className="text-center">
                            <button type="button" onClick={switchToLoginView} className="text-sm text-primary hover:underline">
                                Voltar para o Login
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Auth;