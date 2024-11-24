import { z } from "zod";

export const printerStateSchema = z.enum([
	"IDLE",
	"READY",
	"BUSY",
	"PRINTING",
	"PAUSED",
	"FINISHED",
	"STOPPED",
	"ERROR",
	"ATTENTION", // still printing, but need user actions
]);

export const statusSchema = z.object({
	printer: z.object({
		state: printerStateSchema,
		temp_bed: z.number().optional(),
		target_bed: z.number().optional(),
		temp_nozzle: z.number().optional(),
		target_nozzle: z.number().optional(),
		axis_x: z.number().optional(),
		axis_y: z.number().optional(),
		axis_z: z.number().optional(),
	}),
	job: z
		.object({
			id: z.number(),
			progress: z.number(),
			time_printing: z.number(),
			time_remaining: z.number().optional(),
		})
		.optional(),
});

export const latestJobSchema = z.object({
	id: z.number(),
	state: printerStateSchema,
	progress: z.number(),
	time_printing: z.number(),
	time_remaining: z.number().optional(),
	inaccurate_estimates: z.boolean().optional(),
	file: z.object({
		name: z.string(),
		display_name: z.string().optional(),
		path: z.string(),
	}),
});

export type PrinterState = z.infer<typeof printerStateSchema>;
export type Status = z.infer<typeof statusSchema>;
export type LatestJob = z.infer<typeof latestJobSchema>;
