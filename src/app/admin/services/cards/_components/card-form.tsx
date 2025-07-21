
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { IconPickerDialog } from '@/app/admin/features/cards/_components/icon-picker-dialog';
import { Icon } from '@/lib/icons';
import type { ServiceCard } from '@/types/service-card';
import { upsertServiceCard } from '../actions';

const serviceCardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  iconName: z.string().min(1, "An icon is required"),
});

type FormValues = z.infer<typeof serviceCardSchema>;

export function CardForm({ card }: { card: ServiceCard | null }) {
  const { toast } = useToast();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(upsertServiceCard, { success: false, message: '' });
  const [isPickerOpen, setPickerOpen] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(serviceCardSchema),
    defaultValues: {
      title: card?.title || '',
      subtitle: card?.subtitle || '',
      description: card?.description || '',
      iconName: card?.iconName || 'Lightbulb',
    },
  });

  const selectedIconName = watch('iconName');

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        // The redirect in the action will handle this
      } else {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state, toast]);

  const handleIconSelect = (iconName: string) => {
    setValue('iconName', iconName, { shouldValidate: true });
    setPickerOpen(false);
  };

  return (
    <>
      <form action={formAction}>
        <Card className="bg-secondary/30 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle>Service Card Details</CardTitle>
            <CardDescription>Provide the content and icon for the service card.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <input type="hidden" name="cardId" value={card?.id || ''} />
              <input type="hidden" {...register('iconName')} />

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register('title')} className="bg-input/50 border-border" />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input id="subtitle" {...register('subtitle')} className="bg-input/50 border-border" />
                {errors.subtitle && <p className="text-sm text-destructive">{errors.subtitle.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Use 🔹 for bullet points)</Label>
                <Textarea id="description" {...register('description')} rows={4} className="bg-input/50 border-border" />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>
            </div>
            
            <div className="md:col-span-1 space-y-2">
                <Label>Icon</Label>
                <div className="p-4 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-4">
                    <div className="w-24 h-24 bg-background/50 rounded-xl flex items-center justify-center">
                        <Icon name={selectedIconName} className="w-12 h-12 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{selectedIconName}</span>
                     <Button type="button" variant="outline" onClick={() => setPickerOpen(true)}>Change Icon</Button>
                     {errors.iconName && <p className="text-sm text-destructive">{errors.iconName.message}</p>}
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/services/cards')}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <><Loader2 className="animate-spin mr-2" /> Saving...</> : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
      <IconPickerDialog 
        isOpen={isPickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleIconSelect}
        currentIcon={selectedIconName}
      />
    </>
  );
}
