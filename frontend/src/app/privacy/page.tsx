'use client';

import Link from 'next/link';

export default function PrivacyPage() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#151c27] tracking-tight">Política de Privacidade</h1>
          <p className="text-[#575f6a] text-lg font-medium italic">Sua privacidade é nossa prioridade número um.</p>
        </header>

        <section className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 space-y-10 leading-relaxed text-[#575f6a]">
          <div className="space-y-4">
             <div className="inline-flex items-center space-x-2 bg-[#483ede]/10 text-[#483ede] px-4 py-2 rounded-full text-xs font-bold leading-none">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>EM CONFORMIDADE COM A LGPD</span>
             </div>
             <p className="font-medium text-[#151c27]">Levamos a proteção das suas lembranças muito a sério. Esta política descreve como tratamos suas fotos e dados pessoais no Aura Recall.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#151c27]">1. Dados que coletamos</h2>
            <p>Coletamos apenas as informações estritamente necessárias para o funcionamento do serviço: seu e-mail para identificação da conta e as fotos que você carrega para processar a restauração.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#151c27]">2. Tratamento das Fotos</h2>
            <p>Suas fotos são processadas por nossa IA de forma automatizada e confidencial. O Aura Recall não vende nem compartilha suas imagens originais ou restauradas com terceiros para fins de publicidade ou treinamento de IA externa.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#151c27]">3. Segurança de Pagamento</h2>
            <p>Todas as transações financeiras são processadas através da <strong>Stripe</strong>. O Aura Recall não armazena dados de cartão de crédito em seus próprios servidores, garantindo um nível bancário de segurança para suas compras.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#151c27]">4. Retenção de Dados</h2>
            <p>Você pode solicitar a exclusão de sua conta e de todas as fotos arquivadas a qualquer momento através do suporte ou configurações da sua conta.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
