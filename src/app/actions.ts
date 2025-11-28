"use server";

import { z } from "zod";

const appointmentSchema = z.object({
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

const b2bLeadSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  company: z.string().min(2, "Empresa é obrigatória"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone é obrigatório"),
});

export async function scheduleAppointment(prevState: any, formData: FormData) {
  const validatedFields = appointmentSchema.safeParse({
    vehicleBrand: formData.get("vehicleBrand"),
    vehicleModel: formData.get("vehicleModel"),
    vehicleYear: formData.get("vehicleYear"),
    reasonForSelling: formData.get("reasonForSelling"),
    name: formData.get("name"),
    unit: formData.get("unit"),
    preferredDate: new Date(formData.get("preferredDate") as string),
    preferredTime: formData.get("preferredTime"),
    lgpdConsent: formData.get("lgpdConsent") === 'on',
  });

  if (!validatedFields.success) {
    console.error("Validation Errors:", validatedFields.error.flatten().fieldErrors);
    return {
      message: "Erro de validação. Verifique os campos.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Here you would save the data to Firestore
    console.log("Saving appointment to Firestore:", validatedFields.data);
    // await db.collection('appointments').add(validatedFields.data);
    
    // Simulate a delay
    await new Promise(res => setTimeout(res, 1000));

    return { message: "Agendamento recebido com sucesso!", success: true };
  } catch (e) {
    console.error(e);
    return { message: "Falha ao enviar agendamento. Tente novamente." };
  }
}

export async function submitB2bLead(prevState: any, formData: FormData) {
    const validatedFields = b2bLeadSchema.safeParse({
        name: formData.get("name"),
        company: formData.get("company"),
        email: formData.get("email"),
        phone: formData.get("phone"),
    });

    if (!validatedFields.success) {
        return {
            message: "Erro de validação. Verifique os campos.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        console.log("Saving B2B lead to Firestore:", validatedFields.data);
        await new Promise(res => setTimeout(res, 1000));
        return { message: "Contato recebido! Entraremos em contato em breve.", success: true };
    } catch (e) {
        console.error(e);
        return { message: "Falha ao enviar contato. Tente novamente." };
    }
}
