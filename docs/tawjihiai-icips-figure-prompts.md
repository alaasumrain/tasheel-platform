# TawjihiAI ICIPS Figure Prompts & Decisions

This note captures the final call on how we will visualise each figure from the ICIPS short paper and gives you ready-to-use prompts (textual or mermaid-esque) so you can recreate them in your preferred tool. Metrics are intentionally kept as “preliminary internal findings” to set the right expectation while still telling a meaningful product story.

---

## General Styling Guidelines
- **Tone:** Product case-study first, academic second. Use clean UI-inspired palettes (e.g., TawjihiAI blues `#1E3A8A`, accent orange `#F97316`, neutral grays `#F3F4F6`/`#111827`).
- **Typography:** Sans-serif labels (Inter, SF Pro, or similar); Arabic labels where relevant should mirror the app’s bilingual styling.
- **Annotations:** Prefer concise callouts over verbose text. Highlight what the viewer should notice (e.g., “41% from Amman”).
- **Export format:** SVG for editing, PNG for embedding in the paper (1200px width minimum so it stays sharp when pasted into LaTeX/Word).
- **Status tags:** If a figure contains pilot numbers, add a small caption note reading “Preliminary internal findings (n-sized cohorts).”

---

## Figure 1 – Intake Distribution Snapshot (`figures/fig01-intake-distribution.png`)
**Decision:** Keep the intake survey results because they signal nationwide demand; present both geography and monthly spend in a single, easy-to-read visual.

**Composition Idea**
- Left: Jordan map with governorates colour-coded by respondent count (Amman 41%, Irbid 19%, Zarqa 11%, others aggregated).
- Right: Stacked or grouped bar showing monthly spend buckets (≤50, 50–70, 70–100, 100+ JOD) with percentages.
- Footer note: “Preliminary intake survey, Oct 2024 (n = 104).”

**Prompt (for Figma/Mermaid/AI image tools)**
```
Create a clean infographic that combines:
1. A simplified outline map of Jordan with Amman highlighted at 41%, Irbid 19%, Zarqa 11%, and an “Other governorates” segment covering the rest. Use TawjihiAI blue for the highest percentage and lighter shades for smaller proportions. Include percentage labels directly on the map.
2. A horizontal bar chart listing monthly Tawjihi prep spend buckets: ≤50 JOD (12%), 50–70 JOD (24%), 70–100 JOD (37%), >100 JOD (27%). Bars should be right-aligned with percentages at the end.
3. Title: “Who signed up to shape TawjihiAI?”
4. Subtitle: “Preliminary intake survey, Oct 2024 (n = 104).”
5. Small note: “64% rely on private lessons; 58% report ‘too many sources’.”
Keep layout wide (16:9), background off-white, Arabic translation optional under the title.
```

---

## Figure 2 – Architecture Overview (`figures/fig02-architecture-overview.png`)
**Decision:** Diagram should prioritise clarity over exhaustive detail; focus on how curriculum data flows into Study Path and tutors.

**Key Blocks**
- **Data Ingestion:** `Curriculum JSON`, `Chunking Pipeline`, `Supabase Postgres (catalog_* + tawjihi_chunks)`.
- **Service Layer:** `FastAPI / Study Path APIs` with `/content`, `/flashcards`, `/quiz`.
- **Tutor Orchestration:** `Agno Workflow (Assess → Teach → Practice → Evaluate)` with Gemini 2.5 Flash and session memories.
- **Client Surfaces:** `Next.js Web`, `Capacitor Mobile`, `Tutor Personas (الخوارزمي, Oxford, Adam)`.
- **Telemetry:** `Langfuse / PostHog analytics`.
- Arrows showing data flow and context sharing. Annotate the shared `session_id`.

**Prompt**
```
Draw a systems diagram for “TawjihiAI Architecture” with the following lanes:
- Data Layer: Curriculum JSON → Chunking Pipeline → Supabase (catalog tables + tawjihi_chunks).
- Service Layer: FastAPI Study Path APIs (/api/lessons/... endpoints) connected back to Supabase for reads.
- AI Layer: Agno Tutor Workflow using Gemini 2.5 Flash, pulling lesson artefacts via the Study Path APIs and writing session memories to Supabase.
- Client Layer: Next.js Web App, Capacitor Mobile App, and Tutor Personas (الخوارزمي, Oxford, Adam) consuming the workflow outputs.
- Observability lane: Langfuse + PostHog tapping into both the API and tutor workflow.
Use directional arrows, bilingual labels where meaningful, and show the shared session_id context travelling between Study Path UI and tutor sessions.
```

