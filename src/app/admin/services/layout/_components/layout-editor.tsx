
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ServicesLayoutConfig } from '@/types/services-layout';
import { updateServicesLayoutConfig } from '../actions';
import { Label } from '@/components/ui/label';

const schema = z.object({
  layout: z.enum(['bento', 'grid', 'carousel']),
});

type FormValues = z.infer<typeof schema>;

export function LayoutEditor({ initialLayout }: { initialLayout: ServicesLayoutConfig }) {
  const [state, formAction, isPending] = useActionState(updateServicesLayoutConfig, {
    success: false,
    message: "",
  });
  const { toast } = useToast();

  const { watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      layout: initialLayout.layout,
    },
  });

  const selectedLayout = watch('layout');

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
    <div className="flex flex-col gap-8">
      <form action={formAction}>
        <Card className="bg-secondary/30 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle>Services Section Layout</CardTitle>
            <CardDescription>Choose how the service cards are displayed on your homepage.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-xs space-y-2">
                <Label htmlFor="layout-select">Layout Style</Label>
                <Select value={selectedLayout} onValueChange={(value) => setValue('layout', value as 'bento' | 'grid' | 'carousel')}>
                    <SelectTrigger id="layout-select" className="bg-input/50 border-border">
                        <SelectValue placeholder="Select layout..." />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary/50 backdrop-blur-lg border-border">
                        <SelectItem value="bento">Bento Grid</SelectItem>
                        <SelectItem value="grid">Simple Grid</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                    </SelectContent>
                </Select>
                <input type="hidden" name="layout" value={selectedLayout} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button type="submit" disabled={isPending}>
              {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Layout...</> : "Save Layout"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
