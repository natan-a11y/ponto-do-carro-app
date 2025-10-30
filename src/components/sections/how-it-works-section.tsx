import { HOW_IT_WORKS_STEPS } from "@/lib/data";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-16 md:py-24 bg-background">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000 ease-in-out">
                <Image
                    src="https://i.postimg.cc/bJFNLCc0/2020-Honda-Civic-Type-R-011-2160.jpg"
                    alt="Carro sendo avaliado"
                    width={1080}
                    height={720}
                    className="rounded-lg shadow-2xl"
                    data-ai-hint="car inspection"
                />
            </div>
            <div className="animate-in fade-in slide-in-from-right-8 duration-1000 ease-in-out">
                 <div className="mb-8">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                        Como Funciona
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Vender seu carro nunca foi tão fácil. Siga 3 passos simples.
                    </p>
                </div>
                <div className="space-y-6">
                    {HOW_IT_WORKS_STEPS.map((step) => (
                        <div key={step.id} className="flex gap-6 items-start">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                                <step.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-headline text-xl font-semibold">{step.title}</h3>
                                <p className="text-muted-foreground mt-1">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}