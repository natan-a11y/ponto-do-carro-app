"use client";

import Script from 'next/script';
import { useId } from 'react';

type Props = {
  data: Record<string, any>;
};

export default function StructuredData({ data }: Props) {
  const id = useId();
  return (
    <Script
      id={`structured-data-${id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
