import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

import printerApi from "./printers";

const app = new Hono();

app.use(cors());

app.onError((err, c) => {
	if (err instanceof HTTPException) {
		return err.getResponse();
	}

	if (err instanceof ZodError) {
		return c.text(err.message, 400);
	}

	return c.text(err.message, 500);
});

app.get("/health", (c) => {
	return c.json({ status: "up" });
});

app.basePath("/api/v1").route("/printers", printerApi);

export default app;
