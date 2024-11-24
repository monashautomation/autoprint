import { toast } from "sonner";

import { PrinterCard } from "@/components/printer/card";
import { Breadcrumb, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrinters } from "@/hooks/use-printers";
import { Header } from "@/layouts/sidebar";

export function DashboardPage() {
	return (
		<>
			<Header>
				<Breadcrumb>
					<BreadcrumbPage>Printer Dashboard</BreadcrumbPage>
				</Breadcrumb>
			</Header>

			<Printers />
		</>
	);
}

function Printers() {
	const { printers, isLoading, error } = usePrinters();

	if (error) {
		toast("Error fetching printers", { description: error.message });

		return null;
	}

	if (isLoading || !printers) {
		return (
			<div className="w-full h-full p-4">
				<Card className="w-full h-full">
					<Skeleton className="w-full h-full" />
				</Card>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-6 p-4 pt-0">
			<div className="grid lg:grid-cols-4 gap-4">
				{printers.map((printer) => (
					<PrinterCard key={printer.id} printer={printer} />
				))}
			</div>
		</div>
	);
}
