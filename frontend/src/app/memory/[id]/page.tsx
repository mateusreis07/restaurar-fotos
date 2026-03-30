'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function MemoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [memory, setMemory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/share-memory/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setMemory(data);
      })
      .catch(() => setError('Erro ao carregar memória.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#151c27] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !memory) {
    return (
      <div className="min-h-screen bg-[#151c27] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <span className="material-symbols-outlined text-[64px] text-white/20">sentiment_dissatisfied</span>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">Ops! Link Inválido</h1>
          <p className="text-white/60 max-w-sm">Este link pode ter expirado ou não existe mais.</p>
        </div>
        <Link href="/" className="bg-white text-[#151c27] px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
          Ir para Início
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151c27] text-white selection:bg-[#f43f5e]/30">
      
      {/* Background Ambient Blur */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-[#483ede] blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-[#f43f5e] blur-[120px] rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-6 py-20 lg:py-32 space-y-24">
        
        {/* Header Section */}
        <header className="text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex flex-col items-center">
             <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/20 shadow-2xl">
               <span className="material-symbols-outlined text-[32px] text-[#fecdd3]" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
             </div>
             <div className="space-y-4">
                <h1 className="text-[14px] font-black uppercase tracking-[0.3em] text-[#fecdd3]">Uma lembrança para você</h1>
                <h2 className="text-5xl md:text-7xl font-headline font-black tracking-tight leading-tight">Olá, {memory.recipientName}!</h2>
             </div>
          </div>

          {memory.message && (
             <div className="max-w-2xl mx-auto p-8 md:p-12 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-inner relative group">
                <span className="material-symbols-outlined absolute -top-4 -left-4 text-4xl text-white/20">format_quote</span>
                <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-white/90">
                  "{memory.message}"
                </p>
                <p className="mt-8 text-[15px] font-bold text-white/40 uppercase tracking-widest">— Com carinho, {memory.senderName}</p>
             </div>
          )}
        </header>

        {/* Media Grid / Storytelling */}
        <main className="space-y-16">
          {memory.photos.map((item: any, idx: number) => (
             <section 
               key={item.id} 
               className={`group relative flex flex-col ${idx % 2 === 0 ? 'items-start' : 'items-end'} animate-in fade-in slide-in-from-bottom-12 duration-1000`}
               style={{ animationDelay: `${(idx + 1) * 200}ms` }}
             >
                <div className="w-full md:w-[85%] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 bg-black/40 relative">
                   {item.type === 'video' ? (
                     <video 
                        src={item.animatedUrl} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                     />
                   ) : (
                     <img 
                        src={item.url} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                     />
                   )}
                   
                   {/* Overlay Info */}
                   <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <p className="text-[12px] font-bold uppercase tracking-widest text-white/60">Lembrança #{idx + 1}</p>
                   </div>
                </div>
             </section>
          ))}
        </main>

        {/* Growth CTA Section */}
        <footer className="pt-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000" style={{animationDelay: '1s'}}>
          <div className="p-10 md:p-16 bg-gradient-to-br from-[#483ede] to-[#7c3aed] rounded-[4rem] shadow-2xl space-y-8 relative overflow-hidden group">
             {/* Decorative Elements */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
             
             <div className="relative z-10 space-y-4">
                <h3 className="text-3xl md:text-5xl font-black tracking-tight">E as suas memórias?</h3>
                <p className="text-lg md:text-xl text-white/80 font-medium max-w-xl mx-auto">
                  Também tem fotos antigas que gostaria de ver com nitidez e cor? Experimente o Aura Recall agora.
                </p>
             </div>

             <div className="relative z-10">
                <Link href="/" className="inline-flex items-center gap-3 bg-white text-[#483ede] px-10 py-5 rounded-full font-black text-lg hover:scale-105 active:scale-[0.98] transition-all shadow-xl shadow-black/20">
                  Experimentar Aura Recall
                  <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
                </Link>
             </div>
             
             <p className="relative z-10 text-[13px] font-bold text-white/40 uppercase tracking-[0.2em] pt-4">Restauração • Assistente de Cor • Animação IA</p>
          </div>
          
          <div className="mt-20 opacity-30 flex items-center justify-center gap-4 grayscale">
            <span className="text-xl font-headline font-black">Aura Recall</span>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <span className="text-[12px] font-bold uppercase tracking-widest">Memórias Preservadas</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
