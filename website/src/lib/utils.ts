import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDateTime(value?: string | Date | null): string {
	return value ? format(value, "yyyy-MM-dd HH:mm:ss") : "";
}

export function isNil(value: unknown): boolean {
	return value === undefined || value === null;
}

export function isNotNil(value: unknown): boolean {
	return !isNil(value);
}
