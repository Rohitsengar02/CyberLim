
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ProjectsAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <div>
              <h1 className="text-3xl font-bold text-primary">Manage Projects Section</h1>
              <p className="text-muted-foreground">
                Customize the heading, cards, and layout of the projects section.
              </p>
          </div>
        </div>
      {children}
    </div>
  );
}
