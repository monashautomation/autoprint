import type { ReactNode } from "react";
import { Outlet } from "react-router";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export function SidebarLayout() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
			<Toaster />
		</SidebarProvider>
	);
}

export function Header({ children }: { children?: ReactNode }) {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 justify-between">
			<div className="flex items-center gap-2 px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				{children}
			</div>

			<div className="px-6">
				<ModeToggle />
			</div>
		</header>
	);
}
