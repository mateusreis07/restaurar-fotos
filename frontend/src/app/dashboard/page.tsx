'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const router = useRouter();

  // Load saved session on mount and protect route
  useEffect(() => {
    const savedEmail = localStorage.getItem('aura_email');
    if (!savedEmail) {
      router.push('/login');
      return;
    }
    
    setIsAuthChecking(true);
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: savedEmail })
    })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
        loadPhotos(data.user.id);
      } else {
        localStorage.removeItem('aura_email');
        router.push('/login');
      }
    })
    .catch((err) => {
      console.error(err);
      router.push('/login');
    })
    .finally(() => setIsAuthChecking(false));
  }, [router]);

  const loadPhotos = async (userId: string) => {
    try {
      const res = await fetch(`/api/photos/history/${userId}`);
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
      const res = await fetch('/api/photos/upload', {
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
      const res = await fetch('/api/webhook/checkout', {
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

  // Render auth checking state to prevent flicker
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <p className="text-secondary font-headline font-medium animate-pulse">Carregando memórias...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface">
      <nav className="fixed top-0 w-full z-50 glass-panel shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/"><div className="text-2xl font-bold tracking-tighter text-primary font-headline">Aura Recall</div></Link>
          <div className="flex items-center space-x-4">
            <span className="font-bold text-on-surface">Créditos: <span className="text-primary">{user.credits}</span></span>
            <button onClick={() => { setUser(null); localStorage.removeItem('aura_email'); router.push('/login'); }} className="text-sm font-medium text-secondary hover:text-primary transition-colors">Sair</button>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar / Upload Region */}
        <aside className="space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-slate-200/60 transition-all hover:shadow-md">
            <h2 className="font-headline font-bold text-xl mb-4">Restaurar nova foto</h2>
            {user.credits > 0 ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-primary/30 p-8 rounded-xl text-center bg-surface-container-low transition-colors hover:bg-primary/5 cursor-pointer">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2">upload</span>
                  <p className="text-sm font-medium text-secondary mb-4">Arraste ou clique para selecionar</p>
                  <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm" />
                </div>
                <button 
                  onClick={handleUpload} 
                  disabled={uploading || !file}
                  className="w-full editorial-gradient text-on-primary py-4 rounded-xl font-headline font-bold disabled:opacity-50 hover:shadow-lg transition-all active:scale-95"
                >
                  {uploading ? 'Enviando ao Laboratório...' : 'Restaurar com IA'}
                </button>
              </div>
            ) : (
              <div className="text-center p-6 bg-error-container/20 border border-error/20 rounded-xl">
                <span className="material-symbols-outlined text-error text-3xl mb-2">error</span>
                <p className="text-error font-medium">Seu saldo acabou!</p>
                <p className="text-error/80 text-sm mt-1">Adquira um novo pacote abaixo.</p>
              </div>
            )}
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-slate-200/60">
            <h2 className="font-headline font-bold text-xl mb-4">Comprar Créditos</h2>
            <div className="space-y-3">
              <button onClick={() => handleBuyCredits('price_5')} className="w-full text-left p-4 rounded-xl bg-surface hover:bg-surface-container-low transition-colors border border-slate-200 flex justify-between items-center group">
                <span className="font-medium text-slate-700">5 Fotos</span> 
                <span className="text-primary font-bold group-hover:scale-110 transition-transform">R$ 29</span>
              </button>
              <button onClick={() => handleBuyCredits('price_10')} className="w-full text-left p-4 rounded-xl editorial-gradient text-white hover:opacity-90 flex justify-between items-center shadow-lg hover:shadow-primary/30 active:scale-95 transition-all">
                <span className="font-bold">10 Fotos (Mais Comum)</span> 
                <span className="font-bold text-lg">R$ 49</span>
              </button>
              <button onClick={() => handleBuyCredits('price_20')} className="w-full text-left p-4 rounded-xl bg-surface hover:bg-surface-container-low transition-colors border border-slate-200 flex justify-between items-center group">
                <span className="font-medium text-slate-700">20 Fotos</span> 
                <span className="text-primary font-bold group-hover:scale-110 transition-transform">R$ 79</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Gallery Region */}
        <section className="col-span-1 lg:col-span-2">
          <h2 className="font-headline font-extrabold text-3xl mb-6">Aura Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {photos.length === 0 ? (
              <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-16 bg-surface-container-low rounded-2xl border border-slate-200/60 border-dashed text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">monochrome_photos</span>
                <p className="text-secondary font-medium text-lg">Você ainda não restaurou nenhuma fita histórica.</p>
                <p className="text-slate-400 text-sm">Seu baú de memórias está vazio.</p>
              </div>
            ) : (
              photos.map((photo) => (
                <div key={photo.id} className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow group">
                   <div className="w-full aspect-square bg-slate-100 rounded-xl mb-4 overflow-hidden relative border border-slate-200/50">
                      {photo.status === 'PROCESSING' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 z-10 backdrop-blur-sm">
                           <div className="flex flex-col items-center space-y-3">
                             <span className="material-symbols-outlined text-white text-4xl animate-spin">autorenew</span>
                             <span className="text-white font-bold animate-pulse">A IA está reconstruindo...</span>
                           </div>
                        </div>
                      )}
                      <img src={photo.restoredUrl || photo.originalUrl} alt="Memory" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   </div>
                   <div className="flex justify-between items-center px-1">
                     <span className={`text-xs font-bold px-3 py-1.5 rounded-full tracking-wide ${photo.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'}`}>
                       {photo.status === 'COMPLETED' ? 'RESTAURADA' : 'PROCESSANDO'}
                     </span>
                     {photo.status === 'COMPLETED' && (
                       <a href={photo.restoredUrl} target="_blank" download className="text-sm font-bold text-primary flex items-center gap-1 hover:opacity-70 transition-opacity">
                         <span className="material-symbols-outlined text-[18px]">download</span> Salvar
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
