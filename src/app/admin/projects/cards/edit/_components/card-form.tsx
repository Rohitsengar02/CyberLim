
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState, useCallback, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Trash2, UploadCloud, AlertCircle, CheckCircle } from 'lucide-react';
import type { Project } from '@/types/project';
import { upsertProject, uploadImageAction } from '../../actions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { GenerateContentDialog } from './generate-content-dialog';
import { GenerateImageDialog } from './generate-image-dialog';
import type { GenerateProjectOutput } from '@/ai/flows/generate-project-details-flow';
import { cn } from '@/lib/utils';

type GalleryImage = {
  id: string; // a unique ID for the key, can be timestamp or url
  url: string; // can be blob url or final cloudinary url
  state: 'new' | 'uploading' | 'uploaded' | 'error';
  file?: File; // Only for new files
  error?: string; // Optional error message
};

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().min(1, "Description is required"),
  liveUrl: z.string().url().optional().or(z.literal('')),
  animationColor: z.enum(['pink', 'green', 'white']),
  gridClassName: z.string().optional(),
  tags: z.string().optional(),
  industry: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  goals: z.string().optional(),
  challenges: z.string().optional(),
  research: z.string().optional(),
  design: z.string().optional(),
  development: z.string().optional(),
  techStack: z.string().optional(),
  features: z.string().optional(),
  results: z.string().optional(),
  clientName: z.string().optional(),
  testimonial: z.string().optional(),
  satisfaction: z.enum(['happy', 'neutral', 'unhappy']).optional(),
});

type FormValues = z.infer<typeof projectSchema>;

const arrayToString = (arr: string[] | undefined) => arr?.join('\n') || '';
const resultsToString = (arr: {title: string, value: string}[] | undefined) => arr?.map(r => `${r.value} (${r.title})`).join('\n') || '';
const techStackToString = (arr: {name: string, category: string}[] | undefined) => arr?.map(t => `${t.name} (${t.category})`).join('\n') || '';


