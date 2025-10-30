import { FAQS } from "@/lib/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FaqSection({ maxItems }: { maxItems?: number }) {
  const items = maxItems ? FAQS.slice(0, maxItems) : FAQS;

  return (
    <section id="faq" className="w-full py-16 md:py-24 bg-secondary">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-8 duration-1000 ease-in-out">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Perguntas Frequentes
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Tudo o que você precisa saber sobre a venda do seu carro.
          </p>
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-in-out">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {items.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="bg-background rounded-lg shadow-sm px-6 border">
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
