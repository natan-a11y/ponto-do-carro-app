"use client";

import { UNITS, FAQS, getWhatsAppLink } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Clock, Phone } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import StructuredData from '@/components/site/structured-data';
import { useContactModal } from '@/components/site/contact-modal';

// We need to keep this component for generateStaticParams, but make the page client-side.
// This is a bit of a hack, but it works. We'll render the client component below.

type Props = {
  params: { slug: string };
};

export default function UnitPage({ params }: Props) {
  const unit = UNITS.find((p) => p.slug === params.slug);
  const { onOpen } = useContactModal();

  if (!unit) {
    notFound();
  }

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": `Carro Venda Rápida - ${unit.name}`,
    "image": unit.imageUrl,
    "@id": `https://www.carrovendarapida.com.br/unidades/${unit.slug}`,
    "url": `https://www.carrovendarapida.com.br/unidades/${unit.slug}`,
    "telephone": unit.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": unit.address.split(' - ')[0],
      "addressLocality": "Belo Horizonte",
      "addressRegion": "MG",
      "postalCode": "",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": unit.geo.lat,
      "longitude": unit.geo.lng
    },
    "openingHoursSpecification": unit.openingHours.map(h => ({
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": h.startsWith("Segunda") ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] : ["Saturday"],
        "opens": h.split(': ')[1]?.split(' - ')[0] || "08:00",
        "closes": h.split(': ')[1]?.split(' - ')[1] || "18:00",
    })),
    "sameAs": [
      `https://wa.me/${unit.whatsappNumber}`
    ]
  };

  return (
    <>
    <StructuredData data={localBusinessData} />
    <div className="py-16 md:py-24 bg-background">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <h1 className="text-3xl sm:text-4xl font-bold font-headline mb-2">Venda seu carro no <span className="text-primary">{unit.name.replace('Unidade ', '')}</span> em até 24h</h1>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-8">
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4"/> {unit.address}</div>
            </div>

            <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg mb-8">
                <Image
                    src={unit.imageUrl}
                    alt={`Foto da ${unit.name}`}
                    fill
                    className="object-cover"
                    data-ai-hint={unit.imageHint}
                />
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Informações da Unidade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary"/>
                        <div>{unit.openingHours.join(' | ')}</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary"/>
                        <a href={`tel:${unit.phone}`} className="hover:underline">{unit.phone}</a>
                    </div>
                </CardContent>
            </Card>

            <h2 className="text-2xl font-bold font-headline mb-4">Dúvidas Comuns</h2>
             <Accordion type="single" collapsible className="w-full">
              {FAQS.slice(0, 3).map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="bg-card rounded-lg mb-3 shadow-sm px-4">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-center">Próximo Passo</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Button onClick={onOpen} size="lg" variant="accent">
                            Falar com {unit.name.replace('Unidade ', '')}
                        </Button>
                        <Button onClick={onOpen} size="lg" variant="default">
                           Agendar Avaliação
                        </Button>
                    </CardContent>
                </Card>
                <div className="aspect-video w-full rounded-md overflow-hidden border-4 border-card shadow-lg">
                    <iframe
                        src={unit.mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Mapa da ${unit.name}`}
                    ></iframe>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

// These functions are still needed for Next.js to generate the static pages.
export async function generateStaticParams() {
  return UNITS.map((unit) => ({
    slug: unit.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const unit = UNITS.find((p) => p.slug === params.slug);

  if (!unit) {
    return {
      title: 'Unidade não encontrada',
    };
  }

  return {
    title: `Venda seu Carro no ${unit.name.replace('Unidade ', '')} em até 24h | Carro Venda Rápida`,
    description: `Avaliação grátis na nossa unidade ${unit.name.replace('Unidade ', '')}. Endereço: ${unit.address}. Agende sua visita ou chame no WhatsApp.`,
    openGraph: {
        title: `Venda seu Carro no ${unit.name.replace('Unidade ', '')}`,
        description: `Avaliação grátis na nossa unidade ${unit.name.replace('Unidade ', '')}.`,
        images: [unit.imageUrl],
    },
  };
}
