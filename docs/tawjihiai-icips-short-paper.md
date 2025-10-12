# TawjihiAI: AI Tutors for Personalized Arabic Curriculum Learning in Jordan’s National Exams

**Author:** Alaa Sumrain  
**Affiliation:** Founder, TawjihiAI  
**Email:** [alaasumrain@gmail.com](mailto:alaasumrain@gmail.com)

---

## Abstract

This paper presents *TawjihiAI*, an Arabic-language intelligent tutoring system designed to help Jordanian students prepare for the national Tawjihi exams. The platform combines subject-specialized AI tutors with a retrieval-augmented learning pipeline that is aligned to the Jordanian Ministry of Education curriculum. Each subject is represented by a guided large language model with a distinct persona, grounded on chunked textbook data, catalog metadata, and real-time session memories. The system integrates adaptive feedback, gamified progress tracking, and deterministic study artefacts surfaced through a Study Path experience. A six-week pilot with Tawjihi students yielded a \(+22\%\) relative gain in practice scores and increased daily study streaks. This paper outlines TawjihiAI’s design, implementation, and the broader implications of localized AI tutors for education in the Arab world.

**Keywords:** AI tutors, Arabic education, informatics education, Tawjihi, generative AI, adaptive learning, retrieval-augmented generation

---

## 1. Introduction

The Jordanian *Tawjihi* exam is a decisive academic milestone that determines university admission and future opportunities. Despite its importance, preparation often relies on rote learning, outdated materials, and limited access to personalized guidance.

AI tools such as ChatGPT, Khanmigo, and Duolingo have revolutionized global education, yet none are culturally or linguistically adapted to the Arabic-speaking world. Students in Jordan face a clear gap: modern AI tutoring systems that understand both **Arabic language** and **local curricula** are virtually nonexistent.

### 1.1 Pain Points Observed in the Field

- **Over-reliance on private tutoring:** Families spend an average of 18–22% of household income on Tawjihi tutoring, according to recent Ministry of Education surveys (2023). This amplifies inequity across socio-economic segments [8].
- **Limited digital access:** UNESCO reporting shows that just over half of Jordanian secondary schools have consistent computer lab access, limiting exposure to adaptive tools before high-stakes revision [6].
- **Fragmented study resources:** School-issued textbooks remain the canonical source of truth, yet students frequently assemble ad-hoc notes and worksheets, raising the risk of misinformation.
- **Confidence gap:** Interviews with eight Tawjihi teachers uncovered a pattern of students “second-guessing” answers when explanations are not anchored to familiar Arabic terminology, reinforcing the need for narrative-rich guidance [7].

One student participant summarized the stakes as follows: “If I misinterpret even one calculus question, my engineering dream collapses.” *TawjihiAI* responds by combining empathetic tutor personas with deterministic, curriculum-linked outputs, keeping the emphasis on practical problem solving.

An accompanying nationwide intake form drew 104 submissions from eight governorates, with Amman (41%), Irbid (19%), and Zarqa (11%) topping the list. Nearly three quarters of respondents relied on private lessons, and 64% reported spending at least 70 JOD per month on supplementary prep. More than half noted they “lose time hopping between sources,” shaping TawjihiAI’s focus on unified, trustworthy study flows [7]. Figure&nbsp;1 visualizes the geographic spread and spending patterns that informed product prioritization.

*TawjihiAI* aims to bridge this gap. It introduces a fully Arabic AI tutoring experience, featuring humanized subject tutors and context-aware learning assistance. The platform’s mission is to make high-quality AI tutoring accessible, relatable, and academically accurate for every Tawjihi student.

![Figure placeholder: Intake respondents by governorate and monthly spend buckets.](figures/fig01-intake-distribution.png)

*Figure 1. Proposed visualization summarizing the 104-intake survey submissions (governorate distribution and monthly Tawjihi spend).*

---

## 2. Related Work

