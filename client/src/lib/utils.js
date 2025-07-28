import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


export const getInitials = (name) => {
    if (!name) return "U"; // Return 'U' for undefined or null names
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2); // Limit to 2 characters
};