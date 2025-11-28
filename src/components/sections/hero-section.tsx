"use client";

import { AppointmentForm } from "@/components/forms/appointment-form";
import { UNITS } from "@/lib/data";

export function HeroSection() {
  return (
    <div 
      className="relative w-full min-h-screen flex items-center justify-center -mt-20 pt-20 pb-10"
      style={{ 
        backgroundImage: `url(https://i.postimg.cc/pT3ZYr3k/2020-Honda-Civic-Type-R-001-2160.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-10" />

      <div className="container relative z-20 h-full flex flex-col justify-center items-center max-w-7xl">
        <div className="w-full max-w-md relative group animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-6 relative z-20">
                <AppointmentForm units={UNITS} />
            </div>
        </div>
      </div>
    </div>
  );
}