AI-powered learning platforms such as Khan Academy’s *Khanmigo* and Google’s *NotebookLM* demonstrate the potential of conversational AI in education. However, most rely on English datasets and global curricula.

In the Arab region, existing edtech tools are either content repositories or multiple-choice practice apps — not intelligent tutors. Few integrate generative AI with national curricula or Arabic NLP, highlighting a research and implementation gap that *TawjihiAI* directly addresses.

---

## 3. System Overview

*TawjihiAI* is built as a modular, multi-surface tutoring platform that serves web, mobile, and conversational experiences. Each tutor persona (e.g., **الخوارزمي** for Mathematics, **Oxford** for English, **Adam** for Arabic) is instantiated by a guided large language model (LLM) with curriculum-aware guardrails and memory controls. Figure&nbsp;2 outlines the system architecture anchoring these surfaces.

![Figure placeholder: End-to-end architecture showing Supabase data tier, FastAPI services, Agno tutor workflows, and client surfaces.](figures/fig02-architecture-overview.png)

*Figure 2. High-level architecture diagram of TawjihiAI highlighting curriculum ingestion, RAG services, tutor orchestration, and user-facing channels.*

### 3.1 Platform Components

- **Web application:** Next.js 15 with Material UI delivers the primary Study Path interface, onboarding flows, and authenticated student portal. Capacitor projects extend the same React codebase to iOS and Android, preserving offline-ready hooks and native notifications.
- **Backend services:** A FastAPI-based stack hosted in Supabase integrates authentication, file storage, REST APIs, and a pgvector-enabled Postgres database. Rate limiting, Supabase Row Level Security, and observability instrumentation (Langfuse/OpenTelemetry) maintain privacy and traceability.
- **AI orchestration:** Agno v2 workflows create subject tutors by composing Gemini 2.5 Flash models with tool access (calculator, Wikipedia), curriculum filters, and personalized session memories (`tawjihi_sessions_memories`). Tutor creation is declarative (`create_agent_from_config`) so new subjects inherit guardrails and metadata.
- **Data layer:** A curated `tawjihi_chunks` table stores textbook passages tagged with subject, unit, lesson sequence, and page spans. Companion catalog tables (`catalog_subjects`, `catalog_units`, `catalog_lessons`) encode hierarchical ordering, time estimates, and skills coverage used across tutors and Study Path.
- **Product surfaces:** Three coordinated experiences—Study Path lesson explorer, chat-based tutoring, and notifications/dashboard—share the same data contracts. Students seamlessly move from a lesson outline to a live conversation with الخوارزمي, carrying context via shared `session_id` values.

### 3.2 Study Path RAG Services

To guarantee curriculum fidelity, TawjihiAI exposes deterministic APIs that transform chunked textbook data into actionable learning artefacts:

- `/api/lessons/{lesson_id}/content` returns structured lesson metadata, outlines, key terms, and mapped chunks.
- `/api/lessons/{lesson_id}/flashcards` generates vetted flashcard scaffolds (`front`, `back`, `source`) ready for polishing.
- `/api/lessons/{lesson_id}/quiz` provides short-answer and multiple-choice skeletons derived from lesson passages.

These endpoints are powered by service functions in `lesson_content.py` (`load_lesson_catalog`, `load_lesson_content`, `extract_flashcard_candidates`, `extract_quiz_items`) that operate on Supabase data and respect per-lesson limits. Redis caching, bilingual output fields, difficulty tagging, and citation anchors are staged as follow-on enhancements.

### 3.3 Tutor Workflow Integration

The math workflow (`math_curriculum.py`) demonstrates how Study Path outputs are interleaved with conversational tutoring. Figure&nbsp;3 maps the current Assess–Teach–Practice–Evaluate loop and the Study Path artefacts used in each phase:

![Figure placeholder: Swimlane diagram for the math workflow (Assess → Teach → Practice → Evaluate) mapped to Study Path artefacts.](figures/fig03-math-workflow.png)

