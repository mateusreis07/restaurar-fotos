'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.user) {
        localStorage.setItem('aura_email', email);
        localStorage.setItem('aura_user_id', data.user.id);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Erro ao criar conta.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro de conexão ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-16 lg:px-24">
        <Link href="/">
          <div className="text-2xl font-bold tracking-tighter text-primary font-headline mb-12">Aura Recall</div>
        </Link>
        
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <h1 className="font-headline font-extrabold text-4xl text-on-surface mb-3">Crie sua conta</h1>
          <p className="text-secondary text-lg mb-10">Junte-se a nós e comece a restaurar suas memórias preciosas hoje mesmo.</p>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 italic">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-bold text-slate-700">Nome e Sobrenome</label>
              <input 
                id="name"
                type="text" 
                placeholder="Ex Carlos Silva" 
                className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-primary transition-colors text-slate-800"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-slate-700">Seu Melhor E-mail</label>
              <input 
                id="email"
                type="email" 
                placeholder="nome@exemplo.com" 
                className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-primary transition-colors text-slate-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold text-slate-700">Crie uma Senha Segura</label>
              <input 
                id="password"
                type="password" 
                placeholder="••••••••" 
                className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-primary transition-colors text-slate-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full editorial-gradient text-on-primary py-4 rounded-xl font-headline font-bold text-lg shadow-lg hover:shadow-primary/30 active:scale-95 transition-all disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? 'Criando conta...' : 'Começar a restaurar'}
            </button>
          </form>
          
          <p className="text-slate-500 text-sm mt-8 text-center lg:text-left">
            Já tem uma conta? <Link href="/login" className="text-primary font-bold hover:underline">Faça login aqui</Link>
          </p>
        </div>
      </div>
      
      {/* Right side: Aesthetic Grid of Memories (Shared with login) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 z-10 mix-blend-overlay"></div>
        
        {/* Memory Grid */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-3 p-4">
          {[
            "/examples/login_woman.png",
            "/examples/login_children.png",
            "/examples/example1.png",
            "/examples/example2.png",
            "/examples/example3.png",
            "/examples/example4.png"
          ].map((url, i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl group shadow-inner border border-white/10">
              <img 
                src={url} 
                className="w-full h-full object-cover grayscale-[15%] sepia-[10%] contrast-110 brightness-110 group-hover:scale-110 transition-transform duration-700" 
                alt={`Memory ${i}`} 
              />
              <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40 z-20"></div>
        
        <div className="absolute bottom-12 left-12 right-12 z-30 text-white border-l-4 border-primary pl-6">
          <h2 className="font-headline font-bold text-3xl mb-3 leading-tight">"O tempo tenta apagar, mas a Aura Recall ajuda você a lembrar."</h2>
          <p className="text-slate-200 font-medium tracking-wide uppercase text-sm">— Cada crédito é uma história recuperada</p>
        </div>
      </div>
    </div>
  );
}
