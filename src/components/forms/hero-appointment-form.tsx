"use client";

import React, { useState, useEffect, useRef, useId } from 'react';
import { useRouter } from 'next/navigation';

import { useFipeBrands, useFipeModels, useFipeYears } from '@/hooks/use-fipe';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Car, Tag, Search, X, Loader2, Calendar } from 'lucide-react';

type FipeItem = { nome: string; codigo: string };

const Dropdown = ({ items = [], onSelect, title, searchable, onClose, loading, error, parentId }: { items: FipeItem[], onSelect: (item: FipeItem) => void, title: string, searchable?: boolean, onClose: () => void, loading: boolean, error: string | null, parentId: string }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchable) {
      inputRef.current?.focus();
    }
  }, [searchable]);

  const filteredItems = items.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        const parentEl = document.getElementById(parentId);
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && parentEl && !parentEl.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, parentId]);


  return (
    <div ref={dropdownRef} className="absolute bottom-full mb-2 left-0 w-full max-h-60 bg-white rounded-lg shadow-2xl border border-gray-100 p-3 z-50 flex flex-col animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <button onClick={onClose} type="button" className="p-1 hover:bg-gray-100 rounded-full text-gray-400"><X size={16} /></button>
      </div>
      
      {searchable && (
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide pr-1">
        {loading ? (
            <div className="flex justify-center items-center h-20 text-gray-500 text-sm"><Loader2 className="animate-spin mr-2" /> Carregando...</div>
        ) : error ? (
            <div className="text-center py-4 text-red-500 text-sm">{error}</div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.codigo} className="p-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm text-gray-700" onClick={() => onSelect(item)}>
              {item.nome}
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">Nenhum resultado.</div>
        )}
      </div>
    </div>
  );
};


export function HeroAppointmentForm() {
    const router = useRouter();
    const vehicleType = 'carros';
    const [selectedBrand, setSelectedBrand] = useState<FipeItem | null>(null);
    const [selectedModel, setSelectedModel] = useState<FipeItem | null>(null);
    const [selectedYear, setSelectedYear] = useState<FipeItem | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const brandId = useId();
    const modelId = useId();
    const yearId = useId();

    const { data: brands, loading: brandsLoading, error: brandsError } = useFipeBrands(vehicleType);
    const { data: models, loading: modelsLoading, error: modelsError } = useFipeModels(vehicleType, selectedBrand?.codigo);
    const { data: years, loading: yearsLoading, error: yearsError } = useFipeYears(vehicleType, selectedBrand?.codigo, selectedModel?.codigo);

    useEffect(() => {
        setSelectedModel(null);
        setSelectedYear(null);
    }, [selectedBrand]);

    useEffect(() => {
        setSelectedYear(null);
    }, [selectedModel]);

    const handleSelect = (setter: React.Dispatch<React.SetStateAction<FipeItem | null>>, nextDropdown: string | null) => (item: FipeItem) => {
        setter(item);
        setActiveDropdown(nextDropdown);
    };

    const toggleDropdown = (dropdownName: string) => {
        if (dropdownName === 'model' && !selectedBrand) return;
        if (dropdownName === 'year' && !selectedModel) return;
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBrand || !selectedModel || !selectedYear) {
            // Optional: add some user feedback
            return;
        }
        const params = new URLSearchParams({
            brandCode: selectedBrand.codigo,
            brandName: selectedBrand.nome,
            modelCode: selectedModel.codigo,
            modelName: selectedModel.nome,
            yearCode: selectedYear.codigo,
            yearName: selectedYear.nome,
        });
        router.push(`/agendar-avaliacao?${params.toString()}`);
    };

    const getSelectionLabel = (item: FipeItem | null, defaultLabel: string, loading: boolean) => {
        if (loading) return "Carregando...";
        return item?.nome || defaultLabel;
    }

    return (
        <div className="p-4 bg-black/50 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="relative" id={brandId}>
                    <button type="button" onClick={() => toggleDropdown('brand')} className="w-full h-12 flex items-center justify-between px-4 bg-white/90 text-gray-800 rounded-lg text-left">
                        <span className="truncate">{getSelectionLabel(selectedBrand, "Marca", brandsLoading)}</span>
                        <Tag className="h-5 w-5 text-gray-500" />
                    </button>
                    {activeDropdown === 'brand' && (
                        <Dropdown 
                            items={brands} 
                            onSelect={handleSelect(setSelectedBrand, 'model')} 
                            title="Selecione a Marca"
                            searchable
                            onClose={() => setActiveDropdown(null)}
                            loading={brandsLoading}
                            error={brandsError}
                            parentId={brandId}
                        />
                    )}
                </div>
                <div className="relative" id={modelId}>
                    <button type="button" onClick={() => toggleDropdown('model')} disabled={!selectedBrand} className="w-full h-12 flex items-center justify-between px-4 bg-white/90 text-gray-800 rounded-lg text-left disabled:opacity-50">
                        <span className="truncate">{getSelectionLabel(selectedModel, "Modelo", modelsLoading)}</span>
                        <Car className="h-5 w-5 text-gray-500" />
                    </button>
                    {activeDropdown === 'model' && (
                        <Dropdown 
                            items={models} 
                            onSelect={handleSelect(setSelectedModel, 'year')} 
                            title="Selecione o Modelo"
                            searchable
                            onClose={() => setActiveDropdown(null)}
                            loading={modelsLoading}
                            error={modelsError}
                            parentId={modelId}
                        />
                    )}
                </div>
                <div className="relative" id={yearId}>
                    <button type="button" onClick={() => toggleDropdown('year')} disabled={!selectedModel} className="w-full h-12 flex items-center justify-between px-4 bg-white/90 text-gray-800 rounded-lg text-left disabled:opacity-50">
                        <span className="truncate">{getSelectionLabel(selectedYear, "Ano", yearsLoading)}</span>
                         <Calendar className="h-5 w-5 text-gray-500" />
                    </button>
                    {activeDropdown === 'year' && (
                        <Dropdown 
                            items={years} 
                            onSelect={handleSelect(setSelectedYear, null)} 
                            title="Selecione o Ano"
                            onClose={() => setActiveDropdown(null)}
                            loading={yearsLoading}
                            error={yearsError}
                            parentId={yearId}
                        />
                    )}
                </div>
                <Button type="submit" size="lg" variant="accent" className="h-12 w-full" disabled={!selectedYear}>
                    Agendar Avaliação
                </Button>
            </form>
        </div>
    );
}
