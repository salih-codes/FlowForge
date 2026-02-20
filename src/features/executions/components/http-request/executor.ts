import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import type { NodeExecutor } from "@/features/executions/types";

type HTTPRequestData = {
	variableName?: string;
	endpoint?: string;
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	body?: string;
};

export const httpRequestExecutor: NodeExecutor<HTTPRequestData> = async ({
	data,
	nodeId,
	context,
	step,
}) => {
	// TODO: Publish loading state for http request
	if (!data.endpoint) {
		throw new NonRetriableError(
			"HTTP Request node error: No endpoint configured",
		);
	}

	if (!data.variableName && typeof data.variableName === "string") {
		throw new NonRetriableError("Variable name not configured");
	}

	const result = await step.run("http-request", async () => {
		// biome-ignore lint/style/noNonNullAssertion: non-null assertion is needed here for now
		const endpoint = data.endpoint!;
		const method = data.method || "GET";
		const options: KyOptions = { method };

		if (["POST", "PUT", "PATCH"].includes(method)) {
			options.body = data.body;
			options.headers = {
				"Contnet-Type": "application/json",
			};
		}
		const response = await ky(endpoint, options);
		const contentType = response.headers.get("content-type");
		const responseData = contentType?.includes("application/json")
			? await response.json()
			: await response.text();

		const responsePayload = {
			httpResponse: {
				status: response.status,
				statusText: response.statusText,
				data: responseData,
			},
		};
		if (data.variableName) {
			return {
				...context,
				[data.variableName]: responsePayload,
			};
		}
		// Fallback to direct HTTP Response
		return {
			...context,
			...responsePayload,
		};
	});

	// TODO: Publish success state for http request

	return result;
};
