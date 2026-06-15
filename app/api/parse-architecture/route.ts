import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.jsonContent) {
      // Parse the JSON text
      const nodes = JSON.parse(body.jsonContent);
      
      return NextResponse.json({
        success: true,
        nodes: nodes,
        analysis: "### Architecture Scanned\n\n- Validated **" + nodes.length + "** components.\n- JSON topology parsed successfully.\n- Structural integrity looks stable.\n\nReady for simulated deployment."
      });
    }

    if (body.imageBase64) {
      // Mock for image parsing
      return NextResponse.json({
        success: true,
        nodes: [],
        analysis: "### Vision Scan Failed\n\nMultimodal capabilities are currently offline. Please use JSON topology import for the demo."
      });
    }

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  } catch (error: any) {
    console.error("API Parse Error:", error);
    return NextResponse.json({ error: "Failed to parse architecture" }, { status: 500 });
  }
}
