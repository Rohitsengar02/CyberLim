
import { getHeroCarouselConfig } from '@/lib/data';
import { StylingEditor } from './_components/styling-editor';

export default async function CarouselStylingPage() {
  const config = await getHeroCarouselConfig();
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Edit Carousel Styling</h1>
        <p className="text-muted-foreground">
          Adjust the dimensions of the cards in the hero section carousel for different screen sizes.
        </p>
      </div>
      <StylingEditor initialData={config} />
    </div>
  );
}
