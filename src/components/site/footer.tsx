import Link from "next/link";
import { Logo } from "./logo";
import { NAV_ITEMS, UNITS } from "@/lib/data";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 32 32" {...props}><path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.546-.827-1.219-.827-1.219l-4.12-1.39c-.372 0-.88.164-.88.642 0 .478.617 1.219.617 1.219s-1.518 4.38 2.139 6.632c3.657 2.25 6.23 2.686 6.23 2.686s.88-.372 1.49-.882c.617-.508.578-1.146.578-1.146s-.545-.99-.882-1.392l-1.963-.4z" fill="currentColor"></path><path d="M26.71 4.542a13.31 13.31 0 0 0-18.862 0A13.31 13.31 0 0 0 4.542 26.71a13.31 13.31 0 0 0 18.862 0 13.31 13.31 0 0 0 3.308-9.432 13.302 13.302 0 0 0-3.308-9.431zm-1.414 17.448a11.33 11.33 0 0 1-16.035 0 11.33 11.33 0 0 1 0-16.035 11.33 11.33 0 0 1 16.035 0 11.33 11.33 0 0 1 0 16.035z" fill="currentColor"></path></svg>
);


export default function SiteFooter() {
  return (
    <footer className="border-t border-border/40 mt-16 pt-12 pb-8">
      <div className="container max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4 md:col-span-1">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Venda seu carro em até 24h úteis. Avaliação gratuita e pagamento à vista.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-8">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Navegação</h4>
              <ul className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Unidades</h4>
              <ul className="space-y-2">
                {UNITS.map((unit) => (
                  <li key={unit.id}>
                    <Link href={`/unidades/${unit.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {unit.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Contato</h4>
              <ul className="space-y-2">
                {UNITS.map((unit) => (
                  <li key={unit.id}>
                    <a href={`https://wa.me/${unit.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <WhatsAppIcon className="w-4 h-4 text-green-500"/>
                      {unit.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Carro Venda Rápida. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}