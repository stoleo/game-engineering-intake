# Game Engineering Intake

Standalone project: a browser intake wizard plus the analysis prompt it generates.

Fill in the current game. Export a packet. Paste that packet into Grok to get a scored diagnosis and a phased improvement plan.

This is its own project. It is not part of an app codebase.

## Run locally

Open `index.html` in Chrome or Edge. No install.

Answers stay in that browser (`localStorage`). Nothing is sent to a server.

## Publish on GitHub Pages

Repo: `stoleo/game-engineering-intake`

1. Settings → Pages → Deploy from a branch → `main` / root

Live URL:

https://stoleo.github.io/game-engineering-intake/

## Use

1. Fill the intake. Unknown is allowed. Invented player evidence is not.
2. Drop text notes if you have them.
3. Copy the full prompt or download the `.md` packet.
4. Paste into a new Grok chat.
5. Read the scorecard first. If 7s appear with no player behaviour, the intake was too thin.

## Repo layout

```
index.html      working wizard
PROMPT.md       standalone analysis prompt
README.md       this file
LICENSE         MIT
```
