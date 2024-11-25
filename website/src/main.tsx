import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "./index.css";

import { ThemeProvider } from "@/components/theme-provider";
import { SidebarLayout } from "@/layouts/sidebar";
import { DashboardPage } from "@/pages/dashboard";
import { PrinterPage } from "@/pages/printer";

const root = document.getElementById("root");

if (root) {
	createRoot(root).render(
		<StrictMode>
			<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<SidebarLayout />}>
							<Route index path="/" element={<DashboardPage />} />
							<Route path="/printers/:printerId" element={<PrinterPage />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</StrictMode>,
	);
}
