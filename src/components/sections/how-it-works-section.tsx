import { HOW_IT_WORKS_STEPS } from "@/lib/data";
import Image from "next/image";
import Script from "next/script";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-16 md:py-24 bg-background">
      <div className="container max-w-4xl mx-auto px-4 flex flex-col items-center gap-12">
        <div className="w-full flex justify-center items-center animate-in fade-in slide-in-from-left-8 duration-1000 ease-in-out">
          <Image
            src="https://i.postimg.cc/bJFNLCc0/2020-Honda-Civic-Type-R-011-2160.jpg"
            alt="Carro esportivo moderno em exibição"
            width={600}
            height={400}
            className="rounded-[3rem] object-cover aspect-video"
          />
        </div>

        <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-in-out">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                Venda seu Carro de Forma Rápida, Justa e Digital
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Na Ponto do Carro, transformamos a complexa tarefa de vender seu veículo em uma experiência ágil e surpreendentemente simples. Nosso processo foi desenhado para maximizar seu tempo e seu retorno financeiro, garantindo a melhor oferta do mercado em até 24h com pagamento à vista.
            </p>
        </div>

        <div className="w-full max-w-xs flex justify-center animate-in fade-in slide-in-from-right-8 duration-1000 ease-in-out">
            <div className="relative w-full">
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
