
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActionState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { generateProjectDetailsAction } from '../../actions';
import { Textarea } from '@/components/ui/textarea';
import type { GenerateProjectOutput } from '@/ai/flows/generate-project-details-flow';

const generateSchema = z.object({
  prompt: z.string().min(10, "Project prompt must be at least 10 characters.").max(500, "Prompt is too long."),
});

type FormValues = z.infer<typeof generateSchema>;

interface GenerateContentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onDataGenerated: (data: GenerateProjectOutput) => void;
}

export function GenerateContentDialog({ isOpen, onClose, onDataGenerated }: GenerateContentDialogProps) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(generateProjectDetailsAction, { success: false, message: '', data: null });
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      prompt: 'A cutting-edge AI-powered analytics platform for e-commerce businesses.'
    },
  });

  useEffect(() => {
    if (state.success && state.data) {
        onDataGenerated(state.data);
        reset();
        onClose();
    } else if (!state.success && state.message) {
        toast({
            title: "Error",
            description: state.message,
            variant: "destructive",
        });
    }
  }, [state, toast, onClose, reset, onDataGenerated]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-secondary/50 backdrop-blur-lg border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Sparkles className="text-accent" /> Generate Project Content with AI</DialogTitle>
          <DialogDescription>
            Describe the project you want to create, and let AI generate a full case study for you.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="prompt">Project Prompt</Label>
                    <Textarea id="prompt" {...register('prompt')} rows={4} placeholder="e.g., A decentralized social media platform that prioritizes user privacy..." className="bg-input/50 border-border" />
                    <p className="text-xs text-muted-foreground">The AI will use this to generate all text content, including title, description, features, tech stack, and more.</p>
                    {errors.prompt && <p className="text-sm text-destructive">{errors.prompt.message}</p>}
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
