import axios from "axios";
import useSWR, { useSWRConfig } from "swr";

import type { Job, Printer, UpdatePrinter } from "@autoprint/db";
import { useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
	throw new Error("Add URL of the API server to environment variables");
}

const apiClient = axios.create({
	baseURL: API_BASE_URL,
});

export function usePrinters() {
	const {
		data: printers,
		isLoading,
		error,
	} = useSWR("/api/v1/printers", async (url) => {
		const resp = await apiClient.get<Printer[]>(url);

		return resp.data;
	});

	return {
		printers,
		isLoading,
		error,
	};
}

export function usePrinter(id: number | string) {
	const { mutate } = useSWRConfig();

	const {
		data: printer,
		isLoading,
		error,
	} = useSWR(`/api/v1/printers/${id}`, async (url: string) => {
		const resp = await apiClient.get<Printer>(url);

		return resp.data;
	});

	const updatePrinter = useCallback(
		async (data: UpdatePrinter) => {
			await apiClient.put(`/api/v1/printers/${id}`, data);
			await mutate("/api/v1/printers");
			await mutate(`/api/v1/printers/${id}`);
		},
		[id, mutate],
	);

	return {
		printer,
		updatePrinter,
		isLoading,
		error,
	};
}

export type PrinterStatus = {
	state: string;
	job: Job | null;
	temperature: {
		bed: number | null;
		targetBed: number | null;
		nozzle: number | null;
		targetNozzle: number | null;
	};
};

export function usePrinterStatus(printerId: number | string) {
	const {
		data: status,
		isLoading,
		error,
	} = useSWR(
		`/api/v1/printers/${printerId}/status`,
		async (url: string) => {
			const resp = await apiClient.get<PrinterStatus>(url);

			return resp.data;
		},
		{ refreshInterval: 5000 },
	);

	return {
		status,
		isLoading,
		error,
	};
}
