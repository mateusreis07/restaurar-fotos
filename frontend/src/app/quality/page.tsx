'use client';

import Link from 'next/link';

export default function QualityPage() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#151c27] tracking-tight">Garantia de Qualidade</h1>
          <p className="text-[#575f6a] text-lg font-medium italic">A tecnologia mais avançada do mundo a serviço do seu passado.</p>
        </header>

        <section className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 space-y-10 leading-relaxed text-[#575f6a]">
          <div className="space-y-4 text-center md:text-left">
             <div className="inline-flex items-center space-x-2 bg-amber-100 text-[#b45309] px-4 py-2 rounded-full text-xs font-bold leading-none">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>PADRÃO ULTRA HD</span>
             </div>
             <p className="font-medium text-[#151c27] text-lg">Nascemos para entregar resultados que emocionam. Cada pixel é processado com precisão clínica.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-[#f0f3ff] rounded-2xl border border-[#dce2f3] space-y-3">
               <h3 className="font-bold text-[#483ede] text-lg">1. Nitidez Surreal</h3>
               <p className="text-sm">Nossa IA reconstrói detalhes que o tempo apagou, devolvendo o brilho nos olhos e a textura da pele.</p>
            </div>
            <div className="p-6 bg-[#f0f3ff] rounded-2xl border border-[#dce2f3] space-y-3">
               <h3 className="font-bold text-[#483ede] text-lg">2. Cores Reais</h3>
               <p className="text-sm">Algoritmos treinados com milhões de fotos históricas para garantir a coloração mais fiel à realidade.</p>
            </div>
            <div className="p-6 bg-[#f0f3ff] rounded-2xl border border-[#dce2f3] space-y-3">
               <h3 className="font-bold text-[#483ede] text-lg">3. Vídeos Suaves</h3>
               <p className="text-sm">A animação 4.0 cria movimentos naturais, capturando a essência de quem você ama.</p>
            </div>
            <div className="p-6 bg-[#f0f3ff] rounded-2xl border border-[#dce2f3] space-y-3">
               <h3 className="font-bold text-[#483ede] text-lg">4. Suporte Total</h3>
               <p className="text-sm">Em caso de qualquer falha técnica no processamento, nosso sistema garante o retorno automático dos seus créditos.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <p className="text-sm">A qualidade da restauração depende da resolução da foto original. No entanto, nossa tecnologia é capaz de melhorar significativamente até as imagens mais severamente danificadas.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
