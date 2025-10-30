import { REVIEWS } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import { Star } from "lucide-react";

export function SocialProofSection() {
  return (
    <section id="reviews" className="w-full py-16 md:py-24 bg-secondary/30">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            O que nossos clientes dizem
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Confiança e agilidade comprovadas por quem já vendeu com a gente.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {REVIEWS.map((review) => (
              <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="flex flex-col h-full justify-between p-6 shadow-md">
                    <CardContent className="p-0">
                      <div className="flex text-yellow-500 mb-4">
                        {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                      </div>
                      <p className="text-muted-foreground mb-6">"{review.text}"</p>
                    </CardContent>
                    <div className="flex items-center gap-4">
                      <Image
                        src={review.avatarUrl}
                        alt={review.author}
                        width={40}
                        height={40}
                        className="rounded-full"
                        data-ai-hint={review.avatarHint}
                      />
                      <p className="font-bold text-foreground">{review.author}</p>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}