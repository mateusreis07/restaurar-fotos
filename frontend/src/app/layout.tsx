import type { Metadata } from 'next';
import './globals.css';
import MobileNav from './components/MobileNav';
import GlobalHeader from './components/GlobalHeader';

export const metadata: Metadata = {
  title: 'Aura Recall | Restaure suas memórias com IA',
  description: 'Transforme fotos desbotadas, riscadas ou embaçadas em recordações vívidas e cristalinas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect"/>
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect"/>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
        <style dangerouslySetInnerHTML={{ __html: `
          .material-symbols-outlined {
              font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
              vertical-align: middle;
          }
          .editorial-gradient {
              background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
          }
          .glass-panel {
              background: rgba(255, 255, 255, 0.8);
              backdrop-filter: blur(20px);
          }
        `}} />
      </head>
      <body className="bg-surface font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed-variant flex flex-col min-h-screen" suppressHydrationWarning>
        <GlobalHeader />
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
