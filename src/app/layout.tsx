import type { Metadata } from "next";
import { Figtree, Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import { Provider } from "jotai";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/client";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Flow Forge",
	description: "Flow Forge. Build your own AI agent workflows",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={cn("dark", figtree.variable)}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<TRPCReactProvider>
					<NuqsAdapter>
						<Provider>{children}</Provider>
					</NuqsAdapter>
					<Toaster />
				</TRPCReactProvider>
			</body>
		</html>
	);
}
