
export interface MenuItem {
  id?: string;
  label: string;
  href: string;
}

export interface NavbarConfig {
  logoText?: string;
  logoImageUrl?: string | null;
  leftMenuItems: MenuItem[];
  rightMenuItems: MenuItem[];
  logoHoverText?: string[];
}
