# Cost Estimator — Interactive Demo

Interactive showcase of the **Cost Estimator** iOS app for screencast recordings, investor demos, and partner presentations.

**Live:** https://cppflow.com/cost-estimator-demo/

## Features

- **4 animated screens:** Scan → Loading → Estimate → Send
- **AI-powered estimates:** Enter any project description, get a real detailed estimate via GPT-4.1
- **6 languages:** English, Spanish, Arabic, German, French, Brazilian Portuguese
- **8 accent colors:** Instantly re-theme the entire UI
- **7 task presets:** One-click common estimate scenarios
- **Photo scanning:** Upload any photo for the scan animation screen
- **Upsell suggestions:** Add-on services on the Send screen

## Usage

1. Open the [live demo](https://cppflow.com/cost-estimator-demo/)
2. Use the control panel above the phone frame to switch screens
3. Select a preset or type a custom task description
4. Choose language and accent color
5. Click **Generate Estimate** to create a real AI-generated estimate
6. Record your screencast — only the phone frame is visible

## Deployment

```bash
# Upload to production server
curl -T index.html ftp://138.68.62.199/cost-estimator-demo/index.html --user deploy:111345
```

## Tech

Single HTML file. No build step, no dependencies, no framework. Just HTML + CSS + vanilla JS + OpenAI API.
