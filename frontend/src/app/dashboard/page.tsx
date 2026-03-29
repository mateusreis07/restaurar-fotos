'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const router = useRouter();

  // Slider State
  const [comparingPhoto, setComparingPhoto] = useState<any>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Modal for animation confirmation
  const [animationPhotoId, setAnimationPhotoId] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('aura_user_id');
    const savedEmail = localStorage.getItem('aura_email');

    if (!userId || !savedEmail) {
      router.push('/login');
      return;
    }

    setIsAuthChecking(true);
    fetch('/api/auth/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          loadPhotos(data.user.id);
        } else {
          localStorage.removeItem('aura_email');
          localStorage.removeItem('aura_user_id');
          router.push('/login');
        }
      })
      .catch((err) => {
        console.error(err);
        router.push('/login');
      })
      .finally(() => setIsAuthChecking(false));
  }, [router]);

  const [isProcessingAnimation, setIsProcessingAnimation] = useState<string | null>(null);

  const loadPhotos = async (userId: string) => {
    try {
      console.log('Fetching photos for user:', userId);
      const res = await fetch(`/api/photos/history/${userId}`);
      console.log('History API status:', res.status);
      const data = await res.json();
      console.log('Photos count:', data.photos?.length);
      if (data.photos) {
        setPhotos(data.photos);
      }
    } catch (err) {
      console.error('Error loading photos:', err);
    }
  };

  const handleAnimate = async (photoId: string) => {
    if (!user || isProcessingAnimation) return;

    setIsProcessingAnimation(photoId);
    try {
      const res = await fetch('/api/photos/animate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId, userId: user.id })
      });

      if (res.ok) {
        // Refresh photos after a small delay to show PROCESSING
        setTimeout(() => loadPhotos(user.id), 800);
      } else {
        const error = await res.json();
        alert(error.error || 'Falha ao iniciar animação.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingAnimation(null);
    }
  };

  useEffect(() => {
    // Polling contínuo apenas se houver fotos processando
    const hasProcessing = photos.some(p => p.status === 'PROCESSING');
    if (hasProcessing && user) {
      const interval = setInterval(() => {
        loadPhotos(user.id);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [photos, user]);

  // Slider Handlers
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

  // Prevent scroll when modal is open
  useEffect(() => {
    if (comparingPhoto || animationPhotoId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setSliderPosition(50); // reset when closed
    }
    return () => { document.body.style.overflow = 'auto'; }
  }, [comparingPhoto, animationPhotoId]);

  if (isAuthChecking || !user) {
    return <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center"></div>;
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f9f9ff] pb-16 md:pb-0 relative">
      <div className="flex-1 overflow-y-auto">


        <div className="p-6 md:p-8 lg:p-12 max-w-[1280px] w-full mx-auto space-y-10">

          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
            <div className="space-y-3">
              <h1 className="font-headline text-[32px] md:text-[44px] font-extrabold tracking-tight text-[#151c27] leading-tight">Minha Galeria</h1>
              <p className="text-[#575f6a] text-[17px] font-medium max-w-xl leading-relaxed">Suas relíquias digitais, restauradas com precisão clínica e profundidade emocional.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/upload">
                <button className="flex items-center gap-2 bg-[#483ede] px-6 py-3.5 rounded-[14px] text-white font-bold shadow-lg shadow-[#483ede]/30 hover:scale-[1.03] active:scale-[0.98] transition-transform text-[15px]">
                  <span className="material-symbols-outlined text-[20px] font-bold">auto_fix_high</span>
                  Nova Restauração
                </button>
              </Link>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((photo, idx) => {
              if (photo.status === 'PROCESSING') return (
                <div key={photo.id} className="bg-[#f0f3ff] rounded-[1.5rem] overflow-hidden group border border-[#c7c4d7]/30 shadow-sm">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#d3daea]">
                    <img src={photo.originalUrl} alt="Memory restoration in progress" className="w-full h-full object-cover opacity-60 grayscale blur-sm" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                      <div className="relative h-1.5 w-32 bg-white/40 rounded-full overflow-hidden shadow-inner">
                        <div className="absolute inset-0 bg-[#483ede] w-3/4 animate-pulse rounded-full"></div>
                      </div>
                      <span className="bg-[#dce2f3]/90 text-[#483ede] px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-2 backdrop-blur-md shadow-sm">
                        <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                        Processando
                      </span>
                    </div>
                  </div>
                  <div className="p-6 pb-7 space-y-1.5">
                    <h3 className="font-headline font-bold text-[20px] text-[#151c27] truncate">Foto {photos.length - idx}</h3>
                    <p className="text-[#575f6a] text-[14px] font-semibold tracking-wide">Tempo estimado: ~2 minutos</p>
                  </div>
                </div>
              );
              if (photo.status === 'FAILED') return (
                <div key={photo.id} className="bg-[#fff0f0] rounded-[1.5rem] overflow-hidden group border border-[#ffdad6] shadow-sm flex flex-col items-center justify-center p-8 text-center">
                  <span className="material-symbols-outlined text-[42px] mb-3 text-[#ba1a1a] opacity-80">error</span>
                  <h3 className="font-headline font-bold text-[18px] mb-2 text-[#151c27]">Processamento Falhou</h3>
                  <p className="text-[14px] font-medium text-[#575f6a] mb-6">
                    {photo.isRefunded
                      ? "Houve uma instabilidade na IA. Seus 4 créditos foram devolvidos automaticamente e você pode tentar novamente!"
                      : "A conexão com a IA falhou. Nossos técnicos foram notificados e seus créditos estão seguros."
                    }
                  </p>
                  <button
                    onClick={() => {
                      setAnimationPhotoId(photo.id);
                    }}
                    disabled={!!isProcessingAnimation}
                    className="w-full bg-[#483ede] text-white py-3 rounded-[12px] font-bold text-[14px] hover:bg-[#3b32c6] transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessingAnimation === photo.id ? (
                      <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
                    ) : (
                      <span className="material-symbols-outlined text-[20px]">refresh</span>
                    )}
                    Tentar Novamente
                  </button>
                </div>
              );

              return (
                <div key={photo.id} className="bg-white rounded-[1.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group border border-[#c7c4d7]/40 flex flex-col hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f0f3ff]">
                    {photo.animatedUrl ? (
                      <video
                        src={photo.animatedUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <img
                        src={photo.restoredUrl || photo.originalUrl}
                        alt="Restored portrait"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-3.5 py-1.5 rounded-full text-[10.5px] font-extrabold uppercase tracking-widest shadow-lg ${photo.animatedUrl ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#e2f9ec] text-[#0f6b40]'}`}>
                        {photo.animatedUrl ? 'ANIMADA' : 'PRONTA'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-6 w-full">
                      <div className="w-full">
                        <h3 className="font-headline font-bold text-[20px] text-[#151c27] truncate">Restauração {photos.length - idx}</h3>
                        <p className="text-[#575f6a] text-[14px] font-medium mt-1">Restaurada com sucesso</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      {!photo.animatedUrl && photo.status === 'COMPLETED' ? (
                        <button
                          onClick={() => {
                            setAnimationPhotoId(photo.id);
                          }}
                          disabled={!!isProcessingAnimation}
                          className="col-span-2 flex items-center justify-center gap-2 bg-[#f0f3ff] text-[#483ede] px-4 py-3.5 rounded-[12px] font-bold text-[14px] hover:bg-[#dce2f3] transition-all mb-1 cursor-pointer border border-[#dce2f3]"
                        >
                          {isProcessingAnimation === photo.id ? (
                            <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                          ) : (
                            <span className="material-symbols-outlined text-[18px]">movie</span>
                          )}
                          {isProcessingAnimation === photo.id ? 'Animando...' : 'Animar com IA'}
                        </button>
                      ) : null}
                      <button onClick={() => setComparingPhoto(photo)} className="flex items-center justify-center gap-2 bg-[#f0f3ff] text-[#483ede] px-4 py-3 rounded-[12px] font-bold text-[14px] hover:bg-[#dce2f3] transition-colors border border-[#dce2f3] cursor-pointer">
                        <span className="material-symbols-outlined text-[18px]">contrast</span>
                        Comparar
                      </button>
                      <a href={photo.animatedUrl || photo.restoredUrl || photo.originalUrl} target="_blank" download className="flex items-center justify-center gap-2 bg-[#483ede] text-white px-4 py-3 rounded-[12px] font-bold text-[14px] hover:bg-[#3b32c6] transition-colors shadow-md shadow-[#483ede]/20">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Baixar
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Static Banner - Preserve your heritage (Spans 2 columns) */}
            <div className="md:col-span-2 lg:col-span-2 bg-[#e2e8f8] rounded-[1.5rem] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center border border-[#dce2f3] shadow-inner relative overflow-hidden">
              <div className="w-full md:w-3/5 space-y-4 z-10">
                <div className="inline-block px-3.5 py-1.5 bg-[#483ede]/15 text-[#483ede] text-[10.5px] font-extrabold uppercase tracking-widest rounded-full mb-2">MEMÓRIAS ETERNAS</div>
                <h2 className="font-headline text-[28px] md:text-[34px] font-extrabold leading-tight tracking-tight text-[#151c27]">Reviva a emoção de cada detalhe</h2>
                <p className="text-[#464555] font-medium leading-relaxed text-[15px]">Cada foto antiga guarda um fragmento da sua história que merece ser visto com clareza. Nossa tecnologia devolve a cor, a nitidez e a vida às suas lembranças, permitindo que o passado brilhe novamente no presente.</p>
              </div>
              <div className="w-full md:w-2/5 relative hidden md:block z-10">
                <div className="aspect-[4/3] rounded-[1rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] rotate-3 mx-auto w-full max-w-[260px] border-4 border-white">
                  <img src="/examples/example1.png" alt="Exemplo de Restauração Aura" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Upload State Card (Card 5) */}
            <Link href="/upload" className="block w-full h-full min-h-[280px]">
              <div className="h-full bg-white rounded-[1.5rem] border-[2px] border-dashed border-[#c7c4d7] flex flex-col items-center justify-center p-10 text-center space-y-5 hover:bg-[#f0f3ff] hover:border-[#a5b4fc] shadow-sm transition-all duration-300 group cursor-pointer lg:min-h-full min-h-[300px]">
                <div className="w-[72px] h-[72px] bg-[#f0f3ff] rounded-full flex items-center justify-center text-[#483ede] group-hover:scale-110 group-hover:bg-[#e2e8f8] transition-all shadow-inner">
                  <span className="material-symbols-outlined text-[32px]">add_a_photo</span>
                </div>
                <div>
                  <p className="font-headline font-bold text-[19px] text-[#151c27] mb-1.5">Restaurar outra foto</p>
                  <p className="text-[#575f6a] text-[14.5px] font-medium">Arraste e solte ou navegue pelos arquivos</p>
                </div>
              </div>
            </Link>
          </section>
        </div>

        {/* Footer */}
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
      </div>

      {/* COMPARAÇÃO INTERATIVA MODAL */}
      {comparingPhoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-6" onClick={() => setComparingPhoto(null)}>
          {/* Wrapper dinâmico que ajusta largura/altura baseado na imagem sem cortá-la */}
          <div
            className="relative inline-block max-w-[95vw] max-h-[85vh] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] cursor-ew-resize select-none border border-white/20 bg-slate-900"
            onClick={(e) => e.stopPropagation()}
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
            onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
          >
            {/* Botão Fechar */}
            <button
              onClick={() => setComparingPhoto(null)}
              className="absolute top-4 right-4 z-[110] bg-black/40 hover:bg-black/80 text-white rounded-full p-2 transition-colors flex items-center justify-center backdrop-blur-md"
              title="Fechar"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {/* RESTAURADA (Imagem Base) - Define o tamanho do pai dinamicamente */}
            <img
              src={comparingPhoto.restoredUrl || comparingPhoto.originalUrl}
              alt="Restaurada"
              className="block w-auto h-auto max-w-full max-h-[85vh] pointer-events-none select-none object-contain"
              draggable={false}
            />

            {/* ANTIGA (Cortada por Cima com Clip-Path) */}
            <div
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
              }}
            >
              <img
                src={comparingPhoto.originalUrl}
                alt="Antiga"
                className="block w-full h-full object-cover pointer-events-none select-none"
                draggable={false}
              />
              <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-white/30" />
            </div>

            {/* Slider Central e Botão */}
            <div
              className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_15px_rgba(0,0,0,0.6)] z-10 pointer-events-none"
              style={{ left: `calc(${sliderPosition}% - 3px)` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl border border-slate-200 transition-transform hover:scale-110 text-[#483ede]">
                <span className="material-symbols-outlined font-bold text-[24px]">unfold_more</span>
              </div>
            </div>

            {/* Labels Informativas */}
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full text-[14.5px] font-extrabold tracking-tight text-[#483ede] shadow-xl pointer-events-none transition-opacity duration-300 z-20" style={{ opacity: sliderPosition < 35 ? 0 : 1 }}>
              Antiga
            </div>
            <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full text-[14.5px] font-extrabold tracking-tight text-[#483ede] shadow-xl pointer-events-none transition-opacity duration-300 z-20" style={{ opacity: sliderPosition > 65 ? 0 : 1 }}>
              Restaurada
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Animação */}
      {animationPhotoId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#151c27]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-[420px] overflow-hidden shadow-2xl border border-[#c7c4d7]/40 p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-[#f0f3ff] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-[36px] text-[#483ede]">movie_filter</span>
            </div>

            <div className="space-y-3">
              <h2 className="font-headline text-[24px] font-black text-[#151c27]">
                {user.credits < 4 ? 'Créditos Insuficientes' : 'Dar vida a esta memória?'}
              </h2>
              <p className="text-[#575f6a] text-[15px] leading-relaxed font-medium">
                {user.credits < 4
                  ? `Você tem apenas ${user.credits} créditos, mas esta operação requer 4 créditos. Adquira um pacote para continuar.`
                  : <>A IA irá gerar uma <span className="text-[#483ede] font-bold">animação realista de 5 segundos</span> para esta foto. Esta operação requer <span className="text-[#483ede] font-bold">4 créditos</span>.</>
                }
              </p>
            </div>

            <div className="space-y-3 pt-4">
              {user.credits < 4 ? (
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full bg-[#483ede] text-white py-4 rounded-[16px] font-bold text-[16px] hover:bg-[#3b32c6] shadow-lg shadow-[#483ede]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                  Comprar Créditos
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleAnimate(animationPhotoId as string);
                    setAnimationPhotoId(null);
                  }}
                  className="w-full bg-[#483ede] text-white py-4 rounded-[16px] font-bold text-[16px] hover:bg-[#3b32c6] shadow-lg shadow-[#483ede]/30 active:scale-95 transition-all"
                >
                  Confirmar e Animar
                </button>
              )}
              <button
                onClick={() => setAnimationPhotoId(null)}
                className="w-full bg-white text-[#575f6a] py-3.5 rounded-[16px] font-bold text-[15px] hover:bg-[#f9f9ff] transition-colors"
              >
                Agora não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
