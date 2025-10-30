import type { Unit, FAQItem, Review, HowItWorksStep, NavItem, B2BBenefit } from './types';
import { Calendar, Car, Handshake, Search, BadgeCheck, Users, Zap } from 'lucide-react';
import { placeholderImages } from './placeholder-images.json';

const getPlaceholderImage = (id: string) => {
  const img = placeholderImages.find(p => p.id === id);
  if (!img) {
    return { url: 'https://placehold.co/600x400', hint: 'placeholder' };
  }
  return { url: img.imageUrl, hint: img.imageHint };
};

export const UNITS: Unit[] = [
  {
    id: 'buritis',
    slug: 'buritis',
    name: 'Unidade Buritis',
    address: 'Rua Senador Lima Guimarães, 132 - BH/MG',
    phone: '+5531999991111',
    whatsappNumber: '5531999991111',
    openingHours: ['Segunda a Sexta: 08:00 - 18:00', 'Sábado: 08:00 - 12:00'],
    geo: { lat: -19.9701, lng: -43.9619 },
    mapUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3750.051933560662!2d-43.96447488898953!3d-19.955745976502283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa6983756885555%3A0x867c295784345207!2sR.%20Sen.%20Lima%20Guimar%C3%A3es%2C%20132%20-%20Buritis%2C%20Belo%20Horizonte%20-%20MG%2C%2030575-580!5e0!3m2!1sen!2sbr!4v1678886543210!5m2!1sen!2sbr`,
    imageUrl: getPlaceholderImage('unit-buritis').url,
    imageHint: getPlaceholderImage('unit-buritis').hint,
  },
  {
    id: 'caicara',
    slug: 'caicara',
    name: 'Unidade Caiçara',
    address: 'Rua Francisco Bicalho, 1450 - BH/MG',
    phone: '+5531999992222',
    whatsappNumber: '5531999992222',
    openingHours: ['Segunda a Sexta: 09:00 - 19:00', 'Sábado: 09:00 - 13:00'],
    geo: { lat: -19.9023, lng: -43.9686 },
    mapUrl: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3751.498877561805!2d-43.97118998899066!3d-19.89290097654714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa69131604a434d%3A0x6a057f59793c2005!2sR.%20Francisco%20Bicalho%2C%201450%20-%20Cai%C3%A7aras%2C%20Belo%20Horizonte%20-%20MG%2C%2030720-340!5e0!3m2!1sen!2sbr!4v1678886543211!5m2_sen!2sbr`,
    imageUrl: getPlaceholderImage('unit-caicara').url,
    imageHint: getPlaceholderImage('unit-caicara').hint,
  },
];

export const FAQS: FAQItem[] = [
  { id: '1', question: 'Como funciona a venda em até 24h?', answer: 'Após a vistoria de 15 minutos, seu carro é ofertado para nossa rede de +500 lojistas. A melhor proposta é apresentada a você em até 24h. Aceitando, o pagamento é feito à vista via PIX ou TED.' },
  { id: '2', question: 'Preciso pagar algo pela avaliação?', answer: 'Não. A avaliação e a vistoria são totalmente gratuitas e sem compromisso.' },
  { id: '3', question: 'Quais documentos são necessários?', answer: 'Para a avaliação, apenas o documento do veículo (CRLV). Para a venda, você precisará do seu documento de identidade (CNH ou RG) e o CRV (recibo de compra e venda).' },
  { id: '4', question: 'Meu carro tem dívidas. Posso vender?', answer: 'Sim. O valor das dívidas (IPVA, multas) pode ser abatido da proposta final, e nós cuidamos da quitação.' },
  { id: '5', question: 'Onde ficam as unidades?', answer: `Atualmente, temos unidades nos bairros Buritis e Caiçara, em Belo Horizonte. Você pode agendar uma avaliação na mais próxima de você.`},
];

const originalReviews: Review[] = [
  { id: '1', author: 'Mariana P.', text: 'Processo super rápido e transparente. Vendi meu carro em menos de 24h e o dinheiro caiu na conta no mesmo dia. Recomendo!', avatarUrl: getPlaceholderImage('review-1').url, avatarHint: getPlaceholderImage('review-1').hint },
  { id: '2', author: 'Carlos F.', text: 'Fui muito bem atendido na unidade Buritis. A avaliação foi realmente rápida e a proposta foi justa. Melhor que vender pra particular.', avatarUrl: getPlaceholderImage('review-2').url, avatarHint: getPlaceholderImage('review-2').hint },
  { id: '3', author: 'Juliana S.', text: 'Tinha receio, mas a experiência foi ótima. Sem burocracia e com segurança. Equipe profissional.', avatarUrl: getPlaceholderImage('review-3').url, avatarHint: getPlaceholderImage('review-3').hint },
  { id: '4', author: 'Rafael L.', text: 'Consegui um valor melhor do que em outras concessionárias. O fato de vários lojistas disputarem o carro faz diferença.', avatarUrl: getPlaceholderImage('review-4').url, avatarHint: getPlaceholderImage('review-4').hint },
  { id: '5', author: 'Beatriz M.', text: 'Praticidade total. Agendei online, fui atendida no horário e resolvi a venda do meu carro sem dor de cabeça.', avatarUrl: getPlaceholderImage('review-5').url, avatarHint: getPlaceholderImage('review-5').hint },
];

export const REVIEWS: Review[] = [...originalReviews, ...originalReviews];


export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
    { id: '1', title: '1. Agende grátis', description: 'Escolha a unidade mais próxima e agende online ou pelo WhatsApp.', icon: Calendar },
    { id: '2', title: '2. Vistoria em 15 min', description: 'Nossa equipe faz uma inspeção completa e transparente do seu veículo.', icon: Search },
    { id: '3', title: '3. Proposta e Pagamento', description: 'Receba a melhor oferta em até 24h. Pagamento à vista via PIX/TED.', icon: Handshake },
];

export const NAV_ITEMS: NavItem[] = [
    { title: 'Como Funciona', href: '/como-funciona' },
    { title: 'Unidades', href: '/unidades' },
    { title: 'Avaliações', href: '/avaliacoes' },
    { title: 'Para Lojistas', href: '/para-lojistas' },
    { title: 'FAQ', href: '/faq' },
];

export const B2B_BENEFITS: B2BBenefit[] = [
  { id: '1', title: 'Deal Flow Qualificado', description: 'Receba oportunidades de compra de veículos já inspecionados e com documentação verificada.', icon: BadgeCheck },
  { id: '2', title: 'Zero Capex', description: 'Aumente seu estoque sem investimento em estrutura física, marketing ou equipe de captação.', icon: Car },
  { id: '3', title: 'Agilidade e Volume', description: 'Tenha acesso a um fluxo constante de carros, permitindo focar no que você faz de melhor: vender.', icon: Zap },
  { id: '4', title: 'Parceria Estratégica', description: 'Faça parte de uma rede selecionada e fortaleça seu negócio com um parceiro confiável.', icon: Users }
];

export const WHATSAPP_BASE_URL = 'https://wa.me/';

export const getWhatsAppLink = (unitId?: string, message: string = 'Olá! Gostaria de mais informações sobre como vender meu carro.') => {
  const unit = UNITS.find(u => u.id === unitId);
  const phone = unit ? unit.whatsappNumber : UNITS[0].whatsappNumber; // Fallback to a default number
  const encodedMessage = encodeURIComponent(message);
  return `${WHATSAPP_BASE_URL}${phone}?text=${encodedMessage}`;
};

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];
