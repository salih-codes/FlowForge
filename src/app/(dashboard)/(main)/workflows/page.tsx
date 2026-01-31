import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { prefetchWorkflows } from "@/features/workflows/servers/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import WorkflowsList, {
	WorkflowsContainer,
} from "@/features/workflows/components/workflows";

export default async function Page() {
	await requireAuth();
	prefetchWorkflows();
	return (
		<WorkflowsContainer>
			<HydrateClient>
				<ErrorBoundary fallback={<p>Error</p>}>
					<Suspense fallback={<p>Loading...</p>}>
						<WorkflowsList />
					</Suspense>
				</ErrorBoundary>
			</HydrateClient>
		</WorkflowsContainer>
	);
}
