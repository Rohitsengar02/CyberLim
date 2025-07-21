
import { getHeroAnimationConfig } from '@/lib/data';
import { GifEditor } from './_components/gif-editor';

export default async function AdminGifPage() {
  const config = await getHeroAnimationConfig();
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Edit Hero Animation</h1>
        <p className="text-muted-foreground">
          Update the central animated GIF and adjust its scaling for different screen sizes.
        </p>
      </div>
      <GifEditor initialData={config} />
    </div>
  );
}
