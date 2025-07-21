
import type { IconName } from "@/lib/icons";

export interface ServiceCard {
  id: string;
  iconName: IconName;
  title: string;
  subtitle?: string;
  description: string;
  createdAt?: string;
}
