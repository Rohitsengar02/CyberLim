
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FeaturesLayoutConfig } from "@/types/features-layout";
import { updateFeaturesLayoutConfig } from "../actions";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle } from "lucide-react";

const schema = z.object({
  layoutMode: z.enum(['scroll', 'grid']),
  cardWidthDesktop: z.coerce.number().min(200).max(500),
  cardHeightDesktop: z.coerce.number().min(200).max(500),
  cardWidthMobile: z.coerce.number().min(150).max(400),
  cardHeightMobile: z.coerce.number().min(150).max(500),
  backdropBlur: z.coerce.number().min(0).max(50),
});

type FormValues = z.infer<typeof schema>;

export function LayoutEditor({ initialData }: { initialData: FeaturesLayoutConfig }) {
  const [state, formAction, isPending] = useActionState(updateFeaturesLayoutConfig, {
    success: false,
    message: "",
  });
  const { toast } = useToast();

  const { register, watch, setValue, formState: { errors } } = useForm<FormValues>({
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
            <CardTitle>Layout & Styling</CardTitle>
            <CardDescription>Control the appearance of the feature cards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            
            <fieldset className="space-y-4">
                <legend className="text-lg font-semibold text-primary">Card Dimensions (Desktop)</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Card Width: {watchedValues.cardWidthDesktop}px</Label>
                        <Slider min={200} max={500} step={10} value={[watchedValues.cardWidthDesktop]} onValueChange={(v) => setValue('cardWidthDesktop', v[0])}/>
                        <input type="hidden" {...register('cardWidthDesktop')} />
                    </div>
                    <div className="space-y-2">
                        <Label>Card Height: {watchedValues.cardHeightDesktop}px</Label>
                        <Slider min={200} max={500} step={10} value={[watchedValues.cardHeightDesktop]} onValueChange={(v) => setValue('cardHeightDesktop', v[0])}/>
                        <input type="hidden" {...register('cardHeightDesktop')} />
                    </div>
                </div>
            </fieldset>

            <fieldset className="space-y-4">
                <legend className="text-lg font-semibold text-primary">Card Dimensions (Mobile)</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Card Width: {watchedValues.cardWidthMobile}px</Label>
                        <Slider min={150} max={400} step={10} value={[watchedValues.cardWidthMobile]} onValueChange={(v) => setValue('cardWidthMobile', v[0])}/>
                        <input type="hidden" {...register('cardWidthMobile')} />
                    </div>
                    <div className="space-y-2">
                        <Label>Card Height: {watchedValues.cardHeightMobile}px</Label>
                        <Slider min={150} max={500} step={10} value={[watchedValues.cardHeightMobile]} onValueChange={(v) => setValue('cardHeightMobile', v[0])}/>
                        <input type="hidden" {...register('cardHeightMobile')} />
                    </div>
                </div>
            </fieldset>
            
            <fieldset className="space-y-4">
                <legend className="text-lg font-semibold text-primary">Styling & Behavior</legend>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Glass Effect Blur: {watchedValues.backdropBlur}px</Label>
                        <Slider min={0} max={50} step={1} value={[watchedValues.backdropBlur]} onValueChange={(v) => setValue('backdropBlur', v[0])}/>
                        <input type="hidden" {...register('backdropBlur')} />
                    </div>
                    <div className="space-y-2">
                        <Label>Layout Mode (Coming Soon)</Label>
                         <Select defaultValue={watchedValues.layoutMode} onValueChange={(v) => setValue('layoutMode', v as 'scroll' | 'grid')} disabled>
                            <SelectTrigger className="bg-input/50 border-border">
                                <SelectValue placeholder="Select layout mode" />
                            </SelectTrigger>
                            <SelectContent className="bg-secondary/50 backdrop-blur-lg border-border">
                                <SelectItem value="scroll">Horizontal Scroll</SelectItem>
                                <SelectItem value="grid">Grid</SelectItem>
                            </SelectContent>
                        </Select>
                        <input type="hidden" {...register('layoutMode')} />
                    </div>
                </div>
            </fieldset>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <div className="lg:col-span-1 sticky top-32 space-y-8">
        <Card className="bg-secondary/30 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>Shows a sample card with your styles applied.</CardDescription>
          </CardHeader>
          <CardContent className="h-[450px] bg-black/20 rounded-lg flex items-center justify-center p-4">
            <div
                className="relative rounded-3xl p-8 bg-white/5 border border-white/10 shadow-2xl shadow-black/40"
                style={{
                    width: `${watchedValues.cardWidthDesktop}px`,
                    height: `${watchedValues.cardHeightDesktop}px`,
                    backdropFilter: `blur(${watchedValues.backdropBlur}px)`,
                }}
            >
                <div className="flex flex-col h-full relative z-10">
                    <div className="flex-shrink-0 w-16 h-16 mb-6 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                        <HelpCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Sample Title</h3>
                    <p className="mt-2 text-white/70 text-sm flex-grow">This is a sample description for the feature card preview.</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
