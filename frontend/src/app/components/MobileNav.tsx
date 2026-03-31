'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show on login/signup or pages that don't need it
  const hideOnPaths = ['/login', '/signup', '/'];
  if (hideOnPaths.includes(pathname)) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-[#dce2f3] pt-3 pb-6 px-1 flex justify-around items-center z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <Link href="/dashboard" className={`flex flex-col items-center gap-1.5 w-full transition-colors ${isActive('/dashboard') ? 'text-[#483ede]' : 'text-[#a0abbb] hover:text-[#575f6a]'}`}>
            <span className="material-symbols-outlined text-[24px]" style={{fontVariationSettings: isActive('/dashboard') ? "'FILL' 1" : "'FILL' 0"}}>photo_library</span>
            <span className={`text-[9px] uppercase tracking-widest ${isActive('/dashboard') ? 'font-extrabold' : 'font-bold'}`}>Galeria</span>
        </Link>
        <div className="h-6 w-px bg-[#dce2f3]/60 shrink-0" />
        <Link href="/present" className={`flex flex-col items-center gap-1.5 w-full transition-colors ${isActive('/present') ? 'text-[#483ede]' : 'text-[#a0abbb] hover:text-[#575f6a]'}`}>
            <span className="material-symbols-outlined text-[24px]" style={{fontVariationSettings: isActive('/present') ? "'FILL' 1" : "'FILL' 0"}}>card_giftcard</span>
            <span className={`text-[9px] uppercase tracking-widest ${isActive('/present') ? 'font-extrabold' : 'font-bold'}`}>Presentear</span>
        </Link>
        <div className="h-6 w-px bg-[#dce2f3]/60 shrink-0" />
        <Link href="/upload" className={`flex flex-col items-center gap-1.5 w-full transition-colors ${isActive('/upload') ? 'text-[#483ede]' : 'text-[#a0abbb] hover:text-[#575f6a]'}`}>
            <span className="material-symbols-outlined text-[24px]" style={{fontVariationSettings: isActive('/upload') ? "'FILL' 1" : "'FILL' 0"}}>auto_fix_high</span>
            <span className={`text-[9px] uppercase tracking-widest ${isActive('/upload') ? 'font-extrabold' : 'font-bold'}`}>Restaurar</span>
        </Link>
        <div className="h-6 w-px bg-[#dce2f3]/60 shrink-0" />
        <Link href="/pricing" className={`flex flex-col items-center gap-1.5 w-full transition-colors ${isActive('/pricing') ? 'text-[#483ede]' : 'text-[#a0abbb] hover:text-[#575f6a]'}`}>
            <span className="material-symbols-outlined text-[24px]" style={{fontVariationSettings: isActive('/pricing') ? "'FILL' 1" : "'FILL' 0"}}>payments</span>
            <span className={`text-[9px] uppercase tracking-widest ${isActive('/pricing') ? 'font-extrabold' : 'font-bold'}`}>Créditos</span>
        </Link>
        <div className="h-6 w-px bg-[#dce2f3]/60 shrink-0" />
        <button 
          onClick={() => { 
            signOut({ callbackUrl: '/login' }); 
          }} 
          className="flex flex-col items-center gap-1.5 text-[#a0abbb] hover:text-[#ba1a1a] w-full transition-colors"
        >
            <span className="material-symbols-outlined text-[24px]">logout</span>
            <span className="text-[9px] uppercase font-bold tracking-widest">Sair</span>
        </button>
    </nav>
  );
}
