import placeholderImages from "@/lib/placeholder-images.json";
import Image from "next/image";
import type { Metadata } from 'next';
import { BadgeCheck } from "lucide-react";

export const metadata: Metadata = {
  title: 'Sobre Nós | Ponto do Carro',
  description: 'Conheça a história e a missão da Ponto do Carro: revolucionar a venda de carros usados em Belo Horizonte com tecnologia, transparência e eficiência.',
};

const aboutImage = placeholderImages.placeholderImages.find(p => p.id === 'about-us');

const values = [
    { title: 'Transparência', description: 'Todo o processo, da avaliação à proposta, é claro e sem letras miúdas.' },
    { title: 'Agilidade', description: 'Respeitamos o seu tempo. Venda seu carro sem burocracia e com pagamento rápido.' },
    { title: 'Justiça', description: 'Com mais de 500 lojistas competindo, garantimos uma proposta justa pelo seu veículo.' }
];

export default function SobreNosPage() {
  return (
    <div className="w-full py-16 md:py-24 bg-background">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-headline">
                Revolucionando a venda de carros usados
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                Nascemos da inconformidade com o processo lento, burocrático e muitas vezes injusto de vender um carro. Nossa missão é simples: usar tecnologia para conectar você à melhor oferta do mercado, de forma rápida, segura e transparente.
            </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
                <h2 className="text-2xl font-bold font-headline mb-6">Nossos Valores</h2>
                <ul className="space-y-6">
                    {values.map(v => (
                        <li key={v.title} className="flex gap-4">
                             <BadgeCheck className="h-8 w-8 text-primary shrink-0 mt-1" />
                             <div>
                                <h3 className="font-semibold text-lg">{v.title}</h3>
                                <p className="text-muted-foreground">{v.description}</p>
                             </div>
                        </li>
                    ))}
                </ul>
            </div>
             {aboutImage && (
                <div className="relative aspect-4/3 w-full rounded-lg overflow-hidden shadow-lg order-1 lg:order-2">
                    <Image
                        src={aboutImage.imageUrl}
                        alt="Equipe Ponto do Carro"
                        fill
                        className="object-cover"
                        data-ai-hint={aboutImage.imageHint}
                    />
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
