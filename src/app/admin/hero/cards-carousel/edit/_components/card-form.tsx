
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { HeroCard } from '@/types/hero-card';
import { upsertHeroCard } from '../../actions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

const heroCardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  imageUrl: z.any().optional(),
  avatarUrl: z.any().optional(),
  imageHint: z.string().optional(),
  avatarHint: z.string().optional(),
});

type FormValues = z.infer<typeof heroCardSchema>;

export function CardForm({ card }: { card: HeroCard | null }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(heroCardSchema),
    defaultValues: {
      name: card?.name || '',
      username: card?.username || '',
      imageHint: card?.imageHint || '',
      avatarHint: card?.avatarHint || '',
    },
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(card?.imageUrl || null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(card?.avatarUrl || null);

  const watchedImage = watch('imageUrl');
  const watchedAvatar = watch('avatarUrl');
  
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

  const onFormSubmit = (data: FormValues) => {
    const formData = new FormData();
    if(card?.id) formData.append('cardId', card.id);
    formData.append('currentImageUrl', card?.imageUrl || '');
    formData.append('currentAvatarUrl', card?.avatarUrl || '');

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]);
      } else if (typeof value === 'string') {
        formData.append(key, value);
      }
    });

    startTransition(async () => {
      const result = await upsertHeroCard(null, formData);
      if (result.success) {
        toast({ title: "Success", description: result.message });
        router.push('/admin/hero/cards-carousel');
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Card className="bg-secondary/30 backdrop-blur-lg border-white/10">
            <CardHeader>
                <CardTitle>Card Details</CardTitle>
                <CardDescription>Provide the content and images for the card.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/hero/cards-carousel')}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                 {isPending ? <><Loader2 className="animate-spin mr-2" /> Saving...</> : "Save Changes"}
              </Button>
            </CardFooter>
        </Card>
      </form>
  );
}
