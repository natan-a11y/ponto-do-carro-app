import { UnitsSection } from "@/components/sections/units-section";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nossas Unidades | Carro Venda Rápida',
  description: 'Encontre a unidade da Carro Venda Rápida mais próxima de você em Belo Horizonte. Visite-nos no Buritis ou Caiçara.',
};

export default function UnidadesPage() {
  return (
    <div className="pt-10">
      <UnitsSection />
    </div>
  );
}
