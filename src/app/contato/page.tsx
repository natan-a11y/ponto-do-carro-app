import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getWhatsAppLink, UNITS } from '@/lib/data';
import type { Metadata } from 'next';
import Link from 'next/link';
import { B2BForm } from '@/components/forms/b2b-form';

export const metadata: Metadata = {
  title: 'Contato | Carro Venda Rápida',
  description: 'Fale conosco. Entre em contato com uma de nossas unidades ou, se for um lojista, conheça nosso programa de parceria.',
};

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 32 32" {...props}><path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.546-.827-1.219-.827-1.219l-4.12-1.39c-.372 0-.88.164-.88.642 0 .478.617 1.219.617 1.219s-1.518 4.38 2.139 6.632c3.657 2.25 6.23 2.686 6.23 2.686s.88-.372 1.49-.882c.617-.508.578-1.146.578-1.146s-.545-.99-.882-1.392l-1.963-.4z" fill="currentColor"></path><path d="M26.71 4.542a13.31 13.31 0 0 0-18.862 0A13.31 13.31 0 0 0 4.542 26.71a13.31 13.31 0 0 0 18.862 0 13.31 13.31 0 0 0 3.308-9.432 13.302 13.302 0 0 0-3.308-9.431zm-1.414 17.448a11.33 11.33 0 0 1-16.035 0 11.33 11.33 0 0 1 0-16.035 11.33 11.33 0 0 1 16.035 0 11.33 11.33 0 0 1 0 16.035z" fill="currentColor"></path></svg>
);


export default function ContatoPage() {
  return (
    <div className="w-full py-16 md:py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4">
             <div className="text-center mb-12">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-headline">
                    Fale Conosco
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Tem alguma dúvida ou sugestão? Quer saber mais sobre nosso programa de parceria para lojistas? Preencha o formulário ou entre em contato com uma de nossas unidades.
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Nossas Unidades</CardTitle>
                            <CardDescription>Entre em contato diretamente com a unidade de sua preferência.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {UNITS.map(unit => (
                                <div key={unit.id} className="border-b pb-4 last:border-b-0">
                                    <h3 className="font-semibold">{unit.name}</h3>
                                    <p className="text-muted-foreground text-sm">{unit.address}</p>
                                    <a href={getWhatsAppLink(unit.id, `Olá! Tenho uma dúvida.`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm mt-2 text-green-600 hover:underline">
                                        <WhatsAppIcon className="w-4 h-4" />
                                        <span>Falar no WhatsApp</span>
                                    </a>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                 <Card className="shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-center font-headline text-2xl">Lojistas e Parcerias</CardTitle>
                        <CardDescription className="text-center">Deixe seu contato para nossa equipe comercial.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <B2BForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
