'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const hideOnPaths = ['/login', '/signup', '/'];

export default function GlobalHeader() {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
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
      .catch(err => console.error('Header fetch error', err));
    }
  }, [pathname, isHidden]);

  if (isHidden) return null;

  return (
    <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-[#c7c4d7]/30 shadow-sm">
        <span className="text-[20px] font-headline font-black tracking-tight text-[#483ede]">Aura Recall</span>
        <Link href="/pricing" className="flex items-center gap-2 bg-[#f0f3ff] px-4 py-2 rounded-full border border-[#dce2f3] active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[18px] text-[#483ede]" style={{fontVariationSettings: "'FILL' 1"}}>payments</span>
            <span className="text-[#483ede] font-extrabold text-[14px]">{user?.credits ?? 0}</span>
        </Link>
    </header>
  );
}
