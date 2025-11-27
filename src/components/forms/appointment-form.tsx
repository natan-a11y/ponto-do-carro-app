"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormState } from "react-dom";
import { useIMask } from "react-imask";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { scheduleAppointment } from "@/app/actions";
import { type Unit, TIME_SLOTS } from "@/lib/data";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Car, Bike, Truck, Tag, Search, X, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- Tipos e Schemas ---

type FipeItem = { nome: string; codigo: string };

const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  phone: z.string().min(15, "Telefone inválido"),
  unit: z.string().min(1, "Unidade é obrigatória"),
  preferredDate: z.date({ required_error: "Data é obrigatória" }),
  preferredTime: z.string().min(1, "Horário é obrigatório"),
  lgpdConsent: z.literal(true, {
    errorMap: () => ({ message: "Você deve aceitar os termos." }),
  }),
});

type FormData = z.infer<typeof formSchema>;

const FIPE_BASE_URL = 'https://parallelum.com.br/fipe/api/v1';

// --- Subcomponentes Reutilizáveis ---

const PhoneInput = React.forwardRef<HTMLInputElement, { field: any }>(({ field }, ref) => {
    const { ref: iMaskRef, setValue } = useIMask({ 
      mask: '(00) 00000-0000',
      onAccept: (value: any) => field.onChange(value)
    });

    useEffect(() => {
        if (field.value) {
            setValue(field.value);
        }
    }, [field.value, setValue]);

    return <Input {...field} ref={iMaskRef} defaultValue={field.value} />;
});
PhoneInput.displayName = 'PhoneInput';

const VehicleTypeIcon = ({ active, onClick, icon }: { active: boolean, onClick: ()=>void, icon: React.ReactNode }) => (
  <button 
    type="button"
    onClick={onClick}
    className={cn(`p-2 rounded-md transition-all duration-200`,
      active ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'
    )}
  >
    {icon}
  </button>
);