*Figure 3. Tutor workflow swimlane illustrating how catalog data and Study Path artefacts flow through the math AGNO workflow.*

1. **Catalog load:** Grade-12 lessons are prefetched into workflow state, giving tutors awareness of sequencing and completion history.
2. **Teach step:** On-demand lesson retrieval injects outlines, flashcards, and quizzes into session memory, ensuring every explanation is sourced.
3. **Practice step:** Student requests for “بطاقات” or “اختبار” trigger flashcard and quiz surfaces produced by the RAG services; otherwise tutors fall back to dynamic practice prompts.
4. **Evaluate step:** Placeholder scoring updates mastery metrics and flags lessons needing review, setting the stage for analytics-backed adaptivity.

---

## 4. Implementation & Testing

All metrics reported in this section represent preliminary internal findings captured during Q4 2024 pilots and research sprints.

### 4.1 Listening Sessions

Before shipping the Study Path beta, three virtual listening sessions were hosted with 18 students shortlisted from the intake form. Sessions ran in Arabic, lasted 60 minutes, and centered on three prompts: the biggest Tawjihi anxiety, the most time-consuming study task, and the ideal “smart” companion. Common threads included:

- **Fear of forgetting procedures:** 61% worried about “blanking” on calculus steps or physics constants under exam pressure. Participants asked for quick, contextual refreshers tied to official textbook visuals.
- **Fragmented resources:** Students juggled school notebooks, YouTube playlists, and tutoring worksheets. Many kept “five tabs open and no idea which one to trust,” motivating Study Path’s curriculum-linked flashcards and citations.
- **Preference for small-group sharing:** Two-thirds preferred camera-off sessions, reinforcing that the product should support private, judgment-free practice before they are ready for teacher feedback.

Those findings informed early design decisions: keeping the interface bilingual-friendly, foregrounding page-number citations, and ensuring the tutor personas feel approachable rather than robotic [7]. Figure&nbsp;4 depicts the Study Path detail screen annotated with these artefacts.

![Figure placeholder: Annotated Study Path lesson detail screen with flashcards, quiz tabs, and Ask the tutor CTA.](figures/fig04-study-path-ui.png)

*Figure 4. Suggested screenshot-based figure of the Study Path interface, emphasizing curriculum-aligned artefacts and the tutor hand-off.*

### 4.2 Deployment Status

The current production stack spans the Supabase backend, Next.js portal, and Agno tutor workflows. Authenticated users can onboard, select subjects, and launch Study Path lessons that stream curriculum-grounded responses. File upload validators, chat history retrieval, and multimodal agent runs are exercised through automated backend tests.

### 4.3 Study Path Pilot

A controlled pilot involved 20 Grade-12 students preparing for Tawjihi 2025. Students accessed the Study Path interface daily to review math lessons and consult الخوارزمي. Usage analytics and survey feedback surfaced early trends:

- **Daily engagement:** 90% of participants launched at least one tutor session per day, supported by keyboard-accessible topic navigation and the “Ask the tutor” hand-off.
- **Comprehension gains:** Learners reported higher confidence when flashcards and quizzes used colloquial Arabic alongside classical phrasing, validating the bilingual roadmap.
- **Perceived trust:** Grounded explanations with inline citations were highlighted as “reassuring,” complementing the platform’s persona-driven motivation.

Quantitatively, average mock-exam scores improved from 58.4% to 71.2% after six weeks (\(n = 18\) students who completed both assessments) [7]. The relative gain is
\[
\Delta = \frac{71.2 - 58.4}{58.4} \approx 0.22.
\]

\begin{table}[t]
\centering
\begin{tabular}{lccc}
\hline
\textbf{Cohort} & \textbf{\(n\)} & \textbf{Baseline (\%)} & \textbf{Post (\%)} \\
\hline
Pilot students & 18 & 58.4 & 71.2 \\
Control (self-study) & 12 & 57.9 & 59.1 \\
\hline
\end{tabular}
\caption{Comparison of mock-exam scores over six weeks for Study Path pilot vs. self-directed peers.}
\end{table}

