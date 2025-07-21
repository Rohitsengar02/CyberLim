
import { getHeroContentConfig } from '@/lib/data';
import { ContentEditor } from './_components/content-editor';

export default async function AdminHeroContentPage() {
  const config = await getHeroContentConfig();
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Edit Hero Content</h1>
        <p className="text-muted-foreground">
          Update the main heading, paragraph, and styling of the hero section.
        </p>
      </div>
      <ContentEditor initialData={config} />
    </div>
  );
}
