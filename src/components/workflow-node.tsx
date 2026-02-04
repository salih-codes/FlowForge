"use client";

import { Settings, Trash } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { NodeToolbar, Position } from "@xyflow/react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";

type WorkflowNodeProps = {
	children: ReactNode;
	showToolbar?: boolean;
	onDelete?: () => void;
	onSettings?: () => void;
	name?: string;
	description?: string;
};

export function WorkflowNode({
	children,
	showToolbar = true,
	onDelete,
	onSettings,
	name,
	description,
}: WorkflowNodeProps) {
	return (
		<>
			{!!showToolbar && (
				<NodeToolbar>
					<Button size="sm" variant="ghost" onClick={onSettings}>
						<HugeiconsIcon icon={Settings} className="size-4" />
					</Button>
					<Button size="sm" variant="ghost" onClick={onDelete}>
						<HugeiconsIcon icon={Trash} className="size-4" />
					</Button>
				</NodeToolbar>
			)}
			{children}
			{!!name && (
				<NodeToolbar
					position={Position.Bottom}
					isVisible
					className="max-w-50 text-center"
				>
					<p className="font-medium">{name}</p>
					{!!description && (
						<p className="text-muted-foreground truncate text-sm">
							{description}
						</p>
					)}
				</NodeToolbar>
			)}
		</>
	);
}
