'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const hideOnPaths = ['/login', '/signup', '/', '/terms', '/privacy', '/security', '/quality'];

export default function Sidebar() {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isHidden = hideOnPaths.includes(pathname);

  useEffect(() => {
    if (isHidden) return;
    
    const userId = localStorage.getItem('aura_user_id');
    if (userId) {
      fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(err => console.error('Sidebar fetch error', err));
    }
  }, [pathname, isHidden]);

  if (isHidden) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="hidden md:flex flex-col h-screen w-[280px] bg-[#f9f9ff] p-4 space-y-2 sticky top-0 shrink-0 border-r border-[#c7c4d7]/30">
        <div className="px-5 py-6 mb-2">
            <span className="text-[22px] font-black tracking-tight text-[#483ede] font-headline">Aura Recall</span>
        </div>

        <div className="mb-8 px-5">
            <p className="text-[#151c27] font-headline font-extrabold text-[19px] leading-tight tracking-tight">Bem-vindo de volta</p>
            <p className="text-[#575f6a] text-[14px] font-medium mt-1">Preservando seu legado</p>
        </div>

        <nav className="flex-1 space-y-1.5 px-2">
            <Link href="/dashboard" className={`flex items-center gap-3.5 px-4 py-3.5 rounded-[14px] font-bold transition-transform duration-200 hover:translate-x-1 ${isActive('/dashboard') ? 'bg-[#dce2f3] text-[#483ede] shadow-sm shadow-[#dce2f3]/50' : 'text-[#575f6a] hover:text-[#151c27] hover:bg-[#f0f3ff]'}`}>
                <span className="material-symbols-outlined text-[22px]" style={{fontVariationSettings: isActive('/dashboard') ? "'FILL' 1" : "'FILL' 0"}}>photo_library</span>
                <span className="text-[15px]">Minha Galeria</span>
            </Link>
            <Link href="/present" className={`flex items-center gap-3.5 px-4 py-3.5 rounded-[14px] font-bold transition-transform duration-200 hover:translate-x-1 ${isActive('/present') ? 'bg-[#dce2f3] text-[#483ede] shadow-sm shadow-[#dce2f3]/50' : 'text-[#575f6a] hover:text-[#151c27] hover:bg-[#f0f3ff]'}`}>
                <span className="material-symbols-outlined text-[22px]" style={{fontVariationSettings: isActive('/present') ? "'FILL' 1" : "'FILL' 0"}}>card_giftcard</span>
                <span className="text-[15px]">Presentear Memória</span>
            </Link>
            <Link href="/upload" className={`flex items-center gap-3.5 px-4 py-3.5 rounded-[14px] font-bold transition-transform duration-200 hover:translate-x-1 ${isActive('/upload') ? 'bg-[#dce2f3] text-[#483ede] shadow-sm shadow-[#dce2f3]/50' : 'text-[#575f6a] hover:text-[#151c27] hover:bg-[#f0f3ff]'}`}>
                <span className="material-symbols-outlined text-[22px]" style={{fontVariationSettings: isActive('/upload') ? "'FILL' 1" : "'FILL' 0"}}>auto_fix_high</span>
                <span className="text-[15px]">Nova Restauração</span>
            </Link>
            <Link href="/pricing" className={`flex items-center gap-3.5 px-4 py-3.5 rounded-[14px] font-bold transition-transform duration-200 hover:translate-x-1 ${isActive('/pricing') ? 'bg-[#dce2f3] text-[#483ede] shadow-sm shadow-[#dce2f3]/50' : 'text-[#575f6a] hover:text-[#151c27] hover:bg-[#f0f3ff]'}`}>
                <span className="material-symbols-outlined text-[22px]" style={{fontVariationSettings: isActive('/pricing') ? "'FILL' 1" : "'FILL' 0"}}>payments</span>
                <span className="text-[15px]">Créditos</span>
            </Link>
        </nav>

        {/* Credit Display */}
        <div className="mt-auto mx-2 px-5 py-6 rounded-[1.25rem] bg-[#f0f3ff] mb-4 border border-[#e2e8f8]">
            <p className="text-[10.5px] uppercase tracking-widest text-[#575f6a] font-extrabold mb-1.5">Créditos restantes</p>
            <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-[34px] font-headline font-black tracking-tighter text-[#483ede]">{user?.credits ?? 0}</span>
            </div>
            <Link href="/pricing" className="w-full mt-3 flex justify-center py-3 bg-[#483ede] text-white rounded-[12px] font-bold text-[14px] hover:bg-[#3b32c6] shadow-md shadow-[#483ede]/20 active:scale-95 transition-all text-center">
                Comprar Créditos
            </Link>
        </div>

        <div className="pt-4 border-t border-[#c7c4d7]/30 mx-2 space-y-1 mb-2">
            <button 
              onClick={() => { 
                localStorage.removeItem('aura_email'); 
                localStorage.removeItem('aura_user_id');
                router.push('/login'); 
              }} 
              className="w-full flex items-center gap-3.5 px-4 py-2.5 text-[#575f6a] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/50 rounded-[12px] font-semibold transition-colors"
            >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span className="text-[14px]">Sair da Conta</span>
            </button>
        </div>
    </aside>
  );
}
