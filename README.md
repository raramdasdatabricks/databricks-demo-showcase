# Databricks Demo Showcase

A polished, customer-facing microsite that presents short Databricks demo videos and
GIFs on one page — organized into a clear value story across **AI agents, AI apps,
quality & observability, governance & compliance, and data + AI workflows**.

Built as a **static site** (plain HTML + CSS + vanilla JS, zero build step) so it's fast,
trivially hostable, and easy to hand off. Swap in a real video by dropping a file in a
folder and editing one JSON entry.

---

## What's in the box

```
databricks-demo-showcase/
├── index.html              # Homepage: hero, featured, filters, grid, CTA, modal
├── css/styles.css          # Design system (Databricks-inspired)
├── js/app.js               # Data load, render, filtering, click-to-play modal
├── data/demos.json         # ← SINGLE SOURCE OF TRUTH for all demo content
├── assets/
│   ├── videos/             # drop .mp4 files here
│   ├── gifs/               # drop .gif files here
│   └── thumbnails/         # optional preview images / video posters
├── .nojekyll               # required for correct GitHub Pages asset serving
├── README.md               # this file
└── PITCH_SUMMARY.md         # copy-paste blurb for a deck or email
```

---

## Local preview

Browsers block `fetch()` of local JSON over `file://`, so run a tiny static server
(any one of these):

```bash
# Python 3 (already on macOS)
cd databricks-demo-showcase
python3 -m http.server 8000
# → open http://localhost:8000

# or Node
npx serve .

# or VS Code: right-click index.html → "Open with Live Server"
```

That's the entire dev loop. There is **no build, no npm install, no framework.**

---

## Adding / editing demos

Everything is driven by `data/demos.json`. Each demo object:

| Field           | Purpose                                                              |
|-----------------|----------------------------------------------------------------------|
| `id`            | Unique slug                                                          |
| `title`         | Card + modal heading                                                 |
| `category`      | One of the category `id`s (`ai-agents`, `ai-apps`, `quality`, `governance`, `platform`) |
| `categoryLabel` | Human-readable category shown on the card                           |
| `featured`      | `true` → also shown in the Featured section near the top            |
| `duration`      | Shown as a chip on the card (e.g. `"2:10"`)                          |
| `type`          | `"video"` (mp4) or `"gif"`                                           |
| `src`           | Path to the asset, e.g. `assets/videos/agent.mp4`. Leave `""` for a "coming soon" placeholder |
| `thumbnail`     | Optional preview/poster image. Omit → branded gradient preview      |
| `summary`       | One-line value statement on the card                                |
| `whatItIs` / `whyItMatters` / `businessProblem` / `audience` | Shown in the detail modal |

To **drop in a real video**:
1. Copy your file to `assets/videos/your-demo.mp4`.
2. In `demos.json`, set `"type": "video"` and `"src": "assets/videos/your-demo.mp4"`.
3. (Optional) add a poster image to `assets/thumbnails/` and set `"thumbnail"`.
4. Refresh. Done.

Add a brand-new card by appending another object to the `demos` array. Change the hero
copy or CTAs via the `site` block at the top of the same file.

---

## Deploy to GitHub Pages (free)

GitHub Pages serves static files directly — no build pipeline needed.

1. **Create a repo** and push this folder's contents to the `main` branch:
   ```bash
   cd databricks-demo-showcase
   git init && git add . && git commit -m "Databricks demo showcase"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. In the repo: **Settings → Pages → Build and deployment**.
   - **Source:** *Deploy from a branch*
   - **Branch:** `main`, folder `/ (root)`
   - Save.
3. Wait ~1 minute. Your site is live at:
   `https://<you>.github.io/<repo>/`

### Base-path note (important)
This site uses **relative paths** (`css/styles.css`, `data/demos.json`, `assets/...`),
so it works correctly under a project subpath like `/<repo>/` **without any
configuration**. Do not switch to absolute paths (`/css/...`) — those break on project
Pages because the site lives in a subdirectory, not at the domain root.

The included **`.nojekyll`** file tells Pages to serve files as-is (Jekyll otherwise
ignores files/folders beginning with `_` and can interfere with asset handling).

### Build output expectations
There is no build artifact — **what you push is what is served.** The "output" is the
repository root itself.

### Other zero-cost options
The same static folder deploys as-is to **Netlify** or **Cloudflare Pages** (drag-and-drop
or connect the repo; no build command, publish directory = root). GitHub Pages is the
default recommendation since it needs no extra account.

---

## Customizing the brand / contact details

- **Hero, headline, CTAs:** edit the `site` block in `data/demos.json`.
- **Contact email:** the CTAs link to `rajesh.ramdas@databricks.com` — search/replace in
  `index.html` and `data/demos.json` for your account team's address.
- **Colors / type:** all tokens live at the top of `css/styles.css` (`:root`).

---

## Notes

- Responsive down to mobile; 3-up grid on desktop, 2-up on tablet, 1-up on phone.
- Accessible: keyboard-focusable cards, `Esc` closes the modal, reduced-motion respected.
- No external runtime dependencies (only a Google Fonts link, which degrades gracefully).

> **Disclaimer:** This microsite and its placeholder content are demonstration material
> prepared for customer conversations. Replace placeholders with customer-safe assets and
> validate any described capability against your own environment and requirements before
> relying on it in production.
