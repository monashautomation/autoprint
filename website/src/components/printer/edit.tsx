import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePrinter } from "@/hooks/use-printers";
import type { Printer, UpdatePrinter } from "@autoprint/db";
import { toast } from "sonner";

const schema = z.object({
	name: z.string().min(1, "Name cannot be empty"),
	url: z.string().min(1, "URL cannot be empty"),
	apiKey: z.string().optional(),
	cameraUrl: z.string().optional(),
});

export function EditPrinter({
	printer,
	children,
}: { printer: Printer; children: ReactNode }) {
	const { updatePrinter } = usePrinter(printer.id);
	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const form = useForm<UpdatePrinter>({
		resolver: zodResolver(schema),
		defaultValues: {
			...printer,
		},
	});

	async function onSubmit(values: UpdatePrinter) {
		setLoading(true);

		await updatePrinter({
			...printer,
			...values,
		});

		toast("Updated Successfully", {
			description: `${printer.name} is updated.`,
		});

		setLoading(false);
		setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger onClick={() => setOpen(true)}>{children}</DialogTrigger>
			<DialogContent className="w-[400px]">
				<DialogHeader>
					<DialogTitle>Edit Printer</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="px-6 py-4 grid gap-6"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Name <span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										URL <span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="cameraUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Camera URL</FormLabel>
									<FormControl>
										<Input {...field} value={field.value || undefined} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="apiKey"
							render={({ field }) => (
								<FormItem>
									<FormLabel>API Key</FormLabel>
									<FormControl>
										<Input {...field} value={field.value || undefined} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button disabled={loading}>
								{loading && <Loader2 className="animate-spin" />} Submit
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
