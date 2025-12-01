"use client";

import { useTransition } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IMaskInput } from "react-imask";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitB2bLead } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  company: z.string().min(2, "Empresa é obrigatória"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone é obrigatório"),
});

type FormData = z.infer<typeof formSchema>;

export function B2BForm() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useFormState(submitB2bLead, { message: null });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { register, formState: { errors }, control } = form;

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    startTransition(() => {
      formAction(formData);
    });
  };

  if (state?.success) {
    return (
      <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="font-bold text-lg">Contato Recebido!</AlertTitle>
        <AlertDescription>
          <p className="mb-4">Obrigado pelo seu interesse! Nossa equipe entrará em contato em breve.</p>
          <Button asChild>
            <Link href="/">Voltar para o início</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome Completo</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="company">Nome da Loja</Label>
        <Input id="company" {...register("company")} />
        {errors.company && <p className="text-sm text-red-600 mt-1">{errors.company.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="phone">WhatsApp</Label>
        <IMaskInput
            mask="(00) 00000-0000"
            id="phone"
            {...register("phone")}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            )}
            placeholder="(DDD) XXXXX-XXXX"
        />
        {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
      </div>
      <Button type="submit" disabled={isPending} className="w-full" variant="accent">
        {isPending ? <Loader2 className="animate-spin" /> : "Enviar Contato"}
      </Button>
       {state?.message && !state.success && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
