"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NAV_ITEMS, getWhatsAppLink } from "@/lib/data";
import { Logo } from "./logo";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Set initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled 
        ? "border-b border-border/40 bg-background/80 backdrop-blur-lg" 
        : "border-b border-transparent"
    )}>
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Logo />
        <nav className="hidden md:flex md:items-center md:gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-foreground/60"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
           <Button variant="outline" asChild className="rounded-full">
            <Link href={getWhatsAppLink(undefined, 'Olá! Gostaria de agendar uma avaliação.')}>Falar no WhatsApp</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/agendar-avaliacao">Agendar Avaliação</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col h-full">
              <div className="mb-8">
                <Logo />
              </div>
              <nav className="flex flex-col gap-6">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === item.href ? "text-primary" : "text-foreground/80"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-4">
                <Button variant="outline" asChild className="rounded-full">
                  <Link href={getWhatsAppLink(undefined, 'Olá! Gostaria de agendar uma avaliação.')}>Falar no WhatsApp</Link>
                </Button>
                <Button asChild className="rounded-full">
                  <Link href="/agendar-avaliacao">Agendar Avaliação</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
