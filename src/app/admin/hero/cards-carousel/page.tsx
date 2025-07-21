
import { getHeroCards } from '@/lib/data';
import { HeroCardsClient } from './_components/hero-cards-client';

export const dynamic = 'force-dynamic';

export default async function CardsCarouselAdminPage() {
  const cards = await getHeroCards();

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Manage Hero Carousel Cards</h1>
        <p className="text-muted-foreground">
          Add, edit, or remove the cards that appear in the animated hero section carousel.
        </p>
      </div>
      <HeroCardsClient initialCards={cards} />
    </div>
  );
}
