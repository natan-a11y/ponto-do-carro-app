"use client";

import { useState, useTransition, useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useIMask, IMask } from "react-imask";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { scheduleAppointment } from "@/app/actions";
import { type Unit, TIME_SLOTS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { useFipeBrands, useFipeModels, useFipeYears } from "@/hooks/use-fipe";

// FIPE API types
type FipeData = { nome: string; codigo: string };

const plateRegex = /^([A-Z]{3}-?[0-9][A-Z0-9][0-9]{2})$/;

const formSchema = z.object({
  vehicleType: z.string().min(1, "Tipo de veículo é obrigatório"),
  vehicleBrand: z.string().min(1, "Marca é obrigatória"),
  vehicleModel: z.string().min(1, "Modelo é obrigatório"),
  vehicleYear: z.string().min(1, "Ano é obrigatório"),
  vehiclePlate: z.string().regex(plateRegex, "Placa inválida"),
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

// Input com máscara para Telefone
const PhoneInput = ({ field, ...props }: { field: any }) => {
    const { ref } = useIMask({ 
      mask: '(00) 00000-0000',
      onAccept: (value: any) => field.onChange(value)
    });
    return <Input {...props} ref={ref} defaultValue={field.value} />;
};

// Input com máscara para Placa (Padrão e Mercosul)
const PlateInput = ({ field, ...props }: { field: any }) => {
    const { ref } = useIMask({
        mask: IMask.Masked.Pattern,
        pattern: '[A-Z]{3}-`[0-9]{4}`',
        prepare: (str) => str.toUpperCase(),
        blocks: {
            A: {
                mask: IMask.Masked.MaskedRegExp,
                pattern: /[A-Z0-9]/,
            },
        },
        onAccept: (value: any) => field.onChange(value)
    });
    return <Input {...props} ref={ref} defaultValue={field.value} />;
}


export function AppointmentForm({ units }: { units: Unit[] }) {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useFormState(scheduleAppointment, { message: null });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const vehicleTypes: FipeData[] = [
      { nome: 'Carro', codigo: 'carros' },
      { nome: 'Moto', codigo: 'motos' },
      { nome: 'Caminhão', codigo: 'caminhoes' },
  ];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lgpdConsent: false,
      vehicleType: '',
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: '',
      vehiclePlate: '',
    },
  });

  const { register, control, trigger, getValues, setValue, formState: { errors } } = form;

  const watchedVehicleType = useWatch({ control, name: 'vehicleType' });
  const watchedVehicleBrand = useWatch({ control, name: 'vehicleBrand' });
  const watchedVehicleModel = useWatch({ control, name: 'vehicleModel' });
  
  const { data: brands, loading: loadingBrands, error: errorBrands } = useFipeBrands(watchedVehicleType);
  const { data: models, loading: loadingModels, error: errorModels } = useFipeModels(watchedVehicleType, watchedVehicleBrand);
  const { data: years, loading: loadingYears, error: errorYears } = useFipeYears(watchedVehicleType, watchedVehicleBrand, watchedVehicleModel);

  // Limpa os campos dependentes quando a seleção principal muda
  useEffect(() => {
      if (!isClient) return;
      setValue('vehicleBrand', '');
      setValue('vehicleModel', '');
      setValue('vehicleYear', '');
  }, [watchedVehicleType, setValue, isClient]);

  useEffect(() => {
      if (!isClient) return;
      setValue('vehicleModel', '');
      setValue('vehicleYear', '');
  }, [watchedVehicleBrand, setValue, isClient]);


  const nextStep = async () => {
    const fields: (keyof FormData)[] = step === 1
      ? ["vehicleType", "vehicleBrand", "vehicleModel", "vehicleYear", "vehiclePlate"]
      : ["name", "phone", "unit"];
    
    const isValid = await trigger(fields);
    if (isValid) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    
    const brandName = brands.find(b => b.codigo === data.vehicleBrand)?.nome || '';
    const modelName = models.find(m => m.codigo === data.vehicleModel)?.nome || '';
    const yearData = years.find(y => y.codigo === data.vehicleYear);

    const finalData = { 
      ...data, 
      vehicleBrandName: brandName, 
      vehicleModelName: modelName,
      vehicleYearName: yearData?.nome || '',
      codigoFipe: data.vehicleModel, // O código do modelo é o código FIPE
      anoModelo: data.vehicleYear, // O código do ano é o ano/combustível
    };

    Object.entries(finalData).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, String(value));
      }
    });
    
    startTransition(() => { formAction(formData); });
  };
  
  if (state?.success) {
    const values = getValues();
    const selectedUnit = units.find(u => u.id === values.unit);
    
    return (
      <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="font-bold text-lg">Agendamento Recebido!</AlertTitle>
        <AlertDescription>
          <p className="mb-4">Obrigado, <strong>{values.name}</strong>! Recebemos sua solicitação para o dia <strong>{format(values.preferredDate, "dd/MM/yyyy")}</strong> às <strong>{values.preferredTime}</strong> na <strong>{selectedUnit?.name}</strong>. Entraremos em contato em breve para confirmar.</p>
          <Button asChild>
            <Link href="/">Voltar para o início</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const renderSelect = (name: keyof FormData, placeholder: string, items: FipeData[], isLoading: boolean, isDisabled: boolean, error?: string | null) => (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value} disabled={isDisabled || isLoading}>
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? 'Carregando...' : placeholder} />
            </SelectTrigger>
            <SelectContent>
              {items.map(item => <SelectItem key={item.codigo} value={item.codigo}>{item.nome}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      />
      {errors[name] && <p className="text-sm text-red-600 mt-1">{(errors[name] as any).message}</p>}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Progress value={(step / 3) * 100} className="mb-8" />
      
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in-50">
          <h3 className="text-2xl font-semibold font-headline">1. Dados do Veículo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <Label>Tipo de Veículo</Label>
              {renderSelect("vehicleType", "Selecione o tipo", vehicleTypes, false, !isClient)}
            </div>
            <div>
              <Label>Marca</Label>
              {renderSelect("vehicleBrand", "Selecione a marca", brands, loadingBrands, !isClient || !watchedVehicleType, errorBrands)}
            </div>
            <div>
              <Label>Modelo</Label>
              {renderSelect("vehicleModel", "Selecione o modelo", models, loadingModels, !isClient || !watchedVehicleBrand, errorModels)}
            </div>
            <div>
              <Label>Ano</Label>
              {renderSelect("vehicleYear", "Selecione o ano", years, loadingYears, !isClient || !watchedVehicleModel, errorYears)}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="vehiclePlate">Placa do Veículo</Label>
              <Controller
                name="vehiclePlate"
                control={control}
                render={({ field }) => <PlateInput field={field} id="vehiclePlate" placeholder="ABC-1234 ou ABC1D23" />}
              />
              {errors.vehiclePlate && <p className="text-sm text-red-600 mt-1">{errors.vehiclePlate.message}</p>}
            </div>
          </div>
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
                render={({ field }) => <PhoneInput field={field} id="phone" />}
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
        {step === 3 && <Button type="submit" disabled={isPending} variant="accent">{isPending ? <Loader2 className="animate-spin" /> : "Finalizar Agendamento"}</Button>}
      </div>

       {state?.message && !state.success && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro no Agendamento</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