---

## Figure 3 – Math Tutor Workflow (`figures/fig03-math-workflow.png`)
**Decision:** Illustrate the current workflow even if future iterations add more logic; transparency beats silence.

**Swimlane Layout**
- Lanes: `Study Path APIs`, `Tutor Workflow`, `Student`.
- Steps:
  1. Assess – Tutor checks mastery + picks next lesson (state: `lesson_catalog`, `current_index`).
  2. Teach – Workflow calls `/content`, stores `latest_chunks`, `latest_lesson_stats`.
  3. Practice – Depending on student request, fetches `/flashcards` or `/quiz`.
  4. Evaluate – Placeholder scoring updates `mastery_scores`, `review_needed`.
- Optional: add small icons for flashcards/quizzes.

**Prompt**
```
Create a swimlane diagram titled “الخوارزمي – Math Workflow (Current)” with three lanes: Student, Tutor Workflow (Agno), and Study Path Services.
- Assess: Tutor checks session state (lesson_catalog, mastery_scores) and messages student about focus area.
- Teach: Tutor requests /api/lessons/{id}/content, receives outline + key terms, and delivers an explanation.
- Practice: Student asks for flashcards or quizzes; tutor calls /flashcards or /quiz endpoints and returns artefacts.
- Evaluate: Tutor applies provisional score (default 85%), updates review_needed if score < 70, advances lesson index.
Include state variables in parentheses and note that everything stays grounded via session_id.
```

---

## Figure 4 – Study Path UI (`figures/fig04-study-path-ui.png`)
**Decision:** Use a real or staged screenshot; annotate to show how the RAG outputs surface in-product.

**Capture Targets**
- Topic list with highlighted lesson.
- Detail panel showing outline, key terms, chunk citations (page numbers).
- Tabs for Flashcards and Quiz with sample cards.
- “Ask الخوارزمي” CTA at the bottom handing off to chat.
- Optional bilingual hints (“المصطلحات الرئيسية”, etc.).

**Prompt**
```
Design an annotated product screenshot of the TawjihiAI Study Path lesson detail screen:
- Highlight the selected lesson in the left-side topic list.
- In the main panel, show lesson title, estimate (e.g., 15 minutes), outline bullets, key terms with Arabic labels, and a preview paragraph.
- Include tabs for Flashcards (with at least two sample cards) and Quiz (show one multiple-choice skeleton).
- Add callouts pointing to page citations, the flashcard tab, quiz tab, and the “Ask الخوارزمي” button that opens the tutor chat.
- Use the app’s colour palette: deep blue header, neutral white content cards, orange accent for CTA.
- Include a badge reading “Beta – Preliminary UI” to signal this is an in-progress build.
```

---

## Figure 5 – Pilot Results (`figures/fig05-pilot-results.png`)
**Decision:** Keep the \(+22\%\) and streak story but mark the data as preliminary. Combine score comparison and streak trend for a fuller picture.

**Recommended Layout**
- Left: Grouped bar chart (Baseline vs. Post) for Pilot (n = 18) and Control (n = 12).
- Right or top strip: Line showing median daily streak length rising from 12 to 34 days.
- Caption note: “Preliminary internal findings, Q4 2024.”

**Prompt**
```
Create a results graphic titled “Pilot Outcomes (Preliminary – Q4 2024)” with:
- Grouped bar chart: Pilot Students (Baseline 58.4%, Post 71.2%), Control Group (Baseline 57.9%, Post 59.1%). Use TawjihiAI blue for baseline and accent orange for post.
- Small line chart or sparkline showing median daily study streaks increasing from 12 days to 34 over the six-week pilot.
- Callouts: “+22% relative gain in mock exam scores” and “90% daily tutor engagement”.
- Footer: “n = 18 (pilot) vs. n = 12 (self-study); preliminary internal findings.”
Keep axes clean, background light, fonts sans-serif.
```

---

## Next Moves
1. Recreate/export each figure using the prompts above. Keep editable sources (Figma, Mermaid, etc.) so we can tweak quickly if ICIPS reviewers request changes.
2. Drop the final PNGs into `docs/tawjihiai-icips-short-paper.md` by replacing the placeholders.
3. Once visuals are in place, regenerate the manuscript (LaTeX/Word) and review layout for flow.

Let me know when the visuals are ready and I can help with integration or final formatting. !*** End Patch
