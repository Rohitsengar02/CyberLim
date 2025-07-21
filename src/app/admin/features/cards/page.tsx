
import { getFeatureCards } from '@/lib/data';
import { FeatureCardsClient } from './_components/feature-cards-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CardsAdminPage() {
  const cards = await getFeatureCards();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
            <Link href="/admin/features">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
            </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold text-primary">Manage Feature Cards</h1>
            <p className="text-muted-foreground">
            Add, edit, or remove the cards that appear in the features section.
            </p>
        </div>
      </div>
      <FeatureCardsClient initialCards={cards} />
    </div>
  );
}
