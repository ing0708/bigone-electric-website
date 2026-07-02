# Big One Electric — Website

Static one-page site (pure HTML/CSS/vanilla JS, no build step). Built as a
brand catalog to drive phone/LINE inquiries — there is no cart or checkout.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Images

No image assets are included in this repo yet. Every `<img>` uses the
relative path it will need once real files are added (see table below) and
degrades gracefully to a styled navy placeholder (via `onerror` +
`.img-fallback` in `css/style.css`) when the file is missing — so images can
be dropped in later with **no code changes**.

Place files under `images/` using these exact names:

| File | Content |
|---|---|
| `logo.png` | Full-color logo, transparent background |
| `logo-white.png` | All-white logo for the dark nav/footer |
| `favicon.png` | Cropped bolt icon from the logo |
| `product-amber.png` / `-red.png` / `-blue.png` / `-green.png` | Rotary warning light, 4 colors, transparent background |
| `installation-real.jpg` | Real night installation photo (hero trust section) |
| `about-header.jpg` | About Us opening background |
| `about-timeline-1.jpg` … `-4.jpg` | Timeline illustrations (1992 / 2005 / 2020 / 2023–2025) |
| `about-standards.jpg` | Close-up of electrical/control work |
| `products/*.jpg` (12 files) | One image per product category — see `index.html` for exact filenames |
| `og-share.jpg` | 1200×630 social share preview |

## Products

The product grid mirrors the 12 categories from the printed catalog
(`Big One Electric` PDF): Rotary Warning Light, Terminal Blocks Rail Type
(TR/TBR), Cable Glands, Terminal Block (TB), Grounding Bus-Bar, Pressure
Clips, Bus Bar Insulators, DIN Rail, Pulley for Electric Cable, Liquid
Level Relay, Current Transformers (CT), and Fuse E16 Base. Per the design
brief this is intentionally a spec/price-free grid — pricing and model
codes (e.g. TR10–TR400, MSQ-40/60/100/130) live in the catalog, not the
website.

## Notes

- The hero color switcher defaults to **amber** and cross-fades the
  headline word, glow, and product photo via the animatable `--accent`
  CSS custom property (`@property --accent` in `css/style.css`).
- The footer LINE OA button is a placeholder (`href="#"`) — swap in the
  real LINE ID/link once available; see the comment above it in
  `index.html`.
- The footer map uses a no-API-key Google Maps `output=embed` iframe built
  from the office address.
