
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
import type { ServicesHeadingConfig } from "@/types/services-heading";
import { updateServicesHeadingConfig } from "../actions";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  heading: z.string().min(1, "Heading is required"),
  paragraph: z.string().min(1, "Paragraph is required"),
  paddingTopDesktop: z.coerce.number().min(0).max(500),
  paddingTopMobile: z.coerce.number().min(0).max(300),
});

type FormValues = z.infer<typeof schema>;

export function HeadingEditor({ initialData }: { initialData: ServicesHeadingConfig }) {
  const [state, formAction, isPending] = useActionState(updateServicesHeadingConfig, {
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
                    <CardTitle>Content & Spacing</CardTitle>
                    <CardDescription>Update the text and vertical alignment of the services section.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-primary">Text Content</legend>
                        <div className="space-y-2">
                            <Label htmlFor="heading">Main Heading</Label>
                            <Textarea id="heading" {...register('heading')} rows={2} className="bg-input/50 border-border" />
                            {errors.heading && <p className="text-sm text-destructive">{errors.heading.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="paragraph">Sub-Paragraph</Label>
                            <Textarea id="paragraph" {...register('paragraph')} rows={4} className="bg-input/50 border-border" />
                            {errors.paragraph && <p className="text-sm text-destructive">{errors.paragraph.message}</p>}
                        </div>
                    </fieldset>

                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-primary">Vertical Spacing</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Top Padding (Desktop): {watchedValues.paddingTopDesktop}px</Label>
                                <Slider min={0} max={300} step={10} value={[watchedValues.paddingTopDesktop]} onValueChange={(v) => setValue('paddingTopDesktop', v[0])}/>
                                <input type="hidden" {...register('paddingTopDesktop')} />
                            </div>
                            <div className="space-y-2">
                                <Label>Top Padding (Mobile): {watchedValues.paddingTopMobile}px</Label>
                                <Slider min={0} max={200} step={10} value={[watchedValues.paddingTopMobile]} onValueChange={(v) => setValue('paddingTopMobile', v[0])}/>
                                <input type="hidden" {...register('paddingTopMobile')} />
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
                </CardHeader>
                <CardContent className="h-[400px] bg-black/20 rounded-lg flex flex-col justify-center text-center overflow-hidden relative p-4">
                    <div className="w-full" style={{ paddingTop: `${watchedValues.paddingTopDesktop}px`}}>
                         <h2 className="text-4xl font-bold text-primary mb-4">
                           {watchedValues.heading}
                         </h2>
                         <p className="text-muted-foreground max-w-md mx-auto">
                           {watchedValues.paragraph}
                         </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
