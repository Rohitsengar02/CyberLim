
import { getProjectById } from '@/lib/data';
import { CardForm } from './_components/card-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function EditProjectPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const projectId = searchParams.id;
  const project = projectId ? await getProjectById(projectId) : null;
  
  if (projectId && !project) {
      return <div>Project not found.</div>
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/projects/cards">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold text-primary">{project ? 'Edit Project' : 'Create New Project'}</h1>
            <p className="text-muted-foreground">
            {project ? 'Update the details for this project.' : 'Fill in the details for the new project.'}
            </p>
        </div>
      </div>
      <CardForm project={project} />
    </div>
  );
}
