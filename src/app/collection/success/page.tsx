import { Badge } from '@/components/shared/badge';
import { Container } from '@/components/shared/container';
import { CollectionSuccessCard } from '@/components/collection/collection-success-card';

export const dynamic = 'force-dynamic';

export default async function CollectionSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ purchaseId?: string }>;
}) {
  const { purchaseId } = await searchParams;

  return (
    <Container className="py-16 sm:py-20">
      <div className="mb-10 space-y-4">
        <Badge>Growth Library</Badge>
        <h1 className="font-display text-5xl tracking-tight text-navy-950 sm:text-6xl">Your payment is confirmed</h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-600">
          We are preparing your premium handbook now and sending it by email. This page updates automatically.
        </p>
      </div>
      {purchaseId ? (
        <CollectionSuccessCard purchaseId={purchaseId} />
      ) : (
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
          Missing purchase ID. Please return to your confirmation link.
        </div>
      )}
    </Container>
  );
}
