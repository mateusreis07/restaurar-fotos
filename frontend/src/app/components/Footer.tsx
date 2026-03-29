'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 mt-auto bg-[#f0f3ff] border-t border-[#dce2f3]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-center md:text-left">
          <span className="text-xl font-headline font-extrabold text-[#151c27]">Aura Recall</span>
          <p className="font-body text-[14px] text-[#575f6a] font-medium tracking-wide">© 2026 Aura Recall. Suas memórias, lindamente preservadas.</p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4">
          <Link className="font-body text-[14px] font-semibold text-[#575f6a] hover:text-[#483ede] transition-colors" href="/terms">Termos de Uso</Link>
          <Link className="font-body text-[14px] font-semibold text-[#575f6a] hover:text-[#483ede] transition-colors" href="/privacy">Privacidade</Link>
          <Link className="font-body text-[14px] font-semibold text-[#575f6a] hover:text-[#483ede] transition-colors" href="/security">Segurança</Link>
          <Link className="font-body text-[14px] font-semibold text-[#575f6a] hover:text-[#483ede] transition-colors" href="/quality">Qualidade</Link>
        </div>
      </div>
    </footer>
  );
}
