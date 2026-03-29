'use client';

import Link from 'next/link';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#f9f9ff] font-sans pb-20">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-[#483ede] font-headline">Aura Recall</Link>
          <Link href="/" className="font-headline font-bold text-sm text-[#575f6a] hover:text-[#483ede] transition-colors">Voltar</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-32 space-y-12">
        <header className="space-y-4 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#151c27] tracking-tight">Segurança do Sistema</h1>
          <p className="text-[#575f6a] text-lg font-medium italic">Sua proteção e a tranquilidade de seus dados são o nosso maior compromisso.</p>
        </header>

        <section className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 space-y-10 leading-relaxed text-[#575f6a]">
          <div className="space-y-4">
             <div className="inline-flex items-center space-x-2 bg-emerald-100 text-[#0f6b40] px-4 py-2 rounded-full text-xs font-bold leading-none">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>PLATAFORMA ULTRASSEGURA</span>
             </div>
             <p className="font-medium text-[#151c27]">Utilizamos tecnologia de infraestrutura de nível empresarial para garantir que suas fotos permaneçam confidenciais em todas as etapas do processo.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#151c27]">1. Criptografia de Ponta a Ponta</h2>
            <p>Todos os dados transmitidos para o Aura Recall, desde seu login até o upload das fotos, são protegidos com criptografia SSL/TLS de 256 bits, a mesma utilizada por bancos internacionais.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#151c27]">2. Armazenamento Seguro</h2>
            <p>As fotos são armazenadas em servidores de nuvem de alta segurança com controle de acesso rigoroso. O Aura Recall utiliza tecnologias modernas de isolamento de dados para garantir que um usuário nunca consiga acessar os dados de outro.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#151c27]">3. Transações via Stripe</h2>
            <p>A segurança dos seus pagamentos é garantida pela <strong>Stripe</strong>, líder global em pagamentos online. O Aura Recall não vê e nem armazena os dados do seu cartão de crédito.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#151c27]">4. Monitoramento 24/7</h2>
            <p>Nossa equipe monitora o sistema continuamente para identificar e prevenir qualquer tentativa de acesso não autorizado, garantindo a integridade da plataforma.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
