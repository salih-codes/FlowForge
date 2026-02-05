import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";

export const ManualTriggerNode = memo((props: NodeProps) => {
	return (
		<>
			<BaseTriggerNode
				{...props}
				icon={MousePointerIcon}
				name="When clicking 'Executing workflow'"
				// status={nodeStatus}
				// onSettings={handleOpenSettings}
				// onDoubleClick={handleOpenSettings}
			/>
		</>
	);
});
