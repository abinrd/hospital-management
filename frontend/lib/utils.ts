import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const AD_EMAIL = process.env.AD_EMAIL;
export const AD_PASSWORD = process.env.AD_PASSWORD;

export const fetchData = async (endpoint: string, options = {}) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return res;
};
