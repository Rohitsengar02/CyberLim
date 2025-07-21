
import { getFeaturesLayoutConfig } from '@/lib/data';
import { LayoutEditor } from './_components/layout-editor';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function AdminFeaturesLayoutPage() {
  const config = await getFeaturesLayoutConfig();
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/features">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-primary">Edit Layout & Animation</h2>
          <p className="text-muted-foreground">
            Customize the appearance and behavior of the features section.
          </p>
        </div>
      </div>
      <LayoutEditor initialData={config} />
    </div>
  );
}
