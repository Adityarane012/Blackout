import { NextRequest, NextResponse } from "next/server";
import { INFRASTRUCTURE_TOPOLOGY } from "@/lib/graph-definition";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nodeId = searchParams.get("nodeId");

  if (!nodeId) {
    return NextResponse.json({ error: "Missing nodeId parameter" }, { status: 400 });
  }

  // 1. Try to query the local FastAPI Neo4j backend
  try {
    const res = await fetch(`http://localhost:8000/nodes/${nodeId}/blast-radius`, {
      signal: AbortSignal.timeout(1500)
    });

    if (res.ok) {
      const data = await res.json();
      // Neo4j blast radius is a list of node records. Extract IDs.
      if (Array.isArray(data)) {
        const ids = data.map((n: any) => n.id);
        return NextResponse.json({ source: "neo4j", ids });
      }
    }
  } catch (err) {
    // Backend/Neo4j offline - fall through to fallback BFS
  }

  // 2. Fallback: Recursive upstream BFS traversal using static topology
  const ids = calculateFallbackBlastRadius(nodeId);
  return NextResponse.json({ source: "fallback", ids });
}

function calculateFallbackBlastRadius(rootId: string): string[] {
  // Build a reverse dependency graph (child -> parents)
  // For each node in topology, it lists nodes it depends on.
  // We want to find nodes that depend on a given node (upstream dependents).
  const dependentsMap = new Map<string, string[]>();
  
  INFRASTRUCTURE_TOPOLOGY.forEach((node) => {
    node.dependencies.forEach((depId) => {
      if (!dependentsMap.has(depId)) {
        dependentsMap.set(depId, []);
      }
      dependentsMap.get(depId)!.push(node.id);
    });
  });

  const visited = new Set<string>();
  const queue: string[] = [rootId];
  visited.add(rootId);

  let head = 0;
  while (head < queue.length) {
    const current = queue[head++];
    const parents = dependentsMap.get(current) || [];
    parents.forEach((parent) => {
      if (!visited.has(parent)) {
        visited.add(parent);
        queue.push(parent);
      }
    });
  }

  // Remove the root node from the blast radius list
  visited.delete(rootId);
  return Array.from(visited);
}
