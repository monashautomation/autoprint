import { PrusaLinkClient } from "@autoprint/client/prusa-link";
import {
	createPrinter,
	getJobById,
	getPrinters,
	updatePrinterById,
} from "@autoprint/db";
import { insertPrinterSchema, updatePrinterSchema } from "@autoprint/db";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { validatePrinterId } from "./middlewares";

const app = new Hono();

app.get("/", async (c) => {
	const printers = await getPrinters();

	return c.json(printers);
});

app.get(
	"/:printerId/status",
	validatePrinterId({ from: "param" }),
	async (c) => {
		const { printer } = c.var;
		const job = printer.currentJobId
			? await getJobById(printer.currentJobId)
			: null;

		try {
			const client = new PrusaLinkClient(printer);
			const { printer: printerStatus } = await client.status();

			return c.json({
				job,
				state: printerStatus.state,
				temperature: {
					bed: printerStatus.temp_bed ?? null,
					targetBed: printerStatus.target_bed ?? null,
					nozzle: printerStatus.temp_nozzle ?? null,
					targetNozzle: printerStatus.target_nozzle ?? null,
				},
			});
		} catch (e) {
			return c.json({
				job,
				state: "OFFLINE",
				temperature: null,
			});
		}
	},
);

app.post("/", zValidator("json", insertPrinterSchema), async (c) => {
	const printer = c.req.valid("json");

	await createPrinter(printer);

	return c.text("Printer created.", 201);
});

app.put(
	"/:printerId",
	validatePrinterId({ from: "param" }),
	zValidator("json", updatePrinterSchema),
	async (c) => {
		const data = c.req.valid("json");
		const printerId = c.var.printer.id;

		await updatePrinterById(printerId, data);

		return c.text("Printer updated.", 204);
	},
);

export default app;
