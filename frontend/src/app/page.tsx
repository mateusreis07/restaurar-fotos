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
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-primary font-headline">Aura Recall</div>
          <div className="hidden md:flex items-center space-x-8">
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
      
      <main className="pt-24 flex-grow">
        {/* Hero Section */}
        <section className="px-6 py-12 md:py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
          
          {/* Interactive Before/After Slider */}
          <div 
            ref={containerRef}
            className="relative lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl group w-full aspect-[4/5] lg:aspect-auto select-none cursor-ew-resize bg-slate-900 border border-slate-200"
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

        {/* 🎬 Visual Trio & AI Demonstration */}
        <section className="bg-white py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center space-x-2 editorial-gradient text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                  Tecnologia 2026
                </div>
                <h2 className="font-headline font-extrabold text-4xl md:text-5xl text-on-surface leading-tight">
                  Veja suas memórias <span className="text-primary italic font-serif">ganharem vida</span>
                </h2>
                <p className="text-lg text-secondary leading-relaxed">
                  Nossa IA reconstrói detalhes perdidos, adiciona cor e transforma sua foto estática em um vídeo realista com movimento natural.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="bg-surface-container-low p-6 rounded-2xl border border-slate-100">
                    <div className="text-primary font-bold text-lg mb-1">Restauração Profunda</div>
                    <p className="text-sm text-slate-500">Removemos arranhões e restauramos o brilho nos olhos.</p>
                  </div>
                  <div className="bg-surface-container-low p-6 rounded-2xl border border-slate-100">
                    <div className="text-primary font-bold text-lg mb-1">Movimento Natural</div>
                    <p className="text-sm text-slate-500">IA que simula a vida com movimentos sutis e realistas.</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative w-full max-w-2xl">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                       {/* Example 1: Restoration High Quality */}
                       <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                          <img src="/examples/example1.png" className="w-full h-full object-cover" alt="Restauração de Alta Qualidade" />
                          <div className="absolute top-2 left-2 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Antes/Depois</div>
                       </div>
                       {/* Example 2: Scratched Photo Restoration */}
                       <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                          <img src="/examples/example2.png" className="w-full h-full object-cover" alt="Restauração de Foto Rasgada" />
                          <div className="absolute top-2 left-2 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Remoção de Riscos</div>
                       </div>
                       {/* Example 3: Facial Reconstruction Detail */}
                       <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                          <img src="/examples/example3.png" className="w-full h-full object-cover" alt="Recuperação de Nitidez e Detalhe" />
                          <div className="absolute top-2 left-2 editorial-gradient text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Nitidez IA</div>
                       </div>
                    </div>
                    <div className="flex flex-col justify-center space-y-4">
                       {/* Main Video Demo */}
                       <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-100">
                          <video 
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                            className="w-full h-full object-cover"
                            poster="/examples/original_video_base.png"
                          >
                            <source src="https://res.cloudinary.com/dwzcwtxfv/video/upload/v1774536765/aura_recall/restored/mry0sfxj4k3wt9mhjymp.mp4" type="video/mp4" />
                          </video>
                          <div className="absolute bottom-4 left-4 right-4 glass-panel py-3 px-4 rounded-xl flex items-center justify-between">
                             <span className="text-[10px] font-black text-primary uppercase">Resultado Final (Animado)</span>
                             <span className="material-symbols-outlined text-primary text-lg">play_circle</span>
                          </div>
                       </div>
                       {/* Example 4: Portrait Detail */}
                       <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                          <img src="/examples/original_video_base.png" className="w-full h-full object-cover grayscale opacity-80" alt="Foto Original Antes" />
                          <div className="absolute top-2 left-2 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Foto Original</div>
                       </div>
                    </div>
                 </div>
                 {/* Decorative elements */}
                 <div className="absolute -z-10 -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                 <div className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="como-funciona" className="bg-surface-container-low py-24 px-6 border-y border-slate-200/60">
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
        <section className="bg-white py-24 px-6 overflow-hidden">
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
        <section className="bg-slate-900 py-32 px-6 relative overflow-hidden">
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
        <section className="bg-surface-container-low py-24 px-6">
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
        <section id="precos" className="bg-surface-container-low py-24 px-6 border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline font-extrabold text-4xl text-on-surface mb-4">Escolha seu pacote</h2>
              <p className="text-secondary text-lg">Pague apenas pelo que precisar através da plataforma ultra segura Stripe.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-surface-container-low p-10 rounded-2xl shadow-sm space-y-8 flex flex-col border border-slate-200/60">
                <div className="space-y-2">
                  <h3 className="font-headline font-bold text-xl text-slate-700">Entrada</h3>
                  <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Reviva memórias especiais</p>
                  <div className="flex items-baseline space-x-1 pt-2">
                    <span className="text-2xl font-bold text-slate-400">R$</span>
                    <span className="text-5xl font-extrabold text-slate-800">29,90</span>
                  </div>
                </div>
                <ul className="space-y-4 flex-grow text-sm">
                  <li className="flex items-center space-x-3 text-secondary">
                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    <span className="font-bold text-slate-700">10 créditos</span>
                  </li>
                  <li className="flex items-center space-x-3 text-secondary">
                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                    <span className="italic">📸 até 10 fotos</span>
                  </li>
                  <li className="flex items-center space-x-3 text-secondary">
                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                    <span className="italic">🎬 ou 2 fotos + 2 vídeos</span>
                  </li>
                </ul>
                <Link href="/dashboard" className="w-full">
                  <button className="w-full py-4 rounded-xl border-2 border-primary text-primary font-headline font-bold hover:bg-primary/5 transition-colors">
                    Adquirir
                  </button>
                </Link>
              </div>
              <div className="bg-surface p-10 rounded-2xl shadow-2xl ring-2 ring-primary relative space-y-8 flex flex-col scale-105 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 editorial-gradient text-on-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Mais Escolhido</div>
                <div className="space-y-2">
                  <h3 className="font-headline font-bold text-xl text-primary">Mais Vendido</h3>
                  <p className="text-[11px] font-black text-primary uppercase tracking-wider">Traga suas memórias de volta à vida</p>
                  <div className="flex items-baseline space-x-1 text-primary pt-2">
                    <span className="text-2xl font-bold">R$</span>
                    <span className="text-5xl font-extrabold">49,90</span>
                  </div>
                </div>
                <ul className="space-y-4 flex-grow text-sm">
                  <li className="flex items-center space-x-3">
                    <span className="material-symbols-outlined text-primary">verified</span>
                    <span className="font-bold text-on-surface">25 créditos</span>
                  </li>
                  <li className="flex items-center space-x-3 text-secondary">
                    <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                    <span className="italic font-bold text-on-surface">📸 até 25 fotos</span>
                  </li>
                  <li className="flex items-center space-x-3 text-secondary">
                    <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                    <span className="italic">🎬 ou 5 fotos + 5 Vídeos</span>
                  </li>
                </ul>
                <Link href="/dashboard" className="w-full">
                  <button className="w-full py-4 rounded-xl editorial-gradient text-on-primary font-headline font-bold shadow-xl hover:shadow-primary/40 active:scale-95 transition-all text-lg tracking-wide">
                    Quero este pacote
                  </button>
                </Link>
              </div>
              <div className="bg-surface-container-low p-10 rounded-2xl shadow-sm space-y-8 flex flex-col border border-slate-200/60">
                <div className="space-y-2">
                  <h3 className="font-headline font-bold text-xl text-slate-700">Premium</h3>
                  <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider font-sans">Reviva a sua história</p>
                  <div className="flex items-baseline space-x-1 pt-2">
                    <span className="text-2xl font-bold text-slate-400">R$</span>
                    <span className="text-5xl font-extrabold text-slate-800">89,90</span>
                  </div>
                </div>
                <ul className="space-y-4 flex-grow text-sm">
                  <li className="flex items-center space-x-3 text-secondary">
                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    <span className="font-bold text-slate-700">60 créditos</span>
                  </li>
                  <li className="flex items-center space-x-3 text-secondary">
                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                    <span className="italic">📸 muitas fotos</span>
                  </li>
                  <li className="flex items-center space-x-3 text-secondary">
                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                    <span className="italic">🎬 ou 12 fotos + 12 Vídeos</span>
                  </li>
                </ul>
                <Link href="/dashboard" className="w-full">
                  <button className="w-full py-4 rounded-xl border-2 border-primary text-primary font-headline font-bold hover:bg-primary/5 transition-colors">
                    Adquirir
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* 🚀 Final CTA */}
        <section className="bg-white py-24 px-6 border-t border-slate-100">
           <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="font-headline font-extrabold text-4xl text-on-surface">Traga suas memórias de volta à vida agora</h2>
              <div className="space-y-4">
                 <Link href="/dashboard" className="inline-block w-full max-w-md">
                   <button className="w-full editorial-gradient text-on-primary py-5 rounded-2xl font-headline font-bold text-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all">
                       Restaurar minha foto
                   </button>
                 </Link>
                 <p className="text-sm font-medium text-slate-400">⚡ Leva menos de 10 segundos</p>
              </div>
           </div>
        </section>
      </main>

      <footer className="bg-slate-900 w-full py-16 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="text-2xl font-bold text-white font-headline">Aura Recall</div>
            <p className="font-body text-sm text-slate-400 max-w-sm text-center md:text-left leading-relaxed">
              © 2026 Aura Recall. Suas memórias, perfeitamente preservadas usando o poder da inteligência artificial avançada.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex space-x-8 text-slate-300">
               <Link href="#" className="hover:text-primary-fixed transition-colors text-sm font-medium">Termos de Uso</Link>
               <Link href="#" className="hover:text-primary-fixed transition-colors text-sm font-medium">Privacidade</Link>
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
