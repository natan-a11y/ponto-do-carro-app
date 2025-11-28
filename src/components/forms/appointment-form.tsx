"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormState } from "react-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { scheduleAppointment } from "@/app/actions";
import { type Unit, TIME_SLOTS } from "@/lib/data";
import { useFipeBrands, useFipeModels, useFipeYears } from "@/hooks/use-fipe";

import { Button } from "@/components/ui/button";
import { Car, Tag, Search, X, CheckCircle, Loader2, AlertCircle, Calendar as CalendarIcon, ChevronDown, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- Tipos e Schemas ---

type FipeItem = { nome: string; codigo: string };

const formSchema = z.object({
  vehicleBrand: z.string().min(1, "Marca é obrigatória"),
  vehicleModel: z.string().min(1, "Modelo é obrigatório"),
  vehicleYear: z.string().min(1, "Ano é obrigatório"),
  reasonForSelling: z.string().min(1, "Motivo é obrigatório"),
  name: z.string().min(2, "Nome é obrigatório"),
  unit: z.string().min(1, "Unidade é obrigatória"),
  preferredDate: z.date({ required_error: "Data é obrigatória" }),
  preferredTime: z.string().min(1, "Horário é obrigatório"),
  lgpdConsent: z.literal(true, {
    errorMap: () => ({ message: "Você deve aceitar os termos." }),
  }),
});

type FormData = z.infer<typeof formSchema>;

const REASONS_FOR_SELLING = [
    "Mudança de País ou Cidade",
    "Insegurança de vender no mercado particular",
    "Não tem paciência de vender no mercado particular",
    "Já comprou outro carro",
    "Carro está financiado ou com débitos",
    "Precisa do dinheiro com certa urgência",
    "Outros"
];


// --- Componentes Auxiliares ---

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

const DropdownList = ({ items = [], onSelect, title, searchable, onClose, loading, error }: { items: (FipeItem | string)[], onSelect: (item: FipeItem | string)=>void, title:string, searchable?:boolean, onClose:()=>void, loading: boolean, error: string | null }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchable && inputRef.current) inputRef.current.focus();
  }, [searchable]);
  
  const getItemName = (item: FipeItem | string) => typeof item === 'string' ? item : item?.nome || 'Item';
  const getItemKey = (item: FipeItem | string) => typeof item === 'string' ? item : item?.codigo || Math.random();


  const filteredItems = (items || []).filter(item => 
    getItemName(item).toLowerCase().includes(searchTerm.toLowerCase())
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
        ) : error ? (
            <div className="text-center py-8 text-red-500 text-sm">{error}</div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={getItemKey(item)} className="p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer text-sm text-gray-600 flex justify-between items-center group" onClick={() => onSelect(item)}>
              <span>{getItemName(item)}</span>
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
  const [serverState, formAction] = useFormState(scheduleAppointment, { message: null });
  const [isPending, startTransition] = React.useTransition();

  // Estado da Etapa
  const [step, setStep] = useState(1);
  
  // Estados de seleção FIPE
  const vehicleType = 'carros';
  const [selectedBrand, setSelectedBrand] = useState<FipeItem | null>(null);
  const [selectedModel, setSelectedModel] = useState<FipeItem | null>(null);
  const [selectedYear, setSelectedYear] = useState<FipeItem | null>(null);

  // Estados de UI
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Hooks de dados da FIPE
  const { data: brands, loading: brandsLoading, error: brandsError } = useFipeBrands(vehicleType);
  const { data: models, loading: modelsLoading, error: modelsError } = useFipeModels(vehicleType, selectedBrand?.codigo);
  const { data: years, loading: yearsLoading, error: yearsError } = useFipeYears(vehicleType, selectedBrand?.codigo, selectedModel?.codigo);
  
  const { control, trigger, getValues, setValue, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
  });

  const reasonForSellingValue = watch("reasonForSelling");

  // Efeitos para resetar campos dependentes
  useEffect(() => {
    setSelectedModel(null);
    setValue("vehicleModel", "");
  }, [selectedBrand, setValue]);

  useEffect(() => {
    setSelectedYear(null);
    setValue("vehicleYear", "");
  }, [selectedModel, setValue]);
  
  // Seta os valores no react-hook-form quando a seleção muda
  useEffect(() => setValue("vehicleBrand", selectedBrand?.nome || ""), [selectedBrand, setValue]);
  useEffect(() => setValue("vehicleModel", selectedModel?.nome || ""), [selectedModel, setValue]);
  useEffect(() => setValue("vehicleYear", selectedYear?.nome || ""), [selectedYear, setValue]);

  const toggleDropdown = (name: string) => {
    if (name === 'model' && !selectedBrand) return;
    if (name === 'year' && !selectedModel) return;
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    let nextStep = step + 1;

    if (step === 1) {
      fieldsToValidate = ['vehicleBrand', 'vehicleModel', 'vehicleYear'];
    } else if (step === 2) {
      fieldsToValidate = ['reasonForSelling'];
    } else if (step === 3) {
      fieldsToValidate = ['name', 'unit'];
    } else if (step === 4) {
      fieldsToValidate = ['preferredDate'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(nextStep);
    }
  };
  
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trigger().then(isFormValid => {
      if (isFormValid) {
        const formData = new FormData(e.target as HTMLFormElement);
        formData.set('preferredDate', format(getValues('preferredDate'), 'yyyy-MM-dd'));
        startTransition(() => formAction(formData));
      }
    });
  };
  
  if (serverState?.success) {
    const contactValues = getValues();
    const selectedUnitData = units.find(u => u.id === contactValues.unit);
    
    return (
      <div className="p-6">
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
      </div>
    );
  }

  return (
    <form onSubmit={handleFinalSubmit} className="space-y-6">
      
      {/* Etapa 1: Seleção de Veículo */}
      <div className={cn(step !== 1 && 'hidden', "animate-in fade-in-50 duration-300")}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">1. Selecione o seu veículo</h2>
               <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                  <div className="p-2 rounded-md bg-white shadow-sm text-black">
                     <Car size={18} />
                  </div>
              </div>
          </div>
          
          <div className="flex flex-col gap-4 relative">
              <input type="hidden" name="vehicleBrand" value={getValues("vehicleBrand")} />
              <input type="hidden" name="vehicleModel" value={getValues("vehicleModel")} />
              <input type="hidden" name="vehicleYear" value={getValues("vehicleYear")} />

            <SelectionFieldBlock 
                label="Marca"
                value={selectedBrand?.nome}
                placeholder={brandsLoading ? "Carregando..." : "Selecione a marca"}
                isOpen={activeDropdown === 'brand'}
                onClick={() => toggleDropdown('brand')}
                icon={<Tag size={18} />}
              />
              <SelectionFieldBlock 
                label="Modelo"
                value={selectedModel?.nome}
                placeholder={modelsLoading ? "Carregando..." : "Selecione o modelo"}
                isOpen={activeDropdown === 'model'}
                onClick={() => toggleDropdown('model')}
                disabled={!selectedBrand || models.length === 0}
                icon={<Car size={18} />}
              />
              <SelectionFieldBlock 
                label="Ano"
                value={selectedYear?.nome}
                placeholder={yearsLoading ? "Carregando..." : "Selecione o ano"}
                isOpen={activeDropdown === 'year'}
                onClick={() => toggleDropdown('year')}
                disabled={!selectedModel || years.length === 0}
                icon={<CalendarIcon size={18} />}
              />

              {activeDropdown === 'brand' && (
                <DropdownList 
                  items={brands} 
                  onSelect={(item) => { setSelectedBrand(item as FipeItem); setActiveDropdown('model'); }} 
                  title="Selecione a Marca"
                  searchable
                  onClose={() => setActiveDropdown(null)}
                  loading={brandsLoading}
                  error={brandsError}
                />
              )}
              {activeDropdown === 'model' && (
                <DropdownList 
                  items={models} 
                  onSelect={(item) => { setSelectedModel(item as FipeItem); setActiveDropdown('year'); }} 
                  title="Selecione o Modelo"
                  searchable
                  onClose={() => setActiveDropdown(null)}
                  loading={modelsLoading}
                  error={modelsError}
                />
              )}
              {activeDropdown === 'year' && (
                <DropdownList 
                  items={years} 
                  onSelect={(item) => { setSelectedYear(item as FipeItem); setActiveDropdown(null); }} 
                  title="Selecione o Ano"
                  onClose={() => setActiveDropdown(null)}
                  loading={yearsLoading}
                  error={yearsError}
                />
              )}
          </div>
          <div className="pt-2">
            <Button 
                type="button" 
                onClick={handleNextStep}
                disabled={!selectedYear}
                size="lg" 
                className="w-full"
              >
              Avançar
            </Button>
          </div>
        </div>
      </div>
      
      {/* Etapa 2: Motivo da Venda */}
       <div className={cn("space-y-6", step !== 2 && 'hidden', "animate-in fade-in-50 duration-300")}>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setStep(1)} className="p-2 hover:bg-muted rounded-full">
                <ArrowLeft size={16} />
              </button>
              <div>
                <p className="text-sm font-semibold text-primary truncate max-w-[250px]">{selectedBrand?.nome} {selectedModel?.nome}</p>
                <p className="text-xs text-muted-foreground">{selectedYear?.nome}</p>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 pt-4 border-t">2. Motivo da Venda</h3>
            <div>
              <Controller
                name="reasonForSelling"
                control={control}
                render={({ field }) => (
                    <div className="flex flex-col gap-3">
                        {REASONS_FOR_SELLING.map(reason => (
                            <button
                                type="button"
                                key={reason}
                                onClick={() => field.onChange(reason)}
                                className={cn(
                                    "px-4 py-3 text-left rounded-lg text-sm font-medium border transition-colors",
                                    field.value === reason 
                                        ? "bg-primary text-primary-foreground border-transparent"
                                        : "bg-transparent hover:bg-muted"
                                )}
                            >
                                {reason}
                            </button>
                        ))}
                    </div>
                )}
                />
                <input type="hidden" {...control.register("reasonForSelling")} />
                {errors.reasonForSelling && <p className="text-sm text-red-600 mt-1">{errors.reasonForSelling.message}</p>}
            </div>
            <div className="pt-2">
                <Button 
                    type="button" 
                    onClick={handleNextStep}
                    size="lg" 
                    className="w-full"
                    disabled={!reasonForSellingValue}
                >
                Avançar
                </Button>
            </div>
        </div>

      {/* Etapa 3: Contato e Unidade */}
      <div className={cn("space-y-6", step !== 3 && 'hidden', "animate-in fade-in-50 duration-300")}>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setStep(2)} className="p-2 hover:bg-muted rounded-full">
            <ArrowLeft size={16} />
          </button>
          <div>
            <p className="text-sm font-semibold text-primary truncate max-w-[250px]">{selectedBrand?.nome} {selectedModel?.nome}</p>
            <p className="text-xs text-muted-foreground">{selectedYear?.nome}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 border-t pt-4">3. Seu Nome e Unidade</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Seu nome</label>
            <Controller name="name" control={control} render={({ field }) => <input id="name" {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />} />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>
        </div>
        <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unidade de preferência</label>
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
        <div className="pt-2">
            <Button 
                type="button" 
                onClick={handleNextStep}
                size="lg" 
                className="w-full"
              >
              Avançar para Agendamento
            </Button>
          </div>
      </div>

       {/* Etapa 4: Data */}
       <div className={cn("space-y-6", step !== 4 && 'hidden', "animate-in fade-in-50 duration-300")}>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setStep(3)} className="p-2 hover:bg-muted rounded-full">
                <ArrowLeft size={16} />
              </button>
              <div>
                <p className="text-sm font-semibold text-primary truncate max-w-[250px]">{selectedBrand?.nome} {selectedModel?.nome}</p>
                <p className="text-xs text-muted-foreground">{selectedYear?.nome}</p>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 pt-4 border-t">4. Data de preferência</h3>
            <div className="flex flex-col items-center">
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
             <div className="pt-2">
                <Button 
                    type="button" 
                    onClick={handleNextStep}
                    size="lg" 
                    className="w-full"
                >
                Avançar para Horário
                </Button>
            </div>
        </div>

        {/* Etapa 5: Horário e Finalização */}
        <div className={cn("space-y-6", step !== 5 && 'hidden', "animate-in fade-in-50 duration-300")}>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setStep(4)} className="p-2 hover:bg-muted rounded-full">
                <ArrowLeft size={16} />
              </button>
              <div>
                <p className="text-sm font-semibold text-primary truncate max-w-[250px]">{selectedBrand?.nome} {selectedModel?.nome}</p>
                <p className="text-xs text-muted-foreground">{selectedYear?.nome}</p>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 pt-4 border-t">5. Horário de preferência</h3>
            <div className="space-y-4">
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
          <div className="flex items-start space-x-3 pt-4">
            <Controller
              name="lgpdConsent"
              control={control}
              render={({ field }) => (
                <Checkbox id="lgpdConsent" onCheckedChange={field.onChange} checked={field.value} name="lgpdConsent" className="mt-1" />
              )}
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="lgpdConsent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Concordo com os termos
              </label>
              <p className="text-sm text-muted-foreground">
                Ao agendar, você concorda em ser contatado e aceita nossa política de privacidade.
              </p>
              {errors.lgpdConsent && <p className="text-sm text-red-600 mt-1">{errors.lgpdConsent.message}</p>}
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isPending} variant="accent" size="lg" className="w-full">
                {isPending ? <Loader2 className="animate-spin" /> : "Finalizar Agendamento"}
            </Button>
          </div>
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

    