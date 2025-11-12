"use client";

import { AppointmentForm } from "@/components/forms/appointment-form";
import { UNITS } from "@/lib/data";
import { useContactModal } from "@/components/site/contact-modal";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export default function AgendarAvaliacaoPage() {
  const { onOpen } = useContactModal();

  // Since we are using 'use client', we can't export metadata directly.
  // This should be handled in a parent layout or via the file-based metadata API if possible.
  // For this case, we will just have the title in the h1.

  return (
    <div className="w-full py-16 md:py-24 bg-background">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Agendar Avaliação Gratuita
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Complete os 3 passos para agendar sua vistoria de 15 minutos.
            Prefere falar com alguém?{' '}
             <Button variant="link" className="p-0 h-auto text-lg text-primary underline hover:text-primary/80" onClick={onOpen}>
              Chame no WhatsApp
            </Button>.
          </p>
        </div>
        
        <div className="bg-card p-6 sm:p-8 rounded-xl shadow-2xl border">
            <AppointmentForm units={UNITS} />
        </div>
      </div>
    </div>
  );
}
