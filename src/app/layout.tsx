import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import SiteHeader from '@/components/site/header';
import SiteFooter from '@/components/site/footer';
import StickyCTA from '@/components/site/sticky-cta';
import './globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Venda seu Carro em até 24h | Ponto do Carro',
  description: 'Avaliação grátis em 15 min, +500 lojistas e pagamento à vista. Agende online ou chame no WhatsApp.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=Inter:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://wa.me" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
      </head>
      <body
        className={cn(
          "min-h-screen font-body antialiased",
        )}
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <StickyCTA />
        <Toaster />
      </body>
    </html>
  );
}
