
import { getServicesHeadingConfig } from '@/lib/data';
import { HeadingEditor } from './_components/heading-editor';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function AdminServicesHeadingPage() {
  const config = await getServicesHeadingConfig();
  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/admin/services">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
              <h2 className="text-2xl font-bold text-primary">Edit Heading & Content</h2>
              <p className="text-muted-foreground">
                Update the main title and introductory paragraph for the Services section.
              </p>
          </div>
        </div>
      <HeadingEditor initialData={config} />
    </div>
  );
}
