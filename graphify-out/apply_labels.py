import sys, json
from graphify.build import build_from_json
from graphify.cluster import score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from pathlib import Path

# Load files
extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text(encoding="utf-8"))
detection  = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding="utf-8"))
analysis   = json.loads(Path('graphify-out/.graphify_analysis.json').read_text(encoding="utf-8"))

G = build_from_json(extraction)
communities = {int(k): v for k, v in analysis['communities'].items()}
cohesion = {int(k): v for k, v in analysis['cohesion'].items()}
tokens = {'input': extraction.get('input_tokens', 0), 'output': extraction.get('output_tokens', 0)}

# Choose descriptive labels for the communities
labels = {
    0: "External Dependencies",
    1: "Miscellaneous UI Components",
    2: "Simulation State Management",
    3: "Sidebar Navigation UI",
    4: "Network Graph Visualization",
    5: "Core Design System & UI Utils",
    6: "Form Fields & Descriptions",
    7: "Command Palette UI",
    8: "TypeScript Configuration",
    9: "Button Groups & Card Items",
    10: "Components JSON Settings",
    11: "Development Tooling Dependencies",
    12: "Alert Dialog Components",
    13: "Menubar Navigation UI",
    14: "Context Menu Components",
    15: "Dropdown Menu Components",
    16: "Landing Page Sections",
    17: "Carousel Sliders UI",
    18: "Chart & Visualization UI",
    19: "Input Groups & Form Controls",
    20: "Select Dropdown UI",
    21: "Sheet & Drawer Overlays",
    22: "Drawer Bottom-Sheet UI",
    23: "Navigation Menu Header",
    24: "Pagination Controls UI",
    25: "Empty State Indicators",
    26: "Project Documentation Metas",
    27: "Interactive Simulation Previews",
    28: "Global Font & Metadata",
    29: "Tabbed Navigation UI",
    30: "Alert Banner Indicators",
    31: "Animated Canvas Backgrounds"
}

# Add default community names for any omitted/thin ones if they exist
for k in communities:
    if k not in labels:
        labels[k] = f"Community {k}"

# Regenerate questions with real community labels
questions = suggest_questions(G, communities, labels)

# Regenerate the plain-language report
report = generate(G, communities, cohesion, labels, analysis['gods'], analysis['surprises'], detection, tokens, '.', suggested_questions=questions)
Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding="utf-8")
Path('graphify-out/.graphify_labels.json').write_text(json.dumps({str(k): v for k, v in labels.items()}, ensure_ascii=False), encoding="utf-8")
print('Report updated with community labels')
