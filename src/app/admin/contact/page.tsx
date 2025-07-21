
import { getContactSubmissions } from '@/lib/data';
import { SubmissionsClient } from './_components/submissions-client';

export const dynamic = 'force-dynamic';

export default async function ContactAdminPage() {
  const submissions = await getContactSubmissions();

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Contact Form Submissions</h1>
        <p className="text-muted-foreground">
          View and manage messages sent through your website's contact form.
        </p>
      </div>
      <SubmissionsClient initialSubmissions={submissions} />
    </div>
  );
}
