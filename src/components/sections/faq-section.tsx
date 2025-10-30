import { FAQS } from "@/lib/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "../ui/button";
import Link from "next/link";

export function FaqSection({ maxItems }: { maxItems?: number }) {
  const items = maxItems ? FAQS.slice(0, maxItems) : FAQS;

  return (
    <section id="faq" className="w-full py-16 md:py-24 bg-secondary/30">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Perguntas Frequentes
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Tudo o que você precisa saber sobre a venda do seu carro.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {items.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="bg-background/70 rounded-lg mb-3 shadow-sm px-4">
              <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {maxItems && FAQS.length > maxItems && (
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/faq">Ver todas as perguntas</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}