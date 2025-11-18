
import { UNITS } from '@/lib/data';
import { notFound } from 'next/navigation';
import StructuredData from '@/components/site/structured-data';
import UnitPageClient from './unit-page-client';

type Props = {
  params: { slug: string };
};

export default function UnitPage({ params }: Props) {
  const unit = UNITS.find((p) => p.slug === params.slug);

  if (!unit) {
    notFound();
  }

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": `Ponto do Carro - ${unit.name}`,
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
      <UnitPageClient unit={unit} />
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
    title: `Venda seu Carro no ${unit.name.replace('Unidade ', '')} em até 24h | Ponto do Carro`,
    description: `Avaliação grátis na nossa unidade ${unit.name.replace('Unidade ', '')}. Endereço: ${unit.address}. Agende sua visita ou chame no WhatsApp.`,
    openGraph: {
        title: `Venda seu Carro no ${unit.name.replace('Unidade ', '')}`,
        description: `Avaliação grátis na nossa unidade ${unit.name.replace('Unidade ', '')}.`,
        images: [unit.imageUrl],
    },
  };
}
