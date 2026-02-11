import toposort from "toposort";
import type { Connection, Node } from "@/generated/prisma/client";

export const topologicalSort = (
	nodes: Node[],
	connections: Connection[],
): Node[] => {
	// If no connections return node as-is (they're all independent)
	if (connections.length === 0) {
		return nodes;
	}

	// Create edges array for toposort
	const edges: [string, string][] = connections.map((connection) => [
		connection.fromNodeId,
		connection.toNodeId,
	]);

	// Track which nodes are part of connections
	const connectedNodeIds = new Set<string>();
	for (const connection of connections) {
		connectedNodeIds.add(connection.fromNodeId);
		connectedNodeIds.add(connection.toNodeId);
	}

	// Topological sort
	let sortedNodeIds: string[];
	try {
		sortedNodeIds = toposort(edges);
	} catch (error) {
		if (error instanceof Error && error.message.includes("Cyclic")) {
			throw new Error("Workflow contains a cycle");
		}
		throw error;
	}

	// Map sorted IDs back to node objects
	const nodeMap = new Map(nodes.map((n) => [n.id, n]));

	// biome-ignore lint/style/noNonNullAssertion: nodes in sortedNodeIds are guaranteed to exist in nodeMap
	const sortedNodes = sortedNodeIds.map((id) => nodeMap.get(id)!);

	// Append nodes that have no connections (they can run in any order)
	const unconnectedNodes = nodes.filter(
		(node) => !connectedNodeIds.has(node.id),
	);

	return [...sortedNodes, ...unconnectedNodes];
};
