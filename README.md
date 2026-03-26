# Quantum Avatar Engine

This project is a web-based avatar generator powered by real quantum entropy from the CURBy API (University of Colorado).

Instead of using pseudo-random functions like `Math.random()`, this application generates avatars using entropy derived from live quantum measurements.

## What it does

- Fetches entropy from the CURBy API
- Converts that entropy into structured values
- Maps those values to avatar traits such as:
  - Face shape
  - Eye color
  - Hair style
  - Outfit
  - Expressions
- Renders a dynamic SVG-based avatar in the browser

Each avatar is influenced by real-world quantum randomness rather than deterministic algorithms.

## Why this is interesting

Most applications rely on pseudo-random generators, which are predictable.  
This project uses entropy derived from quantum experiments, making each output fundamentally unpredictable.

## Tech Stack

- React (frontend)
- Node.js + Express (backend)
- CURBy Quantum Entropy API

## How it works (high level)

1. Backend calls CURBy endpoint: "https://random.colorado.edu/api/curbyq/round/latest/result"

2. Extracts entropy from CID-based fields in the response

3. Converts entropy into numeric values

4. Frontend maps those values to avatar traits

5. Avatar is rendered as SVG with animations and interactions

## Running locally

```bash
BACKEND
cd server
npm install
node server.js


FRONTEND
npm run dev