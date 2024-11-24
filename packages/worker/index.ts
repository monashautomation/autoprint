import { type Printer, getPrinters } from "@autoprint/db";
import { AxiosError } from "axios";

import { monitorPrusaPrinter } from "./prusa";

export async function monitorPrinters() {
	const printers = await getPrinters();
	const tasks = printers.map((printer) => monitorPrinter(printer));

	await Promise.all(tasks);

	setTimeout(monitorPrinters, 5000);
}

async function monitorPrinter(printer: Printer): Promise<void> {
	if (printer.api !== "PrusaLinkWeb") {
		throw Error("Unsupported Printer api for printer worker");
	}

	try {
		return await monitorPrusaPrinter(printer.id);
	} catch (error) {
		if (error instanceof AxiosError && error.request) {
			return;
		}
		console.log(`[prusa-worker-${printer.id}] error: ${error}`);
	}
}
