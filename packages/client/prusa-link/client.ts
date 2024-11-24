import axios, { type AxiosInstance } from "axios";

import type { Printer } from "../types";
import { type LatestJob, type Status, latestJobSchema } from "./types";

export class PrusaLinkClient {
	private readonly httpClient: AxiosInstance;

	public constructor(printer: Printer) {
		this.httpClient = axios.create({
			baseURL: printer.url,
			headers: {
				"X-Api-Key": printer.apiKey,
			},
			timeout: 3000,
		});
	}

	public async status(): Promise<Status> {
		const resp = await this.httpClient.get<Status>("/api/v1/status");

		return resp.data;
	}

	public async latestJob(): Promise<LatestJob | null> {
		const resp = await this.httpClient.get("/api/v1/job");

		switch (resp.status) {
			case 200:
				return latestJobSchema.parse(resp.data);
			case 204:
				return null;
			default:
				throw Error(
					`Unexpected response status of latest job API: ${resp.status}`,
				);
		}
	}

	public async uploadFile(
		path: string,
		file: Blob,
		options: { printAfterUpload?: boolean } = {},
	): Promise<void> {
		const { printAfterUpload } = options;

		await this.httpClient.put(`/api/v1/files${path}`, file, {
			headers: {
				"Content-Type": "application/octet-stream",
				"Print-After-Upload": printAfterUpload ? "1" : "0",
			},
		});
	}

	public async deleteFile(path: string): Promise<void> {
		await this.httpClient.delete(`/api/v1/files${path}`);
	}
}
