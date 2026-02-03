import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import WorkflowsList, {
	WorkflowsContainer,
	WorkflowsError,
	WorkflowsLoading,
} from "@/features/workflows/components/workflows";
import { workflowsParamsLoader } from "@/features/workflows/servers/params-loader";
import { prefetchWorkflows } from "@/features/workflows/servers/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type Props = {
	searchParams: Promise<SearchParams>;
};
export default async function Page({ searchParams }: Props) {
	await requireAuth();
	const params = await workflowsParamsLoader(searchParams);

	prefetchWorkflows(params);

	return (
		<WorkflowsContainer>
			<HydrateClient>
				<ErrorBoundary fallback={<WorkflowsError />}>
					<Suspense fallback={<WorkflowsLoading />}>
						<WorkflowsList />
					</Suspense>
				</ErrorBoundary>
			</HydrateClient>
		</WorkflowsContainer>
	);
}
