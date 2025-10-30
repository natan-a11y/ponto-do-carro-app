import { HOW_IT_WORKS_STEPS } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-16 md:py-24 bg-background">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-8 duration-1000 ease-in-out">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Como Funciona
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Vender seu carro nunca foi tão fácil. Siga 3 passos simples.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div key={step.id} className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-in-out" style={{animationDelay: `${index * 150}ms`}}>
              <Card className="text-center border-2 border-transparent hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline text-2xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
