import { cva } from "class-variance-authority";
import { addSeconds } from "date-fns";
import {
	CircleHelp,
	Clock,
	File,
	MoveDownRight,
	MoveUpRight,
	Thermometer,
} from "lucide-react";
import type {
	ComponentProps,
	ComponentType,
	ReactNode,
	SVGAttributes,
} from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePrinterStatus } from "@/hooks/use-printers";
import { cn, formatDateTime, isNil } from "@/lib/utils";
import type { Printer } from "@autoprint/db";

function parseStateVariant(
	state: string,
): "offline" | "printing" | "ready" | "error" {
	switch (state.toLowerCase()) {
		case "offline":
			return "offline";
		case "ready":
		case "finished":
		case "printed":
		case "idle":
			return "ready";
		case "error":
			return "error";
		default:
			return "printing";
	}
}

const printerCardVariants = cva("bg-gradient-to-br", {
	variants: {
		state: {
			offline: "from-gray-200/60 via-gray-50 to-gray-200/50",
			printing: "from-blue-200/60 via-blue-50 to-blue-200/50",
			ready: "from-green-200/60 via-green-50 to-green-200/50",
			error: "from-red-200/60 via-red-50 to-red-200/50",
		},
	},
	defaultVariants: {
		state: "offline",
	},
});

export type PrinterCardProps = ComponentProps<typeof Card> & {
	printer: Printer;
};

export function PrinterCard({
	printer,
	className,
	...props
}: PrinterCardProps) {
	const { status, isLoading, error } = usePrinterStatus(printer.id);

	if (error) {
		toast("Error fetching printer status", { description: error });
		return null;
	}

	if (isLoading || !status) {
		return (
			<Card
				className={cn(
					printerCardVariants({ state: "offline" }),
					"h-[350px]",
					className,
				)}
				{...props}
			>
				<Skeleton className="w-full h-full" />
			</Card>
		);
	}

	const state = status.state;

	return (
		<Card
			className={cn(
				printerCardVariants({ state: parseStateVariant(state) }),
				className,
			)}
			{...props}
		>
			<CardHeader className="py-4">
				<div className="flex flex-row justify-between items-center">
					<span className="font-semibold">{printer.name}</span>
					<div className="flex gap-4">
						<span className="font-semibold">{state}</span>
						{status.job && <span>{status.job.progress.toFixed(0)}%</span>}
					</div>
				</div>
			</CardHeader>
			<CardContent className="grid gap-3">
				<div className="grid items-center lg:grid-cols-2 gap-2">
					<TemperatureStatus
						label="Bed"
						actual={status.temperature?.bed}
						target={status.temperature?.targetBed}
					/>

					<TemperatureStatus
						label="Nozzle"
						actual={status.temperature?.nozzle}
						target={status.temperature?.targetNozzle}
					/>

					<EstimatedEnd secondsLeft={status.job?.secondsLeft} />
					<JobFile filename={status.job?.filePath} />
				</div>

				<div className="w-full min-h-[100px] rounded-xl overflow-hidden">
					<img
						src={`${printer.cameraUrl}?action=stream`}
						alt={`camera of ${printer.name}`}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

function formatFilename(name: string): string {
	if (name.length <= 15) {
		return name;
	}

	const prefix = name.substring(0, 10);

	return `${prefix}..`;
}

function JobFile({ filename }: { filename?: string | null }) {
	if (isNil(filename)) {
		return (
			<Status label="GCode File" Icon={File}>
				NA
			</Status>
		);
	}

	return (
		<Status label="GCode File" Icon={File}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger className="flex flex-row gap-1 items-center">
						<span className="text-xs">{formatFilename(filename ?? "")}</span>
						<CircleHelp className="w-3 h-3" />
					</TooltipTrigger>
					<TooltipContent>
						<p>Add to library</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</Status>
	);
}

function EstimatedEnd({ secondsLeft }: { secondsLeft?: number | null }) {
	const t = isNil(secondsLeft)
		? "NA"
		: formatDateTime(addSeconds(new Date(), secondsLeft ?? 0));

	return (
		<Status label="Finish Time" Icon={Clock}>
			{t}
		</Status>
	);
}

function TemperatureStatus({
	label,
	actual,
	target,
}: { label: string; actual?: number | null; target?: number | null }) {
	if (actual === null || actual === undefined) {
		return (
			<Status label={label} Icon={Thermometer}>
				<span>NA</span>
			</Status>
		);
	}

	const tar = target ?? 0;
	const Arrow = actual <= tar ? MoveUpRight : MoveDownRight;

	return (
		<Status label={label} Icon={Thermometer}>
			<div className="flex flex-row items-center gap-1">
				<p>{actual}℃</p>
				<Arrow className="w-4 h-4" />
				<p>{tar}℃</p>
			</div>
		</Status>
	);
}

function Status<P extends object>({
	label,
	Icon,
	children,
}: {
	label: string;
	Icon: ComponentType<SVGAttributes<P>>;
	children: ReactNode;
}) {
	return (
		<div className="flex items-center space-x-2">
			<Icon className="w-4 h-4" />
			<div className="text-sm">
				<span className="font-medium">{label}</span>
				<div className="text-gray-600">{children}</div>
			</div>
		</div>
	);
}
