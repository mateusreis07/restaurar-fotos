'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Footer from '../components/Footer';

export default function PresentPage() {
  const { data: session, status } = useSession();
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [memories, setMemories] = useState<any[]>([]);
  const [isLoadingMemories, setIsLoadingMemories] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Selection, 2: Form
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const isAuthChecking = status === 'loading';
  const user = session?.user as any;

  useEffect(() => {
    if (status === 'authenticated') {
       loadPhotos();
       loadMemories();
    }
  }, [status]);

  const loadPhotos = async () => {
    try {
      const res = await fetch('/api/photos/history');
      const data = await res.json();
      if (data.photos) {
        setPhotos(data.photos.filter((p: any) => p.status === 'COMPLETED'));
      }
    } catch (err) {
      console.error('Error loading photos:', err);
    }
  };

  const loadMemories = async () => {
    setIsLoadingMemories(true);
    try {
      // Agora a rota descobre o ID pela sessão no servidor
      const res = await fetch(`/api/share-memory`);
      const data = await res.json();
      if (data.memories) {
        setMemories(data.memories);
      }
    } catch (err) {
      console.error('Error loading memories:', err);
    } finally {
      setIsLoadingMemories(false);
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleShareSubmit = async () => {
    if (!user || selectedPhotos.length === 0 || !recipientName) return;

    setIsSharing(true);
    try {
      const res = await fetch('/api/share-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName,
          message,
          fileIds: selectedPhotos
        })
      });

      const data = await res.json();
      if (res.ok) {
        const fullUrl = data.url.startsWith('http') 
          ? data.url 
          : `${window.location.protocol}//${window.location.host}${data.url}`;
        setShareLink(fullUrl);
        loadMemories(); // Refresh history
      } else {
        alert(data.error || 'Erro ao gerar link.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão.');
    } finally {
      setIsSharing(false);
    }
  };

  const getFullShareLink = (id: string) => {
    return `${window.location.protocol}//${window.location.host}/memory/${id}`;
  };

  if (isAuthChecking || !user) {
    return <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center"></div>;
  }

  return (
    <div className="bg-[#f9faff] flex flex-col min-h-screen relative font-sans">
      <div className="p-6 md:p-8 lg:p-12 max-w-[1200px] w-full mx-auto space-y-16 flex-1">
      
      {/* Header com Voltar */}
      <section className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="font-headline text-[32px] md:text-[40px] font-black tracking-tight text-[#151c27] leading-tight">Presentear Memória</h1>
              <p className="text-[#575f6a] text-[17px] font-medium max-w-xl">
                {currentStep === 1 
                  ? "Selecione os momentos que deseja compartilhar nesta experiência única. Também tem fotos antigas que gostaria de ver com nitidez e cor? Experimente o Reviva agora." 
                  : "Agora, personalize a mensagem e os detalhes do destinatário."
                }
              </p>
            </div>
            
            {/* Step Indicator */}
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-[#dce2f3] shadow-sm self-start">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[13px] transition-all ${currentStep === 1 ? 'bg-[#f43f5e] text-white' : 'bg-[#f0f3ff] text-[#575f6a]'}`}>1</div>
               <div className="w-8 h-[2px] bg-[#dce2f3]"></div>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[13px] transition-all ${currentStep === 2 ? 'bg-[#f43f5e] text-white' : 'bg-[#f0f3ff] text-[#575f6a]'}`}>2</div>
            </div>
          </div>
        </section>

        {!shareLink ? (
          <div className="space-y-16">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {currentStep === 1 ? (
                /* PASSO 1: SELEÇÃO DE MÍDIA */
                <div className="space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[20px] font-black text-[#151c27]">Selecione as mídias ({selectedPhotos.length})</h2>
                      <span className="text-[13px] text-[#575f6a] font-medium italic">Clique nas fotos para marcar</span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {photos.map((photo) => (
                        <div 
                          key={photo.id} 
                          onClick={() => togglePhotoSelection(photo.id)}
                          className={`relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer border-4 transition-all duration-300 group ${selectedPhotos.includes(photo.id) ? 'border-[#f43f5e] shadow-xl scale-[0.98]' : 'border-white hover:border-[#c7c4d7] shadow-sm'}`}
                        >
                          {photo.animatedUrl ? (
                            <video src={photo.animatedUrl} muted className="w-full h-full object-cover" />
                          ) : (
                            <img src={photo.restoredUrl || photo.originalUrl} className="w-full h-full object-cover" />
                          )}
                          
                          <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedPhotos.includes(photo.id) ? 'bg-[#f43f5e] text-white' : 'bg-white/60 backdrop-blur-md text-transparent border border-white group-hover:bg-white'}`}>
                            <span className="material-symbols-outlined text-[20px] font-bold">check</span>
                          </div>

                          {photo.animatedUrl && (
                            <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
                               <span className="material-symbols-outlined text-white text-[16px]">movie</span>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {photos.length === 0 && (
                        <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-[#c7c4d7] space-y-6">
                           <div className="w-20 h-20 bg-[#f9f9ff] rounded-full flex items-center justify-center mx-auto">
                              <span className="material-symbols-outlined text-[40px] text-[#c7c4d7]">photo_library</span>
                           </div>
                           <div className="space-y-2">
                              <p className="text-[#575f6a] font-bold text-[18px]">Sua galeria está vazia.</p>
                              <p className="text-[#575f6a]/60 font-medium">Restaure algumas fotos antes de criar um presente.</p>
                           </div>
                           <Link href="/upload" className="inline-block bg-[#483ede] text-white px-8 py-4 rounded-2xl font-black hover:bg-[#3b32c7] transition-all">Começar Restauração</Link>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-6 pt-10 border-t border-[#c7c4d7]/20">
                     {selectedPhotos.length === 0 && (
                        <p className="text-[14px] text-[#f43f5e] font-bold">✨ Selecione pelo menos uma mídia para continuar.</p>
                     )}
                     <button
                        onClick={() => setCurrentStep(2)}
                        disabled={selectedPhotos.length === 0}
                        className="bg-[#f43f5e] text-white px-12 py-5 rounded-[22px] font-black text-[17px] hover:bg-[#e11d48] shadow-2xl shadow-[#f43f5e]/30 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed group"
                     >
                        Seguir para os Detalhes
                        <span className="material-symbols-outlined text-[24px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                     </button>
                  </div>
                </div>
              ) : (
                /* PASSO 2: FORMULÁRIO DE CONFIGURAÇÃO */
                <div className="max-w-[700px] mx-auto space-y-10 py-4">
                   <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-[#dce2f3] space-y-12">
                      <div className="space-y-3">
                         <div className="w-16 h-16 bg-[#fff1f2] text-[#f43f5e] rounded-2xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-[32px]" style={{fontVariationSettings: "'FILL' 1"}}>card_giftcard</span>
                         </div>
                         <h3 className="text-[28px] font-black text-[#151c27]">Detalhes do Presente</h3>
                         <p className="text-[16px] text-[#575f6a] font-medium leading-relaxed">Personalize a experiência. Você poderá visualizar o resultado antes de enviar o link definitivo.</p>
                      </div>

                      <div className="space-y-8">
                         <div className="space-y-3">
                           <label className="text-[13px] font-black uppercase tracking-[0.15em] text-[#575f6a] ml-1">Quem irá receber?</label>
                           <input 
                             type="text" 
                             placeholder="Ex: Vovó Maria, Mãe, Meu Amor..."
                             value={recipientName}
                             onChange={(e) => setRecipientName(e.target.value)}
                             className="w-full bg-[#f9faff] border-2 border-[#dce2f3] rounded-[22px] px-7 py-5 focus:outline-none focus:ring-4 focus:ring-[#f43f5e]/10 focus:border-[#f43f5e] transition-all font-bold text-[18px] text-[#151c27] placeholder:text-[#575f6a]/30"
                           />
                         </div>

                         <div className="space-y-3">
                           <label className="text-[13px] font-black uppercase tracking-[0.15em] text-[#575f6a] ml-1">Sua Mensagem Especial</label>
                           <textarea 
                             placeholder="Escreva algo do fundo do coração que acompanhe essas memórias..."
                             rows={6}
                             value={message}
                             onChange={(e) => setMessage(e.target.value)}
                             className="w-full bg-[#f9faff] border-2 border-[#dce2f3] rounded-[22px] px-7 py-5 focus:outline-none focus:ring-4 focus:ring-[#f43f5e]/10 focus:border-[#f43f5e] transition-all font-bold text-[17px] text-[#151c27] placeholder:text-[#575f6a]/30 resize-none leading-relaxed"
                           ></textarea>
                         </div>
                      </div>

                      <div className="flex flex-col gap-4 pt-4">
                         <button
                           onClick={handleShareSubmit}
                           disabled={isSharing || !recipientName}
                           className="w-full bg-[#f43f5e] text-white py-6 rounded-[24px] font-black text-[18px] hover:bg-[#e11d48] shadow-2xl shadow-[#f43f5e]/40 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed group"
                         >
                           {isSharing ? (
                             <span className="material-symbols-outlined animate-spin">refresh</span>
                           ) : (
                             <>Finalizar e Gerar Experiência <span className="material-symbols-outlined text-[24px] group-hover:rotate-12 transition-transform">celebration</span></>
                           )}
                         </button>
                         <button
                           onClick={() => setCurrentStep(1)}
                           className="w-full py-4 text-[#575f6a] font-extrabold text-[15px] hover:text-[#151c27] transition-all flex items-center justify-center gap-2"
                         >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            Alterar mídias selecionadas
                         </button>
                      </div>
                   </div>
                </div>
              )}
            </div>

            {/* Gerenciador de Links Existentes */}
            <section className="space-y-10 pt-16 border-t border-[#c7c4d7]/30">
              <div className="space-y-3 text-center md:text-left">
                <h2 className="text-[28px] font-black text-[#151c27]">Seu Histórico de Presentes</h2>
                <p className="font-body text-[15px] text-[#575f6a] font-medium leading-relaxed">Gerencie e compartilhe novamente as experiências que você já criou.</p>
              </div>

              {isLoadingMemories ? (
                <div className="flex justify-center py-16">
                   <div className="w-12 h-12 border-4 border-[#f43f5e]/20 border-t-[#f43f5e] rounded-full animate-spin"></div>
                </div>
              ) : memories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {memories.map((mem) => (
                    <div key={mem.id} className="bg-white p-8 rounded-[2.5rem] border border-[#dce2f3] shadow-sm flex flex-col justify-between space-y-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <div className="bg-[#fff1f2] text-[#f43f5e] px-4 py-1.5 rounded-full flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] font-bold">card_giftcard</span>
                            <span className="text-[11px] font-black uppercase tracking-wider">Ativo</span>
                          </div>
                          <span className="text-[12px] font-bold text-[#575f6a] bg-[#f0f3ff] px-4 py-1.5 rounded-full truncate">
                            {new Date(mem.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[12px] text-[#575f6a]/60 font-black uppercase tracking-widest">Para o destinatário:</p>
                          <h4 className="text-[24px] font-black text-[#151c27] truncate group-hover:text-[#483ede] transition-colors">{mem.recipientName}</h4>
                        </div>
                        <p className="text-[14px] text-[#575f6a] font-medium line-clamp-3 italic bg-[#f9faff] p-4 rounded-2xl border border-[#f0f3ff]">
                          "{mem.message || 'Esta experiência não possui uma mensagem personalizada.'}"
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => window.open(getFullShareLink(mem.id), '_blank')}
                          className="flex-1 bg-[#151c27] text-white py-4 rounded-[18px] font-black text-[14px] hover:bg-black transition-all flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                          Visualizar
                        </button>
                        
                        <button 
                          onClick={async () => {
                            const link = getFullShareLink(mem.id);
                            if (navigator.share) {
                              try {
                                await navigator.share({
                                  title: 'Memória Especial 🎁',
                                  text: `Oi ${mem.recipientName}, preparei algo especial para você rever alguns momentos que ganharam vida nova na Reviva! ✨`,
                                  url: link,
                                });
                              } catch (err) {
                                console.error('Share failed', err);
                              }
                            } else {
                              navigator.clipboard.writeText(link);
                              alert('Link copiado!');
                            }
                          }}
                          className="w-14 h-14 bg-[#483ede] text-white rounded-[18px] flex items-center justify-center hover:bg-[#3b32c7] transition-all shadow-lg shadow-[#483ede]/20 group/btn"
                          title="Compartilhar"
                        >
                          <span className="material-symbols-outlined text-center text-[22px]">share</span>
                        </button>

                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(getFullShareLink(mem.id));
                            alert('Link copiado com sucesso!');
                          }}
                          className="w-14 h-14 bg-[#f0f3ff] text-[#483ede] rounded-[18px] flex items-center justify-center hover:bg-[#483ede] hover:text-white transition-all shadow-sm group/btn"
                          title="Copiar Link"
                        >
                          <span className="material-symbols-outlined text-center text-[22px]">content_copy</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-20 rounded-[3.5rem] border border-[#dce2f3] text-center space-y-6 shadow-sm">
                   <div className="w-24 h-24 bg-[#f9f9ff] rounded-full flex items-center justify-center mx-auto border border-[#f0f3ff]">
                      <span className="material-symbols-outlined text-[48px] text-[#c7c4d7]">history</span>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[#151c27] font-black text-[20px]">Nenhum histórico encontrado.</p>
                      <p className="text-[#575f6a] font-medium">Os presentes que você criar aparecerão aqui para fácil acesso.</p>
                   </div>
                </div>
              )}
            </section>
          </div>
        ) : (
          /* Estado de Sucesso (Link Gerado) */
          <div className="max-w-[650px] mx-auto bg-white rounded-[4rem] p-12 md:p-16 text-center space-y-12 shadow-2xl border border-[#dce2f3] animate-in zoom-in-95 duration-500">
             <div className="w-28 h-28 bg-[#f0fdf4] rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg animate-bounce">
                <span className="material-symbols-outlined text-[56px] text-[#16a34a]" style={{fontVariationSettings: "'FILL' 1"}}>celebration</span>
             </div>
             
             <div className="space-y-4">
                <h2 className="font-headline text-[36px] md:text-[44px] font-black text-[#151c27] tracking-tight leading-none">Pronto para Emocionar!</h2>
                <p className="text-[#575f6a] text-[18px] font-medium leading-relaxed max-w-md mx-auto">
                   A experiência personalizada para **{recipientName}** está pronta. Envie o link abaixo para transformar o dia de alguém.
                </p>
             </div>

             <div className="bg-[#f9faff] p-8 rounded-[3rem] border border-[#dce2f3] space-y-5 shadow-inner">
                <div className="text-left">
                   <p className="text-[12px] font-black uppercase tracking-[0.25em] text-[#483ede] mb-2 ml-1">Link de Acesso Único</p>
                   <div className="flex items-center gap-4 bg-white p-5 rounded-3xl shadow-sm border border-[#e2e8f0] group">
                      <p className="flex-1 font-bold text-[16px] text-[#151c27] truncate select-all">{shareLink}</p>
                      <button 
                         onClick={() => {
                            navigator.clipboard.writeText(shareLink!);
                            alert('Link copiado com sucesso!');
                         }}
                         className="w-12 h-12 bg-[#483ede] text-white rounded-2xl flex items-center justify-center hover:bg-[#3b32c7] transition-all active:scale-90 shadow-lg shadow-[#483ede]/20"
                      >
                         <span className="material-symbols-outlined text-[22px]">content_copy</span>
                      </button>
                   </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-[#16a34a] font-bold text-[14px]">
                   <span className="material-symbols-outlined text-[18px]">verified</span>
                   Seguro e otimizado para dispositivos móveis
                </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-4">
                <button 
                   onClick={() => window.open(shareLink!, '_blank')}
                   className="flex-1 bg-[#151c27] text-white py-5 rounded-[22px] font-black text-[16px] hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                >
                   Visualizar Agora
                   <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                </button>
                <button
                   onClick={() => {
                      setShareLink(null);
                      setRecipientName('');
                      setMessage('');
                      setSelectedPhotos([]);
                      setCurrentStep(1);
                   }}
                   className="flex-1 bg-white border-2 border-[#dce2f3] py-5 rounded-[22px] font-black text-[16px] text-[#575f6a] hover:bg-[#f9faff] hover:text-[#151c27] transition-all"
                >
                   Criar Outro Presente
                </button>
             </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
