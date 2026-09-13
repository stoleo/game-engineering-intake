# Game Engineering Intake

Standalone, AI-provider-neutral protocol plus an optional browser intake wizard. No provider-specific SDK, backend, or API key required. The website does not run an AI or connect to your game.

## Use with any coding or game-building AI

Point your AI at this repository and say:

> Assess my game using AGENTS.md and PROMPT.md. Inspect the project you can access, complete the intake from evidence, return to this chat with only material questions, wait for answers when needed, then prioritize worthwhile improvements. Use Big wins and read-only assessment by default. Preserve my existing answers and authorization.

The AI needs its own project access. It can use the protocol directly; the form is optional.

Big wins is the default threshold. Negligible gains are filtered before effort ranking. Every recommendation needs evidence, expected outcome, the smallest sufficient intervention, total effort, verification, and stopping conditions. Zero qualifying actions is valid. Fine polish requires explicit selection and a limited budget. Assessment and implementation have separate authorization and budgets; form entries do not grant permission.

Repo: https://github.com/stoleo/game-engineering-intake
Pages: https://stoleo.github.io/game-engineering-intake/

## Run
Open `index.html` locally, or use GitHub Pages after Settings → Pages → main / root.

Answers and imported text stay in browser storage where available; the application uploads no intake data. The hosted page and external fonts still make network requests. Copy or download a packet to share with your chosen AI. The full protocol is bundled for offline use.

Known key fields measures completeness, not evidence quality or game readiness. Unknown does not count as complete.

Supported UTF-8 text files (txt, md, csv, json, tsv, log, yaml, yml) enter exports up to 80,000 characters per file with explicit truncation notices. Files over 2 MiB are omitted before reading. Images, PDFs, DOCX and unsupported formats are listed as contents NOT included: attach them separately in your AI chat or paste excerpts. Legacy saved text warns that original completeness is unknown. Storage failures show a warning; export before closing the tab.

## Development checks

With Node.js 18 or newer:

```sh
node scripts/build-prompt.cjs
node scripts/build-prompt.cjs --check
node --test
```

PROMPT.md is authoritative; regenerate prompt-data.js after editing it. The generated copy makes local-file exports work without a fetch. Tests cover packet and wizard behavior, not whether an external AI will follow instructions. GitHub Pages serves main from the repository root; verify the deployed commit and live wizard after publishing.

## Files
- `index.html` — intake wizard
- `PROMPT.md` — analysis engine
- `AGENTS.md` — AI entry point
- `prompt-data.js` — generated offline protocol
- `wizard-data.js` — intake fields
- `wizard-app.js` — form and export behavior
- `LICENSE` — MIT
