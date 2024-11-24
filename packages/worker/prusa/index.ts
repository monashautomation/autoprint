import { subSeconds } from "date-fns";

import {
	type PrinterState,
	PrusaLinkClient,
} from "@autoprint/client/prusa-link";
import {
	type JobStatus,
	createJob,
	getJobById,
	getPrinterById,
	updateJobById,
	updatePrinterById,
} from "@autoprint/db";

export async function monitorPrusaPrinter(printerId: number) {
	const printer = await getPrinterById(printerId);
	const client = new PrusaLinkClient(printer);

	const status = await client.status();
	const latestJob = await client.latestJob();
	const currentJob = printer.currentJobId
		? await getJobById(printer.currentJobId)
		: null;
	const printerState = status.printer.state;

	if (!latestJob && !currentJob) {
		// TODO: start next order
	} else if (latestJob && !currentJob) {
		// save new internal job
		if (latestJob.time_printing > 0) {
			// wait heating finished (time_printing == 0) to calculate printing start time
			const job = await createJob({
				printerId,
				localId: latestJob.id.toString(),
				status: parseJobStatus(printerState),
				progress: latestJob.progress,
				secondsLeft: latestJob.time_remaining,
				filePath: `${latestJob.file.path}/${latestJob.file.name}`,
				startAt: subSeconds(new Date(), latestJob.time_printing),
			});
			await updatePrinterById(printerId, { ...printer, currentJobId: job.id });
		}
	} else if (!latestJob && currentJob) {
		// finish current job
		await updateJobById(currentJob.id, {
			status: parseJobStatus(printerState),
			secondsLeft: 0,
			endAt: new Date(),
		});

		await updatePrinterById(printerId, { ...printer, currentJobId: null });

		if (!currentJob.orderId) {
			// delete GCode file if job is submitted by app
			await client.deleteFile(currentJob.filePath);
		}
	} else if (latestJob && currentJob) {
		if (latestJob.id.toString() === currentJob.localId) {
			// update current job
			await updateJobById(currentJob.id, {
				status: parseJobStatus(printerState),
				progress: latestJob.progress,
				secondsLeft: latestJob.time_remaining,
			});
		} else {
			// lost tracking of current job, mark status as unknown
			await updateJobById(currentJob.id, { status: "unknown" });
			await updatePrinterById(printerId, { ...printer, currentJobId: null });
		}
	}
}

function parseJobStatus(state: PrinterState): JobStatus {
	switch (state) {
		case "ERROR":
			return "error";
		case "STOPPED":
			return "cancelled";
		case "FINISHED":
			return "printed";
		case "PRINTING":
		case "PAUSED":
		case "ATTENTION":
			return "printing";
		default:
			return "unknown";
	}
}
