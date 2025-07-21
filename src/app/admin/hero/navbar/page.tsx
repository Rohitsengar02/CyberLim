import { getNavbarConfig } from '@/lib/data';
import { NavbarEditor } from './_components/navbar-editor';

export default async function AdminNavbarPage() {
  const config = await getNavbarConfig();
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Edit Navigation</h1>
        <p className="text-muted-foreground">
          Manage your website's main navigation. The logo appears in the center, with menu items on the left and right.
        </p>
      </div>
      <NavbarEditor initialData={config} />
    </div>
  );
}
