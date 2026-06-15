import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let events: any[] = [];
  let scenario = "";
  let elapsedTime = 0;
  try {
    const body = await req.json();
    events = body.events || [];
    scenario = body.scenario || "normal";
    elapsedTime = body.elapsedTime || 0;

    const prompt = `You are ORION-9, a cynical, veteran cyberpunk SRE Operator. Generate a premium Post-Mortem Incident Report for the simulated infrastructure collapse.

INCIDENT DATA:
- Trigger Scenario: ${scenario}
- Total Operational Jitter Time: ${elapsedTime} seconds
- Full Incident Log Timeline:
${(events || []).map((e: any) => `[${e.type.toUpperCase()}] ${e.message}`).join("\n")}

TASK: Write a formal post-mortem SRE report in Markdown format. The style must be high-tension, technical, and rich in terminal atmosphere.
Include precisely these sections:
1. # ⚡ INCIDENT RESPONSE POST-MORTEM: SYSTEM BLACKOUT
2. ## 📋 EXECUTIVE SUMMARY
   - Brief 2-3 sentence overview of the system state, cascade triggers, and ultimate outage severity.
3. ## 🔍 ROOT CAUSE ANALYSIS (RCA)
   - A step-by-step breakdown of how the failure propagated through the dependencies (e.g. from Primary Database to upstream services, API gateway, and edge).
4. ## 📊 SYSTEM IMPACT SUMMARY
   - Detail the degradation percentage of network bandwidth, active connections, and listing crashed services.
5. ## 🛠 SRE REMEDIATION TASKS
   - Provide 3 highly realistic, high-tech bullet points to insulate the grid from this signature in the future (e.g., circuit breakers, bulkheading, shadow replication).

Keep the content immersive and highly realistic. Output raw Markdown directly. No conversational text outside the markdown.`;

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
            temperature: 0.7,
            num_predict: 1200
          }
        }),
        // 5 second timeout for larger report generation
        signal: AbortSignal.timeout(5000)
      });

      if (localOllamaResponse.ok) {
        const localData = await localOllamaResponse.json();
        const report = localData.message?.content?.trim() || "";
        if (report) {
          return NextResponse.json({ report });
        }
      }
    } catch (ollamaErr) {
      // Local Ollama not active
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
              maxOutputTokens: 1500,
              temperature: 0.7
            }
          })
        }
      );

      if (geminiResponse.ok) {
        const geminiData = await geminiResponse.json();
        const report = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        if (report) {
          return NextResponse.json({ report });
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
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const report = data.choices?.[0]?.message?.content?.trim();
        if (report) {
          return NextResponse.json({ report });
        }
      }
    }

    // 4. Fallback procedural template
    const report = generateProceduralAnalysis(events, scenario, elapsedTime);
    return NextResponse.json({ report });
  } catch (error: any) {
    console.error("API Analyze Error:", error);
    return NextResponse.json({
      report: `### ⚡ Incident Analysis Engine Failover\n\n**Warning**: Analysis feed degraded. Displaying emergency cached post-mortem template.\n\n${generateProceduralAnalysis(events, scenario, elapsedTime)}`
    });
  }
}

function generateProceduralAnalysis(events: any[], scenario: string, elapsedTime: number): string {
  const crashes = (events || []).filter((e) => e.type === "critical" && e.message.includes("crashed"));
  const warnings = (events || []).filter((e) => e.type === "warning");

  const crashedList = crashes.map((c) => {
    const match = c.message.match(/CRITICAL: (.*) crashed/);
    return match ? match[1] : "Component Node";
  });

  const uniqueCrashes = Array.from(new Set(crashedList));

  return `# ⚡ INCIDENT RESPONSE POST-MORTEM: SYSTEM BLACKOUT

## 📋 EXECUTIVE SUMMARY
At T-${elapsedTime}s, a massive grid failure occurred during the **${scenario.toUpperCase()}** simulation sequence. The outage registered maximum severity, triggering emergency circuit breaks across the active network. **${uniqueCrashes.length} critical services** suffered catastrophic collapse, leading to downstream connection pool saturation and edge request drops. 

## 🔍 ROOT CAUSE ANALYSIS (RCA)
1. **Trigger Phase**: The scenario initialized under **${scenario}** parameter parameters.
2. **Initial Stress**: Thread pool exhaustion began propagating through core resources. Load indicators spiked quickly past safety limits.
3. **Cascading Failure**: 
   ${uniqueCrashes.map((c, i) => `${i + 1}. **${c}** failed completely, causing all client requests to queue, generating a retry storm.`).join("\n   ")}
4. **Complete Outage**: The core load balancers choked on TCP socket backlog, triggering complete client disconnection.

## 📊 SYSTEM IMPACT SUMMARY
- **Total Duration**: ${elapsedTime} seconds of unmitigated system downtime.
- **Service Status**: collapsed (**${uniqueCrashes.join(", ") || "No nodes crashed"}**).
- **Packet Loss**: ~87.4% on all internal regional routes.
- **Average Latency**: Spiked from 25ms to over 999ms during key cascade events.

## 🛠 SRE REMEDIATION TASKS
* **Implement Circuit Breakers**: Deploy intelligent load-shedding circuit breakers on API gateway dependencies to instantly fail-fast and avoid thread pool saturation.
* **Bulkhead Isolation**: Separate auth and transaction transaction pools into independent compute spaces to prevent replication drift from killing independent services.
* **Dynamic Graceful Degradation**: Enable automatic fallback to static cached mock-data feeds when db replica latency crosses a 350ms threshold.`;
}
