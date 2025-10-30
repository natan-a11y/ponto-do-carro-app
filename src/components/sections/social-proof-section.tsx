"use client";

import { REVIEWS } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

export function SocialProofSection() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <section id="reviews" className="w-full py-16 md:py-24 bg-secondary">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-8 duration-1000 ease-in-out">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            O que nossos clientes dizem
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Confiança e agilidade comprovadas por quem já vendeu com a gente.
          </p>
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-in-out">
          <Carousel
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent>
              {REVIEWS.map((review, index) => (
                <CarouselItem key={`${review.id}-${index}`} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2 h-full">
                    <Card className="flex flex-col h-full justify-between p-6 shadow-md bg-background">
                      <CardContent className="p-0">
                        <div className="flex text-accent mb-4">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                        </div>
                        <p className="text-muted-foreground mb-6 text-base">"{review.text}"</p>
                      </CardContent>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-bold text-foreground">{review.author}</p>
                          <p className="text-sm text-muted-foreground">Cliente Verificado</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-10" />
            <CarouselNext className="mr-10" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
