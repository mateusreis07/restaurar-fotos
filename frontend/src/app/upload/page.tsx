'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [colorize, setColorize] = useState(true);
  const [animate, setAnimate] = useState(false);
  const router = useRouter();

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
      if (data.user) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
    })
    .catch(() => router.push('/login'));
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const objectUrl = URL.createObjectURL(selected);
      setPreview(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    if (user.credits <= 0) {
      alert('Seus créditos esgotaram. Escolha um novo pacote na Loja de Créditos para continuar salvando suas memórias!');
      router.push('/pricing');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id);
    formData.append('colorize', colorize.toString());
    formData.append('animate', animate.toString());

    try {
      const res = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard');
      } else {
        alert('Erro: ' + data.error);
        setUploading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Houve um problema de conexão. Tente novamente.');
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (!user) return (
     <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-[#604AF0]/20 border-t-[#604AF0] rounded-full animate-spin"></div>
     </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative font-sans">
      
      {/* Back Button */}
      <Link href="/dashboard" className="absolute top-6 left-6 flex items-center text-slate-500 hover:text-[#604AF0] transition-colors font-medium text-sm bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-full z-50">
        <span className="material-symbols-outlined mr-2 text-[18px]">arrow_back</span>
        Voltar para Galeria
      </Link>

      <div className="max-w-[1100px] w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center z-10">
        
        {/* Left Side: Text and Copy */}
        <div className="flex flex-col space-y-8 px-4 text-center lg:text-left items-center lg:items-start">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#EEECFF] text-[#604AF0] px-4 py-2 rounded-full text-sm font-bold mb-8">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>Restauração com IA</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-[#0F172A] tracking-tight leading-[1.1] mb-8">
              Dê vida nova às <br className="hidden sm:block"/>
              suas <br className="hidden sm:block"/>
              <span className="text-[#604AF0]">lembranças.</span>
            </h1>
            
            <p className="text-[#64748B] text-lg sm:text-xl font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
              Nossa tecnologia remove manchas, corrige cores e reconstrói detalhes perdidos em segundos. Simples como um passe de mágica.
            </p>
          </div>
          
          <div className="flex items-center space-x-4 pt-6 justify-center lg:justify-start">
             {/* Avatars */}
             <div className="flex -space-x-4 relative">
               <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80" alt="User 1" className="position-relative w-12 h-12 rounded-full border-[3px] border-[#F8FAFC] object-cover shadow-sm" />
               <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80" alt="User 2" className="position-relative w-12 h-12 rounded-full border-[3px] border-[#F8FAFC] object-cover shadow-sm" />
               <div className="position-relative w-12 h-12 rounded-full border-[3px] border-[#F8FAFC] bg-[#E2E8F0] flex items-center justify-center text-[10px] font-extrabold text-[#475569] z-10 shadow-sm">+10k</div>
             </div>
             <p className="text-[#64748B] text-[15px] font-bold">Confiado por milhares de famílias.</p>
          </div>
        </div>

        {/* Right Side: Upload Card */}
        <div className="flex flex-col items-center w-full relative">
          
          <div className="bg-white rounded-[3rem] p-4 sm:p-5 w-full max-w-[480px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-[#F1F5F9] relative overflow-hidden">
            
            {/* Dashed Upload Area inside the white card */}
            <div className={`relative rounded-[2.5rem] border-[2px] ${preview ? 'border-dashed border-[#A5B4FC]/40 bg-[#F8FAFC]' : 'border-dashed border-[#A5B4FC]/50 bg-[#F5F7FF]/50 hover:bg-[#EEECFF]/30 transition-colors'} p-6 sm:p-8 flex flex-col items-center justify-center text-center pb-8`}>
              
              {!preview && (
                 <input 
                   type="file" 
                   accept="image/*" 
                   onChange={handleFileChange} 
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                 />
              )}

              {/* Upload Content Placeholder */}
              <div className="w-[72px] h-[72px] bg-[#604AF0] rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-[#604AF0]/30 z-0">
                 <span className="material-symbols-outlined text-[36px]">cloud_upload</span>
              </div>
              
              <h3 className="text-[20px] sm:text-[22px] font-extrabold text-[#1E293B] mb-2">
                  Arraste ou selecione sua foto
              </h3>
              
              <p className={`text-[#64748B] text-[15px] font-medium ${preview ? 'mb-8' : 'mb-12'}`}>
                  Formatos suportados: JPG, PNG ou HEIC
              </p>
              
              {/* Selected File Card */}
              {preview && (
                 <div className="bg-white w-full rounded-[1.5rem] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.12)] border border-slate-100/60 p-3 mb-8 z-20 relative">
                    <div className="w-full rounded-[1rem] overflow-hidden aspect-square relative shadow-inner mb-4 group bg-[#F8FAFC]">
                       <img src={preview} className="w-full h-full object-cover" />
                       
                       <div className="absolute inset-0 bg-black/5 flex flex-col items-center justify-center pointer-events-none">
                          <div className="bg-white/98 px-6 py-3 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.08)] flex items-center font-bold text-[14.5px] tracking-tight text-[#604AF0]">
                            <span className="material-symbols-outlined text-[20px] mr-2">check_circle</span> 
                            Foto pronta para restaurar
                          </div>
                       </div>

                       {/* Hover functionality to change image */}
                       {!uploading && (
                         <input 
                           type="file" 
                           accept="image/*" 
                           onChange={handleFileChange} 
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                           title="Trocar imagem"
                         />
                       )}
                    </div>
                    
                    <div className="px-2 pb-2 text-left">
                      <p className="font-bold text-[#1E293B] text-[15px] truncate max-w-full block tracking-tight">
                         {file?.name}
                      </p>
                      <p className="text-[#64748B] text-[13px] font-semibold mt-1 tracking-wide">
                         {formatFileSize(file?.size || 0)}
                      </p>
                    </div>
                 </div>
              )}

              {/* AI Options */}
              {preview && !uploading && (
                <div className="w-full mb-6 flex flex-col gap-4">
                {/* Toggle: Colorize */}
                <div className="flex items-center justify-between p-6 bg-white/60 rounded-3xl border border-[#c7c4d7]/40 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#483ede] to-[#6366f1] rounded-2xl flex items-center justify-center shadow-lg shadow-[#483ede]/20">
                      <span className="material-symbols-outlined text-white text-[24px]">palette</span>
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-[#151c27] text-[15px]">Colorir Automático</h4>
                      <p className="text-[12px] font-semibold text-[#575f6a]/80">Restaura as cores de fotos P&B</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setColorize(!colorize)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${colorize ? 'bg-[#483ede]' : 'bg-[#e2e8f8]'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-md ${colorize ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Toggle: Animate */}
                <div className="flex items-center justify-between p-6 bg-white/60 rounded-3xl border border-[#c7c4d7]/40 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#f43f5e] to-[#fb7185] rounded-2xl flex items-center justify-center shadow-lg shadow-[#f43f5e]/20">
                      <span className="material-symbols-outlined text-white text-[24px]">movie</span>
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-[#151c27] text-[15px]">Animar Retrato (Premium)</h4>
                      <p className="text-[12px] font-semibold text-[#f43f5e] uppercase tracking-wider">+4 créditos extras</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setAnimate(!animate)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${animate ? 'bg-[#f43f5e]' : 'bg-[#e2e8f8]'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-md ${animate ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                </div>
              )}

              {/* Action Button */}
              {preview && (
                 <button 
                     onClick={handleUpload}
                     disabled={uploading}
                     className="w-full max-w-full bg-[#604AF0] hover:bg-[#4A32DA] shadow-xl shadow-[#604AF0]/25 cursor-pointer text-white rounded-[2rem] py-5 font-bold tracking-wide text-[18px] flex justify-center items-center transition-all duration-300 z-20 relative disabled:opacity-75 disabled:cursor-not-allowed"
                 >
                    {uploading ? (
                      <><span className="material-symbols-outlined animate-spin mr-3 text-[22px]">refresh</span> Processando IA...</>
                    ) : (
                      <>Restaurar agora <span className="material-symbols-outlined ml-2 text-[24px]">auto_awesome</span></>
                    )}
                 </button>
              )}

            </div>
          </div>
          
          {/* Bottom Security Badges */}
          <div className="flex items-center space-x-8 sm:space-x-12 mt-8 lg:mt-10 opacity-80">
             <div className="flex items-center space-x-2.5 text-[#475569]">
                <span className="material-symbols-outlined text-[#604AF0] text-[20px]">verified_user</span>
                <span className="text-[13px] sm:text-sm font-bold tracking-wide">Privacidade Garantida</span>
             </div>
             <div className="flex items-center space-x-2.5 text-[#475569]">
                <span className="material-symbols-outlined text-[#604AF0] text-[20px]">high_quality</span>
                <span className="text-[13px] sm:text-sm font-bold tracking-wide">Qualidade Ultra HD</span>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
