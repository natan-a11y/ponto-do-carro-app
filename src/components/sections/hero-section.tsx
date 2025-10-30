"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { CheckCircle } from "lucide-react";
import { useContactModal } from "../site/contact-modal";

const heroImage = placeholderImages.find(p => p.id === 'hero-background');

export function HeroSection() {
  const { onOpen } = useContactModal();

  const benefits = [
    "Avaliação gratuita em 15 min",
    "+500 lojistas disputando seu carro",
    "Pagamento à vista (PIX/TED)",
  ];

  return (
    <section className="relative w-full h-screen flex items-center justify-center -mt-16">
        {heroImage && (
             <Image
                src={heroImage.imageUrl}
                alt="Carro moderno em destaque"
                fill
                className="object-cover z-0"
                priority
                quality={100}
                data-ai-hint={heroImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-l from-primary/20 to-transparent z-10" />

      <div className="container relative z-20 max-w-7xl h-full flex flex-col justify-center items-end">
        <div className="max-w-2xl text-right">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-headline text-primary-foreground">
            Venda seu carro em até <span className="text-accent">24h</span>
          </h1>
          <div className="mt-8 flex flex-col items-end gap-4 text-base text-primary-foreground">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-end gap-4">
            <Button size="lg" variant="accent" onClick={onOpen} className="rounded-full">
                Falar com especialista
            </Button>
            <Button size="lg" variant="secondary" onClick={onOpen} className="rounded-full">
                Agendar avaliação
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
