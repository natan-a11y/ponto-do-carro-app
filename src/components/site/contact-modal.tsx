"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UNITS, getWhatsAppLink } from '@/lib/data';
import { Button } from '../ui/button';
import { MapPin } from 'lucide-react';
import { Card } from '../ui/card';

type ContactModalContextType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export const useContactModal = () => {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error('useContactModal must be used within a ContactModalProvider');
  }
  return context;
};

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 32 32" {...props}><path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.546-.827-1.219-.827-1.219l-4.12-1.39c-.372 0-.88.164-.88.642 0 .478.617 1.219.617 1.219s-1.518 4.38 2.139 6.632c3.657 2.25 6.23 2.686 6.23 2.686s.88-.372 1.49-.882c.617-.508.578-1.146.578-1.146s-.545-.99-.882-1.392l-1.963-.4z" fill="currentColor"></path><path d="M26.71 4.542a13.31 13.31 0 0 0-18.862 0A13.31 13.31 0 0 0 4.542 26.71a13.31 13.31 0 0 0 18.862 0 13.31 13.31 0 0 0 3.308-9.432 13.302 13.302 0 0 0-3.308-9.431zm-1.414 17.448a11.33 11.33 0 0 1-16.035 0 11.33 11.33 0 0 1 0-16.035 11.33 11.33 0 0 1 16.035 0 11.33 11.33 0 0 1 0 16.035z" fill="currentColor"></path></svg>
);

export const ContactModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <ContactModalContext.Provider value={{ isOpen, onOpen, onClose }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-center">Fale com um especialista</DialogTitle>
            <DialogDescription className="text-center">
              Selecione a unidade com a qual você deseja falar para agendar sua avaliação.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {UNITS.map((unit) => (
              <a 
                href={getWhatsAppLink(unit.id, `Olá! Quero avaliar meu carro na unidade ${unit.name.replace('Unidade ', '')}.`)}
                target="_blank"
                rel="noopener noreferrer"
                key={unit.id}
                onClick={onClose}
              >
                <Card className="p-4 hover:bg-secondary transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">{unit.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <MapPin className="h-4 w-4"/>
                                <span>{unit.address.split(',')[0]}</span>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600">
                             <WhatsAppIcon className="w-7 h-7" />
                        </Button>
                    </div>
                </Card>
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </ContactModalContext.Provider>
  );
};
