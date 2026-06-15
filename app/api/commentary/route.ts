import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { nodes, activeScenario, recentEvents } = await req.json();

    const failedNodes = nodes.filter((n: any) => n.status === "failure");
    const stressedNodes = nodes.filter((n: any) => n.status === "stress" || n.status === "degraded");

    const prompt = `You are ORION-9, a cynical, elite cyberpunk SRE (Site Reliability Engineer) monitoring a failing high-performance grid inside a dark neon command center. Your style is brief, technical, high-tension, and rich in sci-fi atmosphere.

SYSTEM ARCHITECTURE UPDATE:
- Active Scenario: ${activeScenario}
- Stressed/Degraded Nodes: ${stressedNodes.map((n: any) => `${n.label} (${n.load}% load)`).join(", ") || "None"}
- Crashed Nodes: ${failedNodes.map((n: any) => n.label).join(", ") || "None"}

RECENT SYSTEM ALERTS:
${(recentEvents || []).slice(-3).map((e: any) => `[${e.type.toUpperCase()}] ${e.message}`).join("\n")}

TASK: Generate a single, short sentence of live telemetry commentary. Use intense cyberpunk/SRE terminology (e.g., packet storm, queue saturation, memory leak, replica lag, TCP handshake degradation, replica split-brain, pool depletion, core dump). Keep it cynical and high-stress. 
Do NOT exceed 20 words. No intro or explanation, output ONLY the direct commentary sentence.`;

    // 1. Check for Local Ollama Setup (Free Local AI)
    try {
      const localOllamaResponse = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL || "gemma2:2b",
          messages: [{ role: "user", content: prompt }],
          stream: false,
          options: {
            temperature: 0.8,
            num_predict: 40
          }
        }),
        // Short timeout to avoid hanging if Ollama is not active
        signal: AbortSignal.timeout(1200)
      });

      if (localOllamaResponse.ok) {
        const localData = await localOllamaResponse.json();
        const commentary = localData.message?.content?.trim() || "";
        if (commentary) {
          return NextResponse.json({ commentary });
        }
      }
    } catch (ollamaErr) {
      // Ollama not running locally, proceed to cloud providers
    }

    // 2. Check for Google Gemini (Free Cloud AI)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: 60,
              temperature: 0.85
            }
          })
        }
      );

      if (geminiResponse.ok) {
        const geminiData = await geminiResponse.json();
        const commentary = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        if (commentary) {
          return NextResponse.json({ commentary });
        }
      }
    }

    // 3. Check for standard OpenAI Key
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 60,
          temperature: 0.85,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const commentary = data.choices?.[0]?.message?.content?.trim();
        if (commentary) {
          return NextResponse.json({ commentary });
        }
      }
    }

    // 4. Procedural fallback for offline / no-key demo modes
    const commentary = generateProceduralCommentary(nodes, activeScenario, recentEvents);
    return NextResponse.json({ commentary });
  } catch (error: any) {
    console.error("API Commentary Error:", error);
    return NextResponse.json({
      commentary: "Warning: Telemetry link jitter. Proceeding on emergency procedural routing."
    });
  }
}

function generateProceduralCommentary(nodes: any[], scenario: string, events: any[]): string {
  const failed = nodes.filter((n) => n.status === "failure");
  const stressed = nodes.filter((n) => n.status === "stress" || n.status === "degraded");

  if (failed.length > 0) {
    const target = failed[Math.floor(Math.random() * failed.length)];
    const templates = [
      `Grid alert: ${target.label} went dark. Downstream queues are backing up into buffer limits.`,
      `Telemetry failure signature detected on ${target.label}. Thread pool exhaustion confirmed.`,
      `Cascade warning: ${target.label} outage causing packet storms on regional backbone routing.`,
      `Emergency protocol active. Re-routing traffic from collapsed node ${target.label}.`,
      `AI Predictive: ${target.label} crash indicates memory leak propagation across the hypervisor.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  if (stressed.length > 0) {
    const target = stressed[Math.floor(Math.random() * stressed.length)];
    const templates = [
      `Alert: ${target.label} load peaking at ${target.load}%. Retry storming active on port 443.`,
      `Diagnostics: Cache miss ratio rising on ${target.label}. Saturated TCP sockets detected.`,
      `Jitter spike on ${target.label}. Database connection pool depletion imminent.`,
      `Warning: Segment drift detected on ${target.label}. Regional replication lag is increasing.`,
      `Predictive SRE: Microsecond response latency on ${target.label} is beginning to degrade routing.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  if (scenario === "traffic-spike") {
    return "Massive external traffic wave hitting CDN edge. Connection threads spawning rapidly.";
  }

  const ambient = [
    "Grid status nominal. AI analytical engines monitoring heartbeat loops.",
    "Data packets shifting smoothly across regional gateways. No anomalies flagged.",
    "System telemetry clear. Power grid buffers running at optimal temperature.",
    "Active replication threads verified. AI neural net reports 100% routing health."
  ];
  return ambient[Math.floor(Math.random() * ambient.length)];
}
