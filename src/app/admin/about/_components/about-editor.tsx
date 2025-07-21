
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
import { Textarea } from "@/components/ui/textarea";
import { updateAboutUsConfig } from "../actions";
import type { AboutUsContentConfig } from "@/types/about-us-content";

const aboutSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  description: z.string().min(1, "Description is required"),
  missionStatement: z.string().min(1, "Mission statement is required"),
  coreValues: z.string().min(1, "Core values are required"),
  whyChooseUs: z.string().min(1, "Why Choose Us section is required"),
  ctaHeading: z.string().min(1, "CTA Heading is required"),
  imageUrl: z.any().optional(),
});

type FormValues = z.infer<typeof aboutSchema>;

export function AboutEditor({ initialData }: { initialData: AboutUsContentConfig }) {
  const [state, formAction, isPending] = useActionState(updateAboutUsConfig, {
    success: false,
    message: "",
  });
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState(initialData.imageUrl);
  
  const {
    register,
    handleSubmit,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
        heading: initialData.heading,
        description: initialData.description,
        missionStatement: initialData.missionStatement,
        coreValues: initialData.coreValues.join('\n'),
        whyChooseUs: initialData.whyChooseUs.join('\n'),
        ctaHeading: initialData.ctaHeading,
    },
  });
  
  const imageFile = watch("imageUrl");

  useEffect(() => {
    if (imageFile && imageFile[0]) {
      const url = URL.createObjectURL(imageFile[0]);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

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
    <form action={formAction}>
        <Card className="bg-secondary/30 backdrop-blur-lg border-white/10">
            <CardHeader>
                <CardTitle>About Us Section Editor</CardTitle>
                <CardDescription>Update the content and image for your "About Us" section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="heading">Heading</Label>
                    <Input id="heading" {...register('heading')} className="bg-input/50 border-border" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Introductory Description</Label>
                    <Textarea id="description" {...register('description')} rows={4} className="bg-input/50 border-border" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="missionStatement">Mission Statement</Label>
                    <Textarea id="missionStatement" {...register('missionStatement')} rows={3} className="bg-input/50 border-border" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="coreValues">Core Values (one per line)</Label>
                    <Textarea id="coreValues" {...register('coreValues')} rows={4} className="bg-input/50 border-border" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="whyChooseUs">Why Choose Us (one per line)</Label>
                    <Textarea id="whyChooseUs" {...register('whyChooseUs')} rows={6} className="bg-input/50 border-border" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ctaHeading">CTA Heading</Label>
                    <Input id="ctaHeading" {...register('ctaHeading')} className="bg-input/50 border-border" />
                </div>
                
                <div className="space-y-4">
                    <Label>Section Image</Label>
                     <input type="hidden" name="currentImageUrl" value={initialData.imageUrl || ''} />
                    <Input id="imageUrl" type="file" accept="image/*" {...register('imageUrl')} className="bg-input/50 border-border file:text-foreground" />
                    {imagePreview && (
                        <div className="mt-2 relative w-48 h-32">
                             <Image src={imagePreview} alt="Image preview" layout="fill" className="rounded-md object-cover"/>
                        </div>
                    )}
                </div>

            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={isPending}>
                    {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                </Button>
            </CardFooter>
        </Card>
    </form>
  );
}

    