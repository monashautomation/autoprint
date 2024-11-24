import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

import { $jobs, $printers } from "./tables";
import type {
	Job,
	NewJob,
	NewPrinter,
	Printer,
	UpdateJob,
	UpdatePrinter,
} from "./types";

const db = drizzle(Bun.env.DATABASE_URL, {
	schema: {
		printers: $printers,
		jobs: $jobs,
	},
});

export async function createPrinter(printer: NewPrinter): Promise<void> {
	await db.insert($printers).values(printer);
}

export async function getPrinters(): Promise<Printer[]> {
	return db.select().from($printers);
}

export async function findPrinterById(id: number): Promise<Printer | null> {
	const printers = await db
		.select()
		.from($printers)
		.where(eq($printers.id, id));

	return printers.length === 0 ? null : printers[0];
}

export async function getPrinterById(id: number): Promise<Printer> {
	const printer = await findPrinterById(id);

	if (!printer) {
		throw new Error("printer not found");
	}

	return printer;
}

export async function updatePrinterById(
	id: number,
	data: UpdatePrinter,
): Promise<void> {
	await db
		.update($printers)
		.set({
			...data,
			updateAt: new Date(),
		})
		.where(eq($printers.id, id));
}

export async function deletePrinterById(id: number): Promise<void> {
	await db.delete($printers).where(eq($printers.id, id));
}

export async function getJobs(): Promise<Job[]> {
	return db.select().from($jobs);
}

export async function createJob(job: NewJob): Promise<Job> {
	const inserted = await db.insert($jobs).values(job).returning();

	return inserted[0];
}

export async function findJobById(id: number): Promise<Job | null> {
	const jobs = await db.select().from($jobs).where(eq($jobs.id, id));

	return jobs.length === 0 ? null : jobs[0];
}

export async function getJobById(id: number): Promise<Job> {
	const job = await findJobById(id);

	if (!job) {
		throw new Error("Job not found");
	}

	return job;
}

export async function updateJobById(
	id: number,
	data: UpdateJob,
): Promise<void> {
	await db
		.update($jobs)
		.set({
			...data,
			updateAt: new Date(),
		})
		.where(eq($jobs.id, id));
}

export async function deleteJobById(id: number): Promise<void> {
	await db.delete($jobs).where(eq($jobs.id, id));
}
