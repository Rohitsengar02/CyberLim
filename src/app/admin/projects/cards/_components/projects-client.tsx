
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Project } from '@/types/project';
import type { ProjectLayoutConfig } from '@/types/project-layout';
import { updateProjectLayoutConfig } from '../actions';
import { Label } from '@/components/ui/label';
import { ProjectCardItem } from './project-card-item';
import Link from 'next/link';

const schema = z.object({
  layout: z.enum(['bento', 'grid', 'carousel']),
});

type FormValues = z.infer<typeof schema>;

export function ProjectsClient({ initialProjects, initialLayout }: { initialProjects: Project[], initialLayout: ProjectLayoutConfig }) {
  const [state, formAction, isPending] = useActionState(updateProjectLayoutConfig, {
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
            <CardTitle>Project Section Layout</CardTitle>
            <CardDescription>Choose how the projects are displayed on your homepage.</CardDescription>
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
            <Button asChild>
                <Link href="/admin/projects/cards/edit">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
      
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-secondary/30 border border-white/10">
            <h2 className="text-2xl font-bold text-primary">Your Projects</h2>
            <p className="text-muted-foreground mt-1">Add, edit, or delete your portfolio projects.</p>
        </div>
         {initialProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {initialProjects.map((project) => (
                    <ProjectCardItem key={project.id} project={project} />
                ))}
            </div>
         ) : (
             <p className="text-muted-foreground text-center py-8">No projects found.</p>
         )}
      </div>

    </div>
  );
}
