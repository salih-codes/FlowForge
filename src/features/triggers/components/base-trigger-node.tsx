"use client";

import { type NodeProps, Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode } from "react";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { WorkflowNode } from "@/components/workflow-node";

type BaseTriggerNodeProps = {
	icon: LucideIcon | string;
	name: string;
	description?: string;
	children?: ReactNode;
	// status?: NodeStatus;
	onSettings?: () => void;
	onDoubleClick?: () => void;
} & NodeProps;

export const BaseTriggerNode = memo(
	({
		// id,
		icon: Icon,
		name,
		description,
		children,
		onSettings,
		onDoubleClick,
	}: BaseTriggerNodeProps) => {
		// TODO: Add delete
		const handleDelete = () => {};
		return (
			<WorkflowNode
				name={name}
				description={description}
				onDelete={handleDelete}
				onSettings={onSettings}
			>
				{/* TODO: Wrap with node status indocator */}
				<BaseNode
					onDoubleClick={onDoubleClick}
					className="rouned-l-2xl relative group"
				>
					<BaseNodeContent>
						{typeof Icon === "string" ? (
							<Image src={Icon} alt={name} width={16} height={16} />
						) : (
							<Icon className="size-4 text-muted-foreground" />
						)}
						{children}
						<BaseHandle id="source-1" type="source" position={Position.Right} />
					</BaseNodeContent>
				</BaseNode>
			</WorkflowNode>
		);
	},
);

BaseTriggerNode.displayName = "BaseTriggerNode";
