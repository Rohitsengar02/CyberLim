
"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import type { Project } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { useActionState, useEffect } from 'react';
import { deleteProject } from '../actions';

export function ProjectCardItem({ project }: { project: Project }) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(deleteProject, { success: false, message: "" });

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
    <Card className="bg-secondary/30 backdrop-blur-lg border-white/10 flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {project.imageUrl && (
            <div className="relative aspect-video w-full rounded-md overflow-hidden border border-border">
                <Image src={project.imageUrl} alt={project.title} layout="fill" className="object-cover" />
            </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2">{project.tagline}</p>
        <div className="flex flex-wrap gap-2">
            {project.tags?.slice(0, 3).map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
        </div>
      </CardContent>
      <CardFooter className="p-3 bg-secondary/50 border-t border-border flex justify-end gap-2">
        <Button asChild variant="outline" size="icon">
          <Link href={`/admin/projects/cards/edit?id=${project.id}`}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-secondary/50 backdrop-blur-lg border-border">
             <form action={formAction}>
                <input type="hidden" name="projectId" value={project.id} />
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the project.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit" disabled={isPending}>
                    {isPending ? <><Loader2 className="animate-spin mr-2" /> Deleting...</> : "Delete"}
                </AlertDialogAction>
                </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
