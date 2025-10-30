import { SocialProofSection } from '@/components/sections/social-proof-section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Avaliações de Clientes | Ponto do Carro',
  description: 'Veja o que nossos clientes dizem sobre a experiência de vender o carro conosco. Rapidez, transparência e o melhor negócio.',
};

export default function AvaliacoesPage() {
  return (
    <div className="pt-10">
        <SocialProofSection />
    </div>
  );
}
