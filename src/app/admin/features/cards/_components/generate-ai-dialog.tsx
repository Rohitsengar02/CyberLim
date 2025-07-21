
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActionState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { generateAndSaveFeatureCards } from '../actions';
import { Textarea } from '@/components/ui/textarea';

const generateSchema = z.object({
  count: z.coerce.number().int().min(1, "Must generate at least 1 card.").max(8, "Cannot generate more than 8 cards at a time."),
  context: z.string().min(10, "Project context must be at least 10 characters.").max(500, "Context is too long."),
});

type FormValues = z.infer<typeof generateSchema>;

export function GenerateAIDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(generateAndSaveFeatureCards, { success: false, message: '' });
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      count: 3,
      context: 'A cutting-edge AI-powered analytics platform for e-commerce businesses.'
    },
  });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success) {
        reset();
        onClose();
      }
    }
  }, [state, toast, onClose, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-secondary/50 backdrop-blur-lg border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Sparkles className="text-accent" /> Generate Cards with AI</DialogTitle>
          <DialogDescription>
            Describe your project, and let AI generate relevant feature cards for you.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="count">Number of Cards (1-8)</Label>
                    <Input id="count" type="number" min="1" max="8" {...register('count')} className="bg-input/50 border-border" />
                    {errors.count && <p className="text-sm text-destructive">{errors.count.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="context">Project Context</Label>
                    <Textarea id="context" {...register('context')} rows={4} placeholder="e.g., A decentralized social media platform that prioritizes user privacy..." className="bg-input/50 border-border" />
                    <p className="text-xs text-muted-foreground">Provide a brief description of the project or website.</p>
                    {errors.context && <p className="text-sm text-destructive">{errors.context.message}</p>}
                </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                 {isPending ? <><Loader2 className="animate-spin mr-2" /> Generating...</> : "Generate"}
              </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
