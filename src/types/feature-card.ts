
import type { IconName } from "@/lib/icons";

export interface FeatureCard {
  id: string;
  iconName: IconName;
  title: string;
  description: string;
  createdAt?: string;
}
