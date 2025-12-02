"use client";

import { AppointmentForm } from "@/components/forms/appointment-form";
import { UNITS } from "@/lib/data";
import { Users } from "lucide-react";

export function HeroSection() {
  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center -mt-20 pt-20 pb-10"
      style={{
        backgroundImage: `url(https://i.postimg.cc/pT3ZYr3k/2020-Honda-Civic-Type-R-001-2160.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-10" />

      <main className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-20">
        
        {/* Lado Esquerdo: CTA */}
        <div className="space-y-8 text-center lg:text-left text-white animate-in fade-in slide-in-from-left-4 duration-700">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 shadow-sm text-accent text-xs font-semibold uppercase tracking-wide mx-auto lg:mx-0">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
             Avaliação rápida e segura
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
            Agende sua avaliação e venda seu carro em <span className="text-accent">24h</span>
          </h1>
          
          <p className="text-lg text-white/80 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Selecione seu veículo ao lado e preencha seus dados para marcar uma vistoria gratuita de 15 minutos em uma de nossas unidades.
          </p>
          
          <div className="pt-4 flex items-center gap-4 justify-center lg:justify-start border-t border-white/20 w-full max-w-md mx-auto lg:mx-0">
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full bg-white/20 border-2 border-background flex items-center justify-center overflow-hidden shadow-sm">
                    <Users size={16} className="text-white/60" />
                 </div>
               ))}
             </div>
             <div className="text-left">
                <p className="text-sm font-bold text-white">+500 Clientes Satisfeitos</p>
                <p className="text-xs text-white/70">Confiam em nosso processo</p>
             </div>
           </div>
        </div>

        {/* Lado Direito: Formulário */}
        <div className="flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
           <div className="w-full max-w-md relative">
              <div className="w-full bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 relative z-20">
                <AppointmentForm units={UNITS} />
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
