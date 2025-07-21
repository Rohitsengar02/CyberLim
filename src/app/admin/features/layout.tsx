
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function FeaturesAdminLayout({
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
              <h1 className="text-3xl font-bold text-primary">Manage Features Section</h1>
              <p className="text-muted-foreground">
                Customize the heading, cards, and layout of the features section.
              </p>
          </div>
        </div>
      {children}
    </div>
  );
}
