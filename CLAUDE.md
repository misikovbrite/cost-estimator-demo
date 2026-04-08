# Cost Estimator Demo — Interactive Showcase

## Live URL
**https://cppflow.com/cost-estimator-demo/**

## What This Is
Interactive HTML demo of the Cost Estimator iOS app for screencast recordings and investor/partner demos. Single `index.html` file — no build step, no dependencies.

## 4 Screens (flow)
1. **Scan** — Photo upload + scanning animation over the image
2. **Loading** — Clipboard animation with "Building Your Estimate..."
3. **Estimate** — Full estimate detail (scope, labor, materials, totals, timeline, notes)
4. **Send** — Send estimate screen (client info, send method, upsells, total)

## Control Panel (above the phone frame, not captured in screencast)
- **Screen buttons:** Scan | Loading | Estimate | Send
- **Photo upload:** Camera icon next to Scan — loads image for scan screen

## Right Side Panel (also outside screencast area)
- **Presets** — 7 ready-made estimate tasks (Ceiling Leak, Faucet, Bathroom Tile, etc.)
- **Language** — EN, ES, AR, DE, FR, PT-BR (switches UI + API generates content in that language)
- **Accent Color** — 8 color themes (blue, teal, purple, orange, green, yellow, red, graphite)
- **Task Description** — textarea for custom estimate description
- **API Key** — OpenAI API key (stored in localStorage, pre-filled with project key)
- **Generate Estimate** — calls GPT-4.1 API, generates real estimate, populates all screens

## OpenAI Integration
- Model: `gpt-4.1`
- Prompt adapted from the iOS app's `WizardEstimationService.swift` (Call 4: Generate Estimate)
- Language instruction appended when non-English language selected
- Currency auto-switches: $ (EN/ES), ر.س (AR), € (DE/FR), R$ (PT-BR)
- Local pricing per country (US, Saudi Arabia, Germany, France, Brazil)

## File Structure
```
index.html          — The entire demo (HTML + CSS + JS, ~2000 lines)
CLAUDE.md           — This file
.github/workflows/  — GitHub Pages workflow (not working due to Actions disabled on account)
```

## Hosting & Deployment

### Production (cppflow.com)
```bash
# Deploy from local
curl -T /Users/borismisikov/Desktop/cost-estimator-demo/index.html \
  ftp://138.68.62.199/cost-estimator-demo/index.html --user deploy:111345

# Or from repo root
curl -T index.html ftp://138.68.62.199/cost-estimator-demo/index.html --user deploy:111345
```

### GitHub
- **Repo:** `misikovbrite/cost-estimator-demo` (public)
- **GitHub Pages:** NOT WORKING (Actions disabled at account level)
- URL would be: https://misikovbrite.github.io/cost-estimator-demo/

### Update workflow
1. Edit `/Users/borismisikov/Desktop/ceiling-estimate.html` (working copy)
2. Copy to repo: `cp ~/Desktop/ceiling-estimate.html ~/Desktop/cost-estimator-demo/index.html`
3. Deploy to server: `curl -T index.html ftp://138.68.62.199/cost-estimator-demo/index.html --user deploy:111345`
4. Git commit + push: `git add index.html && git commit -m "description" && git push`

## Color Palette (default)
- Primary Blue: `#1565C0`
- Blue Surface: `#E3F2FD`
- App Background: `#FAFAFA`
- Text Primary: `#1C1C1E`
- Text Secondary: `#6E6E73`
- Card Background: `#FFFFFF`
- Header Background: `#F8F8F8`

## Localization
UI strings defined in `UI_STRINGS` object (6 languages). Each language has ~30 keys covering all screens.
API content generation uses `LANG_NAMES` + `LANG_CURRENCY` + `LANG_COUNTRY` for full localization.

## API Key
Pre-filled in the HTML. If it stops working, get a new one from https://platform.openai.com/api-keys

## Related
- iOS app source: `~/Desktop/vibecode/cost-estimator-iOS/`
- Android app source: `~/AndroidStudioProjects/Cost Estimator/`
- iOS app prompt: `CostEstimator/Services/WizardEstimationService.swift`
