import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "./index.css";

import { DashboardPage } from "@/pages/dashboard";

const root = document.getElementById("root");

if (root) {
	createRoot(root).render(
		<StrictMode>
			<BrowserRouter>
				<Routes>
					<Route path="/" index element={<DashboardPage />} />
				</Routes>
			</BrowserRouter>
		</StrictMode>,
	);
}
