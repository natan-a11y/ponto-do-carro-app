"use client";

import { REVIEWS } from "@/lib/data";
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";

export function SocialProofSection() {
  const testimonials = REVIEWS.map(review => ({
    author: {
      name: review.author,
      handle: `@${review.author.toLowerCase().replace(/\s/g, '')}`,
      avatar: review.avatarUrl,
    },
    text: review.text,
  }));
  
  return (
    <TestimonialsSection
      title="O que nossos clientes dizem"
      description="Confiança e agilidade comprovadas por quem já vendeu com a gente."
      testimonials={testimonials}
      className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-in-out"
    />
  );
}
