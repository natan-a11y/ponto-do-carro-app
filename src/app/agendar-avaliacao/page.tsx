import { AppointmentForm } from "@/components/forms/appointment-form";
import { UNITS, getWhatsAppLink } from "@/lib/data";
import type { Metadata } from "next";
import Link from "next/link";
import { AppointmentFormProvider } from "@/components/forms/appointment-form-context";

export const metadata: Metadata = {
  title: "Agendar Avaliação | Carro Venda Rápida",
  description: "Agende sua avaliação gratuita em 3 passos simples. Preencha os dados do seu veículo e escolha o melhor dia e horário.",
};

export default function AgendarAvaliacaoPage() {
  return (
    <div className="w-full py-16 md:py-24 bg-background">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Agendar Avaliação Gratuita
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Complete os 3 passos para agendar sua vistoria de 15 minutos.
            Prefere falar com alguém? <Link href={getWhatsAppLink()} className="text-primary underline hover:text-primary/80">Chame no WhatsApp</Link>.
          </p>
        </div>
        
        <div className="bg-card p-6 sm:p-8 rounded-xl shadow-2xl border">
            <AppointmentFormProvider>
              <AppointmentForm units={UNITS} />
            </AppointmentFormProvider>
        </div>
      </div>
    </div>
  );
}
