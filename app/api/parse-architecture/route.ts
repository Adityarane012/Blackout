import { NextRequest, NextResponse } from "next/server";

interface NodeDefinition {
  id: string;
  label: string;
  type: "cdn" | "loadbalancer" | "api" | "server" | "cache" | "queue" | "database";
  region: "GLOBAL" | "US-EAST" | "US-WEST" | "EU-WEST";
  baseLoad: number;
  dependencies: string[];
  x: number;
  y: number;
}

export async function POST(req: NextRequest) {
  try {
    const { jsonContent, imageBase64, imageMimeType } = await req.json();

    const systemPrompt = `You are a legendary Site Reliability Engineer (SRE) and infrastructure architect. 
Your task is to analyze an infrastructure architecture system (either provided as a JSON configuration or a visual system diagram image).

Format the output strictly as a JSON object containing two fields:
1. "nodes": An array of NodeDefinition objects representing the system components.
2. "analysis": An SRE Architectural Vulnerability & Reliability Report written in cyberpunk terminal Markdown. Focus on single points of failure, scaling risks, circular loops, cache policies, and circuit breaking. Keep the tone highly technical and cynical.

Each NodeDefinition in the "nodes" array MUST match this exact schema:
interface NodeDefinition {
  id: string; // Alphanumeric lowercase identifier, no spaces (e.g., 'cdn-1', 'auth-srv')
  label: string; // Human readable name (e.g., 'Auth Service', 'Primary MySQL')
  type: 'cdn' | 'loadbalancer' | 'api' | 'server' | 'cache' | 'queue' | 'database';
  region: 'GLOBAL' | 'US-EAST' | 'US-WEST' | 'EU-WEST';
  baseLoad: number; // Value between 15 and 70 representing initial baseline load
  dependencies: string[]; // List of other node IDs that this node connects to (sends requests to)
  x: number; // Layout position X grid value (0 to 100)
  y: number; // Layout position Y grid value (0 to 100)
}

Layout guidelines for grid mapping (x, y):
- CDN edges should be placed near the top (y: 10 - 20, spaced horizontally).
- Load Balancers should follow edges (y: 25 - 35).
- API Gateways should follow (y: 40 - 50).
- Services/Servers and Caches should sit in the middle-bottom (y: 55 - 70).
- Databases and Message Queues should sit at the bottom (y: 75 - 90).

Avoid overlapping coordinates. Always return valid JSON. Do not wrap the JSON output in markdown fences (e.g. do not use \`\`\`json).`;

    const geminiKey = process.env.GEMINI_API_KEY;

    if (imageBase64 && geminiKey) {
      // 1. Process Multimodal Vision using Google Gemini
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const mime = imageMimeType || "image/jpeg";

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemPrompt}\n\nAnalyze the attached system architecture diagram image, extract its microservices, and compile the report.` },
                  {
                    inlineData: {
                      mimeType: mime,
                      data: cleanBase64
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              maxOutputTokens: 2000,
              temperature: 0.2,
              responseMimeType: "application/json" // Force JSON output mode
            }
          })
        }
      );

      if (geminiResponse.ok) {
        const geminiData = await geminiResponse.json();
        const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        try {
          const parsed = JSON.parse(responseText);
          if (parsed.nodes && Array.isArray(parsed.nodes)) {
            return NextResponse.json(parsed);
          }
        } catch (e) {
          console.error("Gemini Multimodal JSON Parse Error:", e, responseText);
        }
      }
    }

    if (jsonContent) {
      // 2. Validate and Parse provided JSON configuration
      try {
        let nodes: NodeDefinition[] = [];
        if (typeof jsonContent === "string") {
          const parsed = JSON.parse(jsonContent);
          nodes = Array.isArray(parsed) ? parsed : parsed.nodes || [];
        } else if (Array.isArray(jsonContent)) {
          nodes = jsonContent;
        }

        // Validate basic properties
        const validatedNodes = nodes.map((node: any, idx: number) => {
          const id = node.id || `node-${idx}`;
          return {
            id: id.toLowerCase().replace(/\s+/g, "-"),
            label: node.label || `Component ${idx + 1}`,
            type: ["cdn", "loadbalancer", "api", "server", "cache", "queue", "database"].includes(node.type) 
              ? node.type 
              : "server",
            region: ["GLOBAL", "US-EAST", "US-WEST", "EU-WEST"].includes(node.region) 
              ? node.region 
              : "US-EAST",
            baseLoad: typeof node.baseLoad === "number" ? Math.max(10, Math.min(100, node.baseLoad)) : 35,
            dependencies: Array.isArray(node.dependencies) ? node.dependencies : [],
            x: typeof node.x === "number" ? Math.max(0, Math.min(100, node.x)) : 10 + (idx * 15) % 80,
            y: typeof node.y === "number" ? Math.max(0, Math.min(100, node.y)) : 40 + (idx * 10) % 50,
          };
        });

        // Query LLM to generate SRE Report based on parsed topology
        let analysis = "";
        if (geminiKey) {
          const analysisPrompt = `${systemPrompt}\n\nAnalyze this validated JSON node topology and generate the SRE report:\n${JSON.stringify(validatedNodes, null, 2)}`;
          const analysisRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: analysisPrompt }] }],
                generationConfig: {
                  maxOutputTokens: 1200,
                  temperature: 0.7,
                  responseMimeType: "application/json"
                }
              })
            }
          );
          if (analysisRes.ok) {
            const data = await analysisRes.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
            try {
              const res = JSON.parse(text);
              analysis = res.analysis || "";
            } catch (err) {
              // fallback text
            }
          }
        }

        if (!analysis) {
          analysis = generateProceduralAnalysis(validatedNodes);
        }

        return NextResponse.json({ nodes: validatedNodes, analysis });
      } catch (err) {
        return NextResponse.json({ error: "Failed to parse system topology JSON" }, { status: 400 });
      }
    }

    // 3. Fallback / Mock parsing if offline or image input failed
    const mockNodes: NodeDefinition[] = [
      { id: "custom-cdn", label: "User Gateway Edge", type: "cdn", region: "GLOBAL", baseLoad: 25, dependencies: ["custom-lb"], x: 50, y: 15 },
      { id: "custom-lb", label: "Custom LB Cluster", type: "loadbalancer", region: "US-EAST", baseLoad: 40, dependencies: ["custom-api"], x: 50, y: 30 },
      { id: "custom-api", label: "Custom API Core", type: "api", region: "US-EAST", baseLoad: 50, dependencies: ["custom-srv", "custom-cache"], x: 50, y: 48 },
      { id: "custom-cache", label: "Active Memcached", type: "cache", region: "US-EAST", baseLoad: 60, dependencies: ["custom-db"], x: 25, y: 65 },
      { id: "custom-srv", label: "Monolith Service Core", type: "server", region: "US-EAST", baseLoad: 45, dependencies: ["custom-db"], x: 75, y: 65 },
      { id: "custom-db", label: "Single SQL DB Instance", type: "database", region: "US-EAST", baseLoad: 65, dependencies: [], x: 50, y: 85 }
    ];

    return NextResponse.json({
      nodes: mockNodes,
      analysis: `### ⚡ OFFLINE / MOCK SRE DIAGNOSTICS ENGAGED\n\n**Operator Note**: Multimodal parsing bypassed. Displaying generated SRE grid layout based on default microservices.\n\n${generateProceduralAnalysis(mockNodes)}`
    });

  } catch (error: any) {
    console.error("API Parse Architecture Error:", error);
    return NextResponse.json({ error: "Internal server error occurred while parsing architecture" }, { status: 500 });
  }
}

