import { ButtonLink } from "@/components/shared/button";
import { Container } from "@/components/shared/container";

export default function NotFoundPage() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">404</p>
      <h1 className="mt-4 font-display text-6xl text-navy-950">Page not found</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
        The page you requested could not be found. You can return to the homepage or start a new report.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/categories" variant="secondary">
          Create a report
        </ButtonLink>
      </div>
    </Container>
  );
}
