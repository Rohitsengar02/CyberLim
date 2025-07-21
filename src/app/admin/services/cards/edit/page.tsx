
import { getServiceCardById } from '@/lib/data';
import { CardForm } from '../_components/card-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function EditServiceCardPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const cardId = searchParams.id;
  const card = cardId ? await getServiceCardById(cardId) : null;
  
  if (cardId && !card) {
      return <div>Card not found.</div>
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/services/cards">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold text-primary">{card ? 'Edit Service Card' : 'Create New Card'}</h1>
            <p className="text-muted-foreground">
            {card ? 'Update the details for this card.' : 'Fill in the details for the new service card.'}
            </p>
        </div>
      </div>
      <CardForm card={card} />
    </div>
  );
}
