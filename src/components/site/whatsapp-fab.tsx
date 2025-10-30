
"use client";

import { Button } from "@/components/ui/button";
import { getWhatsAppLink } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 32 32" {...props}><path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.546-.827-1.219-.827-1.219l-4.12-1.39c-.372 0-.88.164-.88.642 0 .478.617 1.219.617 1.219s-1.518 4.38 2.139 6.632c3.657 2.25 6.23 2.686 6.23 2.686s.88-.372 1.49-.882c.617-.508.578-1.146.578-1.146s-.545-.99-.882-1.392l-1.963-.4z" fill="currentColor"></path><path d="M26.71 4.542a13.31 13.31 0 0 0-18.862 0A13.31 13.31 0 0 0 4.542 26.71a13.31 13.31 0 0 0 18.862 0 13.31 13.31 0 0 0 3.308-9.432 13.302 13.302 0 0 0-3.308-9.431zm-1.414 17.448a11.33 11.33 0 0 1-16.035 0 11.33 11.33 0 0 1 0-16.035 11.33 11.33 0 0 1 16.035 0 11.33 11.33 0 0 1 0 16.035z" fill="currentColor"></path></svg>
);


export default function WhatsAppFab() {
    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Button asChild size="icon" className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 text-white shadow-lg">
                <a href={getWhatsAppLink(undefined, 'Olá! Gostaria de mais informações.')} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="w-8 h-8" />
                    <span className="sr-only">Falar no WhatsApp</span>
                </a>
            </Button>
        </div>
    );
}
