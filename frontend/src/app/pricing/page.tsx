'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '../components/Footer';

function PricingContent() {
  const [user, setUser] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showCanceled, setShowCanceled] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Detect canceled purchase from Stripe redirect
  useEffect(() => {
    if (searchParams.get('canceled') === 'true' && !sessionStorage.getItem('canceled_modal_shown')) {
      sessionStorage.setItem('canceled_modal_shown', 'true');
      setShowCanceled(true);
    }
    if (searchParams.get('canceled')) {
      window.history.replaceState({}, '', '/pricing');
    }
  }, [searchParams]);

  useEffect(() => {
    const userId = localStorage.getItem('aura_user_id');
    const savedEmail = localStorage.getItem('aura_email');
    
    if (!userId || !savedEmail) {
      router.push('/login');
      return;
    }
    
    fetch('/api/auth/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.user) setUser(data.user);
      else router.push('/login');
    })
    .catch(() => router.push('/login'));
  }, [router]);

  const handleBuyCredits = async (planId: string) => {
    if (!user) return;
    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/webhook/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, planId })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erro ao processar plano. Tente novamente.');
        setLoadingPlan(null);
      }
    } catch(err) {
      console.error('Checkout error');
      setLoadingPlan(null);
    }
  };

  if (!user) return <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center"></div>;

  return (
    <div className="bg-[#f9f9ff] flex flex-col min-h-screen relative font-sans">
      <div className="pt-8 md:pt-24 pb-32 px-6 flex flex-col items-center justify-center flex-1">

        <div className="max-w-7xl mx-auto w-full mt-2 md:mt-0">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-block px-4 py-1.5 bg-[#483ede]/10 text-[#483ede] text-[12px] font-extrabold uppercase tracking-widest rounded-full mb-2">LOJA DE CRÉDITOS</div>
            <h2 className="font-headline font-extrabold text-[36px] md:text-[48px] text-[#151c27] tracking-tight">Escolha seu pacote de restauração</h2>
            <p className="text-[#575f6a] text-[18px] font-medium max-w-2xl mx-auto">Pague apenas pelo que precisar através da plataforma ultrassegura da Stripe. Sem assinaturas ocultas.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-[1100px] mx-auto">
            
            {/* Plan 1 */}
            <div className="bg-[#f0f3ff] p-10 rounded-[2rem] shadow-sm space-y-8 flex flex-col border border-[#dce2f3] hover:-translate-y-1 transition-transform cursor-default">
              <div className="space-y-2">
                <h3 className="font-headline font-bold text-[22px] text-[#151c27]">Entrada</h3>
                <p className="text-[13px] font-bold text-[#483ede] uppercase tracking-wider">Reviva memórias especiais</p>
                <div className="flex items-baseline space-x-1.5 pt-2">
                  <span className="text-[20px] font-bold text-[#575f6a]">R$</span>
                  <span className="text-[48px] font-extrabold text-[#151c27] tracking-tighter">29,90</span>
                </div>
              </div>
              <ul className="space-y-4 flex-grow">
                <li className="flex items-center space-x-3 text-[#575f6a]">
                  <span className="material-symbols-outlined text-[#0f6b40]">check_circle</span>
                  <span className="font-bold text-[#151c27] text-[15.5px]">10 créditos</span>
                </li>
                <li className="flex items-center space-x-3 text-[#575f6a]">
                  <span className="material-symbols-outlined text-[#0f6b40]">check_circle</span>
                  <span className="text-[15px] font-medium italic">📸 até 10 fotos</span>
                </li>
                <li className="flex items-center space-x-3 text-[#575f6a]">
                  <span className="material-symbols-outlined text-[#0f6b40]">check_circle</span>
                  <span className="text-[15px] font-medium italic">🎬 ou 2 fotos + 2 vídeos</span>
                </li>
                <li className="flex items-center space-x-3 text-[#f43f5e] font-black">
                  <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>card_giftcard</span>
                  <span className="text-[14px]">Página de Presente Digital Incluída</span>
                </li>
              </ul>
              <button 
                onClick={() => handleBuyCredits('plan_1')}
                disabled={loadingPlan !== null}
                className="w-full py-4 rounded-[1.25rem] border-2 border-[#483ede] text-[#483ede] font-extrabold tracking-wide hover:bg-[#483ede]/5 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {loadingPlan === 'plan_1' ? <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span> : 'Adquirir Pacote'}
              </button>
            </div>
            
            {/* Plan 2: Best Value */}
            <div className="bg-white p-10 py-12 md:scale-105 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] ring-[3px] ring-[#483ede] relative space-y-8 flex flex-col z-10 mx-auto w-full border border-white">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#483ede] text-white text-[11px] font-extrabold px-5 py-2.5 rounded-full uppercase tracking-widest shadow-xl whitespace-nowrap">O Mais Popular</div>
              <div className="space-y-2">
                <h3 className="font-headline font-extrabold text-[24px] text-[#483ede]">Mais Vendido</h3>
                <p className="text-[13px] font-black text-[#483ede] uppercase tracking-wider">Traga suas memórias de volta à vida</p>
                <div className="flex items-baseline space-x-1.5 text-[#483ede] pt-2">
                  <span className="text-[24px] font-extrabold">R$</span>
                  <span className="text-[60px] font-black tracking-tighter">49,90</span>
                </div>
              </div>
              <ul className="space-y-5 flex-grow">
                <li className="flex items-center space-x-3">
                  <span className="material-symbols-outlined text-[#483ede] font-bold">verified</span>
                  <span className="font-extrabold text-[#151c27] text-[16.5px]">25 créditos</span>
                </li>
                <li className="flex items-center space-x-3 text-[#575f6a]">
                  <span className="material-symbols-outlined text-[#483ede] font-bold">verified</span>
                  <span className="text-[15px] font-bold text-[#151c27]">📸 até 25 fotos</span>
                </li>
                <li className="flex items-center space-x-3 text-[#575f6a]">
                  <span className="material-symbols-outlined text-[#483ede] font-bold">verified</span>
                  <span className="text-[15px] font-medium">🎬 ou 5 fotos + 5 Vídeos</span>
                </li>
                <li className="flex items-center space-x-3 text-[#f43f5e] font-black">
                  <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>card_giftcard</span>
                  <span className="text-[15px]">Página de Presente Digital Incluída</span>
                </li>
              </ul>
              <button 
                onClick={() => handleBuyCredits('plan_2')}
                disabled={loadingPlan !== null}
                className="w-full py-5 rounded-[1.25rem] bg-[#483ede] text-white font-extrabold text-[16.5px] shadow-[0_10px_20px_rgba(72,62,222,0.3)] hover:shadow-[0_15px_30px_rgba(72,62,222,0.4)] hover:-translate-y-1 hover:bg-[#3b32c6] active:scale-95 transition-all tracking-wide flex items-center justify-center gap-2"
              >
                {loadingPlan === 'plan_2' ? <span className="material-symbols-outlined animate-spin text-[24px]">refresh</span> : 'Quero este pacote'}
              </button>
            </div>
            
            {/* Plan 3 */}
            <div className="bg-[#f0f3ff] p-10 rounded-[2rem] shadow-sm space-y-8 flex flex-col border border-[#dce2f3] hover:-translate-y-1 transition-transform cursor-default">
              <div className="space-y-2">
                <h3 className="font-headline font-bold text-[22px] text-[#151c27]">Premium</h3>
                <p className="text-[13px] font-bold text-[#0f6b40] uppercase tracking-wider">Reviva a sua história</p>
                <div className="flex items-baseline space-x-1.5 pt-2">
                  <span className="text-[20px] font-bold text-[#575f6a]">R$</span>
                  <span className="text-[48px] font-extrabold text-[#151c27] tracking-tighter">89,90</span>
                </div>
              </div>
              <ul className="space-y-4 flex-grow">
                <li className="flex items-center space-x-3 text-[#575f6a]">
                  <span className="material-symbols-outlined text-[#0f6b40]">check_circle</span>
                  <span className="font-bold text-[#151c27] text-[15.5px]">60 créditos</span>
                </li>
                <li className="flex items-center space-x-3 text-[#575f6a]">
                  <span className="material-symbols-outlined text-[#0f6b40]">check_circle</span>
                  <span className="text-[15px] font-medium italic">📸 muitas fotos</span>
                </li>
                <li className="flex items-center space-x-3 text-[#575f6a]">
                  <span className="material-symbols-outlined text-[#0f6b40]">check_circle</span>
                  <span className="text-[15px] font-medium italic">🎬 ou 12 fotos + 12 Vídeos</span>
                </li>
                <li className="flex items-center space-x-3 text-[#f43f5e] font-black">
                  <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>card_giftcard</span>
                  <span className="text-[14px]">Página de Presente Digital Incluída</span>
                </li>
              </ul>
              <button 
                onClick={() => handleBuyCredits('plan_3')}
                disabled={loadingPlan !== null}
                className="w-full py-4 rounded-[1.25rem] border-2 border-[#483ede] text-[#483ede] font-extrabold tracking-wide hover:bg-[#483ede]/5 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {loadingPlan === 'plan_3' ? <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span> : 'Adquirir Pacote'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Modal de Compra Cancelada */}
      {showCanceled && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#151c27]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-[440px] overflow-hidden shadow-2xl border border-[#c7c4d7]/40 p-10 text-center space-y-8 animate-in zoom-in-95 duration-500">
            
            {/* Ícone */}
            <div className="w-24 h-24 bg-[#fff7ed] rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-white">
              <span className="material-symbols-outlined text-[48px] text-[#f59e0b]" style={{fontVariationSettings: "'FILL' 1"}}>info</span>
            </div>

            {/* Mensagem */}
            <div className="space-y-3">
              <h2 className="font-headline text-[26px] font-black text-[#151c27] tracking-tight leading-tight">Compra Não Finalizada</h2>
              <p className="text-[#575f6a] text-[15px] leading-relaxed font-medium">
                Parece que o pagamento não foi concluído. Nenhuma cobrança foi realizada. Você pode tentar novamente quando quiser — suas memórias estarão esperando!
              </p>
            </div>

            {/* Ações */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => { sessionStorage.removeItem('canceled_modal_shown'); setShowCanceled(false); }}
                className="w-full bg-[#483ede] text-white py-5 rounded-[18px] font-black text-[17px] hover:bg-[#3b32c6] shadow-xl shadow-[#483ede]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
                Escolher um Pacote
              </button>
              <Link
                href="/dashboard"
                onClick={() => { sessionStorage.removeItem('canceled_modal_shown'); setShowCanceled(false); }}
                className="w-full py-4 text-[#575f6a] font-extrabold text-[15px] hover:text-[#151c27] transition-colors flex items-center justify-center"
              >
                Voltar para a Galeria
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center"></div>}>
      <PricingContent />
    </Suspense>
  );
}
