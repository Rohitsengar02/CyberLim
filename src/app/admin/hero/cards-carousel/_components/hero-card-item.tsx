
"use client";

import Image from 'next/image';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import type { HeroCard } from '@/types/hero-card';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { deleteHeroCard } from '../actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useActionState, useEffect } from 'react';
import Link from 'next/link';

export function HeroCardItem({ card }: { card: HeroCard }) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(deleteHeroCard, { success: false, message: "" });
  
  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
    }
  }, [state, toast]);

  return (
    <Card className="bg-secondary/30 backdrop-blur-lg border-white/10 flex flex-col">
      <CardContent className="p-0 relative aspect-[4/5]">
        <Image
          src={card.imageUrl}
          alt={card.name}
          fill
          className="object-cover rounded-t-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
           <div className="flex items-center gap-3">
              <Image
                src={card.avatarUrl}
                width={40}
                height={40}
                alt={card.name}
                className="rounded-full border-2 border-white/50"
              />
              <div>
                <h3 className="font-bold text-lg text-primary drop-shadow-md">{card.name}</h3>
                <p className="text-sm text-white/80">{card.username}</p>
              </div>
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 bg-secondary/50 border-t border-border flex justify-end gap-2">
        <Button asChild variant="outline" size="icon">
          <Link href={`/admin/hero/cards-carousel/edit?id=${card.id}`}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-secondary/50 backdrop-blur-lg border-border">
             <form action={formAction}>
                <input type="hidden" name="cardId" value={card.id} />
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the card.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit" disabled={isPending}>
                    {isPending ? <><Loader2 className="animate-spin mr-2" /> Deleting...</> : "Delete"}
                </AlertDialogAction>
                </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
