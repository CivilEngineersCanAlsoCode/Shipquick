# Pseudocode: BMM Module Reverse Engineering

1. **Step 1: Extract Agent Data** <!-- ref: 1 -->
   - Loop through files in `_bmad/bmm/agents/*.md` <!-- ref: 1.1 -->
   - For each file, parse the YAML frontmatter and the persona section <!-- ref: 1.2 -->
   - Map Name, Role, and Expertise to a table format <!-- ref: 1.3 -->

2. **Step 2: Map Workflow Categories** <!-- ref: 2 -->
   - Scan `_bmad/bmm/workflows/` subdirectories <!-- ref: 2.1 -->
   - Identify core phases: 1-Analysis, 2-Planning, 3-Solutioning, 4-Implementation <!-- ref: 2.2 -->
   - List key workflows under each phase <!-- ref: 2.3 -->

3. **Step 3: Define Module Identity** <!-- ref: 3 -->
   - Identify bmm as the primary method for AI-driven Agile project execution <!-- ref: 3.1 -->
   - Define target users (Developers, PMs, Architects) <!-- ref: 3.2 -->

4. **Step 4: Generate Brief** <!-- ref: 4 -->
   - Use the template at `_bmad/bmb/workflows/module/templates/brief-template.md` <!-- ref: 4.1 -->
   - Fill in placeholders with extracted data <!-- ref: 4.2 -->
   - Save to `_bmad-output/bmb-creations/modules/module-brief-bmm.md` <!-- ref: 4.3 -->
