
import { AppointmentForm } from "@/components/forms/appointment-form";
import { UNITS } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agendar Avaliação - Venda seu Carro em 24h",
  description: "Agende uma avaliação gratuita para seu carro em uma de nossas unidades. O processo é rápido, justo e o pagamento é à vista.",
};

export default function AgendarAvaliacaoPage() {
  return (
    <div className="w-full bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-headline">Agende sua Avaliação Gratuita</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Preencha os dados abaixo para marcar sua vistoria de 15 minutos. É rápido, fácil e sem compromisso.</p>
        </div>
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-200">
          <AppointmentForm units={UNITS} />
        </div>
      </div>
    </div>
  );
}
