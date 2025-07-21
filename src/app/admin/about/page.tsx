
import { getAboutUsContentConfig } from '@/lib/data';
import { AboutEditor } from './_components/about-editor';

export default async function AdminAboutPage() {
  const config = await getAboutUsContentConfig();
  return (
    <div className="flex flex-col gap-8">
      <AboutEditor initialData={config} />
    </div>
  );
}
