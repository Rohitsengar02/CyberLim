
"use client";

import { Plus } from 'lucide-react';
import type { ServiceCard } from '@/types/service-card';
import { Button } from '@/components/ui/button';
import { ServiceCardItem } from './service-card-item';
import Link from 'next/link';

export function ServicesCardsClient({ initialCards }: { initialCards: ServiceCard[] }) {

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button asChild>
          <Link href="/admin/services/cards/edit">
            <Plus className="mr-2" /> Add New Card
          </Link>
        </Button>
      </div>
      
      {initialCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {initialCards.map((card) => (
            <ServiceCardItem key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-lg border-2 border-dashed border-border">
            <h3 className="text-xl font-semibold text-primary">No service cards found.</h3>
            <p className="text-muted-foreground mt-2">Get started by adding a new service card.</p>
        </div>
      )}
    </>
  );
}
