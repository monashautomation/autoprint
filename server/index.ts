import { monitorPrinters } from "@autoprint/worker";
import app from "./app";

monitorPrinters().then(() => {});

export default app;
