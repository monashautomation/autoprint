import {
	integer,
	pgEnum,
	pgTable,
	serial,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const printerApiEnum = pgEnum("printer_api", [
	"OctoPrint",
	"PrusaLinkWeb",
]);

export const $printers = pgTable("printers", {
	id: serial().primaryKey(),
	name: varchar({ length: 32 }).notNull().unique(),
	url: varchar({ length: 64 }).notNull(),
	api: printerApiEnum().notNull(),
	apiKey: varchar("api_key", { length: 64 }).notNull(),
	cameraUrl: varchar("camera_url", { length: 64 }),
	currentJobId: integer("current_job_id"),
	createAt: timestamp("create_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updateAt: timestamp("update_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const jobStatusEnum = pgEnum("job_status", [
	"printing",
	"printed",
	"picked",
	"cancelling",
	"cancelled",
	"error",
	"unknown",
]);

export const $jobs = pgTable("jobs", {
	id: serial().primaryKey(),
	orderId: uuid("order_id"),
	printerId: integer("printer_id").notNull(),
	localId: varchar("local_id", { length: 128 }).notNull(),
	status: jobStatusEnum().notNull(),
	filePath: varchar("file_path").notNull(),
	progress: integer("progress").notNull().default(0),
	secondsLeft: integer("seconds_left"),
	startAt: timestamp("start_at", { withTimezone: true }).notNull(),
	endAt: timestamp("end_at", { withTimezone: true }),
	createAt: timestamp("create_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updateAt: timestamp("update_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});
