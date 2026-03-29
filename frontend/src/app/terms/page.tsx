'use client';

import Link from 'next/link';

export default function TermsPage() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#151c27] tracking-tight">Termos de Uso</h1>
          <p className="text-[#575f6a] text-lg font-medium italic">Última atualização: 28 de Março de 2026</p>
        </header>

        <section className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 space-y-8 leading-relaxed text-[#575f6a]">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#151c27]">1. Aceitação dos Termos</h2>
            <p>Ao acessar e usar o Aura Recall, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#151c27]">2. Descrição do Serviço</h2>
            <p>O Aura Recall fornece ferramentas de restauração e animação de fotos baseadas em Inteligência Artificial. Os serviços são oferecidos através de um sistema de créditos, onde cada ação (restauração ou animação) consome uma quantidade específica de créditos adquiridos pelo usuário.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#151c27]">3. Propriedade de Conteúdo</h2>
            <p>Você mantém todos os direitos de propriedade sobre as fotos que envia ao Aura Recall. Ao fazer o upload de conteúdo, você nos concede uma licença limitada apenas para processar a imagem e fornecer o resultado restaurado a você.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#151c27]">4. Política de Reembolso</h2>
            <p>Devido à natureza dos serviços digitais processados em tempo real, reembolsos de créditos já utilizados geralmente não são emitidos, exceto em casos de falha técnica comprovada do sistema onde o resultado não foi entregue.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#151c27]">5. Alterações nos Termos</h2>
            <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão notificadas através do site ou e-mail cadastrado.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
