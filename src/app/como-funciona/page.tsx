import { Hero } from '@/components/ui/hero-with-group-of-images-text-and-two-buttons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Como Funciona | Carro Venda Rápida',
  description: 'Entenda em 3 passos simples como vender seu carro em até 24h. Agende, faça a vistoria de 15 minutos e receba a melhor proposta.',
};

export default function ComoFuncionaPage() {
  return (
    <div className="pt-10">
      <Hero />
    </div>
  );
}
