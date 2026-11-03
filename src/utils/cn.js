import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx conditionals without conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