![Figure placeholder: Bar or line chart comparing baseline vs. post scores for pilot and control cohorts, plus daily streak trend.](figures/fig05-pilot-results.png)

*Figure 5. Pilot outcomes visualization showing relative score gains and engagement streaks.*

Figure&nbsp;5 will chart the comparative performance and engagement streaks referenced above, providing an at-a-glance view for ICIPS reviewers.

### 4.4 Verification Workflow

Regression testing covers API contracts for lesson content, flashcards, quizzes, and enhanced agent runs. Frontend snapshots validate Study Path panels, while Supabase policies are verified through point-in-time SQL scripts. Upcoming instrumentation will connect quiz completion events to mastery analytics and teacher review flows, expanding the evidence base.

### 4.5 Human Stories

- **Nour (12th grade science stream):** Used Study Path flashcards during 20-minute morning commutes. Her daily streak reached 34 consecutive days, and she reported finally “seeing” the connection between textbook proofs and colloquial explanations.
- **Ahmad (teacher, Zarqa):** Adopted the tutor dashboard to preview lesson artefacts before class. He highlighted the ability to “trace every answer back to page numbers” as a prerequisite for recommending the tool to colleagues.

---

## 5. Discussion

Localization proved to be a key factor in user satisfaction. Students responded more positively to AI tutors that spoke naturally in Arabic rather than using literal translations. Study Path’s deterministic artefacts further anchored trust by letting learners cross-check answers against official textbooks.

The pilot also highlighted product considerations:

- Adaptive pacing remains critical: some learners sought succinct summaries; others relied on step-by-step derivations. Difficulty tagging and daily objectives are prioritized to accommodate both profiles.
- Teacher oversight is essential for school adoption. The roadmap includes educator review surfaces so quiz items and flashcards can be audited before classroom use.
- Infrastructure resilience matters when scaling. Planned Redis caching, bilingual payloads, and RAG metadata enrichment will reduce latency while enabling future subject expansions (e.g., English, Arabic literature, scientific streams).
- Storytelling amplifies impact. Presenting pilot metrics alongside personal narratives helped stakeholders—from parents to school administrators—see TawjihiAI as a supportive companion rather than a black-box system.

---

## 6. Conclusion

*TawjihiAI* demonstrates the potential of localized AI tutors in transforming national exam preparation. By combining persona-driven LLMs with retrieval-augmented Study Path services, the platform delivers culturally resonant, curriculum-grounded guidance that matches Tawjihi learners’ needs.

Future work will focus on:

- Expanding catalog coverage and rolling out tutor workflows across all Tawjihi subjects and language tracks.  
- Integrating adaptive feedback loops that leverage mastery analytics, daily objectives, and verified quiz scoring.  
- Partnering with schools and ministries for larger-scale pilots, teacher review programs, and certification pathways.  
- Extending bilingual outputs, offline-first mobile experiences, and parent-facing insights to broaden access.

This initiative marks a step toward reimagining Arabic education through intelligent, student-centered AI design, while aligning with ICIPS 2025’s emphasis on inclusive, evidence-based educational technologies.

---

## References

1. Khan Academy. (2023). *Khanmigo: AI for learning.*  
2. OpenAI. (2024). *GPT-4 Technical Report.*  
3. Ministry of Education, Jordan. (2022). *Tawjihi Curriculum Overview.*  
4. Al-Khalil, M. et al. (2023). *Arabic NLP for Education: Opportunities and Challenges.*  
5. Duolingo. (2022). *Language Learning with AI.*  
6. UNESCO Institute for Statistics. (2022). *Jordan Education Data Highlights.*  
7. TawjihiAI Product Team. (2024). *Study Path Pilot Log (Internal Report).*  
8. Ministry of Education, Jordan. (2023). *Household Expenditure Survey on Tawjihi Preparation.*

---
