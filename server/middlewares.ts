import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { type Printer, findPrinterById } from "@autoprint/db";

export type PrinterVariables = {
	printer: Printer;
};

// Validate printer id from path variable or query params.
export const validatePrinterId = ({ from }: { from: "query" | "param" }) =>
	createMiddleware<{
		Variables: PrinterVariables;
	}>(async (c, next) => {
		const printerId =
			from === "param" ? c.req.param("printerId") : c.req.query("printerId");

		const printer = await findPrinterById(z.number().parse(printerId));

		if (!printer) {
			throw new HTTPException(404, { message: "Printer not found." });
		}

		c.set("printer", printer);

		await next();
	});
