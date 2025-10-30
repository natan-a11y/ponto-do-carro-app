import { B2B_BENEFITS } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/placeholder-images.json";
import Image from "next/image";
import type { Metadata } from 'next';
import { B2BForm } from "@/components/forms/b2b-form";

export const metadata: Metadata = {
  title: 'Para Lojistas | Ponto do Carro',
  description: 'Seja nosso parceiro e tenha acesso a um deal flow qualificado de veículos. Aumente seu estoque sem esforço e com zero Capex.',
};

const b2bImage = placeholderImages.find(p => p.id === 'b2b-image');

export default function ParaLojistasPage() {
  return (
    <div className="w-full py-16 md:py-24 bg-background">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-headline">
                    Mais estoque, menos esforço.
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Seja um lojista parceiro e tenha acesso a oportunidades qualificadas, sem investimento inicial. A Ponto do Carro é sua ponte para um estoque renovado e de qualidade.
                </p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {B2B_BENEFITS.map((benefit) => (
                        <div key={benefit.id} className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <benefit.icon className="h-6 w-6" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-8">
                {b2bImage && (
                    <div className="relative aspect-4/3 w-full rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src={b2bImage.imageUrl}
                            alt="Parceria de negócios"
                            fill
                            className="object-cover"
                            data-ai-hint={b2bImage.imageHint}
                        />
                    </div>
                )}
                <Card className="shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-center font-headline text-2xl">Torne-se um Parceiro</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <B2BForm />
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
