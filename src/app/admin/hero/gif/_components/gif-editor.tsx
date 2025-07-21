
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useActionState, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateHeroAnimationConfig } from "../actions";
import type { HeroAnimationConfig } from "@/types/hero-animation";
import { Slider } from "@/components/ui/slider";

const heroAnimationSchema = z.object({
  gifUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  gifFile: z.any().optional(),
  desktopScale: z.number().min(0.1).max(5),
  mobileScale: z.number().min(0.1).max(5),
});

type FormValues = z.infer<typeof heroAnimationSchema>;

export function GifEditor({ initialData }: { initialData: HeroAnimationConfig }) {
  const [state, formAction, isPending] = useActionState(updateHeroAnimationConfig, {
    success: false,
    message: "",
  });
  const { toast } = useToast();

  const { register, watch, setValue, getValues, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(heroAnimationSchema),
    defaultValues: {
      gifUrl: initialData.gifUrl,
      desktopScale: initialData.desktopScale,
      mobileScale: initialData.mobileScale,
    },
  });
  
  const watchedGifUrl = watch('gifUrl');
  const watchedGifFile = watch('gifFile');
  const watchedDesktopScale = watch('desktopScale');
  const watchedMobileScale = watch('mobileScale');

  const [previewUrl, setPreviewUrl] = useState(initialData.gifUrl);
  
  useEffect(() => {
      if (watchedGifFile && watchedGifFile[0]) {
          const url = URL.createObjectURL(watchedGifFile[0]);
          setPreviewUrl(url);
          return () => URL.revokeObjectURL(url);
      } else {
          setPreviewUrl(watchedGifUrl || initialData.gifUrl);
      }
  }, [watchedGifUrl, watchedGifFile, initialData.gifUrl]);

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
                    <CardTitle>GIF Configuration</CardTitle>
                    <CardDescription>Upload a new GIF or provide a URL, and set the display scale.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <input type="hidden" name="currentGifUrl" value={initialData.gifUrl} />
                    <div className="space-y-2">
                        <Label htmlFor="gifFile">Upload GIF</Label>
                        <Input id="gifFile" type="file" accept="image/gif" {...register('gifFile')} className="bg-input/50 border-border file:text-foreground" />
                        <p className="text-xs text-muted-foreground">This will override the URL field if a file is chosen.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gifUrl">Or Paste GIF URL</Label>
                        <Input id="gifUrl" {...register('gifUrl')} placeholder="https://example.com/animation.gif" className="bg-input/50 border-border" />
                        {errors.gifUrl && <p className="text-sm text-destructive">{errors.gifUrl.message}</p>}
                    </div>
                    
                    <div className="space-y-4">
                        <Label htmlFor="desktopScale">Desktop Scale: {watchedDesktopScale.toFixed(1)}</Label>
                        <Slider 
                            id="desktopScale"
                            min={0.5}
                            max={3}
                            step={0.1}
                            value={[watchedDesktopScale]}
                            onValueChange={(value) => setValue('desktopScale', value[0], { shouldValidate: true })}
                        />
                         <input type="hidden" {...register('desktopScale')} />
                    </div>
                    
                    <div className="space-y-4">
                        <Label htmlFor="mobileScale">Mobile Scale: {watchedMobileScale.toFixed(1)}</Label>
                        <Slider 
                            id="mobileScale"
                            min={0.5}
                            max={3}
                            step={0.1}
                            value={[watchedMobileScale]}
                            onValueChange={(value) => setValue('mobileScale', value[0], { shouldValidate: true })}
                        />
                        <input type="hidden" {...register('mobileScale')} />
                    </div>

                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </form>

        <Card className="lg:col-span-1 bg-secondary/30 backdrop-blur-lg border-white/10 sticky top-24">
            <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>A scaled preview of the animation.</CardDescription>
            </CardHeader>
            <CardContent>
                {previewUrl ? (
                     <div className="relative w-full h-64 bg-black/20 rounded-lg flex items-center justify-center overflow-hidden">
                        <Image src={previewUrl} alt="GIF Preview" layout="fill" objectFit="contain" unoptimized />
                    </div>
                ) : (
                    <div className="w-full h-64 bg-black/20 rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">No GIF to preview</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
