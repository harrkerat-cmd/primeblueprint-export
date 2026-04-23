"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/shared/button";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";

export function ContactForm() {
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  async function onSubmit(values: ContactInput) {
    setStatus("Sending...");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const data = await response.json();
    setStatus(response.ok ? "Message sent. We will get back to you shortly." : data.error ?? "Message could not be sent.");
    if (response.ok) {
      form.reset();
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
      <div>
        <input
          {...form.register("name")}
          placeholder="Your name"
          className="w-full rounded-[24px] border border-slate-200 px-5 py-4 outline-none transition focus:border-navy-900"
        />
        {form.formState.errors.name ? <p className="mt-2 text-sm text-red-600">{form.formState.errors.name.message}</p> : null}
      </div>
      <div>
        <input
          {...form.register("email")}
          placeholder="Your email"
          className="w-full rounded-[24px] border border-slate-200 px-5 py-4 outline-none transition focus:border-navy-900"
        />
        {form.formState.errors.email ? <p className="mt-2 text-sm text-red-600">{form.formState.errors.email.message}</p> : null}
      </div>
      <div>
        <textarea
          {...form.register("message")}
          rows={6}
          placeholder="How can we help?"
          className="w-full rounded-[24px] border border-slate-200 px-5 py-4 outline-none transition focus:border-navy-900"
        />
        {form.formState.errors.message ? <p className="mt-2 text-sm text-red-600">{form.formState.errors.message.message}</p> : null}
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        Send message
        <Send className="h-4 w-4" />
      </Button>
      {status ? <p className="text-sm text-slate-600">{status}</p> : null}
    </form>
  );
}
