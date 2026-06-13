import type { ComponentType } from "react";
import type { IconProps } from "@/types/ui";

export interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<IconProps>;
}

export interface NavSection {
  section: string;
  items: NavItem[];
}
