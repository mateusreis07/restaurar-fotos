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
            <Link href="/dashboard" className="font-headline font-medium text-sm tracking-tight text-slate-600 hover:text-primary transition-colors duration-300">Minha Área</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="hidden sm:block text-slate-600 font-headline font-medium text-sm hover:text-primary transition-colors duration-300">
              Login
            </Link>
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
              className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            
            {/* Before (Damaged) - Clipped Overlay */}
            <div 
              className="absolute inset-0 h-full overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <div 
                className="absolute inset-0 h-full bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${imageUrl})`,
                  width: '100vw',
                  maxWidth: containerRef.current?.offsetWidth || 1000,
                  filter: 'sepia(80%) grayscale(40%) blur(1px) contrast(80%) brightness(0.9)'
                }}
              />
            </div>

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

        {/* How it Works */}
        <section id="como-funciona" className="bg-surface-container-low py-24 px-6 border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-headline font-extrabold text-4xl text-on-surface mb-4">A magia acontece em 3 cliques</h2>
              <p className="text-secondary max-w-xl mx-auto text-lg">Esqueça softwares complexos de edição gráfica. Traga suas memórias de volta à vida imediatamente.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-surface rounded-2xl p-10 space-y-6 shadow-sm hover:-translate-y-2 transition-transform duration-300 border border-slate-100">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center transform -rotate-3">
                  <span className="material-symbols-outlined text-primary text-3xl">add_photo_alternate</span>
                </div>
                <h3 className="font-headline font-bold text-2xl">1. Faça o Upload</h3>
                <p className="text-secondary leading-relaxed">Pode ser uma foto escaneada ou até mesmo uma foto tirada do álbum de família com o seu próprio celular.</p>
              </div>
              <div className="bg-surface rounded-2xl p-10 space-y-6 shadow-sm hover:-translate-y-2 transition-transform duration-300 border border-slate-100 relative">
                <div className="absolute top-0 right-10 -translate-y-1/2 editorial-gradient text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">IA Avançada</div>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center transform rotate-3">
                  <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                </div>
                <h3 className="font-headline font-bold text-2xl">2. Nossa Máquina Analisa</h3>
                <p className="text-secondary leading-relaxed">Em menos de 10 segundos nossa inteligência artificial mapeia traços, corrige texturas e injeta as cores corretas.</p>
              </div>
              <div className="bg-surface rounded-2xl p-10 space-y-6 shadow-sm hover:-translate-y-2 transition-transform duration-300 border border-slate-100">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center transform -rotate-3">
                  <span className="material-symbols-outlined text-primary text-3xl">download</span>
                </div>
                <h3 className="font-headline font-bold text-2xl">3. Emoção Pronta</h3>
                <p className="text-secondary leading-relaxed">Emocione sua família. Baixe o retrato restaurado em ultra-definição para imprimir, emoldurar ou postar.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-surface py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline font-extrabold text-4xl text-on-surface mb-4">Feito para suas melhores lembranças</h2>
              <p className="text-secondary max-w-2xl mx-auto text-lg">Tecnologia de ponta trabalhando nos bastidores para devolver a perfeição às suas fotos históricas.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-surface-container-low border border-slate-200/60 shadow-sm hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">face</span>
                </div>
                <h3 className="font-headline font-bold text-xl">Restauração Facial</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Reconstruímos rostos borrados ou desfocados com uma precisão impressionante, recuperando a identidade original.</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-surface-container-low border border-slate-200/60 shadow-sm hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">cleaning_services</span>
                </div>
                <h3 className="font-headline font-bold text-xl">Remoção de Danos</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Adeus a rasgos, manchas de mofo, dobras e riscos de caneta que arruinaram e envelheceram a sua fotografia.</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-surface-container-low border border-slate-200/60 shadow-sm hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">palette</span>
                </div>
                <h3 className="font-headline font-bold text-xl">Colorização Mágica</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Dê vida ao passado e veja seus avós em cores vibrantes transformando fotos preto e branco em pinturas vivas.</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-surface-container-low border border-slate-200/60 shadow-sm hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">high_quality</span>
                </div>
                <h3 className="font-headline font-bold text-xl">Ultra Resolução</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Multiplicamos a qualidade e os pixels das imagens pequenas para o formato 4K, perfeitas para impressão e quadros.</p>
              </div>
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
      </main>

      <footer className="bg-surface-container-low w-full py-16 px-6 mt-auto border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="text-xl font-bold text-slate-900 font-headline">Aura Recall</div>
            <p className="font-body text-sm text-slate-500 max-w-sm text-center md:text-left">
              © 2026 Aura Recall. Suas memórias, perfeitamente preservadas usando o poder da criatividade computacional avançada.
            </p>
          </div>
          <div className="flex space-x-6 text-slate-400">
             <Link href="#" className="hover:text-primary transition-colors text-sm">Termos de Uso</Link>
             <Link href="#" className="hover:text-primary transition-colors text-sm">Privacidade</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
