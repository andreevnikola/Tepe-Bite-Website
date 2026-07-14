# TEPE bite Website

## **IMPORTANT — Core rules**

### UI work

For any change to UI, layout, styling, animation, responsiveness, or public-facing content:

- Invoke `/frontend-design` **before planning or coding**.
- **YOU MUST READ AND FOLLOW `STYLE_GUIDE.md` FOR ALL DESIGN DECISIONS.**
- Inspect the result in the browser at approximately **390 px, 768 px, and 1440 px**.
- Fix issues within the current task. Only report unrelated problems.

Check that:

- nothing overflows, overlaps, clips, or breaks in either language;
- images, spacing, typography, colours, buttons, and sections stay consistent;
- mobile is intentionally designed, not merely compressed desktop;
- a first-time visitor can quickly understand the product, Plovdiv connection, impact model, and next action;
- the page tells one clear, visually coherent story.

**Code compilation does not verify design work.**

### Orchestration

Act as an **orchestrator** of the implementation.

- Identify independent workstreams before implementation.
- Delegate independent work to subagents **simultaneously, not sequentially (whenever possible)**.
- Give subagents clear goals and non-overlapping file ownership.
- Keep integration, final decisions, and verification in the main agent.
- Skip subagents only if the task requires too much context, is vastly compex, or requires tightly coupled work.

### Assumptions

**Do not make material assumptions.** You must always prefer to ask if something has not been specified. When you ask you should suggest approaches.

## Product context

TEPE bite is **„Барчето на Пловдив“**: a Plovdiv-based, mission-driven brand whose first product is a salted-caramel snack bar.

Communication order:

**Plovdiv identity → product → measurable impact → action**

For every sold bar, **€0.15 goes to TEPE bite Impact**. Its value is multiplied through sponsors, donated materials, expertise, institutional support, partnerships, and volunteers.

The brand should feel **local, premium, warm, credible, human, and distinctive**—never corporate, generic, or AI-generated.

Bulgarian is primary. Every public-facing content change must also include natural English.

**Never invent product facts, nutrition or health claims, prices, results, donations, partners, approvals, legal claims, or initiative progress. Verify them or ask the user.**

## Tech stack

- **Framework:** Next.js 15, App Router, `src/`
- **UI:** React 19
- **Styling:** Tailwind CSS 4; shared styles in `src/app/globals.css`
- **State:** Jotai; language atom in `src/store/lang.ts`
- **Fonts:** Playfair Display and DM Sans via `next/font/google`
- **Images:** `next/image`; assets in `public/`

## Commands

```bash
npm run dev:fresh
npm run build
npm run lint
```

## Implementation

Before creating anything, search for an existing component, token, utility, asset, hook, helper, or abstraction.

Use this order:

**Reuse → refactor for reuse → create**

Do not duplicate existing functionality. Refactor only when safe and relevant to the current task.

**Keep scope strict.** Do not redesign, refactor, or fix unrelated areas. Do not add dependencies for functionality the project already supports.

## Completion

Before declaring completion:

- inspect the final diff;
- test the changed behaviour;
- inspect UI changes in the browser at all three widths;
- report failed or skipped checks.

Keep responses concise: state what changed, what was verified, and any relevant unresolved issue.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

For tasks where the implementation location is unknown or multiple modules may
be involved, run `graphify query "<precise task description>"` before broad
Glob, Grep, or source-file reads. Read only the files identified by Graphify.
Skip Graphify for trivial edits where the exact file is already known. Never
manually edit `graphify-out/`.

After completing a task that changed source code, run
`graphify check-update .`. If the graph is stale, run `graphify update .`
once before finishing.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
