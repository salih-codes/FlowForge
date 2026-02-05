"use client";
import {
	CreditCardIcon,
	FolderOpenIcon,
	History,
	KeyIcon,
	LogoutIcon,
	StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";
import { authClient } from "@/lib/auth-client";

interface MenuItem {
	title: string;
	url: string;
	icon: IconSvgElement;
}

interface MenuGroup {
	title: string;
	items: MenuItem[];
}

const menuItems: MenuGroup[] = [
	{
		title: "workflows",
		items: [
			{ title: "Workflows", url: "/workflows", icon: FolderOpenIcon },
			{ title: "Credentials", url: "/credentials", icon: KeyIcon },
			{ title: "Executions", url: "/executions", icon: History },
		],
	},
];
export default function AppSidebar() {
	const router = useRouter();
	const pathname = usePathname();

	const { hasActiveSubscription, isLoading } = useHasActiveSubscription();
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenuItem>
					<SidebarMenuButton
						className="gap-x-4 h-10 px-4"
						render={<Link prefetch href="/" />}
					>
						<Image
							src="/logos/logo.svg"
							width={30}
							height={30}
							alt="FlowForge"
						/>
						<span className="font-semibold text-sm">FlowForge</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarHeader>
			<SidebarContent>
				{menuItems.map((group) => (
					<SidebarGroup key={group.title}>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											tooltip={item.title}
											isActive={
												item.url === "/"
													? pathname === "/"
													: pathname.startsWith(item.url)
											}
											render={<Link href={item.url} prefetch />}
											className="gap-x-4 h-10 px-4"
										>
											<HugeiconsIcon icon={item.icon} className="size-4" />
											<span>{item.title}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter>
				{!hasActiveSubscription && !isLoading && (
					<SidebarMenuItem>
						<SidebarMenuButton
							tooltip="Upgrade to Pro"
							className="gap-x-4 h-10 px-4"
							onClick={() => authClient.checkout({ slug: "pro" })}
						>
							<HugeiconsIcon icon={StarIcon} className="size-4" />
							<span>Upgrade to Pro</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				)}
				<SidebarMenuItem>
					<SidebarMenuButton
						tooltip="Billing Portal"
						className="gap-x-4 h-10 px-4"
						onClick={() => authClient.customer.portal()}
					>
						<HugeiconsIcon icon={CreditCardIcon} className="size-4" />
						<span>Billing Portal</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarMenuButton
						tooltip="Sign Out"
						className="gap-x-4 h-10 px- text-destructive"
						onClick={() =>
							authClient.signOut({
								fetchOptions: {
									onSuccess: () => {
										router.push("/login");
									},
								},
							})
						}
					>
						<HugeiconsIcon icon={LogoutIcon} className="size-4" />
						<span>Sign Out</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarFooter>
		</Sidebar>
	);
}
