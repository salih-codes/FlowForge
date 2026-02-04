"use client";

import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { memo } from "react";
import { Button } from "@/components/ui/button";

export const AddNodeButton = memo(() => {
	return (
		<Button
			onClick={() => {}}
			size="icon"
			variant="outline"
			className="bg-background"
		>
			<HugeiconsIcon icon={PlusSignIcon} />
		</Button>
	);
});

AddNodeButton.displayName = "AddNodeButton";
