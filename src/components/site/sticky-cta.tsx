import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getWhatsAppLink } from "@/lib/data";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 32 32" {...props}><path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.546-.827-1.219-.827-1.219l-4.12-1.39c-.372 0-.88.164-.88.642 0 .478.617 1.219.617 1.219s-1.518 4.38 2.139 6.632c3.657 2.25 6.23 2.686 6.23 2.686s.88-.372 1.49-.882c.617-.508.578-1.146.578-1.146s-.545-.99-.882-1.392l-1.963-.4z" fill="currentColor"></path><path d="M26.71 4.542a13.31 13.31 0 0 0-18.862 0A13.31 13.31 0 0 0 4.542 26.71a13.31 13.31 0 0 0 18.862 0 13.31 13.31 0 0 0 3.308-9.432 13.302 13.302 0 0 0-3.308-9.431zm-1.414 17.448a11.33 11.33 0 0 1-16.035 0 11.33 11.33 0 0 1 0-16.035 11.33 11.33 0 0 1 16.035 0 11.33 11.33 0 0 1 0 16.035z" fill="currentColor"></path></svg>
);


export default function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background/80 backdrop-blur-sm p-3 border-t z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center gap-3">
          <Button variant="outline" className="w-full bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600" asChild>
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <WhatsAppIcon className="w-5 h-5"/>
              WhatsApp
            </a>
          </Button>
          <Button className="w-full" asChild>
            <Link href="/agendar-avaliacao">Agendar</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
