import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ToneType =
  | "gen-z"
  | "shakespeare"
  | "pirate"
  | "corporate"
  | "yoda"
  | "baby"
  | "cat"
  | "dog"
  | "drunk"
  | "angry"
  | "valley-girl"
  | "cowboy"
  | "anime"
  | "superhero"
