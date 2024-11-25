import { useMemo } from "react";
import { useParams } from "react-router";
import { z } from "zod";

import { PrinterCard } from "@/components/printer/card";
import { EditPrinter } from "@/components/printer/edit";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrinter } from "@/hooks/use-printers";
import { Header } from "@/layouts/sidebar";
import type { Printer } from "@autoprint/db";

const printerIdSchema = z.coerce.number();

export function PrinterPage() {
	const params = useParams();
	const printerId = useMemo(() => {
		return printerIdSchema.parse(params.printerId);
	}, [params]);
	const { printer } = usePrinter(printerId);

	if (!printer) {
		return <Skeleton className="w-full h-full" />;
	}

	return (
		<>
			<PageHeader printer={printer} />
			<main className="h-full flex flex-col gap-8 p-8 pt-0">
				<div className="flex justify-between items-center">
					<h2 className="font-semibold text-2xl">{printer.name}</h2>
					<div>
						<EditPrinter printer={printer}>
							<Button>Edit</Button>
						</EditPrinter>
					</div>
				</div>
				<div className="grid lg:grid-cols-2 gap-4 h-2/5">
					<PrinterCard
						className="h-full"
						printer={printer}
						showCamera={false}
						showPrinterInfo
						title="Printer Information"
					/>
					<Card className="overflow-hidden">
						<img
							src={`${printer.cameraUrl}?action=stream`}
							alt={`camera of ${printer.name}`}
						/>
					</Card>
				</div>
				<Card className="h-full bg-secondary flex justify-center items-center">
					<span className="text-muted-foreground">Work in progress</span>
				</Card>
			</main>
		</>
	);
}

function PageHeader({ printer }: { printer: Printer }) {
	return (
		<Header>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbPage>Printers</BreadcrumbPage>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{printer.name}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</Header>
	);
}
