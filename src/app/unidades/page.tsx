import { UnitsSection } from "@/components/sections/units-section";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nossas Unidades | Ponto do Carro',
  description: 'Encontre a unidade da Ponto do Carro mais próxima de você em Belo Horizonte. Visite-nos no Buritis ou Caiçara.',
};

export default function UnidadesPage() {
  return (
    <div className="pt-10">
      <UnitsSection />
    </div>
  );
}
