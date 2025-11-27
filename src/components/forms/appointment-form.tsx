
"use client";

import React, { useState, useEffect, useTransition } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- Tipos e Schema ---

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

const vehicleTypes: FipeItem[] = [
    { nome: 'Carro', codigo: 'carros' },
    { nome: 'Moto', codigo: 'motos' },
    { nome: 'Caminhão', codigo: 'caminhoes' },
];

// --- Componentes Auxiliares ---

const PhoneInput = React.forwardRef<HTMLInputElement, { field: any }>(({ field }, ref) => {
    const { ref: iMaskRef } = useIMask({ 
      mask: '(00) 00000-0000',
      onAccept: (value: any) => field.onChange(value)
    });
    return <Input {...field} ref={iMaskRef} defaultValue={field.value} />;
});
PhoneInput.displayName = 'PhoneInput';

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
  
  // Estados de UI da FIPE
  const [fipeLoading, setFipeLoading] = useState<string | null>(null);
  const [fipeError, setFipeError] = useState<string | null>(null);

  const { register, control, trigger, getValues, formState: { errors, isValid } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      unit: "",
      preferredTime: "",
      lgpdConsent: false,
    },
  });

  // 1. Buscar Marcas
  useEffect(() => {
    const fetchBrands = async () => {
        setFipeLoading('brands');
        setFipeError(null);
        // Reset
        setSelectedBrand(null);
        setSelectedModel(null);
        setSelectedYear(null);
        setModels([]);
        setYears([]);
        try {
            const response = await fetch(`${FIPE_BASE_URL}/${vehicleType}/marcas`);
            const data = await response.json();
            setBrands(data);
        } catch (err) {
            setFipeError("Erro ao carregar marcas.");
        } finally {
            setFipeLoading(null);
        }
    };
    fetchBrands();
  }, [vehicleType]);

  // 2. Buscar Modelos
  useEffect(() => {
    if (!selectedBrand) return;
    const fetchModels = async () => {
        setFipeLoading('models');
        setFipeError(null);
        // Reset
        setSelectedModel(null);
        setSelectedYear(null);
        setYears([]);
        try {
            const response = await fetch(`${FIPE_BASE_URL}/${vehicleType}/marcas/${selectedBrand.codigo}/modelos`);
            const data = await response.json();
            setModels(data.modelos);
        } catch (err) {
            setFipeError("Erro ao carregar modelos.");
        } finally {
            setFipeLoading(null);
        }
    };
    fetchModels();
  }, [selectedBrand, vehicleType]);
  
  // 3. Buscar Anos
  useEffect(() => {
    if (!selectedModel) return;
    const fetchYears = async () => {
        setFipeLoading('years');
        setFipeError(null);
        // Reset
        setSelectedYear(null);
        try {
            const response = await fetch(`${FIPE_BASE_URL}/${vehicleType}/marcas/${selectedBrand!.codigo}/modelos/${selectedModel.codigo}/anos`);
            const data = await response.json();
            setYears(data);
        } catch (err) {
            setFipeError("Erro ao carregar anos.");
        } finally {
            setFipeLoading(null);
        }
    };
    fetchYears();
  }, [selectedModel, selectedBrand, vehicleType]);


  const nextStep = async () => {
    let isValidStep = false;
    if (step === 1) {
        isValidStep = !!(vehicleType && selectedBrand && selectedModel && selectedYear);
    } else if (step === 2) {
        isValidStep = await trigger(["name", "phone", "unit"]);
    }
    
    if (isValidStep) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => setStep(s => s - 1);

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    
    const finalData = { 
      ...data,
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
  };
  
  if (serverState?.success) {
    const contactValues = getValues();
    const selectedUnitData = units.find(u => u.id === contactValues.unit);
    
    return (
      <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="font-bold text-lg">Agendamento Recebido!</AlertTitle>
        <AlertDescription>
          <p className="mb-4">Obrigado, <strong>{contactValues.name}</strong>! Recebemos sua solicitação para o dia <strong>{format(contactValues.preferredDate, "dd/MM/yyyy")}</strong> às <strong>{contactValues.preferredTime}</strong> na <strong>{selectedUnitData?.name}</strong>. Entraremos em contato em breve para confirmar.</p>
          <Button asChild>
            <Link href="/">Voltar para o início</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const renderSelect = (
      placeholder: string, 
      items: FipeItem[], 
      selectedValue: FipeItem | null,
      onSelect: (item: FipeItem | null) => void,
      isLoading: boolean, 
      isDisabled: boolean,
    ) => (
    <Select 
        onValueChange={(code) => onSelect(items.find(item => item.codigo === code) || null)}
        value={selectedValue?.codigo || ""}
        disabled={isDisabled || isLoading}
    >
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? 'Carregando...' : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map(item => <SelectItem key={item.codigo} value={item.codigo}>{item.nome}</SelectItem>)}
      </SelectContent>
    </Select>
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(getValues()); }} className="space-y-8">
      <Progress value={(step / 3) * 100} className="mb-8" />
      
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in-50">
          <h3 className="text-2xl font-semibold font-headline">1. Dados do Veículo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <Label>Tipo de Veículo</Label>
              <Select onValueChange={setVehicleType} value={vehicleType}>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo"/></SelectTrigger>
                <SelectContent>
                    {vehicleTypes.map(type => <SelectItem key={type.codigo} value={type.codigo}>{type.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Marca</Label>
              {renderSelect("Selecione a marca", brands, selectedBrand, setSelectedBrand, fipeLoading === 'brands', !vehicleType)}
            </div>
            <div>
              <Label>Modelo</Label>
              {renderSelect("Selecione o modelo", models, selectedModel, setSelectedModel, fipeLoading === 'models', !selectedBrand)}
            </div>
            <div>
              <Label>Ano</Label>
              {renderSelect("Selecione o ano", years, selectedYear, setSelectedYear, fipeLoading === 'years', !selectedModel)}
            </div>
          </div>
          {fipeError && <p className="text-sm text-red-600 mt-2">{fipeError}</p>}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in-50">
          <h3 className="text-2xl font-semibold font-headline">2. Contato e Unidade</h3>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="unit"><SelectValue placeholder="Selecione a unidade" /></SelectTrigger>
                  <SelectContent>
                    {units.map(unit => <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.unit && <p className="text-sm text-red-600 mt-1">{errors.unit.message}</p>}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in fade-in-50">
          <h3 className="text-2xl font-semibold font-headline">3. Data e Horário</h3>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Selecione o horário" /></SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                    </SelectContent>
                  </Select>
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
        {step > 1 && <Button type="button" variant="outline" onClick={prevStep}>Anterior</Button>}
        
        {step < 3 && <Button type="button" onClick={nextStep} variant="accent">Próximo</Button>}
        
        {step === 3 && (
            <Button type="submit" disabled={isPending || !isValid} variant="accent">
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
