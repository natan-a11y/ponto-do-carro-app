import { HOW_IT_WORKS_STEPS } from "@/lib/data";
import Image from "next/image";
import Script from "next/script";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-16 md:py-24 bg-background overflow-x-hidden">
      <div className="grid md:grid-cols-2 gap-12 w-full items-center mb-16">
          <div className="w-full flex justify-center items-center animate-in fade-in slide-in-from-left-8 duration-1000 ease-in-out">
              <Image
              src="https://i.postimg.cc/bJFNLCc0/2020-Honda-Civic-Type-R-011-2160.jpg"
              alt="Carro esportivo moderno em exibição"
              width={600}
              height={400}
              quality={100}
              className="rounded-r-[3rem] object-cover aspect-video w-full h-full"
              />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-in-out pr-4 lg:pr-16">
              <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                      Como Funciona
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                      Vender seu carro nunca foi tão fácil. Siga nossos 3 passos simples.
                  </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 md:gap-8 w-full mt-8">
                  {HOW_IT_WORKS_STEPS.map((step) => (
                      <div key={step.id} className="flex flex-col items-center text-center p-2 md:p-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                              <step.icon className="h-6 w-6" />
                          </div>
                          <h3 className="text-lg font-semibold">{step.title}</h3>
                          <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
                      </div>
                  ))}
              </div>
          </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 w-full items-center">
          <div className="animate-in fade-in slide-in-from-left-8 duration-1000 ease-in-out pl-4 lg:pl-16 order-2 md:order-1">
              <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold tracking-tight sm:text-3xl font-headline">
                      Veja na Prática
                  </h3>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Quer <span className="font-bold text-primary">vender seu carro hoje</span>? O vídeo ao lado demonstra como nosso processo digital e transparente funciona. Acompanhe a <span className="font-bold">vistoria completa de 15 minutos</span>, onde cada detalhe do seu veículo é avaliado para garantir a melhor oferta. Em seguida, seu carro é leiloado em nossa plataforma para mais de 500 lojistas, criando uma disputa justa que valoriza seu patrimônio.
                  </p>
                   <p className="mt-4 text-lg text-muted-foreground">
                    O resultado é uma <span className="font-bold">proposta de compra rápida</span> e o <span className="font-bold">pagamento imediato</span> após a sua aprovação. Chega de negociar com vários compradores e perder tempo com burocracia. Na Ponto do Carro, você tem dinheiro na mão de forma segura e eficiente.
                  </p>
              </div>
          </div>
           <div className="w-full flex justify-center animate-in fade-in slide-in-from-right-8 duration-1000 ease-in-out order-1 md:order-2">
              <div className="relative w-full max-w-sm">
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
