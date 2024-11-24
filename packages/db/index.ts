declare module "bun" {
	/**
	 * Declaration of related environment variables.
	 *
	 * @see [Bun environment variables](https://bun.sh/docs/runtime/env)
	 * @see [Interface merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces)
	 */
	interface Env {
		DATABASE_URL: string;
	}
}

export * from "./db";
export * from "./types";
