import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { $jobs, $printers, jobStatusEnum, printerApiEnum } from "./tables";

export const printerApiSchema = z.enum(printerApiEnum.enumValues);
export const jobStatusSchema = z.enum(jobStatusEnum.enumValues);

export const selectPrinterSchema = createSelectSchema($printers);
export const insertPrinterSchema = createInsertSchema($printers).pick({
	name: true,
	api: true,
	url: true,
	apiKey: true,
	cameraUrl: true,
});
export const updatePrinterSchema = createInsertSchema($printers).pick({
	name: true,
	api: true,
	url: true,
	apiKey: true,
	cameraUrl: true,
	currentJobId: true,
});

export const selectJobSchema = createSelectSchema($jobs);
export const insertJobSchema = createInsertSchema($jobs).omit({
	id: true,
	createAt: true,
	updateAt: true,
	endAt: true,
});
export const updateJobSchema = createInsertSchema($jobs).pick({
	id: true,
	status: true,
	secondsLeft: true,
	progress: true,
	endAt: true,
});

export type PrinterApi = z.infer<typeof printerApiSchema>;
export type JobStatus = z.infer<typeof jobStatusSchema>;
export type Printer = z.infer<typeof selectPrinterSchema>;
export type Job = z.infer<typeof selectJobSchema>;

export type NewPrinter = z.infer<typeof insertPrinterSchema>;
export type UpdatePrinter = z.infer<typeof updatePrinterSchema>;
export type NewJob = z.infer<typeof insertJobSchema>;
export type UpdateJob = z.infer<typeof updateJobSchema>;
