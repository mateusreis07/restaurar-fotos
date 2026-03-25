'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = '';

export default function Dashboard() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // Load saved session on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('aura_email');
    if (savedEmail) {
      setEmail(savedEmail);
      fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: savedEmail })
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          loadPhotos(data.user.id);
        }
      })
      .catch(console.error);
    }
  }, []);

  // Simple Mock Login System corresponding to backend POST /api/auth/login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('aura_email', email);
        loadPhotos(data.user.id);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const loadPhotos = async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/photos/history/${userId}`);
      const data = await res.json();
      if (data.photos) setPhotos(data.photos);
    } catch(err) {
      console.error(err);
    }
  };

  // Upload handler
  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id);

    try {
      const res = await fetch(`${API_URL}/api/photos/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUser({ ...user, credits: data.creditsLeft });
        setPhotos([data.photo, ...photos]);
        setFile(null);
        alert('Foto enviada! Aguarde alguns segundos e atualize para ver a restauração (mock).');
      } else {
        alert('Erro: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  };

  // Stripe Checkout
  const handleBuyCredits = async (planId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/api/webhook/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, planId })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch(err) {
      console.error('Checkout error');
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="p-10 bg-white rounded-xl shadow-xl max-w-md w-full text-center">
          <h1 className="font-headline font-bold text-3xl mb-2 text-primary">Aura Recall</h1>
          <p className="text-secondary mb-8">Entre para acessar suas memórias</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="Digite seu email" 
              className="p-4 rounded-xl border border-outline-variant bg-surface-container-low focus:outline-none focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="editorial-gradient text-white p-4 rounded-xl font-headline font-bold">
              Entrar Continuar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <nav className="fixed top-0 w-full z-50 glass-panel shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/"><div className="text-2xl font-bold tracking-tighter text-primary font-headline">Aura Recall</div></Link>
          <div className="flex items-center space-x-4">
            <span className="font-bold text-on-surface">Créditos: <span className="text-primary">{user.credits}</span></span>
            <button onClick={() => { setUser(null); localStorage.removeItem('aura_email'); }} className="text-sm font-medium text-secondary hover:text-primary">Sair</button>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar / Upload Region */}
        <aside className="space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/20">
            <h2 className="font-headline font-bold text-xl mb-4">Restaurar nova foto</h2>
            {user.credits > 0 ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-primary/30 p-8 rounded-xl text-center bg-surface-container-low">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2">upload</span>
                  <p className="text-sm font-medium text-secondary mb-4">Arraste ou clique para selecionar</p>
                  <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm" />
                </div>
                <button 
                  onClick={handleUpload} 
                  disabled={uploading || !file}
                  className="w-full editorial-gradient text-on-primary py-4 rounded-xl font-headline font-bold disabled:opacity-50"
                >
                  {uploading ? 'Enviando...' : 'Restaurar com IA'}
                </button>
              </div>
            ) : (
              <div className="text-center p-6 bg-error-container/20 rounded-xl">
                <p className="text-error font-medium">Você não tem créditos!</p>
              </div>
            )}
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/20">
            <h2 className="font-headline font-bold text-xl mb-4">Comprar Créditos</h2>
            <div className="space-y-3">
              <button onClick={() => handleBuyCredits('price_5')} className="w-full text-left p-4 rounded-lg bg-surface hover:bg-surface-container-low transition-colors border border-outline-variant/20 flex justify-between font-medium">
                <span>5 Fotos</span> <span className="text-primary font-bold">R$ 29</span>
              </button>
              <button onClick={() => handleBuyCredits('price_10')} className="w-full text-left p-4 rounded-lg bg-primary-fixed text-on-primary-fixed hover:opacity-90 flex justify-between font-bold">
                <span>10 Fotos (+ IA Facial Avançada)</span> <span>R$ 49</span>
              </button>
              <button onClick={() => handleBuyCredits('price_20')} className="w-full text-left p-4 rounded-lg bg-surface hover:bg-surface-container-low transition-colors border border-outline-variant/20 flex justify-between font-medium">
                <span>20 Fotos</span> <span className="text-primary font-bold">R$ 79</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Gallery Region */}
        <section className="col-span-1 lg:col-span-2">
          <h2 className="font-headline font-extrabold text-3xl mb-6">Suas Memórias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {photos.length === 0 ? (
              <p className="text-secondary p-8 bg-surface rounded-xl">Você ainda não restaurou nenhuma foto.</p>
            ) : (
              photos.map((photo) => (
                <div key={photo.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/20">
                   <div className="w-full aspect-square bg-slate-100 rounded-lg mb-4 overflow-hidden relative">
                      {photo.status === 'PROCESSING' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                           <span className="text-white font-bold animate-pulse">A IA está processando...</span>
                        </div>
                      )}
                      {/* Show Restored or Original */}
                      <img src={photo.restoredUrl || photo.originalUrl} alt="Memory" className="w-full h-full object-cover" />
                   </div>
                   <div className="flex justify-between items-center">
                     <span className={`text-xs font-bold px-2 py-1 rounded-full ${photo.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                       {photo.status}
                     </span>
                     {photo.status === 'COMPLETED' && (
                       <a href={photo.restoredUrl} target="_blank" download className="text-sm font-bold text-primary flex items-center gap-1">
                         <span className="material-symbols-outlined text-sm">download</span> Baixar
                       </a>
                     )}
                   </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
