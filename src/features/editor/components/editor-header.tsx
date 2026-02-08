"use client";
import { Save } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAtomValue } from "jotai";
import Link from "next/link";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	useSuspenseWorkflow,
	useUpdateWorkflow,
	useUpdateWorkflowName,
} from "@/features/workflows/hooks/use-workflows";
import { editorAtom } from "../store/atoms";

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
	const editor = useAtomValue(editorAtom);
	const saveWorkflow = useUpdateWorkflow();

	const handleSave = () => {
		if (!editor) return;

		const nodes = editor.getNodes();
		const edges = editor.getEdges();

		saveWorkflow.mutate({ id: workflowId, nodes, edges });
	};

	return (
		<div className="ml-auto">
			<Button size="sm" onClick={handleSave} disabled={saveWorkflow.isPending}>
				<HugeiconsIcon icon={Save} className="size-4" />
			</Button>
		</div>
	);
};

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
	const { data: workflow } = useSuspenseWorkflow(workflowId);
	const updateWorkflowName = useUpdateWorkflowName();

	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState(workflow.name);

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (workflow.name) {
			setName(workflow.name);
		}
	}, [workflow.name]);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing]);

	const handleSave = async () => {
		if (name === workflow.name) {
			setIsEditing(false);
			return;
		}
		try {
			await updateWorkflowName.mutateAsync({
				id: workflowId,
				name,
			});
		} catch {
			setName(workflow.name);
			toast.error("Error setting workflow name");
		} finally {
			setIsEditing(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSave();
		} else if (e.key === "Escape") {
			setName(workflow.name);
			setIsEditing(false);
		}
	};

	if (isEditing) {
		return (
			<Input
				ref={inputRef}
				disabled={updateWorkflowName.isPending}
				value={name}
				onChange={(e) => setName(e.target.value)}
				onBlur={handleSave}
				onKeyDown={handleKeyDown}
				className="h-7 w-auto min-w-25 px-2"
			/>
		);
	}
	return (
		<BreadcrumbItem
			onClick={() => setIsEditing(true)}
			className="cursor-pointer hover:text-foreground transition-colors"
		>
			{workflow?.name}
		</BreadcrumbItem>
	);
};

export const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink
						render={
							<Link prefetch href="/workflows">
								Workflows
							</Link>
						}
					/>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<EditorNameInput workflowId={workflowId} />
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default function EditorHeader({ workflowId }: { workflowId: string }) {
	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
			<SidebarTrigger />
			<div className="flex flex-row items-center justify-between gap-x-4 w-full">
				<EditorBreadcrumbs workflowId={workflowId} />
				<EditorSaveButton workflowId={workflowId} />
			</div>
		</header>
	);
}
