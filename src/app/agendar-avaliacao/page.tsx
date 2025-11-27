import { AppointmentForm } from "@/components/forms/appointment-form";
import { UNITS } from "@/lib/data";
import type { Metadata } from "next";
import { Users, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: "Agendar Avaliação Gratuita | Ponto do Carro",
  description: "Venda seu carro em 24h. Use nossa ferramenta para selecionar seu veículo e agende uma avaliação gratuita em uma de nossas unidades. Rápido, justo e pagamento à vista.",
};

export default function AgendarAvaliacaoPage() {
  return (
    <div className="w-full bg-[#F8F9FA] text-gray-800 font-body">
      <main className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        
        {/* Lado Esquerdo: CTA */}
        <div className="space-y-8 text-center lg:text-left animate-in fade-in slide-in-from-left-4 duration-700">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-primary-foreground text-xs font-semibold uppercase tracking-wide mx-auto lg:mx-0">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
             Avaliação rápida e segura
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1]">
            Agende sua avaliação e venda seu carro em <span className="text-primary">24h</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Selecione seu veículo ao lado e preencha seus dados para marcar uma vistoria gratuita de 15 minutos em uma de nossas unidades.
          </p>
          
          <div className="pt-4 flex items-center gap-4 justify-center lg:justify-start border-t border-gray-200/60 mt-8 w-full max-w-md mx-auto lg:mx-0">
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center overflow-hidden shadow-sm">
                    <Users size={16} className="text-gray-400" />
                 </div>
               ))}
             </div>
             <div className="text-left">
                <p className="text-sm font-bold text-gray-800">+500 Clientes Satisfeitos</p>
                <p className="text-xs text-gray-500">Confiam em nosso processo</p>
             </div>
           </div>
        </div>

        {/* Lado Direito: Formulário */}
        <div className="flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
           <div className="w-full max-w-md relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-6 relative z-20">
                <AppointmentForm units={UNITS} />
              </div>
           </div>
        </div>

      </main>
    </div>
  );
}
