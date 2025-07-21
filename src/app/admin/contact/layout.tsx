
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ContactAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/admin/hero">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Homepage Sections</span>
            </Link>
          </Button>
          <div>
              <h1 className="text-3xl font-bold text-primary">Manage Contact Submissions</h1>
              <p className="text-muted-foreground">
                View and manage messages from your website visitors.
              </p>
          </div>
        </div>
      {children}
    </div>
  );
}
