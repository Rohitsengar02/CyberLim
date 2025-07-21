
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActionState, useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { generateProjectImageAction } from '../../actions';
import { Textarea } from '@/components/ui/textarea';

const generateSchema = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters.").max(500, "Prompt is too long."),
});

type FormValues = z.infer<typeof generateSchema>;

interface GenerateImageDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onImageGenerated: (imageUrl: string) => void;
}

export function GenerateImageDialog({ isOpen, onClose, onImageGenerated }: GenerateImageDialogProps) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(generateProjectImageAction, { success: false, message: '', data: null });
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      prompt: 'futuristic user interface for a data analytics dashboard, dark mode, glowing neon accents'
    },
  });

  useEffect(() => {
    if (state.success && state.data?.imageUrl) {
        setGeneratedImageUrl(state.data.imageUrl);
    } else if (!state.success && state.message) {
        toast({
            title: "Generation Failed",
            description: state.message,
            variant: "destructive",
        });
    }
  }, [state, toast]);

  const handleDialogClose = () => {
    reset();
    setGeneratedImageUrl(null);
    onClose();
  }

  const handleAddImage = () => {
    if (generatedImageUrl) {
      onImageGenerated(generatedImageUrl);
      handleDialogClose();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="sm:max-w-[500px] bg-secondary/50 backdrop-blur-lg border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Sparkles className="text-accent" /> Generate Image with AI</DialogTitle>
          <DialogDescription>
            Describe the image you want to create. Be as descriptive as possible for the best results.
          </DialogDescription>
        </DialogHeader>

        {generatedImageUrl ? (
            <div className="space-y-4">
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border">
                    <Image src={generatedImageUrl} alt="AI Generated Image" layout="fill" className="object-cover" />
                </div>
                <p className="text-sm text-muted-foreground">Happy with the result? Add it to your gallery or try a new prompt.</p>
                <DialogFooter className="gap-2 sm:justify-between">
                    <Button type="button" variant="outline" onClick={() => setGeneratedImageUrl(null)}>
                        <Wand2 className="mr-2 h-4 w-4" /> Try Another Prompt
                    </Button>
                    <Button type="button" onClick={handleAddImage}>Add to Gallery</Button>
                </DialogFooter>
            </div>
        ) : (
            <form action={formAction}>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="prompt">Image Prompt</Label>
                        <Textarea id="prompt" {...register('prompt')} rows={4} placeholder="e.g., A photorealistic image of a futuristic city skyline at dusk..." className="bg-input/50 border-border" />
                        {errors.prompt && <p className="text-sm text-destructive">{errors.prompt.message}</p>}
                    </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleDialogClose}>Cancel</Button>
                  <Button type="submit" disabled={isPending}>
                     {isPending ? <><Loader2 className="animate-spin mr-2" /> Generating...</> : "Generate"}
                  </Button>
                </DialogFooter>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
