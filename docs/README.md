# TawjihiAI ICIPS Prep – Working README

This README captures the state of the TawjihiAI ICIPS 2025 submission workstream, why each file exists, and what remains before we package the final paper.

---

## 1. Current Deliverables

- `tawjihiai-icips-short-paper.md`  
  Draft short paper (ICIPS-style) covering problem context, system architecture, implementation, pilot findings, and roadmap. Includes figure placeholders and LaTeX-friendly math/table blocks. Metrics are marked as preliminary internal findings.

- `tawjihiai-icips-figure-prompts.md`  
  Creative brief for all figures referenced in the paper. Each section documents the visual decision, composition notes, and ready-to-use prompts for recreating assets (maps, diagrams, screenshots, charts).

---

## 2. What’s Done

- Synthesised product specs, Study Path RAG implementation notes, and pilot learnings into an ICIPS-ready narrative.
- Added preliminary quantitative results (intake survey, listening sessions, six-week pilot) with context on methodology.
- Defined five supporting visuals with detailed prompts and styling guidelines.
- Flagged all data as “preliminary internal findings” to set reviewer expectations.

---

## 3. Next Actions Before Submission

1. **Generate Figures**
   - Use the prompts in `tawjihiai-icips-figure-prompts.md` to create:
     - Intake distribution infographic (`figures/fig01-intake-distribution.png`)
     - Architecture overview diagram (`figures/fig02-architecture-overview.png`)
     - Math tutor workflow swimlane (`figures/fig03-math-workflow.png`)
     - Study Path UI annotation (`figures/fig04-study-path-ui.png`)
     - Pilot outcomes chart (`figures/fig05-pilot-results.png`)
   - Export as high-resolution PNGs (≥1200 px wide) and keep editable sources (Figma/Mermaid/etc.).

2. **Embed Visuals**
   - Replace the placeholders in `tawjihiai-icips-short-paper.md` with the final PNG paths (same filenames).
   - Verify figure captions and in-text references still read smoothly.

3. **Final Proof & Formatting**
   - Run a consistency pass (dates, spellings, citation numbering).
   - Convert the markdown to the target ICIPS format (LaTeX template or .docx) and inspect layout, especially tables/figures.
   - Prepare a reference list formatted per ICIPS guidelines if submission requires a specific style.

4. **Optional Enhancements**
   - Add a supplementary appendix if we gather more pilot stats or case studies.
   - Plan a public summary post or press kit once the paper is accepted.

---

## 4. Quick Status Snapshot

| Area | Status | Notes |
| --- | --- | --- |
| Paper narrative | ✅ Draft complete | Waiting on final visuals & formatting |
| Figures | ⏳ Prompts ready | Need design/export |
| Pilot data | ✅ Incorporated | Marked as preliminary |
| Submission prep | ⏳ Pending | Template export + final proof |

---

## 5. Contacts & References

- **Product Lead:** Alaa Sumrain – alaasumrain@gmail.com  
- **Spec Sources:** `docs/product/study_path_rag_spec.md`, `docs/product/tawjihiai_prd.md` (in repo `/Users/Alaa/TawjihiAI/`)
- **Pilot Log:** TawjihiAI internal Notion (referenced as [7] in paper)

Use this README as the checkpoint before each work session so the team stays aligned on narrative, assets, and deadlines. Update the table and next steps as tasks complete.
