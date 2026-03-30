'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const imageUrl = "https://images.unsplash.com/photo-1543430720-fa600c67e423?auto=format&fit=crop&q=100&w=1200";

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass-panel shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-2 max-w-7xl mx-auto">
          <Link href="/" className="py-2 transform active:scale-95 transition-transform w-fit h-fit">
            <img src="/examples/logo-reviva-sem-fundo.png" alt="Reviva Logo" className="h-8 w-auto object-contain" />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a className="font-headline font-medium text-sm tracking-tight text-slate-600 hover:text-primary transition-colors duration-300" href="#exemplos">Exemplos</a>
            <a className="font-headline font-medium text-sm tracking-tight text-slate-600 hover:text-primary transition-colors duration-300" href="#como-funciona">Como funciona</a>
            <a className="font-headline font-medium text-sm tracking-tight text-slate-600 hover:text-primary transition-colors duration-300" href="#precos">Preços</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <button className="editorial-gradient text-on-primary px-6 py-2.5 rounded-full font-headline font-semibold text-sm shadow-md active:scale-95 transition-transform duration-150">
                  Começar a Restaurar
              </button>
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="pt-20 flex-grow">
        {/* Hero Section */}
        <section className="px-6 py-8 md:py-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-on-surface leading-[1.1] tracking-tight">
                Salve as lembranças da sua família do esquecimento.
            </h1>
            <p className="text-lg md:text-xl text-secondary leading-relaxed max-w-lg">
                Nossa Inteligência Artificial remove arranhões, corrige desfoque e revive as cores perdidas pelo tempo em questão de segundos. Suas memórias merecem viver para sempre.
            </p>
            <div className="space-y-4 pt-4">
              <Link href="/dashboard" className="block w-full max-w-md">
                <button className="w-full editorial-gradient text-on-primary py-5 rounded-xl font-headline font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all">
                    Restaurar minha primeira foto
                </button>
              </Link>
              <p className="text-sm font-medium text-slate-400 mt-2">Sem assinaturas. Pague apenas pelo pacote que usar.</p>
            </div>
          </div>
          
          {/* Interactive Before/After Slider - Versão Retangular/Horizontal */}
          <div 
            ref={containerRef}
            className="relative w-full max-w-2xl aspect-video rounded-3xl overflow-hidden shadow-2xl group mx-auto select-none cursor-ew-resize bg-slate-900 border border-slate-200"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
            onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
          >
            {/* After (Restored) - Base Image */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            
            {/* Before (Damaged) - Clipped Overlay using clip-path */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center z-10"
              style={{ 
                backgroundImage: `url(${imageUrl})`,
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                filter: 'sepia(80%) grayscale(40%) blur(1px) contrast(80%) brightness(0.9)'
              }}
            />

            {/* Slider Handle */}
            <div 
              className="absolute inset-y-0 w-1 bg-white/90 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10 pointer-events-none"
              style={{ left: `calc(${sliderPosition}% - 2px)` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-200 transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-primary">unfold_more</span>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-6 left-6 glass-panel px-4 py-2 rounded-xl text-sm font-bold text-primary shadow-sm pointer-events-none transition-opacity duration-300" style={{ opacity: sliderPosition < 20 ? 0 : 1 }}>
              Antiga
            </div>
            <div className="absolute bottom-6 right-6 glass-panel px-4 py-2 rounded-xl text-sm font-bold text-primary shadow-sm pointer-events-none transition-opacity duration-300" style={{ opacity: sliderPosition > 80 ? 0 : 1 }}>
              Restaurada
            </div>
          </div>
        </section>
        {/* ✨ AI Demonstration Grid */}
        <section id="exemplos" className="bg-white py-12 px-6 relative overflow-hidden">
           <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 max-w-3xl mx-auto">
                 <h2 className="font-headline font-black text-5xl md:text-6xl text-on-surface mb-6 leading-tight tracking-tighter">
                    Veja suas memórias <span className="text-primary italic">ganharem vida</span>
                 </h2>
                 <p className="text-secondary text-lg md:text-xl leading-relaxed">
                    Nossa IA reconstrói detalhes perdidos, adiciona cor e transforma sua foto estática em um vídeo realista com movimento natural.
                 </p>
              </div>

              {/* Grid de Exemplos Otimizado - Mais compacto */}
              <div className="space-y-12 max-w-5xl mx-auto">
                 {/* Top Row: Video Demos Side by Side */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Example 1 */}
                    <div className="space-y-4">
                       <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md border border-slate-200">
                          <img src="/examples/original_video_base.png" className="w-full h-full object-cover" alt="Foto Original 1" />
                          <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase">Original 1</div>
                       </div>
                       <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-100">
                          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                             <source src="https://res.cloudinary.com/dwzcwtxfv/video/upload/v1774539296/aura_recall/restored/zcqtmp3dp1nvngu0ffzp.mp4" type="video/mp4" />
                          </video>
                          <div className="absolute bottom-3 left-3 right-3 glass-panel py-2 px-3 rounded-xl flex items-center justify-between">
                             <span className="text-[9px] font-black text-primary uppercase">Resultado Animado 1</span>
                             <span className="material-symbols-outlined text-primary text-base">play_circle</span>
                          </div>
                       </div>
                    </div>

                    {/* Example 2 */}
                    <div className="space-y-4">
                       <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md border border-slate-200">
                          <img src="/examples/original_video_base2.png" className="w-full h-full object-cover" alt="Foto Original 2" />
                          <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase">Original 2</div>
                       </div>
                       <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-100">
                          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                             <source src="https://res.cloudinary.com/dwzcwtxfv/video/upload/v1774615341/aura_recall/restored/ntmvhg9glprhxprdkcn1.mp4" type="video/mp4" />
                          </video>
                          <div className="absolute bottom-3 left-3 right-3 glass-panel py-2 px-3 rounded-xl flex items-center justify-between">
                             <span className="text-[9px] font-black text-primary uppercase">Resultado Animado 2</span>
                             <span className="material-symbols-outlined text-primary text-base">play_circle</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Bottom Row: Static Comparison Grid */}
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-100">
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg border-2 border-white ring-1 ring-slate-100">
                       <img src="/examples/example1.png" className="h-full w-full object-cover" alt="Restauração 1" />
                       <div className="absolute top-2 left-2 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Antes/Depois</div>
                    </div>
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg border-2 border-white ring-1 ring-slate-100">
                       <img src="/examples/example2.png" className="h-full w-full object-cover" alt="Restauração 2" />
                       <div className="absolute top-2 left-2 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Remoção de Riscos</div>
                    </div>
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg border-2 border-white ring-1 ring-slate-100">
                       <img src="/examples/example3.png" className="h-full w-full object-cover" alt="Restauração 3" />
                       <div className="absolute top-2 left-2 editorial-gradient text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Nitidez IA</div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* 🎁 New "Present Memory" Section */}
        <section className="bg-slate-50 py-20 px-6 relative overflow-hidden overflow-visible border-y border-slate-200/50">
           {/* Decorative Elements */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#f43f5e]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
           
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 space-y-10 relative">
                 <div className="inline-flex items-center gap-2 bg-[#fff1f2] text-[#f43f5e] px-4 py-2 rounded-full border border-[#fecdd3]/50">
                    <span className="material-symbols-outlined text-[18px] font-bold" style={{fontVariationSettings: "'FILL' 1"}}>card_giftcard</span>
                    <span className="text-[12px] font-black uppercase tracking-widest">Nova Funcionalidade</span>
                 </div>
                 
                 <div className="space-y-6">
                    <h2 className="font-headline font-black text-4xl md:text-5xl text-on-surface tracking-tighter leading-tight">
                       Transforme memórias em um <span className="text-[#f43f5e]">presente inesquecível</span>
                    </h2>
                    <p className="text-secondary text-lg md:text-xl leading-relaxed max-w-xl">
                       Agora você pode criar uma página personalizada com as fotos e vídeos restaurados para surpreender quem você ama. Uma experiência digital emocionante, pronta para ser compartilhada.
                    </p>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-[#f43f5e]">
                          <span className="material-symbols-outlined text-[20px] font-bold">link</span>
                       </div>
                       <h4 className="font-bold text-slate-900">Link de Acesso Único</h4>
                       <p className="text-slate-500 text-sm leading-relaxed">Gere um endereço exclusivo para cada presenteado, com acesso instantâneo.</p>
                    </div>
                    <div className="space-y-3">
                       <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-[#f43f5e]">
                          <span className="material-symbols-outlined text-[20px] font-bold">chat_bubble</span>
                       </div>
                       <h4 className="font-bold text-slate-900">Mensagem do Coração</h4>
                       <p className="text-slate-500 text-sm leading-relaxed">Adicione uma dedicatória especial que aparecerá antes de revelarem as fotos.</p>
                    </div>
                    <div className="space-y-3">
                       <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-[#f43f5e]">
                          <span className="material-symbols-outlined text-[20px] font-bold">devices</span>
                       </div>
                       <h4 className="font-bold text-slate-900">100% Mobile Optimized</h4>
                       <p className="text-slate-500 text-sm leading-relaxed">Uma experiência imersiva feita para ser aberta no WhatsApp e emocionante de ver.</p>
                    </div>
                    <div className="space-y-3">
                       <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-[#f43f5e]">
                          <span className="material-symbols-outlined text-[20px] font-bold">share</span>
                       </div>
                       <h4 className="font-bold text-slate-900">Compartilhamento Fácil</h4>
                       <p className="text-slate-500 text-sm leading-relaxed">Um clique para enviar por qualquer rede social ou copiar o link secreto.</p>
                    </div>
                 </div>

                 <div className="pt-4">
                    <Link href="/dashboard">
                       <button className="bg-[#f43f5e] text-on-primary px-8 py-4 rounded-2xl font-headline font-bold text-md shadow-2xl shadow-[#f43f5e]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group">
                          Criar meu primeiro presente
                          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                       </button>
                    </Link>
                 </div>
              </div>

              <div className="order-1 lg:order-2 relative">
                 {/* Mockup or Visual Representation - Updated to match real /memory/[id] design */}
                 <div className="relative z-10 bg-white rounded-[3.5rem] p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-slate-200">
                    <div className="rounded-[2.8rem] overflow-hidden aspect-[4/5] relative bg-gradient-to-br from-[#0c1221] via-[#151c27] to-[#0c1221] flex flex-col items-center justify-center p-8 text-center space-y-8">
                       {/* Floating Heart Icon */}
                       <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                          <span className="material-symbols-outlined text-[#f43f5e] text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
                       </div>

                       <div className="space-y-4">
                          <p className="text-[10px] font-black text-[#f43f5e] uppercase tracking-[0.3em]">Uma lembrança para você</p>
                          <h3 className="text-4xl font-black text-white tracking-tight">Olá, Maria!</h3>
                       </div>

                       {/* Translucent Message Card */}
                       <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group">
                          <div className="absolute -top-4 -left-2 opacity-10">
                             <span className="material-symbols-outlined text-6xl text-white">format_quote</span>
                          </div>
                          <p className="text-white text-lg font-medium italic leading-relaxed relative z-10">
                             "Reuni alguns dos nossos momentos mais especiais que ganharam vida nova na Reviva. Espero que se emocione tanto quanto eu."
                          </p>
                          <div className="pt-4 border-t border-white/5">
                             <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">
                                — Com carinho, João
                             </p>
                          </div>
                       </div>

                       <div className="pt-10 flex flex-col items-center gap-4">
                           <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center animate-pulse">
                              <span className="material-symbols-outlined text-white/40 text-xl">expand_more</span>
                           </div>
                           <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Role para ver as fotos</p>
                       </div>
                    </div>
                 </div>
                 
                 {/* Floating Badges */}
                 <div className="absolute -top-6 -right-6 z-20 bg-white p-5 rounded-3xl shadow-2xl border border-slate-100 animate-bounce group hover:animate-none transition-all">
                    <span className="material-symbols-outlined text-[#f43f5e] text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>card_giftcard</span>
                 </div>
                 <div className="absolute -bottom-8 -left-6 z-20 bg-slate-900 px-8 py-5 rounded-[2rem] shadow-2xl text-white border border-white/10">
                    <div className="flex items-center gap-4">
                       <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                       <p className="text-[11px] font-black uppercase tracking-[0.15em] text-white/90">Experiência Criada</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* How it Works */}
        <section id="como-funciona" className="bg-surface-container-low py-12 px-6 border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-headline font-extrabold text-4xl text-on-surface mb-4">A magia acontece em 3 cliques</h2>
              <p className="text-secondary max-w-xl mx-auto text-lg">Esqueça softwares complexos de edição gráfica. Traga suas memórias de volta à vida imediatamente.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-surface rounded-3xl p-10 space-y-6 shadow-sm hover:-translate-y-2 transition-transform duration-300 border border-slate-100">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center transform -rotate-3">
                  <span className="material-symbols-outlined text-primary text-3xl">add_photo_alternate</span>
                </div>
                <h3 className="font-headline font-bold text-2xl">1. Faça o Upload</h3>
                <p className="text-secondary leading-relaxed">Tire uma foto ou escaneie o seu álbum antigo com o celular. Nossa tecnologia cuida do resto.</p>
              </div>
              <div className="bg-surface rounded-3xl p-10 space-y-6 shadow-sm hover:-translate-y-2 transition-transform duration-300 border border-slate-100 relative">
                <div className="absolute top-0 right-10 -translate-y-1/2 editorial-gradient text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">IA Avançada</div>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center transform rotate-3">
                  <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                </div>
                <h3 className="font-headline font-bold text-2xl">2. Nossa Máquina Reconstrói</h3>
                <p className="text-secondary leading-relaxed">Mapeamos cada detalhe, corrigimos texturas, restauramos cores e, se desejar, aplicamos animação cinematográfica.</p>
              </div>
              <div className="bg-surface rounded-3xl p-10 space-y-6 shadow-sm hover:-translate-y-2 transition-transform duration-300 border border-slate-100">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center transform -rotate-3">
                  <span className="material-symbols-outlined text-primary text-3xl">download</span>
                </div>
                <h3 className="font-headline font-bold text-2xl">3. Emoção Pronta</h3>
                <p className="text-secondary leading-relaxed">Baixe em alta definição, pronto para imprimir, emoldurar ou surpreender a família no WhatsApp.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 💎 Benefits Section */}
        <section className="bg-white py-12 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline font-extrabold text-4xl text-on-surface mb-4">Muito mais do que restaurar fotos</h2>
              <p className="text-secondary max-w-2xl mx-auto text-lg">Tecnologia de ponta trabalhando nos bastidores para devolver a perfeição às suas fotos históricas.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: "psychology", title: "Recupera detalhes perdidos", desc: "Nossa IA 'enxerga' além do borrão, reconstruindo olhos, pele e texturas que o tempo apagou." },
                { icon: "palette", title: "Adiciona cor automaticamente", desc: "Algoritmos treinados em milhões de fotos históricas para injetar as cores exatas da época." },
                { icon: "face", title: "Restaura rostos borrados", desc: "Especialistas em reconstrução facial profunda para garantir que a identidade original seja preservada." },
                { icon: "movie", title: "Transforma foto em vídeo", desc: "Dê vida ao passado com animações realistas que capturam a essência do momento." },
                { icon: "bolt", title: "Resultado em segundos", desc: "O que antes levava dias para restauradores humanos, agora acontece em menos de 10 segundos." },
                { icon: "high_quality", title: "Ultra Resolução", desc: "Multiplicamos os pixels para permitir impressões de alta qualidade em grandes formatos." }
              ].map((benefit, i) => (
                <div key={i} className="flex flex-col items-start space-y-4 p-8 rounded-3xl bg-surface-container-low border border-slate-100/60 shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">{benefit.icon}</span>
                  </div>
                  <h3 className="font-headline font-bold text-xl">{benefit.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ❤️ Emotional Block */}
        <section className="bg-slate-900 py-16 px-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-10">
            <h2 className="font-headline font-extrabold text-4xl md:text-5xl text-white leading-tight">
              Algumas memórias <span className="text-primary-fixed">não podem ser perdidas</span>
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Fotos antigas guardam momentos únicos. Pessoas que marcaram sua vida. Histórias que o tempo tentou apagar.
            </p>
            <p className="text-2xl font-serif italic text-white/90">
              Agora você pode trazer tudo isso de volta — com vida.
            </p>
            <div className="pt-6">
              <Link href="/dashboard">
                <button className="editorial-gradient text-on-primary px-10 py-5 rounded-2xl font-headline font-bold text-xl shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all">
                  Restaurar minha foto agora
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* 💬 Social Proof */}
        <section className="bg-surface-container-low py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline font-extrabold text-4xl text-on-surface mb-4">Veja o que as pessoas estão dizendo</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { quote: "Fiquei emocionado vendo a foto do meu avô se mover. Parecia que ele estava ali de novo.", author: "Ricardo S." },
                { quote: "Parece mágica, incrível demais o que essa inteligência artificial consegue fazer.", author: "Mariana L." },
                { quote: "Vale cada centavo. Restaurei o álbum inteiro da minha mãe e ela chorou de alegria.", author: "Cláudia O." }
              ].map((t, i) => (
                <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center space-y-4 italic">
                  <div className="text-amber-400">
                    <span className="material-symbols-outlined">star</span>
                    <span className="material-symbols-outlined">star</span>
                    <span className="material-symbols-outlined">star</span>
                    <span className="material-symbols-outlined">star</span>
                    <span className="material-symbols-outlined">star</span>
                  </div>
                  <p className="text-slate-700 text-lg leading-relaxed">“{t.quote}”</p>
                  <div className="text-slate-400 font-bold not-italic">— {t.author}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="precos" className="bg-white py-12 px-6 border-y border-slate-100">
          <div className="max-w-7xl mx-auto container px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="font-headline font-black text-4xl md:text-5xl text-slate-900 mb-4 tracking-tighter">Escolha seu pacote</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">Pague apenas pelo que precisar através da plataforma ultra segura Stripe.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
              {/* Plan 1 - Entrada */}
              <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 md:mt-8 space-y-8 flex flex-col">
                <div className="space-y-2">
                  <h3 className="font-headline font-bold text-2xl text-slate-900 mb-1">Entrada</h3>
                  <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Reviva memórias especiais</p>
                  <div className="flex items-baseline space-x-1 pt-2 mb-8">
                    <span className="text-2xl font-bold text-slate-400">R$</span>
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">29,90</span>
                  </div>
                </div>
                <ul className="space-y-4 flex-grow text-sm">
                  <li className="flex items-center space-x-3 text-slate-600 font-medium">
                    <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
                    <span className="font-semibold text-slate-700">10 créditos</span>
                  </li>
                  <li className="flex items-center space-x-3 text-slate-500">
                    <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
                    <span className="italic font-bold text-slate-700">📸 até 10 fotos</span>
                  </li>
                  <li className="flex items-center space-x-3 text-slate-500 italic">
                    <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
                    <span>🎬 ou 2 fotos + 2 vídeos</span>
                  </li>
                  <li className="flex items-center space-x-3 text-[#f43f5e] font-black">
                    <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 1"}}>card_giftcard</span>
                    <span>🎁 Página de Presente Digital Incluída</span>
                  </li>
                </ul>
                <Link href="/dashboard" className="w-full">
                  <button className="w-full py-4 rounded-2xl border-2 border-primary text-primary font-headline font-bold hover:bg-primary/5 transition-all active:scale-95">
                    Adquirir
                  </button>
                </Link>
              </div>

              {/* Plan 2 - Mais Vendido (Featured) */}
              <div className="bg-white rounded-[32px] p-10 ring-2 ring-primary shadow-2xl shadow-primary/20 scale-105 relative z-20 space-y-8 flex flex-col">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 editorial-gradient text-on-primary text-xs font-black px-6 py-2 rounded-full tracking-widest uppercase shadow-lg">
                  MAIS ESCOLHIDO
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline font-bold text-3xl text-primary mb-1">Mais Vendido</h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-relaxed">Traga suas memórias de volta à vida</p>
                  <div className="flex items-baseline space-x-1 pt-2 mb-8">
                    <span className="text-primary text-2xl font-bold">R$</span>
                    <span className="text-6xl font-black text-slate-900 tracking-tight">49,90</span>
                  </div>
                </div>
                <ul className="space-y-4 flex-grow">
                  <li className="flex items-center space-x-3 text-slate-900">
                    <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                    <span className="font-bold text-lg text-on-surface">25 créditos</span>
                  </li>
                  <li className="flex items-center space-x-3 text-slate-700 font-semibold">
                    <span className="material-symbols-outlined text-primary text-xl">verified</span>
                    <span className="italic font-bold text-on-surface">📸 até 25 fotos</span>
                  </li>
                  <li className="flex items-center space-x-3 text-slate-700 italic">
                    <span className="material-symbols-outlined text-primary text-xl">verified</span>
                    <span>🎬 ou 5 fotos + 5 Vídeos</span>
                  </li>
                  <li className="flex items-center space-x-3 text-[#f43f5e] font-black">
                    <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 1"}}>card_giftcard</span>
                    <span className="text-lg">🎁 Página de Presente Digital Incluída</span>
                  </li>
                </ul>
                <Link href="/dashboard" className="w-full">
                  <button className="w-full py-5 rounded-2xl editorial-gradient text-on-primary font-headline font-black text-lg hover:brightness-110 transition-all shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95">
                    Quero este pacote
                  </button>
                </Link>
              </div>

              {/* Plan 3 - Premium */}
              <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 md:mt-8 space-y-8 flex flex-col">
                <div className="space-y-2">
                  <h3 className="font-headline font-bold text-2xl text-slate-900 mb-1">Premium</h3>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Reviva a sua história</p>
                  <div className="flex items-baseline space-x-1 pt-2 mb-8">
                    <span className="text-2xl font-bold text-slate-400">R$</span>
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">89,90</span>
                  </div>
                </div>
                <ul className="space-y-4 flex-grow text-sm">
                  <li className="flex items-center space-x-3 text-slate-600 font-medium">
                    <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
                    <span className="font-semibold text-slate-700">60 créditos</span>
                  </li>
                  <li className="flex items-center space-x-3 text-slate-500">
                    <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
                    <span className="italic">📸 muitas fotos</span>
                  </li>
                  <li className="flex items-center space-x-3 text-slate-500 italic">
                    <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
                    <span>🎬 ou 12 fotos + 12 Vídeos</span>
                  </li>
                  <li className="flex items-center space-x-3 text-[#f43f5e] font-black">
                    <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 1"}}>card_giftcard</span>
                    <span>🎁 Página de Presente Digital Incluída</span>
                  </li>
                </ul>
                <Link href="/dashboard" className="w-full">
                  <button className="w-full py-4 rounded-2xl border-2 border-primary text-primary font-headline font-bold hover:bg-primary/5 transition-all active:scale-95">
                    Adquirir
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 🚀 Final CTA */}
        <section className="bg-white py-12 px-6 border-t border-slate-100">
           <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="font-headline font-extrabold text-4xl text-on-surface leading-tight tracking-tight">Traga suas memórias de volta à vida agora</h2>
              <div className="space-y-4">
                 <div className="flex justify-center">
                    <Link href="/dashboard" className="w-full max-w-md">
                      <button className="w-full editorial-gradient text-on-primary py-5 rounded-2xl font-headline font-bold text-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all">
                          Restaurar minha foto
                      </button>
                    </Link>
                 </div>
                 <p className="text-sm font-medium text-slate-400">⚡ Leva menos de 10 segundos</p>
              </div>
           </div>
        </section>
      </main>

      <footer className="bg-slate-900 w-full py-10 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <Link href="/" className="opacity-90 hover:opacity-100 transition-opacity">
               <img src="/examples/logo-reviva-sem-fundo.png" alt="Reviva Logo" className="h-12 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="font-body text-sm text-slate-400 max-w-sm text-center md:text-left leading-relaxed">
              © 2026 Reviva. Suas memórias, perfeitamente preservadas usando o poder da inteligência artificial avançada.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex space-x-8 text-slate-300">
               <Link href="/terms" className="hover:text-primary-fixed transition-colors text-sm font-medium">Termos de Uso</Link>
               <Link href="/privacy" className="hover:text-primary-fixed transition-colors text-sm font-medium">Privacidade</Link>
               <Link href="/security" className="hover:text-primary-fixed transition-colors text-sm font-medium">Segurança</Link>
               <Link href="/quality" className="hover:text-primary-fixed transition-colors text-sm font-medium">Qualidade</Link>
            </div>
            <div className="text-slate-500 text-xs text-center md:text-right">
               Feito com ❤️ para preservar histórias.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
