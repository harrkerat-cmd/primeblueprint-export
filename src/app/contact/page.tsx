import { ContactForm } from "@/components/forms/contact-form";
import { Badge } from "@/components/shared/badge";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr]">
        <div className="space-y-5">
          <Badge>Contact</Badge>
          <h1 className="font-display text-5xl tracking-tight text-navy-950 sm:text-6xl">We are here if you need anything</h1>
          <p className="text-lg leading-8 text-slate-600">
            If you have a question about categories, delivery, or setup, send us a note and we will reply.
          </p>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm text-slate-500">Support email</p>
            <p className="mt-2 font-semibold text-navy-950">{siteConfig.email}</p>
            <p className="mt-5 text-sm text-slate-500">Office line</p>
            <p className="mt-2 font-semibold text-navy-950">{siteConfig.phone}</p>
          </div>
        </div>
        <ContactForm />
      </div>
    </Container>
  );
}
