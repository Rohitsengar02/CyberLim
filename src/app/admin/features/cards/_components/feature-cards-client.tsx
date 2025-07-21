
"use client";

import { Plus, Sparkles } from 'lucide-react';
import type { FeatureCard } from '@/types/feature-card';
import { Button } from '@/components/ui/button';
import { FeatureCardItem } from './feature-card-item';
import Link from 'next/link';
import { useState } from 'react';
import { GenerateAIDialog } from './generate-ai-dialog';

export function FeatureCardsClient({ initialCards }: { initialCards: FeatureCard[] }) {
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsAiDialogOpen(true)}>
          <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
        </Button>
        <Button asChild>
          <Link href="/admin/features/cards/edit">
            <Plus className="mr-2" /> Add New Card
          </Link>
        </Button>
      </div>
      
      {initialCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {initialCards.map((card) => (
            <FeatureCardItem key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-lg border-2 border-dashed border-border">
            <h3 className="text-xl font-semibold text-primary">No cards found.</h3>
            <p className="text-muted-foreground mt-2">Get started by adding a new feature card or generating them with AI.</p>
        </div>
      )}
      
      <GenerateAIDialog 
        isOpen={isAiDialogOpen}
        onClose={() => setIsAiDialogOpen(false)}
      />
    </>
  );
}
