import { UNITS, getWhatsAppLink } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Phone } from "lucide-react";

export function UnitsSection() {
  return (
    <section id="units" className="w-full py-16 md:py-24 bg-background">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-8 duration-1000 ease-in-out">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Nossas Unidades em BH
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Escolha a unidade mais perto de você para uma avaliação rápida e gratuita.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {UNITS.map((unit, index) => (
            <div key={unit.id} className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-in-out" style={{animationDelay: `${index * 150}ms`}}>
              <Card className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-2xl h-full flex flex-col group">
                <div className="relative h-56 w-full">
                  <Image
                    src={unit.imageUrl}
                    alt={`Fachada da ${unit.name}`}
                    fill
                    className="object-cover"
                    data-ai-hint={unit.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                     <CardTitle className="font-headline text-2xl text-white">{unit.name}</CardTitle>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4 flex-grow">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 mt-1 shrink-0 text-primary" />
                    <span>{unit.address}</span>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Clock className="h-5 w-5 mt-1 shrink-0 text-primary" />
                    <div>
                      {unit.openingHours.map(line => <p key={line}>{line}</p>)}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3 p-6 pt-0 mt-auto">
                  <Button variant="outline" asChild className="w-full">
                    <a href={getWhatsAppLink(unit.id, `Olá! Gostaria de agendar uma avaliação na unidade ${unit.name}.`)} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  </Button>
                  <Button asChild className="w-full" variant="accent">
                    <Link href={`/unidades/${unit.slug}`}>Ver detalhes</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
