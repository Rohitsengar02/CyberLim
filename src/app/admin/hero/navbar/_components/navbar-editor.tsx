
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useActionState, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { NavbarConfig } from "@/types/navbar";
import { updateNavbarConfig } from "../actions";
import { Navbar } from "@/components/layout/navbar";

const menuItemSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "URL is required"),
});

const navbarSchema = z.object({
  logoText: z.string().optional(),
  logoImage: z.any().optional(),
  leftMenuItems: z.array(menuItemSchema),
  rightMenuItems: z.array(menuItemSchema),
  logoHoverText: z.array(z.string().min(1, "Text cannot be empty")).optional(),
});

type NavbarFormValues = z.infer<typeof navbarSchema>;

const MenuItemsEditor = ({ control, name, label }: { control: any, name: "leftMenuItems" | "rightMenuItems", label: string }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-primary">{label}</h3>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex items-end gap-4 p-4 rounded-lg bg-secondary/50 border border-border"
        >
          <div className="flex-1">
            <Label htmlFor={`${name}.${index}.label`}>Label</Label>
            <Input
              id={`${name}.${index}.label`}
              {...control.register(`${name}.${index}.label`)}
              className="mt-1 bg-input/50 border-border"
              placeholder="e.g., Features"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor={`${name}.${index}.href`}>URL</Label>
            <Input
              id={`${name}.${index}.href`}
              {...control.register(`${name}.${index}.href`)}
              className="mt-1 bg-input/50 border-border"
              placeholder="e.g., /#features"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => remove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ label: "", href: "" })}
      >
        <Plus className="mr-2 h-4 w-4" /> Add Item
      </Button>
    </div>
  )
}

const LogoHoverTextEditor = ({ control }: { control: any }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "logoHoverText",
    });

    return (
        <div className="space-y-4">
            {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4">
                    <div className="flex-1">
                        <Label htmlFor={`logoHoverText.${index}`}>Text #{index + 1}</Label>
                        <Input
                            id={`logoHoverText.${index}`}
                            {...control.register(`logoHoverText.${index}`)}
                            className="mt-1 bg-input/50 border-border"
                            placeholder="e.g., Innovation"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => append("")}
            >
                <Plus className="mr-2 h-4 w-4" /> Add Hover Text
            </Button>
        </div>
    );
};

export function NavbarEditor({ initialData }: { initialData: NavbarConfig }) {
  const [state, formAction, isPending] = useActionState(updateNavbarConfig, {
    success: false,
    message: "",
  });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [deleteLogoImage, setDeleteLogoImage] = useState(false);

  const {
    register,
    control,
    watch,
    getValues,
    reset,
  } = useForm<NavbarFormValues>({
    resolver: zodResolver(navbarSchema),
    defaultValues: {
      logoText: initialData.logoText || "",
      leftMenuItems: initialData.leftMenuItems || [],
      rightMenuItems: initialData.rightMenuItems || [],
      logoHoverText: initialData.logoHoverText || [],
    },
  });

  const watchedValues = watch();
  const logoImageFile = watch("logoImage");
  const [logoPreview, setLogoPreview] = useState(initialData.logoImageUrl);
  
  useEffect(() => {
    if (deleteLogoImage) {
      setLogoPreview(undefined);
      return;
    }
    if (logoImageFile && logoImageFile[0]) {
      const url = URL.createObjectURL(logoImageFile[0]);
      setLogoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
        setLogoPreview(initialData.logoImageUrl);
    }
  }, [logoImageFile, initialData.logoImageUrl, deleteLogoImage])

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if(state.success) {
          reset({
            ...getValues(),
            logoImage: null
          });
      }
    }
  }, [state, toast, reset, getValues]);
  
  const handleFormAction = (formData: FormData) => {
    formData.append('leftMenuItemsJSON', JSON.stringify(getValues('leftMenuItems')));
    formData.append('rightMenuItemsJSON', JSON.stringify(getValues('rightMenuItems')));
    formData.append('logoHoverTextJSON', JSON.stringify(getValues('logoHoverText')));
    formData.append('deleteLogoImage', String(deleteLogoImage));
    formAction(formData);
  };
  
  const previewConfig: NavbarConfig = {
      logoText: watchedValues.logoText,
      logoImageUrl: logoPreview,
      leftMenuItems: watchedValues.leftMenuItems || [],
      rightMenuItems: watchedValues.rightMenuItems || [],
      logoHoverText: watchedValues.logoHoverText || [],
  }

  return (
    <div className="space-y-8">
      <Card className="bg-secondary/30 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Navbar Editor</CardTitle>
          <CardDescription>Configure the logo and menu items for your site.</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={handleFormAction} className="space-y-8">
            <div className="space-y-6">
                <CardTitle className="text-lg text-primary/80">Logo</CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <Label htmlFor="logoText">Logo Text</Label>
                        <Input
                            id="logoText"
                            {...register("logoText")}
                            className="mt-1 bg-input/50 border-border"
                            placeholder="CyberLIM"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Used if no logo image is uploaded.
                        </p>
                    </div>
                    <div>
                        <Label htmlFor="logoImage">Upload Logo Image</Label>
                        <Input
                            id="logoImage"
                            type="file"
                            accept="image/*"
                            {...register("logoImage")}
                            className="mt-1 bg-input/50 border-border file:text-foreground"
                            onChange={() => setDeleteLogoImage(false)}
                        />
                         <input type="hidden" name="currentLogoImageUrl" value={initialData.logoImageUrl || ''} />
                    </div>
                </div>

                {logoPreview && (
                    <div>
                    <Label>Logo Preview</Label>
                    <div className="mt-2 p-4 border border-dashed border-border rounded-lg flex justify-center items-center bg-secondary/20 relative">
                        <Image
                        src={logoPreview}
                        alt="Logo preview"
                        width={150}
                        height={50}
                        className="object-contain"
                        />
                         <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => setDeleteLogoImage(true)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove logo image</span>
                        </Button>
                    </div>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <CardTitle className="text-lg text-primary/80">Logo Hover Animation</CardTitle>
                 <CardDescription>Add text that animates when hovering over the logo on the main site.</CardDescription>
                <LogoHoverTextEditor control={control} />
            </div>
            
            <div className="space-y-6">
              <CardTitle className="text-lg text-primary/80">Menu Items</CardTitle>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MenuItemsEditor control={control} name="leftMenuItems" label="Left Menu Items" />
                <MenuItemsEditor control={control} name="rightMenuItems" label="Right Menu Items" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card className="bg-secondary/30 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Live Preview</CardTitle>
          <CardDescription>This is how your navbar will appear on the live site.</CardDescription>
        </CardHeader>
        <CardContent className="relative h-48 bg-background/50 rounded-b-lg border-t border-border overflow-hidden">
           <Navbar isScrolled={true} scrollProgress={0} config={previewConfig} />
        </CardContent>
      </Card>
    </div>
  );
}
