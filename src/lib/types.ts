export type Unit = {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  openingHours: string[];
  geo: {
    lat: number;
    lng: number;
  };
  mapUrl: string;
  imageUrl: string;
  imageHint: string;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type Review = {
  id: string;
  author: string;
  text: string;
  avatarUrl: string;
  avatarHint: string;
};

export type HowItWorksStep = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
};

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type B2BBenefit = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
};
