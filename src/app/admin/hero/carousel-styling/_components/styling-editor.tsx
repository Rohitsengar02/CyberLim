
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useActionState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import type { HeroCarouselConfig } from "@/types/hero-carousel-config";
import { updateHeroCarouselConfig } from "../actions";
import { Label } from "@/components/ui/label";

const schema = z.object({
  cardWidthDesktop: z.coerce.number().min(100).max(500),
  cardHeightDesktop: z.coerce.number().min(100).max(700),
  cardWidthMobile: z.coerce.number().min(50).max(300),
  cardHeightMobile: z.coerce.number().min(80).max(500),
});

type FormValues = z.infer<typeof schema>;

export function StylingEditor({ initialData }: { initialData: HeroCarouselConfig }) {
  const [state, formAction, isPending] = useActionState(updateHeroCarouselConfig, {
    success: false,
    message: "",
  });
  const { toast } = useToast();

  const { register, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  const watchedValues = watch();

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <form action={formAction} className="lg:col-span-2">
        <Card className="bg-secondary/30 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle>Card Dimensions</CardTitle>
            <CardDescription>Control the size of the cards in the hero carousel animation.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 pt-4">
            <div className="space-y-4">
                <Label>Card Width (Desktop): {watchedValues.cardWidthDesktop}px</Label>
                <Slider min={100} max={400} step={10} value={[watchedValues.cardWidthDesktop]} onValueChange={(v) => setValue('cardWidthDesktop', v[0])}/>
                <input type="hidden" {...register('cardWidthDesktop')} />
            </div>
            <div className="space-y-4">
                <Label>Card Height (Desktop): {watchedValues.cardHeightDesktop}px</Label>
                <Slider min={150} max={600} step={10} value={[watchedValues.cardHeightDesktop]} onValueChange={(v) => setValue('cardHeightDesktop', v[0])}/>
                <input type="hidden" {...register('cardHeightDesktop')} />
            </div>
            <div className="space-y-4">
                <Label>Card Width (Mobile): {watchedValues.cardWidthMobile}px</Label>
                <Slider min={100} max={300} step={10} value={[watchedValues.cardWidthMobile]} onValueChange={(v) => setValue('cardWidthMobile', v[0])}/>
                <input type="hidden" {...register('cardWidthMobile')} />
            </div>
            <div className="space-y-4">
                <Label>Card Height (Mobile): {watchedValues.cardHeightMobile}px</Label>
                <Slider min={150} max={450} step={10} value={[watchedValues.cardHeightMobile]} onValueChange={(v) => setValue('cardHeightMobile', v[0])}/>
                <input type="hidden" {...register('cardHeightMobile')} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <div className="lg:col-span-1 sticky top-24 space-y-8">
        <Card className="bg-secondary/30 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle>Desktop Preview</CardTitle>
          </CardHeader>
          <CardContent className="h-[500px] bg-black/20 rounded-lg flex items-center justify-center overflow-hidden p-4">
            <div
              className="relative bg-card/60 rounded-2xl shadow-2xl overflow-hidden border border-white/10 shrink-0"
              style={{
                width: `${watchedValues.cardWidthDesktop}px`,
                height: `${watchedValues.cardHeightDesktop}px`,
              }}
            >
              <Image src="https://placehold.co/400x600.png" alt="preview" fill className="object-cover" data-ai-hint="placeholder" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle>Mobile Preview</CardTitle>
          </CardHeader>
          <CardContent className="h-[500px] bg-black/20 rounded-lg flex items-center justify-center overflow-hidden p-4">
             <div
              className="relative bg-card/60 rounded-2xl shadow-2xl overflow-hidden border border-white/10 shrink-0"
              style={{
                width: `${watchedValues.cardWidthMobile}px`,
                height: `${watchedValues.cardHeightMobile}px`,
              }}
            >
              <Image src="https://placehold.co/300x450.png" alt="preview" fill className="object-cover" data-ai-hint="placeholder" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
