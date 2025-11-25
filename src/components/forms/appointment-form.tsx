"use client";

import { useState, useTransition, useActionState, useEffect, useRef } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useIMask } from "react-imask";

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
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';

// FIPE API types
type VehicleType = { nome: string; codigo: string };
type Brand = { nome: string; codigo: string };
type Model = { nome: string; codigo: string };
type Year = { nome: string; codigo: string };


const formSchema = z.object({
  vehicleType: z.string().min(1, "Tipo de veículo é obrigatório"),
  vehicleBrand: z.string().min(1, "Marca é obrigatória"),
  vehicleModel: z.string().min(1, "Modelo é obrigatório"),
  vehicleYear: z.string().min(1, "Ano é obrigatório"),
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

const PhoneInput = ({ field, ...props }: { field: any }) => {
    const { ref, maskRef } = useIMask({
      mask: '(00) 00000-0000',
    });
  
    useEffect(() => {
        if(field.onChange && maskRef.current) {
            const mask = maskRef.current;
            const listener = () => field.onChange(mask.value);
            mask.on('accept', listener);
            return () => {
                mask.off('accept', listener);
            }
        }
    }, [field, maskRef]);

    return <Input {...props} ref={ref} defaultValue={field.value} />;
  };

export function AppointmentForm({ units }: { units: Unit[] }) {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(scheduleAppointment, { message: null });

  // FIPE API State
  const [vehicleTypes] = useState<VehicleType[]>([
      { nome: 'Carro', codigo: 'carros' },
      { nome: 'Moto', codigo: 'motos' },
      { nome: 'Caminhão', codigo: 'caminhoes' },
  ]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState({ brands: false, models: false, years: false });
  const [selectedBrandName, setSelectedBrandName] = useState('');
  const [selectedModelName, setSelectedModelName] = useState('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lgpdConsent: false,
      vehicleType: '',
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: '',
    },
  });

  const { register, control, trigger, getValues, setValue, formState: { errors } } = form;

  const watchedVehicleType = useWatch({ control, name: 'vehicleType' });
  const watchedVehicleBrand = useWatch({ control, name: 'vehicleBrand' });
  const watchedVehicleModel = useWatch({ control, name: 'vehicleModel' });


  useEffect(() => {
    if (watchedVehicleType) {
      setLoading(l => ({ ...l, brands: true }));
      setBrands([]);
      setModels([]);
      setYears([]);
      setValue('vehicleBrand', '');
      setValue('vehicleModel', '');
      setValue('vehicleYear', '');

      fetch(`https://brasilapi.com.br/api/fipe/marcas/v1/${watchedVehicleType}`)
        .then(res => res.json())
        .then(data => {
            setBrands(data);
            setLoading(l => ({ ...l, brands: false }));
        })
        .catch(() => setLoading(l => ({ ...l, brands: false })));
    }
  }, [watchedVehicleType, setValue]);

  useEffect(() => {
    if (watchedVehicleBrand && watchedVehicleType) {
      setLoading(l => ({ ...l, models: true }));
      setModels([]);
      setYears([]);
      setValue('vehicleModel', '');
      setValue('vehicleYear', '');

      const brand = brands.find(b => b.codigo === watchedVehicleBrand);
      if (brand) setSelectedBrandName(brand.nome);

      fetch(`https://brasilapi.com.br/api/fipe/v1/${watchedVehicleType}/${watchedVehicleBrand}`)
        .then(res => res.json())
        .then(data => {
            setModels(data);
            setLoading(l => ({ ...l, models: false }));
        })
        .catch(() => setLoading(l => ({ ...l, models: false })));
    }
  }, [watchedVehicleBrand, watchedVehicleType, brands, setValue]);

  useEffect(() => {
    if (watchedVehicleModel && watchedVehicleBrand && watchedVehicleType) {
      setLoading(l => ({ ...l, years: true }));
      setYears([]);
      setValue('vehicleYear', '');

      const model = models.find(m => m.codigo === watchedVehicleModel);
      if (model) setSelectedModelName(model.nome);

      fetch(`https://brasilapi.com.br/api/fipe/v1/${watchedVehicleType}/${watchedVehicleBrand}/${watchedVehicleModel}`)
        .then(res => res.json())
        .then(data => {
            setYears(data);
            setLoading(l => ({ ...l, years: false }));
        })
        .catch(() => setLoading(l => ({ ...l, years: false })));
    }
  }, [watchedVehicleModel, watchedVehicleBrand, watchedVehicleType, models, setValue]);


  const nextStep = async () => {
    let fields: (keyof FormData)[] = [];
    if (step === 1) fields = ["vehicleType", "vehicleBrand", "vehicleModel", "vehicleYear"];
    if (step === 2) fields = ["name", "phone", "unit"];

    const isValid = await trigger(fields);
    if (isValid) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    const finalData = {
        ...data,
        vehicleBrand: selectedBrandName,
        vehicleModel: selectedModelName,
        vehicleYear: years.find(y => y.codigo === data.vehicleYear)?.nome || data.vehicleYear,
    };

    Object.entries(finalData).forEach(([key, value]) => {
      if (key === 'preferredDate' && value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, String(value));
      }
    });
    
    startTransition(() => {
      formAction(formData);
    });
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

  const renderSelect = (name: keyof FormData, placeholder: string, items: {codigo: string, nome: string}[], isLoading: boolean, isDisabled: boolean) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value} disabled={isDisabled || isLoading}>
          <SelectTrigger>
            <SelectValue placeholder={isLoading ? 'Carregando...' : placeholder} />
          </SelectTrigger>
          <SelectContent>
            {items.map(item => (
              <SelectItem key={item.codigo} value={item.codigo}>{item.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );


  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Progress value={(step / 3) * 100} className="mb-8" />
      
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in-50">
          <h3 className="text-2xl font-semibold font-headline">1. Dados do Veículo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Veículo</Label>
              {renderSelect("vehicleType", "Selecione o tipo", vehicleTypes, false, false)}
              {errors.vehicleType && <p className="text-sm text-red-600 mt-1">{errors.vehicleType.message}</p>}
            </div>
            <div>
              <Label>Marca</Label>
              {renderSelect("vehicleBrand", "Selecione a marca", brands, loading.brands, !watchedVehicleType)}
              {errors.vehicleBrand && <p className="text-sm text-red-600 mt-1">{errors.vehicleBrand.message}</p>}
            </div>
            <div>
              <Label>Modelo</Label>
              {renderSelect("vehicleModel", "Selecione o modelo", models, loading.models, !watchedVehicleBrand)}
              {errors.vehicleModel && <p className="text-sm text-red-600 mt-1">{errors.vehicleModel.message}</p>}
            </div>
            <div>
              <Label>Ano</Label>
              {renderSelect("vehicleYear", "Selecione o ano", years, loading.years, !watchedVehicleModel)}
              {errors.vehicleYear && <p className="text-sm text-red-600 mt-1">{errors.vehicleYear.message}</p>}
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
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                    ))}
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
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
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
                <Checkbox
                  id="lgpdConsent"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1"
                />
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
        {step > 1 && (
          <Button type="button" variant="outline" onClick={prevStep}>
            Anterior
          </Button>
        )}
        {step < 3 && (
          <Button type="button" onClick={nextStep} variant="accent">
            Próximo
          </Button>
        )}
        {step === 3 && (
          <Button type="submit" disabled={isPending} variant="accent">
            {isPending ? <Loader2 className="animate-spin" /> : "Finalizar Agendamento"}
          </Button>
        )}
      </div>

       {state?.message && !state.success && (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
