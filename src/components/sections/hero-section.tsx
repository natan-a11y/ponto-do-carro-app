"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useContactModal } from "../site/contact-modal";

export function HeroSection() {
  const { onOpen } = useContactModal();

  const benefits = [
    "Avaliação gratuita em 15 min",
    "+500 lojistas disputando seu carro",
    "Pagamento à vista (PIX/TED)",
  ];

  return (
    <div 
      className="relative w-full h-screen flex items-center justify-end -mt-20"
      style={{ 
        backgroundImage: `url(https://i.postimg.cc/pT3ZYr3k/2020-Honda-Civic-Type-R-001-2160.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-transparent z-10" />

      <div className="container relative z-20 h-full flex flex-col justify-center items-end text-right max-w-7xl">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-headline text-primary-foreground animate-in fade-in slide-in-from-bottom-12 duration-1000">
            Venda seu carro em até <span className="text-accent">24h</span>
          </h1>
          <div className="mt-8 flex flex-col items-end gap-4 text-base text-primary-foreground">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-in-out"
                style={{ animationDelay: `${500 + index * 150}ms` }}
              >
                <span>{benefit}</span>
                <CheckCircle className="h-5 w-5 text-accent" />
              </div>
            ))}
          </div>
          <div 
            className="mt-10 flex flex-col sm:flex-row items-end sm:items-center sm:justify-end gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-in-out"
            style={{ animationDelay: '900ms' }}
            >
             <Button size="lg" variant="accent" onClick={onOpen} className="rounded-full">
                Agendar avaliação
            </Button>
            <Button size="lg" variant="outline" onClick={onOpen} className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 backdrop-blur-md">
                Falar com especialista
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
