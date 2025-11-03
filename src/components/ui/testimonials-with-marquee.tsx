import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ 
   title,
  description,
  testimonials,
  className
}: TestimonialsSectionProps) {
  return (
    <section className={cn(
      "bg-secondary text-foreground",
      "py-16 md:py-24 px-0",
      className
    )}>
      <div className="mx-auto flex max-w-container flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-4 px-4">
          <h2 className="max-w-[720px] text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {title}
          </h2>
          <p className="text-lg max-w-[600px] text-muted-foreground">
            {description}
          </p>
        </div>
        
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-4 [--gap:1rem] [gap:var(--gap)] flex-row [--duration:60s]">
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
              {[...testimonials, ...testimonials].map((testimonial, i) => (
                <TestimonialCard 
                   key={i}
                   {...testimonial}
                />
              ))}
            </div>
            {/* This is the duplicated content for seamless looping */}
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]" aria-hidden="true">
              {[...testimonials, ...testimonials].map((testimonial, i) => (
                <TestimonialCard 
                   key={i}
                   {...testimonial}
                />
              ))}
            </div>
          </div>
          
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/4 bg-gradient-to-r from-secondary sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/4 bg-gradient-to-l from-secondary sm:block" />
        </div>
      </div>
    </section>
  )
}
