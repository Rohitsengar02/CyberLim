
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActionState, useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { HeroCard } from '@/types/hero-card';
import { upsertHeroCard } from '../actions';

const heroCardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  imageUrl: z.any().optional(),
  avatarUrl: z.any().optional(),
  imageHint: z.string().optional(),
  avatarHint: z.string().optional(),
});

type FormValues = z.infer<typeof heroCardSchema>;

export function CardFormDialog({ isOpen, onClose, card }: { isOpen: boolean; onClose: () => void; card: HeroCard | null }) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(upsertHeroCard, { success: false, message: '' });
  const isEditing = !!card;

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(heroCardSchema),
    defaultValues: {
      name: '',
      username: '',
      imageHint: '',
      avatarHint: '',
    },
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const watchedImage = watch('imageUrl');
  const watchedAvatar = watch('avatarUrl');

  useEffect(() => {
    if (isOpen) {
      if (card) {
        reset({
          name: card.name,
          username: card.username,
          imageHint: card.imageHint,
          avatarHint: card.avatarHint,
        });
        setImagePreview(card.imageUrl);
        setAvatarPreview(card.avatarUrl);
      } else {
        reset({
          name: '',
          username: '',
          imageHint: '',
          avatarHint: '',
        });
        setImagePreview(null);
        setAvatarPreview(null);
      }
    }
  }, [card, reset, isOpen]);
  
   useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      const url = URL.createObjectURL(watchedImage[0]);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchedImage]);

  useEffect(() => {
    if (watchedAvatar && watchedAvatar[0]) {
      const url = URL.createObjectURL(watchedAvatar[0]);
      setAvatarPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchedAvatar]);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success) {
        onClose();
      }
    }
  }, [state, toast, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-secondary/50 backdrop-blur-lg border-border">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Card' : 'Add New Card'}</DialogTitle>
          <DialogDescription>
            Fill in the details for the hero carousel card.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
            <input type="hidden" name="cardId" value={card?.id || ''} />
             <input type="hidden" name="currentImageUrl" value={card?.imageUrl || ''} />
             <input type="hidden" name="currentAvatarUrl" value={card?.avatarUrl || ''} />
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register('name')} className="bg-input/50 border-border" />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" {...register('username')} className="bg-input/50 border-border" />
                    {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="imageHint">Image Hint</Label>
                    <Input id="imageHint" {...register('imageHint')} placeholder="e.g. man portrait" className="bg-input/50 border-border" />
                    <p className="text-xs text-muted-foreground">AI hint for image search. Max 2 words.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="avatarHint">Avatar Hint</Label>
                    <Input id="avatarHint" {...register('avatarHint')} placeholder="e.g. woman face" className="bg-input/50 border-border" />
                    <p className="text-xs text-muted-foreground">AI hint for image search. Max 2 words.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="imageUrl">Main Image</Label>
                    <Input id="imageUrl" type="file" accept="image/*" {...register('imageUrl')} className="bg-input/50 border-border file:text-foreground" />
                    {imagePreview && <Image src={imagePreview} alt="Image preview" width={100} height={125} className="mt-2 rounded-md object-cover"/>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Avatar Image</Label>
                    <Input id="avatarUrl" type="file" accept="image/*" {...register('avatarUrl')} className="bg-input/50 border-border file:text-foreground" />
                    {avatarPreview && <Image src={avatarPreview} alt="Avatar preview" width={40} height={40} className="mt-2 rounded-full object-cover"/>}
                </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                 {isPending ? <><Loader2 className="animate-spin mr-2" /> Saving...</> : "Save Changes"}
              </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
