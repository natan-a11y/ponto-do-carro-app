import Link from "next/link";
import { Car } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <Car className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold font-headline text-primary">
        Carro Venda Rápida
      </span>
    </Link>
  );
}
