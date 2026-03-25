'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass-panel shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-primary font-headline">Aura Recall</div>
          <div className="hidden md:flex items-center space-x-8">
            <a className="font-headline font-medium text-sm tracking-tight text-primary font-bold border-b-2 border-primary pb-1" href="#">Como funciona</a>
            <a className="font-headline font-medium text-sm tracking-tight text-slate-600 hover:text-primary transition-colors duration-300" href="#">Preços</a>
            <Link href="/dashboard" className="font-headline font-medium text-sm tracking-tight text-slate-600 hover:text-primary transition-colors duration-300">Minha Área</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="hidden sm:block text-slate-600 font-headline font-medium text-sm hover:text-primary transition-colors duration-300">Login</button>
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
                Restaure suas fotos antigas com IA em segundos
            </h1>
            <p className="text-lg md:text-xl text-secondary leading-relaxed max-w-lg">
                Transforme fotos desbotadas, riscadas ou embaçadas em recordações vívidas e cristalinas. Uma herança digital para sua família.
            </p>
            <div className="space-y-4">
              <Link href="/dashboard" className="block w-full">
                <button className="w-full editorial-gradient text-on-primary py-5 rounded-xl font-headline font-bold text-lg shadow-lg active:scale-95 transition-all">
                    Restaurar minha foto agora
                </button>
              </Link>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl group w-full aspect-[4/5] bg-slate-300" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBMk8dagUlvtrjUg2jh1pucdn5sF77rIg4yZjlf_Agk2DUGtnLuf7mytHYLorNQPAd1Atvhs9Gpt-5jO41DYDeUITjeUOQT7_I7c3-Ur7aGDIx-JWBL3ysQtoe8dCjAAl_Tlvzc6OVgfPkGK-nDH16dlo6qFJCECGelDmD0JMVPFMfUB5hXUJBZyCrRrkXtsdfyuGmd3z2kR_9IQymwGOOpvYzSlipNq7o7PsuXEf93RF4ipbHdmspXRS2owhP0VlF7Gr0W1ingZKhE')", backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-full bg-white/80 shadow-lg relative cursor-ew-resize">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <span className="material-symbols-outlined text-primary">unfold_more</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 glass-panel px-4 py-2 rounded-lg text-sm font-bold text-primary">Antes</div>
            <div className="absolute bottom-4 right-4 glass-panel px-4 py-2 rounded-lg text-sm font-bold text-primary">Depois</div>
          </div>
        </section>

        {/* How it Works */}
        <section className="bg-surface-container-low py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-headline font-extrabold text-4xl text-on-surface mb-4">Como funciona</h2>
              <p className="text-secondary max-w-xl mx-auto">Três passos simples para trazer suas memórias de volta à vida.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-surface rounded-xl p-10 space-y-6 shadow-sm hover:translate-y-[-8px] transition-transform duration-300">
                <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
                </div>
                <h3 className="font-headline font-bold text-2xl">1. Upload</h3>
                <p className="text-secondary leading-relaxed">Envie uma foto digitalizada ou até mesmo tire uma foto da imagem antiga com seu celular.</p>
              </div>
              <div className="bg-surface rounded-xl p-10 space-y-6 shadow-sm hover:translate-y-[-8px] transition-transform duration-300">
                <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">auto_fix_high</span>
                </div>
                <h3 className="font-headline font-bold text-2xl">2. IA Melhora</h3>
                <p className="text-secondary leading-relaxed">Nossa inteligência artificial analisa cada pixel, remove riscos e recria os detalhes perdidos pelo tempo.</p>
              </div>
              <div className="bg-surface rounded-xl p-10 space-y-6 shadow-sm hover:translate-y-[-8px] transition-transform duration-300">
                <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">download</span>
                </div>
                <h3 className="font-headline font-bold text-2xl">3. Download</h3>
                <p className="text-secondary leading-relaxed">Baixe sua foto restaurada em alta definição, pronta para ser impressa e emoldurada novamente.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-surface py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline font-extrabold text-4xl text-on-surface mb-4">Escolha seu plano</h2>
              <p className="text-secondary">Pague apenas pelo que precisar. Sem assinaturas mensais.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-surface-container-low p-10 rounded-xl shadow-sm space-y-8 flex flex-col">
                <div className="space-y-2">
                  <h3 className="font-headline font-bold text-xl">Iniciante</h3>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold">R$</span>
                    <span className="text-5xl font-extrabold">29</span>
                  </div>
                </div>
                <ul className="space-y-4 flex-grow">
                  <li className="flex items-center space-x-3 text-secondary">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span>5 fotos restauradas</span>
                  </li>
                  <li className="flex items-center space-x-3 text-secondary">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span>Alta definição (HD)</span>
                  </li>
                </ul>
                <Link href="/dashboard">
                  <button className="w-full py-4 rounded-xl border-2 border-primary text-primary font-headline font-bold hover:bg-primary-fixed transition-colors">
                    Comprar Agora
                  </button>
                </Link>
              </div>
              <div className="bg-surface p-10 rounded-xl shadow-xl ring-2 ring-primary relative space-y-8 flex flex-col scale-105">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 editorial-gradient text-on-primary text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">Mais popular</div>
                <div className="space-y-2">
                  <h3 className="font-headline font-bold text-xl text-primary">Memórias de Família</h3>
                  <div className="flex items-baseline space-x-1 text-primary">
                    <span className="text-2xl font-bold">R$</span>
                    <span className="text-5xl font-extrabold">49</span>
                  </div>
                </div>
                <ul className="space-y-4 flex-grow">
                  <li className="flex items-center space-x-3 text-secondary">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span className="font-bold text-on-surface">10 fotos restauradas</span>
                  </li>
                  <li className="flex items-center space-x-3 text-secondary">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span>Restauração facial avançada</span>
                  </li>
                </ul>
                <Link href="/dashboard">
                  <button className="w-full py-4 rounded-xl editorial-gradient text-on-primary font-headline font-bold shadow-lg hover:shadow-primary/20 transition-all">
                    Comprar Agora
                  </button>
                </Link>
              </div>
              <div className="bg-surface-container-low p-10 rounded-xl shadow-sm space-y-8 flex flex-col">
                <div className="space-y-2">
                  <h3 className="font-headline font-bold text-xl">Legado Completo</h3>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold">R$</span>
                    <span className="text-5xl font-extrabold">79</span>
                  </div>
                </div>
                <ul className="space-y-4 flex-grow">
                  <li className="flex items-center space-x-3 text-secondary">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span>20 fotos restauradas</span>
                  </li>
                </ul>
                <Link href="/dashboard">
                  <button className="w-full py-4 rounded-xl border-2 border-primary text-primary font-headline font-bold hover:bg-primary-fixed transition-colors">
                    Comprar Agora
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-low w-full py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="text-lg font-bold text-slate-900 font-headline">Aura Recall</div>
            <p className="font-body text-sm text-slate-500 max-w-sm">© 2026 Aura Recall. Suas memórias, perfeitamente preservadas.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
