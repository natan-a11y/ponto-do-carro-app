"use client";

import { FAQS } from "@/lib/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { Badge } from "../ui/badge";
import { useContactModal } from "../site/contact-modal";

export function FaqSection({ maxItems }: { maxItems?: number }) {
  const { onOpen } = useContactModal();
  const items = maxItems ? FAQS.slice(0, maxItems) : FAQS;

  return (
     <section id="faq" className="w-full py-16 md:py-24 bg-secondary">
       <div className="container mx-auto">
         <div className="grid lg:grid-cols-2 gap-10">
           <div className="flex gap-10 flex-col">
             <div className="flex gap-4 flex-col">
               <div>
                 <Badge variant="outline">FAQ</Badge>
               </div>
               <div className="flex gap-2 flex-col">
                 <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-left font-regular">
                    Perguntas Frequentes
                 </h4>
                 <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
                    Tudo o que você precisa saber sobre a venda do seu carro. Se sua dúvida não estiver aqui, entre em contato.
                 </p>
               </div>
               <div className="">
                 <Button className="gap-4" variant="outline" onClick={onOpen}>
                   Fale conosco <PhoneCall className="w-4 h-4" />
                 </Button>
               </div>
             </div>
           </div>
           <Accordion type="single" collapsible className="w-full">
            {items.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="bg-background rounded-lg mb-3 shadow-sm px-4 border">
                <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
         </div>
          {maxItems && FAQS.length > maxItems && (
          <div className="text-center mt-12 animate-in fade-in duration-1000">
            <Button asChild variant="ghost" className="text-primary hover:text-primary">
              <Link href="/faq">
                Ver todas as perguntas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
       </div>
     </section>
  );
}
