import type { GetStepTools, Inngest } from "inngest";

export type WorkflowContext = Record<string, unknown>;

export type StepTools = GetStepTools<Inngest.Any>;

export type NodeExecutorParams<TData = Record<string, unknown>> = {
	data: TData;
	nodeId: string;
	context: WorkflowContext;
	step: StepTools;
	// publish: TODO when realtimeis added later
};

export type NodeExecutor<TData = Record<string, unknown>> = (
	params: NodeExecutorParams<TData>,
) => Promise<WorkflowContext>;