const SelectionFieldBlock = ({ label, value, placeholder, isOpen, onClick, disabled, icon }: { label:string, value?:string, placeholder:string, isOpen:boolean, onClick:()=>void, disabled?:boolean, icon:React.ReactNode }) => (
  <div 
    className={cn(`w-full flex items-center justify-between px-4 h-14 rounded-xl border transition-all relative`,
      disabled ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed' : 'bg-white border-gray-200 cursor-pointer hover:border-gray-300 hover:shadow-sm',
      isOpen ? 'ring-2 ring-primary/10 border-primary' : ''
    )}
    onClick={!disabled ? onClick : undefined}
  >
    <div className="flex items-center gap-3 overflow-hidden">
      <div className={cn(`text-gray-400`, value && 'text-primary')}>{icon}</div>
      <div className="flex flex-col items-start overflow-hidden">
         {value && <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider leading-none mb-0.5">{label}</span>}
         <span className={cn(`text-sm truncate max-w-[200px]`, value ? 'font-medium text-foreground' : 'text-muted-foreground')}>
            {value || placeholder}
         </span>
      </div>
    </div>
    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
  </div>
);

const DropdownList = ({ items = [], onSelect, title, searchable, onClose, loading }: { items: FipeItem[], onSelect: (item:FipeItem)=>void, title:string, searchable?:boolean, onClose:()=>void, loading: boolean }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchable && inputRef.current) inputRef.current.focus();
  }, [searchable]);

  const filteredItems = (items || []).filter(item => 
    (item?.nome || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute top-[80px] left-0 w-full max-h-[320px] bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-50 flex flex-col animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400"><X size={16} /></button>
      </div>
      
      {searchable && (
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
        {loading ? (
          <div className="flex justify-center items-center h-full text-muted-foreground text-sm"> <Loader2 className="animate-spin mr-2"/> Carregando...</div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item?.codigo || Math.random()} className="p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer text-sm text-gray-600 flex justify-between items-center group" onClick={() => onSelect(item)}>
              <span>{item?.nome || 'Item'}</span>
              <span className="opacity-0 group-hover:opacity-100 text-xs text-gray-400">Selecionar</span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400 text-sm">Nenhum resultado.</div>
        )}
      </div>
    </div>
  );
};


// --- Componente Principal do Formulário ---

export function AppointmentForm({ units }: { units: Unit[] }) {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [serverState, formAction] = useFormState(scheduleAppointment, { message: null });

  // Estados de seleção FIPE
  const [vehicleType, setVehicleType] = useState<string>('carros');
  const [selectedBrand, setSelectedBrand] = useState<FipeItem | null>(null);
  const [selectedModel, setSelectedModel] = useState<FipeItem | null>(null);
  const [selectedYear, setSelectedYear] = useState<FipeItem | null>(null);

  // Estados de dados da API
  const [brands, setBrands] = useState<FipeItem[]>([]);
  const [models, setModels] = useState<FipeItem[]>([]);
  const [years, setYears] = useState<FipeItem[]>([]);
  const [fipeLoading, setFipeLoading] = useState(false);
  const [fipeError, setFipeError] = useState<string | null>(null);
  
  // Estados de UI da FIPE
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { register, control, trigger, getValues, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
  });
  
  const unitValue = watch("unit");

  // 1. Buscar Marcas
  useEffect(() => {
    const fetchBrands = async () => {
        setFipeLoading(true);
        setFipeError(null);
        try {
            const response = await fetch(`${FIPE_BASE_URL}/${vehicleType}/marcas`);
            const data = await response.json();
            setBrands(Array.isArray(data) ? data : []);
        } catch (err) {
            setBrands([]);
            setFipeError("Erro ao carregar marcas.");
        } finally {
            setFipeLoading(false);
        }
    };
    fetchBrands();
    setSelectedBrand(null);
  }, [vehicleType]);

  // 2. Buscar Modelos
  useEffect(() => {
    if (!selectedBrand) {
        setModels([]);
        return;
    };
    const fetchModels = async () => {
        setFipeLoading(true);
        setFipeError(null);
        try {
            const response = await fetch(`${FIPE_BASE_URL}/${vehicleType}/marcas/${selectedBrand.codigo}/modelos`);
            const data = await response.json();
            setModels(data.modelos || []);
        } catch (err) {
            setModels([]);
            setFipeError("Erro ao carregar modelos.");
        } finally {
            setFipeLoading(false);
        }
    };
    fetchModels();
    setSelectedModel(null);
  }, [selectedBrand, vehicleType]);
  
  // 3. Buscar Anos
  useEffect(() => {
    if (!selectedModel || !selectedBrand) {
      setYears([]);
      return;
    };
    const fetchYears = async () => {
        setFipeLoading(true);
        setFipeError(null);
        try {
            const response = await fetch(`${FIPE_BASE_URL}/${vehicleType}/marcas/${selectedBrand!.codigo}/modelos/${selectedModel.codigo}/anos`);
            const data = await response.json();
            setYears(Array.isArray(data) ? data : []);
        } catch (err) {
            setYears([]);
            setFipeError("Erro ao carregar anos.");
        } finally {
            setFipeLoading(false);
        }
    };
    fetchYears();
    setSelectedYear(null);
  }, [selectedModel, selectedBrand, vehicleType]);

  const handleVehicleTypeChange = (type: string) => {
    setVehicleType(type);
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedYear(null);
  }
  
  const toggleDropdown = (name: string) => {
    if (name === 'model' && !selectedBrand) return;
    if (name === 'year' && !selectedModel) return;
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const nextStep = async () => {
    let isValidStep = false;
    if (step === 1) {
        isValidStep = !!(vehicleType && selectedBrand && selectedModel && selectedYear);
        if (isValidStep) setStep(s => s + 1);
    } else if (step === 2) {
        isValidStep = await trigger(["name", "phone", "unit"]);
        if (isValidStep) setStep(s => s + 1);
    }
  };

  const prevStep = () => setStep(s => s - 1);

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trigger().then(isFormValid => {
      if (isFormValid) {
        const formData = new FormData();
        const values = getValues();
        
        const finalData = { 
          ...values,
          vehicleType,
          vehicleBrand: selectedBrand?.nome || '',
          vehicleModel: selectedModel?.nome || '',
          vehicleYear: selectedYear?.nome || '',
        };
        
        Object.entries(finalData).forEach(([key, value]) => {
          if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        
        startTransition(() => { formAction(formData); });
      }
    });
  };
  
  if (serverState?.success) {
    const contactValues = getValues();
    const selectedUnitData = units.find(u => u.id === contactValues.unit);
    
    return (
      <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="font-bold text-lg">Agendamento Recebido!</AlertTitle>
        <AlertDescription>
          <p className="mb-4">Obrigado, <strong>{contactValues.name}</strong>! Recebemos sua solicitação para o dia <strong>{contactValues.preferredDate ? format(contactValues.preferredDate, "dd/MM/yyyy") : ''}</strong> às <strong>{contactValues.preferredTime}</strong> na <strong>{selectedUnitData?.name}</strong>. Entraremos em contato em breve para confirmar.</p>
          <Button asChild>
            <Link href="/">Voltar para o início</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleFinalSubmit} className="space-y-6">
      <Progress value={(step / 3) * 100} className="mb-4" />
      
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in-50">
          <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Selecione o seu veículo</h2>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                  <VehicleTypeIcon active={vehicleType === 'carros'} onClick={() => handleVehicleTypeChange('carros')} icon={<Car size={18} />} />
                  <VehicleTypeIcon active={vehicleType === 'motos'} onClick={() => handleVehicleTypeChange('motos')} icon={<Bike size={18} />} />
                  <VehicleTypeIcon active={vehicleType === 'caminhoes'} onClick={() => handleVehicleTypeChange('caminhoes')} icon={<Truck size={18} />} />
              </div>
          </div>
          
          <div className="flex flex-col gap-4 relative">
             <SelectionFieldBlock 
                label="Marca"
                value={selectedBrand?.nome}
                placeholder="Selecione a marca"
                isOpen={activeDropdown === 'brand'}
                onClick={() => toggleDropdown('brand')}
                icon={<Tag size={18} />}
              />
              <SelectionFieldBlock 
                label="Modelo"
                value={selectedModel?.nome}
                placeholder={fipeLoading && !selectedBrand ? "Carregando..." : "Selecione o modelo"}
                isOpen={activeDropdown === 'model'}
                onClick={() => toggleDropdown('model')}
                disabled={!selectedBrand || models.length === 0}
                icon={<Car size={18} />}
              />
              <SelectionFieldBlock 
                label="Ano"
                value={selectedYear?.nome}
                placeholder={fipeLoading && !selectedModel ? "Carregando..." : "Selecione o ano"}
                isOpen={activeDropdown === 'year'}
                onClick={() => toggleDropdown('year')}
                disabled={!selectedModel || years.length === 0}
                icon={<CalendarIcon size={18} />}
              />

              {activeDropdown === 'brand' && (
                <DropdownList 
                  items={brands} 
                  onSelect={(item) => { setSelectedBrand(item); toggleDropdown('model'); }} 
                  title="Selecione a Marca"
                  searchable
                  onClose={() => setActiveDropdown(null)}
                  loading={fipeLoading && brands.length === 0}
                />
              )}
              {activeDropdown === 'model' && (
                <DropdownList 
                  items={models} 
                  onSelect={(item) => { setSelectedModel(item); toggleDropdown('year'); }} 
                  title="Selecione o Modelo"
                  searchable
                  onClose={() => setActiveDropdown(null)}
                  loading={fipeLoading && models.length === 0}
                />
              )}
              {activeDropdown === 'year' && (
                <DropdownList 
                  items={years} 
                  onSelect={(item) => { setSelectedYear(item); setActiveDropdown(null); }} 
                  title="Selecione o Ano"
                  onClose={() => setActiveDropdown(null)}
                  loading={fipeLoading && years.length === 0}
                />
              )}
          </div>
          {fipeError && <p className="text-sm text-red-600 mt-2">{fipeError}</p>}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in-50">
          <h3 className="text-xl font-semibold font-headline">2. Contato e Unidade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Seu nome</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Seu WhatsApp</Label>
               <Controller
                name="phone"
                control={control}
                render={({ field }) => <PhoneInput field={field} />}
              />
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
            </div>
          </div>
          <div>
              <Label htmlFor="unit">Unidade de preferência</Label>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                    <div className="flex gap-2 flex-wrap pt-2">
                        {units.map(unit => (
                            <button
                                type="button"
                                key={unit.id}
                                onClick={() => field.onChange(unit.id)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                                    field.value === unit.id 
                                        ? "bg-primary text-primary-foreground border-transparent"
                                        : "bg-transparent hover:bg-muted"
                                )}
                            >
                                {unit.name.replace('Unidade ', '')}
                            </button>
                        ))}
                    </div>
                )}
              />
              {errors.unit && <p className="text-sm text-red-600 mt-1">{errors.unit.message}</p>}
            </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in fade-in-50">
          <h3 className="text-xl font-semibold font-headline">3. Data e Horário</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <Label className="mb-2 self-start">Data de preferência</Label>
              <Controller
                name="preferredDate"
                control={control}
                render={({ field }) => (
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date(new Date().toDateString())}
                    initialFocus
                    locale={ptBR}
                    className="border rounded-md"
                  />
                )}
              />
               {errors.preferredDate && <p className="text-sm text-red-600 mt-1 self-start">{errors.preferredDate.message}</p>}
            </div>
            <div className="space-y-4">
              <Label>Horário de preferência</Label>
              <Controller
                name="preferredTime"
                control={control}
                render={({ field }) => (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {TIME_SLOTS.map(time => (
                            <button
                                type="button"
                                key={time}
                                onClick={() => field.onChange(time)}
                                className={cn(
                                    "px-3 py-2 rounded-md text-sm font-medium border transition-colors",
                                     field.value === time 
                                        ? "bg-primary text-primary-foreground border-transparent"
                                        : "bg-transparent hover:bg-muted"
                                )}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                )}
              />
              {errors.preferredTime && <p className="text-sm text-red-600 mt-1">{errors.preferredTime.message}</p>}
            </div>
          </div>
          <div className="flex items-start space-x-3 pt-4">
            <Controller
              name="lgpdConsent"
              control={control}
              render={({ field }) => (
                <Checkbox id="lgpdConsent" checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
              )}
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="lgpdConsent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Concordo com os termos
              </label>
              <p className="text-sm text-muted-foreground">
                Ao agendar, você concorda em ser contatado via WhatsApp e aceita nossa política de privacidade.
              </p>
              {errors.lgpdConsent && <p className="text-sm text-red-600 mt-1">{errors.lgpdConsent.message}</p>}
            </div>
          </div>
        </div>
      )}

      <div className={cn("flex pt-4", step > 1 ? "justify-between" : "justify-end")}>
        {step > 1 && <Button type="button" variant="ghost" onClick={prevStep}>Anterior</Button>}
        
        {step < 3 && <Button type="button" onClick={nextStep} variant="accent" disabled={!selectedYear}>Próximo Passo</Button>}
        
        {step === 3 && (
            <Button type="submit" disabled={isPending} variant="accent">
                {isPending ? <Loader2 className="animate-spin" /> : "Finalizar Agendamento"}
            </Button>
        )}
      </div>

       {serverState?.message && !serverState.success && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro no Agendamento</AlertTitle>
          <AlertDescription>{serverState.message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}