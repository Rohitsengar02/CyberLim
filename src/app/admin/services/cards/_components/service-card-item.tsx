
"use client";

import { Edit, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { deleteServiceCard } from '../actions';
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
import type { ServiceCard } from '@/types/service-card';
import { Icon } from '@/lib/icons';

export function ServiceCardItem({ card }: { card: ServiceCard }) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(deleteServiceCard, { success: false, message: "" });
  
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
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex-1">
          <CardTitle className="text-xl font-semibold text-primary">{card.title}</CardTitle>
          {card.subtitle && <p className="text-sm text-muted-foreground pt-1">{card.subtitle}</p>}
        </div>
        <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center flex-shrink-0 ml-4">
            <Icon name={card.iconName} className="w-6 h-6 text-accent" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{card.description}</p>
      </CardContent>
      <CardFooter className="p-3 bg-secondary/50 border-t border-border flex justify-end gap-2">
        <Button asChild variant="outline" size="icon">
          <Link href={`/admin/services/cards/edit?id=${card.id}`}>
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
                    This action cannot be undone. This will permanently delete the service card.
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
