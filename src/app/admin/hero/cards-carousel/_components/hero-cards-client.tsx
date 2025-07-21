
"use client";

import { Plus } from 'lucide-react';
import type { HeroCard } from '@/types/hero-card';
import { Button } from '@/components/ui/button';
import { HeroCardItem } from './hero-card-item';
import Link from 'next/link';

export function HeroCardsClient({ initialCards }: { initialCards: HeroCard[] }) {

  return (
    <>
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/hero/cards-carousel/edit">
            <Plus className="mr-2" /> Add New Card
          </Link>
        </Button>
      </div>
      
      {initialCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {initialCards.map((card) => (
            <HeroCardItem key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-lg border-2 border-dashed border-border">
            <h3 className="text-xl font-semibold text-primary">No cards found.</h3>
            <p className="text-muted-foreground mt-2">Get started by adding a new card.</p>
        </div>
      )}
    </>
  );
}
