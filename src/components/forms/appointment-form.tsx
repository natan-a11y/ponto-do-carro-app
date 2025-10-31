"use client";

import { useState, useTransition, useActionState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

const formSchema = z.object({
  vehicleBrand: z.string().min(1, "Marca é obrigatória"),
  vehicleModel: z.string().min(1, "Modelo é obrigatório"),
  vehicleYear: z.string().min(4, "Ano é obrigatório").max(4, "Ano inválido"),
  name: z.string().min(2, "Nome é obrigatório"),
  phone: z.string().min(10, "Telefone é obrigatório"),
  unit: z.string().min(1, "Unidade é obrigatória"),
  preferredDate: z.date({ required_error: "Data é obrigatória" }),
  preferredTime: z.string().min(1, "Horário é obrigatório"),
  lgpdConsent: z.literal(true, {
    errorMap: () => ({ message: "Você deve aceitar os termos." }),
  }),
});

type FormData = z.infer<typeof formSchema>;

export function AppointmentForm({ units }: { units: Unit[] }) {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(scheduleAppointment, { message: null });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lgpdConsent: false
    }
  });

  const { register, control, trigger, getValues, formState: { errors } } = form;

  const nextStep = async () => {
    let fields: (keyof FormData)[] = [];
    if (step === 1) fields = ["vehicleBrand", "vehicleModel", "vehicleYear"];
    if (step === 2) fields = ["name", "phone", "unit"];

    const isValid = await trigger(fields);
    if (isValid) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Progress value={(step / 3) * 100} className="mb-8" />
      
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in-50">
          <h3 className="text-2xl font-semibold font-headline">1. Dados do Veículo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="vehicleBrand">Marca</Label>
              <Input id="vehicleBrand" {...register("vehicleBrand")} />
              {errors.vehicleBrand && <p className="text-sm text-red-600 mt-1">{errors.vehicleBrand.message}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleModel">Modelo</Label>
              <Input id="vehicleModel" {...register("vehicleModel")} />
              {errors.vehicleModel && <p className="text-sm text-red-600 mt-1">{errors.vehicleModel.message}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleYear">Ano</Label>
              <Input id="vehicleYear" type="number" {...register("vehicleYear")} />
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
              <Input id="phone" type="tel" {...register("phone")} />
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="unit">Unidade de preferência</Label>
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <div className="flex justify-center">
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
                  />
                )}
              />
            </div>
            <div className="space-y-4">
              <Label>Horário de preferência</Label>
              <Controller
                name="preferredTime"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          {errors.preferredDate && <p className="text-sm text-red-600 mt-1">{errors.preferredDate.message}</p>}
          <div className="flex items-start space-x-2">
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

      <div className={cn("flex", step > 1 ? "justify-between" : "justify-end")}>
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
