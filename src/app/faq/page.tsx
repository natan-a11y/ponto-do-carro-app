import { FaqSection } from '@/components/sections/faq-section';
import StructuredData from '@/components/site/structured-data';
import { FAQS } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perguntas Frequentes (FAQ) | Ponto do Carro',
  description: 'Tire todas as suas dúvidas sobre como vender seu carro. Informações sobre avaliação, pagamento, documentos e mais.',
};

const faqPageData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
        }
    }))
};

export default function FaqPage() {
  return (
    <>
        <StructuredData data={faqPageData} />
        <div className="pt-10">
          <FaqSection />
        </div>
    </>
  );
}
