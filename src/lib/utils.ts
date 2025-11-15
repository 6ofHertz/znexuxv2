import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const priorityColors = {
  high: "hsl(0, 70%, 50%)",
  medium: "hsl(43, 65%, 53%)",
  low: "hsl(202, 81%, 21%)",
};
