import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

function Hero() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 items-center md:grid-cols-2">
          <div className="flex gap-4 flex-col">
            <div>
              <Badge variant="outline">Estamos ao vivo!</Badge>
            </div>
            <div className="flex gap-4 flex-col">
              <h1 className="text-5xl md:text-7xl max-w-lg tracking-tighter text-left font-regular">
                Este é o começo de algo!
              </h1>
              <p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                Gerenciar uma pequena empresa hoje já é difícil. Evite mais
                complicações abandonando métodos comerciais desatualizados e tediosos. Nosso
                objetivo é otimizar o comércio para PMEs, tornando-o mais fácil e rápido do que
                nunca.
              </p>
            </div>
            <div className="flex flex-row gap-4">
              <Button size="lg" className="gap-4" variant="outline">
                Ligar <PhoneCall className="w-4 h-4" />
              </Button>
              <Button size="lg" className="gap-4">
                Inscreva-se aqui <MoveRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="relative bg-muted rounded-md aspect-square">
              <Image src="https://picsum.photos/seed/1/600/600" alt="placeholder" fill className="object-cover rounded-md" data-ai-hint="abstract texture" />
            </div>
            <div className="relative bg-muted rounded-md row-span-2">
              <Image src="https://picsum.photos/seed/2/600/1200" alt="placeholder" fill className="object-cover rounded-md" data-ai-hint="city architecture" />
            </div>
            <div className="relative bg-muted rounded-md aspect-square">
              <Image src="https://picsum.photos/seed/3/600/600" alt="placeholder" fill className="object-cover rounded-md" data-ai-hint="modern art" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
