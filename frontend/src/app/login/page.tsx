'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' // Impede que o Ngrok intercepte a API e bloqueie o payload de login
        },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.user) {
        localStorage.setItem('aura_email', email);
        router.push('/dashboard');
      } else {
        alert('Erro ao entrar.');
      }
    } catch(err) {
      console.error(err);
      alert('Erro de conexão.');
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
          <h1 className="font-headline font-extrabold text-4xl text-on-surface mb-3">Bem-vindo de volta</h1>
          <p className="text-secondary text-lg mb-10">Acesse sua conta para restaurar suas memórias ou adquirir novos pacotes de magia.</p>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-slate-700">Seu E-mail Institucional ou Pessoal</label>
              <input 
                id="email"
                type="email" 
                placeholder="nome@exemplo.com" 
                className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-primary transition-colors text-slate-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter') handleLogin(e); }}
                required
              />
            </div>
            
            <button 
              type="button" 
              onClick={handleLogin}
              disabled={loading}
              className="w-full editorial-gradient text-on-primary py-4 rounded-xl font-headline font-bold text-lg shadow-lg hover:shadow-primary/30 active:scale-95 transition-all disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? 'Entrando...' : 'Acessar meu painel'}
            </button>
          </div>
          
          <p className="text-slate-500 text-sm mt-8 text-center lg:text-left">
            Ao entrar, você concorda com nossos <Link href="#" className="underline hover:text-primary">Termos de Uso</Link> e <Link href="#" className="underline hover:text-primary">Privacidade</Link>.
          </p>
        </div>
      </div>
      
      {/* Right side: Aesthetic Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 z-10 mix-blend-multiply"></div>
        <img 
          src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=100&w=1200" 
          alt="Vintage memory" 
          className="absolute inset-0 w-full h-full object-cover grayscale-[30%] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-20"></div>
        <div className="absolute bottom-12 left-12 right-12 z-30 text-white border-l-4 border-primary pl-6">
          <h2 className="font-headline font-bold text-3xl mb-3 leading-tight">"Um pedaço do tempo roubado de volta das engrenagens do relógio."</h2>
          <p className="text-slate-200 font-medium tracking-wide uppercase text-sm">— O poder da restauração com IA</p>
        </div>
      </div>
    </div>
  );
}
