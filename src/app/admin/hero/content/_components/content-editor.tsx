
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { HeroContentConfig } from "@/types/hero-content";
import { updateHeroContentConfig } from "../actions";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

const heroContentSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  paragraph: z.string().min(1, "Paragraph is required"),
  headingFontSizeDesktop: z.coerce.number().min(10).max(200),
  headingFontSizeMobile: z.coerce.number().min(10).max(100),
  paragraphFontSizeDesktop: z.coerce.number().min(8).max(50),
  paragraphFontSizeMobile: z.coerce.number().min(8).max(40),
  glassWidthDesktop: z.string().min(1, "Required"),
  glassHeightDesktop: z.string().min(1, "Required"),
  glassWidthMobile: z.string().min(1, "Required"),
  glassHeightMobile: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof heroContentSchema>;

export function ContentEditor({ initialData }: { initialData: HeroContentConfig }) {
  const [state, formAction, isPending] = useActionState(updateHeroContentConfig, {
    success: false,
    message: "",
  });
  const { toast } = useToast();

  const { register, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(heroContentSchema),
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
        <div className="lg:col-span-2 space-y-8">
            <form action={formAction}>
                <Card className="bg-secondary/30 backdrop-blur-lg border-white/10">
                    <CardHeader>
                        <CardTitle>Hero Content & Styling</CardTitle>
                        <CardDescription>Update the text and visual properties of the main hero section.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Text Content */}
                        <fieldset className="space-y-4">
                            <legend className="text-lg font-semibold text-primary">Text Content</legend>
                            <div className="space-y-2">
                                <Label htmlFor="heading">Main Heading</Label>
                                <Textarea id="heading" {...register('heading')} rows={3} className="bg-input/50 border-border" />
                                <p className="text-xs text-muted-foreground">Use a new line to create line breaks in the heading.</p>
                                {errors.heading && <p className="text-sm text-destructive">{errors.heading.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="paragraph">Sub-Paragraph</Label>
                                <Textarea id="paragraph" {...register('paragraph')} rows={4} className="bg-input/50 border-border" />
                                {errors.paragraph && <p className="text-sm text-destructive">{errors.paragraph.message}</p>}
                            </div>
                        </fieldset>

                        {/* Font Sizes */}
                        <fieldset className="space-y-4">
                            <legend className="text-lg font-semibold text-primary">Typography</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Heading Font Size (Desktop): {watchedValues.headingFontSizeDesktop}px</Label>
                                    <Slider min={24} max={120} step={1} value={[watchedValues.headingFontSizeDesktop]} onValueChange={(v) => setValue('headingFontSizeDesktop', v[0])}/>
                                    <input type="hidden" {...register('headingFontSizeDesktop')} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Heading Font Size (Mobile): {watchedValues.headingFontSizeMobile}px</Label>
                                    <Slider min={20} max={60} step={1} value={[watchedValues.headingFontSizeMobile]} onValueChange={(v) => setValue('headingFontSizeMobile', v[0])}/>
                                    <input type="hidden" {...register('headingFontSizeMobile')} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Paragraph Font Size (Desktop): {watchedValues.paragraphFontSizeDesktop}px</Label>
                                    <Slider min={10} max={24} step={1} value={[watchedValues.paragraphFontSizeDesktop]} onValueChange={(v) => setValue('paragraphFontSizeDesktop', v[0])}/>
                                    <input type="hidden" {...register('paragraphFontSizeDesktop')} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Paragraph Font Size (Mobile): {watchedValues.paragraphFontSizeMobile}px</Label>
                                    <Slider min={10} max={20} step={1} value={[watchedValues.paragraphFontSizeMobile]} onValueChange={(v) => setValue('paragraphFontSizeMobile', v[0])}/>
                                    <input type="hidden" {...register('paragraphFontSizeMobile')} />
                                </div>
                            </div>
                        </fieldset>

                        {/* Glass Effect */}
                        <fieldset className="space-y-4">
                            <legend className="text-lg font-semibold text-primary">Glass Effect Dimensions</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Width (Desktop)</Label>
                                    <Input {...register('glassWidthDesktop')} placeholder="e.g., 50%" className="bg-input/50 border-border" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Height (Desktop)</Label>
                                    <Input {...register('glassHeightDesktop')} placeholder="e.g., 60%" className="bg-input/50 border-border" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Width (Mobile)</Label>
                                    <Input {...register('glassWidthMobile')} placeholder="e.g., 95%" className="bg-input/50 border-border" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Height (Mobile)</Label>
                                    <Input {...register('glassHeightMobile')} placeholder="e.g., 40%" className="bg-input/50 border-border" />
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
            <Card className="bg-secondary/30 backdrop-blur-lg border-white/10">
                <CardHeader>
                    <CardTitle>Current Saved Data</CardTitle>
                    <CardDescription>This is the raw data currently stored in Firestore. Click the button to revert any unsaved changes in the form above.</CardDescription>
                </CardHeader>
                <CardContent>
                    <pre className="p-4 bg-black/20 rounded-md text-xs text-white/80 overflow-x-auto">
                        {JSON.stringify(initialData, null, 2)}
                    </pre>
                </CardContent>
                <CardFooter>
                    <Button type="button" variant="outline" onClick={() => reset(initialData)}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset Form to Saved State
                    </Button>
                </CardFooter>
            </Card>
        </div>

        <div className="lg:col-span-1 sticky top-24 space-y-8">
            <Card className="bg-secondary/30 backdrop-blur-lg border-white/10">
                <CardHeader>
                    <CardTitle>Live Preview (Desktop)</CardTitle>
                </CardHeader>
                <CardContent className="h-[500px] bg-black/20 rounded-lg flex items-center justify-center overflow-hidden relative">
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/10 backdrop-blur-sm rounded-3xl border border-white/5"
                        style={{
                            width: watchedValues.glassWidthDesktop,
                            height: watchedValues.glassHeightDesktop,
                        }}
                    />
                    <div className="relative text-center w-full p-4">
                        <h1 className="font-headline font-extrabold text-primary leading-tight break-words" style={{ fontSize: `${watchedValues.headingFontSizeDesktop}px` }}>
                            {watchedValues.heading.split('\n').map((line, i) => <span key={i} className="block">{line}</span>)}
                        </h1>
                        <p className="mt-2 text-white max-w-sm mx-auto" style={{ fontSize: `${watchedValues.paragraphFontSizeDesktop}px` }}>
                            {watchedValues.paragraph}
                        </p>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-secondary/30 backdrop-blur-lg border-white/10">
                <CardHeader>
                    <CardTitle>Live Preview (Mobile)</CardTitle>
                </CardHeader>
                <CardContent className="h-[500px] w-full max-w-[320px] mx-auto bg-black/20 rounded-lg flex items-center justify-center overflow-hidden relative border-2 border-border">
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/10 backdrop-blur-sm rounded-3xl border border-white/5"
                        style={{
                            width: watchedValues.glassWidthMobile,
                            height: watchedValues.glassHeightMobile,
                        }}
                    />
                    <div className="relative text-center w-full p-4">
                        <h1 className="font-headline font-extrabold text-primary leading-tight break-words" style={{ fontSize: `${watchedValues.headingFontSizeMobile}px` }}>
                            {watchedValues.heading.split('\n').map((line, i) => <span key={i} className="block">{line}</span>)}
                        </h1>
                        <p className="mt-2 text-white max-w-sm mx-auto" style={{ fontSize: `${watchedValues.paragraphFontSizeMobile}px` }}>
                            {watchedValues.paragraph}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