export function CardForm({ project }: { project: Project | null }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isContentAiDialogOpen, setContentAiDialogOpen] = useState(false);
  const [isImageAiDialogOpen, setImageAiDialogOpen] = useState(false);
  
  const [mainImageSource, setMainImageSource] = useState<File | string | null>(null);
  const [gallerySources, setGallerySources] = useState<GalleryImage[]>([]);
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      tagline: project?.tagline || '',
      description: project?.description || '',
      liveUrl: project?.liveUrl || '',
      animationColor: project?.animationColor || 'pink',
      gridClassName: project?.gridClassName || '',
      tags: arrayToString(project?.tags),
      industry: project?.overview?.industry || '',
      problem: project?.overview?.problem || '',
      solution: project?.overview?.solution || '',
      goals: arrayToString(project?.goals),
      challenges: arrayToString(project?.challenges),
      research: project?.approach?.research || '',
      design: project?.approach?.design || '',
      development: project?.approach?.development || '',
      techStack: techStackToString(project?.techStack),
      features: arrayToString(project?.features),
      results: resultsToString(project?.results),
      clientName: project?.client?.name || '',
      testimonial: project?.client?.testimonial || '',
      satisfaction: project?.client?.satisfaction || 'neutral',
    },
  });

  useEffect(() => {
    if (project) {
        setMainImageSource(project.imageUrl || null);
        const initialGallery = project.gallery?.map(url => ({
            id: url,
            url,
            state: 'uploaded' as const,
        })) || [];
        setGallerySources(initialGallery);
    }
  }, [project]);
  
  const watchedAnimationColor = watch('animationColor');

  const onFormSubmit = (data: FormValues) => {
    startTransition(async () => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
              formData.append(key, value as string);
          }
      });
      
      if (project?.id) {
          formData.append('projectId', project.id);
      }
      
      if (mainImageSource instanceof File) {
          formData.append('imageUrl', mainImageSource);
      } else if (typeof mainImageSource === 'string') {
          formData.append('currentImageUrl', mainImageSource);
      }
      
      const uploadedGalleryUrls = gallerySources
        .filter(img => img.state === 'uploaded')
        .map(img => img.url);
      formData.append('galleryJSON', JSON.stringify(uploadedGalleryUrls));

      const result = await upsertProject(null, formData);

      if (result?.success) {
        toast({ title: "Success", description: result.message });
        router.push('/admin/projects/cards');
      } else {
        toast({ title: "Error", description: result.message || "An unexpected error occurred.", variant: "destructive" });
      }
    });
  };
  
  const handleAiContent = useCallback((data: GenerateProjectOutput) => {
    reset({
      ...data,
      satisfaction: 'happy',
      animationColor: 'pink',
      tags: arrayToString(data.tags),
      goals: arrayToString(data.goals),
      challenges: arrayToString(data.challenges),
      techStack: techStackToString(data.techStack),
      features: arrayToString(data.features),
      results: resultsToString(data.results),
      liveUrl: data.liveUrl || '',
      gridClassName: data.gridClassName || '',
      clientName: data.clientName || '',
      testimonial: data.testimonial || '',
    });
    toast({ title: "Content Populated", description: "The form has been filled with AI-generated content. Please review and save." });
  }, [reset, toast]);

  const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      return new File([blob], fileName, { type: blob.type });
  }

  const uploadImage = useCallback(async (image: GalleryImage) => {
      if (!image.file) return;

      setGallerySources(prev => prev.map(img => img.id === image.id ? { ...img, state: 'uploading' } : img));

      const formData = new FormData();
      formData.append('file', image.file);
      const result = await uploadImageAction(formData);

      if (result.success && result.imageUrl) {
          setGallerySources(prev => prev.map(img => img.id === image.id ? { ...img, state: 'uploaded', url: result.imageUrl!, file: undefined } : img));
      } else {
          setGallerySources(prev => prev.map(img => img.id === image.id ? { ...img, state: 'error', error: result.message } : img));
           toast({
              title: `Upload Failed for ${image.file?.name}`,
              description: result.message,
              variant: "destructive",
           });
      }
  }, [toast]);
  
  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const newFiles: GalleryImage[] = Array.from(e.target.files).map(file => ({
            id: `${file.name}-${Date.now()}`,
            url: URL.createObjectURL(file),
            state: 'new' as const,
            file: file,
        }));
        setGallerySources(prev => [...prev, ...newFiles]);
        newFiles.forEach(uploadImage);
        e.target.value = '';
    }
  };

  const handleAiImage = useCallback(async (imageUrl: string) => {
    try {
        const file = await dataUrlToFile(imageUrl, `ai-generated-${Date.now()}.png`);
        const newImage: GalleryImage = {
            id: `${file.name}-${Date.now()}`,
            url: URL.createObjectURL(file),
            state: 'new',
            file: file,
        };
        setGallerySources(prev => [...prev, newImage]);
        uploadImage(newImage);
        toast({ title: "Image Added", description: "AI-generated image is now uploading to the gallery." });
    } catch(e) {
        toast({ title: "Error", description: "Could not process the generated image.", variant: "destructive"});
    }
  }, [toast, uploadImage]);
  
  const removeGalleryImage = (idToRemove: string) => {
      setGallerySources(prev => prev.filter((img) => img.id !== idToRemove));
  }

  const mainImagePreview = mainImageSource ? (mainImageSource instanceof File ? URL.createObjectURL(mainImageSource) : mainImageSource) : null;
  
  const closeContentDialog = useCallback(() => setContentAiDialogOpen(false), []);
  const closeImageDialog = useCallback(() => setImageAiDialogOpen(false), []);

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Card className="bg-secondary/30 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Provide the core content and images for the project.</CardDescription>
            </div>
            <Button type="button" variant="outline" onClick={() => setContentAiDialogOpen(true)}>
                <Sparkles className="mr-2 h-4 w-4 text-accent" /> Generate with AI
            </Button>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold text-primary">Core Details</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input id="title" {...register('title')} className="bg-input/50 border-border" />
                          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="liveUrl">Live URL</Label>
                          <Input id="liveUrl" {...register('liveUrl')} className="bg-input/50 border-border" placeholder="https://example.com" />
                          {errors.liveUrl && <p className="text-sm text-destructive">{errors.liveUrl.message}</p>}
                      </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="tagline">Tagline</Label>
                      <Textarea id="tagline" {...register('tagline')} rows={2} className="bg-input/50 border-border" />
                      {errors.tagline && <p className="text-sm text-destructive">{errors.tagline.message}</p>}
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="description">Full Description</Label>
                      <Textarea id="description" {...register('description')} rows={5} className="bg-input/50 border-border" />
                      {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="tags">Tags (one per line)</Label>
                      <Textarea id="tags" {...register('tags')} rows={3} className="bg-input/50 border-border" />
                      {errors.tags && <p className="text-sm text-destructive">{errors.tags.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Main Image</Label>
                    <Input id="imageUrl" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setMainImageSource(e.target.files[0])} className="bg-input/50 border-border file:text-foreground" />
                    {mainImagePreview && <Image src={mainImagePreview} alt="Image preview" width={160} height={90} className="mt-2 rounded-md object-cover border border-border"/>}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
               <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg font-semibold text-primary">Image Gallery</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {gallerySources.map((source, index) => {
                       return (
                           <div key={source.id} className="relative group aspect-square">
                               <Image src={source.url} alt={`Gallery image ${index + 1}`} layout="fill" className="object-cover rounded-lg border border-border" />
                               
                                {source.state === 'uploading' && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                                    </div>
                                )}
                                {source.state === 'error' && (
                                    <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center rounded-lg text-white p-2 text-center">
                                        <AlertCircle className="h-8 w-8" />
                                        <span className="text-xs mt-1 font-semibold">Upload failed</span>
                                    </div>
                                )}
                                {source.state === 'uploaded' && (
                                    <div className="absolute top-1 right-1 bg-green-600 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <CheckCircle className="h-4 w-4" />
                                    </div>
                                )}

                               <Button type="button" size="icon" variant="destructive" className="absolute -bottom-2 -right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={() => removeGalleryImage(source.id)}>
                                   <Trash2 className="h-4 w-4" />
                               </Button>
                           </div>
                       )
                    })}
                     <Label htmlFor="gallery-upload" className="aspect-square flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-2">Upload Images</span>
                        <Input id="gallery-upload" type="file" accept="image/*" multiple className="sr-only" onChange={handleGalleryFilesChange} />
                    </Label>
                  </div>
                   <Button type="button" variant="outline" onClick={() => setImageAiDialogOpen(true)}>
                      <Sparkles className="mr-2 h-4 w-4 text-accent" /> Generate Image with AI
                   </Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold text-primary">Case Study Details</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input id="industry" {...register('industry')} className="bg-input/50 border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="problem">The Problem</Label>
                        <Textarea id="problem" {...register('problem')} rows={3} className="bg-input/50 border-border" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="solution">The Solution</Label>
                      <Textarea id="solution" {...register('solution')} rows={4} className="bg-input/50 border-border" />
                    </div>
                </AccordionContent>
              </AccordionItem>

               <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold text-primary">Approach &amp; Features</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="space-y-2">
                         <Label>Research</Label>
                         <Textarea {...register('research')} rows={4} className="bg-input/50 border-border" />
                       </div>
                        <div className="space-y-2">
                         <Label>Design</Label>
                         <Textarea {...register('design')} rows={4} className="bg-input/50 border-border" />
                       </div>
                        <div className="space-y-2">
                         <Label>Development</Label>
                         <Textarea {...register('development')} rows={4} className="bg-input/50 border-border" />
                       </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="features">Features (one per line)</Label>
                            <Textarea id="features" {...register('features')} rows={5} className="bg-input/50 border-border" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="techStack">Tech Stack (e.g., Next.js (Frontend))</Label>
                            <Textarea id="techStack" {...register('techStack')} rows={5} className="bg-input/50 border-border" />
                        </div>
                     </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-semibold text-primary">Results &amp; Client</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                   <div className="space-y-2">
                      <Label htmlFor="results">Results (e.g., 40% (Increase in conversions))</Label>
                      <Textarea id="results" {...register('results')} rows={3} className="bg-input/50 border-border" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <Label>Client Name</Label>
                         <Input {...register('clientName')} className="bg-input/50 border-border" />
                       </div>
                        <div className="space-y-2">
                         <Label>Client Satisfaction</Label>
                          <Select name="satisfaction" value={watch('satisfaction')} onValueChange={(v) => setValue('satisfaction', v as any)}>
                            <SelectTrigger className="bg-input/50 border-border">
                                <SelectValue placeholder="Select satisfaction" />
                            </SelectTrigger>
                            <SelectContent className="bg-secondary/50 backdrop-blur-lg border-border">
                                <SelectItem value="happy">Happy</SelectItem>
                                <SelectItem value="neutral">Neutral</SelectItem>
                                <SelectItem value="unhappy">Unhappy</SelectItem>
                            </SelectContent>
                          </Select>
                       </div>
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="testimonial">Client Testimonial</Label>
                      <Textarea id="testimonial" {...register('testimonial')} rows={3} className="bg-input/50 border-border" />
                    </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg font-semibold text-primary">Styling</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="animationColor">Card Animation Color</Label>
                            <Select value={watchedAnimationColor} onValueChange={(value) => setValue('animationColor', value as 'pink' | 'green' | 'white')}>
                                <SelectTrigger className="bg-input/50 border-border">
                                    <SelectValue placeholder="Select a color" />
                                </SelectTrigger>
                                <SelectContent className="bg-secondary/50 backdrop-blur-lg border-border">
                                    <SelectItem value="pink">Pink</SelectItem>
                                    <SelectItem value="green">Green</SelectItem>
                                    <SelectItem value="white">White</SelectItem>
                                </SelectContent>
                            </Select>
                            <input type="hidden" {...register('animationColor')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gridClassName">Bento Grid Class (Optional)</Label>
                            <Input id="gridClassName" {...register('gridClassName')} className="bg-input/50 border-border" placeholder="md:col-span-2 md:row-span-2" />
                        </div>
                    </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/projects/cards')}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <><Loader2 className="animate-spin mr-2" /> Saving...</> : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
      <GenerateContentDialog
        isOpen={isContentAiDialogOpen}
        onClose={closeContentDialog}
        onDataGenerated={handleAiContent}
      />
       <GenerateImageDialog
        isOpen={isImageAiDialogOpen}
        onClose={closeImageDialog}
        onImageGenerated={handleAiImage}
      />
    </>
  );
}

    