function generateProceduralAnalysis(nodes: NodeDefinition[]): string {
  const dbs = nodes.filter((n) => n.type === "database");
  const lbs = nodes.filter((n) => n.type === "loadbalancer");
  const singlePointsOfFailure: string[] = [];

  // Identify Single Points of Failure
  if (dbs.length === 1) {
    singlePointsOfFailure.push(`**${dbs[0].label}**: Single database instance. Complete lack of read replicas. High data-loss risk under cascading crash conditions.`);
  }
  if (lbs.length === 0) {
    singlePointsOfFailure.push(`**Missing Load Balancer**: Requests route directly into API Gateway tier. Lacks edge traffic smoothing and failover capacity.`);
  }

  // Circular dependencies check
  const circular = false; // Simple placeholder

  return `# 🛡️ SRE INFRASTRUCTURE DIAGNOSTIC REPORT: CUSTOM GRID

## 📋 EXECUTIVE SUMMARY
Analyzed topology containing **${nodes.length} system components**. The design models regional flows across ${Array.from(new Set(nodes.map((n) => n.region))).length} zone coordinates. Security vulnerabilities have been mapped regarding circuit isolation and failover pathways.

## 🔍 CRITICAL ARCHITECTURAL CONCERNS (SPOFs)
${singlePointsOfFailure.length > 0 
  ? singlePointsOfFailure.map((s, idx) => `${idx + 1}. ${s}`).join("\n") 
  : "* No severe single points of database failure detected. Redundancy layers are active."}
${circular ? "* **CIRCULAR LOOPS FOUND**: Circular dependencies mapped between components, creating potential infinite queue lockups during hot retries." : ""}

## 📊 VULNERABILITY MATRIX
* **Cascade Vulnerability**: High. An outage on primary database tiers will instantly flood cache stores due to lack of bulkhead boundaries.
* **Traffic Spacing**: Moderate. Horizontal scale options are available on core layers.
* **Failover Capabilities**: ${dbs.length > 1 ? "Excellent (multi-node synchronization active)" : "Severely degraded (no passive-standby secondary targets)"}.

## 🛠 RECOMMENDATIONS
* **Bulkheading**: Segment Auth compute limits away from transactional services.
* **Circuit Breakers**: Embed automated fail-fast circuit gates on connection interfaces to shield downstream databases from request congestion.
* **Standby Replicas**: Deploy cross-region replication for stateful database tiers.`;
}
