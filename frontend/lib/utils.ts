import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchData = async (endpoint: string, options = {}) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return res;
};
