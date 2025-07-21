
import { getProjectsData, getProjectLayoutConfig } from '@/lib/data';
import { ProjectsClient } from './_components/projects-client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsCardsPage() {
  const projects = await getProjectsData();
  const layoutConfig = await getProjectLayoutConfig();

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/admin/projects">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
              <h2 className="text-2xl font-bold text-primary">Manage Projects</h2>
              <p className="text-muted-foreground">
                Add, edit, delete, and control the layout of projects on your homepage.
              </p>
          </div>
        </div>
      <ProjectsClient initialProjects={projects} initialLayout={layoutConfig} />
    </div>
  );
}
