"use client";
import { WorkflowCircle01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
	EmptyView,
	EntityContainer,
	EntityHeader,
	EntityItem,
	EntityList,
	EntityPagination,
	EntitySearch,
	ErrorView,
	LoadingView,
} from "@/components/entity-components";
import type { Workflow } from "@/generated/prisma/client";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import {
	useCreateWorkflow,
	useRemoveWorkflow,
	useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { useWorkflowsParams } from "../hooks/use-workflows-params";

export const WorkflowsSearch = () => {
	const [params, setParams] = useWorkflowsParams();
	const { searchValue, onSearchChange } = useEntitySearch({
		params,
		setParams,
	});
	return (
		<EntitySearch
			value={searchValue}
			onChange={onSearchChange}
			placeholder="Search Workflows"
		/>
	);
};

export default function WorkflowsList() {
	const workflows = useSuspenseWorkflows();

	return (
		<EntityList
			items={workflows.data.items}
			getKey={(workflow) => workflow.id}
			renderItem={(workflow) => <WorkflowItem data={workflow} />}
			emptyView={<WorkflowsEmpty />}
		/>
	);
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
	const createWorkflow = useCreateWorkflow();
	const router = useRouter();
	const { handleError, modal } = useUpgradeModal();
	const handleCreate = () => {
		createWorkflow.mutate(undefined, {
			onSuccess: (data) => {
				router.push(`/workflows/${data.id}`);
			},
			onError: (error) => {
				handleError(error);
			},
		});
	};

	return (
		<>
			{modal}
			<EntityHeader
				title="Workflows"
				description="Create and manage your workflows"
				onNew={handleCreate}
				newButtonLabel="New Workflow"
				disabled={disabled}
				isCreating={createWorkflow.isPending}
			/>
		</>
	);
};

export const WorkflowsPagination = () => {
	const workflows = useSuspenseWorkflows();
	const [params, setParams] = useWorkflowsParams();

	return (
		<EntityPagination
			disabled={workflows.isFetching}
			totalPages={workflows.data.totalPages}
			page={workflows.data.page}
			onPageChange={(page) => setParams({ ...params, page })}
		/>
	);
};

export const WorkflowsContainer = ({ children }: { children: ReactNode }) => {
	return (
		<EntityContainer
			header={<WorkflowsHeader />}
			search={<WorkflowsSearch />}
			pagination={<WorkflowsPagination />}
		>
			{children}
		</EntityContainer>
	);
};

export const WorkflowsLoading = () => {
	return <LoadingView message="Loading Workflows..." />;
};

export const WorkflowsError = () => {
	return <ErrorView message="Error Loading Workflows" />;
};

export const WorkflowsEmpty = () => {
	const router = useRouter();
	const createWorkflow = useCreateWorkflow();
	const { handleError, modal } = useUpgradeModal();

	const handleCreate = () => {
		createWorkflow.mutate(undefined, {
			onError: (error) => {
				handleError(error);
			},
			onSuccess: (data) => {
				router.push(`/workflows/${data.id}`);
			},
		});
	};

	return (
		<>
			{modal}
			<EmptyView
				message="No workflows found. Start by creating one"
				onNew={handleCreate}
			/>
		</>
	);
};

export const WorkflowItem = ({ data }: { data: Workflow }) => {
	const { mutateAsync: removeWorkflow, isPending } = useRemoveWorkflow();

	const handleRemove = () => {
		removeWorkflow({ id: data.id });
	};
	return (
		<EntityItem
			href={`/workflows/${data.id}`}
			title={data.name}
			subtitle={
				<>
					Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
					&bull; created{" "}
					{formatDistanceToNow(data.createdAt, { addSuffix: true })}
				</>
			}
			image={
				<div className="size-8 flex items-center justifyu-center">
					<HugeiconsIcon
						icon={WorkflowCircle01Icon}
						className="size-5 text-muted-foreground"
					/>
				</div>
			}
			onRemove={handleRemove}
			isRemoving={isPending}
		/>
	);
};
