"use client";

import { useState } from "react";
import { HOW_IT_WORKS_STEPS } from "@/lib/data";
import { Button } from "../ui/button";
import Script from "next/script";
import { useContactModal } from "../site/contact-modal";
import { VolumeX } from "lucide-react";

export function HowItWorksSection() {
    const { onOpen } = useContactModal();
    const [isMuted, setIsMuted] = useState(true);

    const handleToggleMute = () => {
        setIsMuted(false);
    };

  return (
    <section id="how-it-works" className="w-full py-16 md:py-24 bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-12 items-center md:grid-cols-2">
          <div className="flex gap-6 flex-col">
            <div className="flex gap-4 flex-col text-center md:text-left">
              <h2 className="text-3xl md:text-5xl tracking-tight font-bold">
                Vender seu carro nunca foi tão fácil
              </h2>
              <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl mx-auto md:mx-0">
                Nosso processo é desenhado para ser rápido, transparente e justo. Em apenas 3 passos, você transforma seu carro em dinheiro na conta, sem dor de cabeça.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 md:gap-8 w-full mt-4">
                {HOW_IT_WORKS_STEPS.map((step) => (
                    <div key={step.id} className="flex flex-col items-center text-center p-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                            <step.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-base font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground text-xs mt-1">{step.description}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center md:justify-start">
               <Button size="lg" onClick={onOpen} variant="accent">
                Agendar Avaliação Gratuita
              </Button>
               <Button size="lg" onClick={onOpen} variant="outline">
                Falar no WhatsApp
              </Button>
            </div>
          </div>
          <div className="w-full flex justify-center animate-in fade-in slide-in-from-right-8 duration-1000 ease-in-out">
              <div className="relative w-full max-w-sm">
                  <div style={{padding:'177.78% 0 0 0',position:'relative'}}>
                      <iframe 
                          src={`https://player.vimeo.com/video/1132253360?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=${isMuted ? 1 : 0}&controls=0&title=0&byline=0&portrait=0`}
                          frameBorder="0" 
                          allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
                          style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}} 
                          title="Demonstração do processo de venda Ponto do Carro"
                          className="rounded-[2rem] shadow-2xl border"
                          >
                      </iframe>
                  </div>
                  {isMuted && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-[2rem] cursor-pointer"
                        onClick={handleToggleMute}
                      >
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm">
                            <VolumeX className="w-8 h-8 text-white" />
                          </div>
                      </div>
                  )}
                  <Script src="https://player.vimeo.com/api/player.js"></Script>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
