
"use client";

import { useActionState, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { ContactSubmission } from '@/types/contact-submission';
import { Loader2, Trash2 } from 'lucide-react';
import { deleteContactSubmission } from '../actions';
import { format } from 'date-fns';

function DeleteButton({ submissionId }: { submissionId: string }) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(deleteContactSubmission, { success: false, message: "" });

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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-secondary/50 backdrop-blur-lg border-border">
         <form action={formAction}>
            <input type="hidden" name="submissionId" value={submissionId} />
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the submission.
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
  );
}

export function SubmissionsClient({ initialSubmissions }: { initialSubmissions: ContactSubmission[] }) {
  if (initialSubmissions.length === 0) {
    return (
      <div className="text-center py-16 rounded-lg border-2 border-dashed border-border">
        <h3 className="text-xl font-semibold text-primary">No submissions yet.</h3>
        <p className="text-muted-foreground mt-2">When someone contacts you, their message will appear here.</p>
      </div>
    );
  }

  return (
    <Card className="bg-secondary/30 backdrop-blur-lg border-white/10">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium text-primary">{submission.name}</TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell>{submission.phone || 'N/A'}</TableCell>
                <TableCell>{format(new Date(submission.createdAt), "PPP")}</TableCell>
                <TableCell className="text-right">
                    <DeleteButton submissionId={submission.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
