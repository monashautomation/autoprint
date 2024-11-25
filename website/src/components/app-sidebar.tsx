import { ChevronRight, LayoutDashboard } from "lucide-react";
import { Printer as PrinterIcon } from "lucide-react";
import { Link } from "react-router";

import { Logo } from "@/components/logo";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
} from "@/components/ui/sidebar";
import { usePrinters } from "@/hooks/use-printers";

export function AppSidebar() {
	const { printers } = usePrinters();

	return (
		<Sidebar variant="inset">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link to="/">
								<div className="flex aspect-square border size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Logo className="w-4 h-4 fill-white" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="text-md font-semibold">
										Monash Automation
									</span>
									<span className="text-xs">Printing Service</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link to="/">
									<LayoutDashboard /> Dashboard
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarMenu>
						<Collapsible asChild defaultOpen className="group/collapsible">
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton>
										<PrinterIcon />
										<span>Printers</span>
										<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{printers?.map((printer) => (
											<SidebarMenuItem key={printer.id}>
												<SidebarMenuButton asChild>
													<Link to={`/printers/${printer.id}`}>
														{printer.name}
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					</SidebarMenu>
				</SidebarGroup>
				<SidebarGroup />
			</SidebarContent>

			<SidebarFooter>{/*<SidebarMenu></SidebarMenu>*/}</SidebarFooter>
		</Sidebar>
	);
}
