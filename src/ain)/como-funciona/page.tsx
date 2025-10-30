import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Como Funciona | Ponto do Carro',
  description: 'Entenda em 3 passos simples como vender seu carro em até 24h. Agende, faça a vistoria de 15 minutos e receba a melhor proposta.',
};

export default function ComoFuncionaPage() {
  return (
    <div className="pt-10">
      <HowItWorksSection />
    </div>
  );
}
