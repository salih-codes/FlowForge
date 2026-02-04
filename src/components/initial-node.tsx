"use client";

import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { WorkflowNode } from "./workflow-node";

export const InitialNode = memo((props: NodeProps) => {
	return (
		<WorkflowNode showToolbar={false}>
			<PlaceholderNode {...props} onClick={() => {}}>
				<div className="cursor-pointer flex items-center justify-center">
					<HugeiconsIcon icon={PlusSignIcon} className="size-4" />
				</div>
			</PlaceholderNode>
		</WorkflowNode>
	);
});

InitialNode.displayName = "InitialNode";
