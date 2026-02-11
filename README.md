# Valentine Proposal Webapp

A simple, single-page Valentine proposal webapp for **Pooja (Pooh Bear)** with a playful yes-only flow.

## Project Structure

- `index.html` - semantic page structure and app sections
- `styles.css` - scrapbook visual style, responsive layout, and animations
- `script.js` - configurable content + app behavior
- `assets/images/` - your memory photos
- `assets/audio/` - your song file

## Customize Content

Edit the `APP_CONFIG` object in `script.js`:

- `recipientName`
- `nickname`
- `eventDate` (format: `YYYY-MM-DD`)
- `eventTime`
- `eventLocation`
- `introLines`
- `finalMessage`
- `imagePaths`
- `audioPath`
- `noButtonMaxDodges`

## Add Your Media

1. Put your photos in `assets/images/`.
2. Update `imagePaths` in `script.js` to match filenames.
3. Put your music file in `assets/audio/`.
4. Update `audioPath` in `script.js`.

If files are missing:

- Missing photos show friendly placeholder cards.
- Missing audio disables music control with a clear status message.

## Run Locally

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2: Serve locally

From repo root:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to repository `Settings` -> `Pages`.
3. Under **Build and deployment**, set:
   - Source: `Deploy from a branch`
   - Branch: `main` (or your default branch)
   - Folder: `/ (root)`
4. Save and wait for the deployment.
5. Open the generated Pages URL and verify media paths load.

## Accessibility Notes

- Semantic sections and button controls
- Keyboard focus-visible styling
- Reduced motion support (`prefers-reduced-motion`)
- Contrast-forward color palette
- Explicit Play/Pause audio control

## Troubleshooting

- If images do not appear, confirm filenames and paths in `imagePaths`.
- If song cannot play, verify `audioPath` and browser media autoplay policy.
- If GitHub Pages looks unstyled, check `styles.css` path and branch/folder settings.
