import { HOW_IT_WORKS_STEPS } from "@/lib/data";
import Image from "next/image";
import Script from "next/script";

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
                    className="rounded-full shadow-2xl"
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
        <div className="mt-16 md:mt-24 flex justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-in-out">
            <div className="relative w-full max-w-xs">
                <div style={{padding:'177.78% 0 0 0',position:'relative'}}>
                    <iframe 
                        src="https://player.vimeo.com/video/1132253360?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1" 
                        frameBorder="0" 
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
                        style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}} 
                        title="PDC-VIDEO-02-JANEIRO"
                        className="rounded-[3rem] shadow-2xl border"
                        >
                    </iframe>
                </div>
                <Script src="https://player.vimeo.com/api/player.js"></Script>
            </div>
        </div>
      </div>
    </section>
  );
}
