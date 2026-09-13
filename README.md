# aristotelisgkouvas.github.io

Personal portfolio — a static site, no build step, no dependencies. Served by
GitHub Pages straight from `main`.

## Structure

```
index.html            landing (freelance-facing): hero, live strip, services, IQManager
                      case study, work grid, process, about, FAQ, contact — bilingual
cv/                   one-page CV, styled to print straight to PDF
404.html              branded not-found page (GitHub Pages serves it automatically)
style.css             the whole stylesheet, including the print rules
script.js             menu, reveals, lightbox, copy-email, WhatsApp (PHONE), EL/EN i18n, analytics
sitemap.xml           all 9 pages — keep in sync when a case study is added
robots.txt            points crawlers at the sitemap
projects/<slug>/      one case study per folder, same template throughout
assets/projects/      screenshots, one folder per project
```

## Working on it

There is nothing to install. Serve the folder so that root-relative paths
(`/style.css` in `404.html`) resolve:

```bash
python3 -m http.server 8000
```

## Adding a case study

1. Copy an existing folder under `projects/` and edit it — every page uses the
   same template (hero → Greek summary → cover → overview + facts → highlights
   → screens → next project).
2. Put screenshots in `assets/projects/<slug>/`. Desktop shots at 1600px wide,
   mobile at 828px. **Convert them to `.webp` before committing** (see below)
   and reference the `.webp` from the HTML.
3. Every `<img>` needs `width`, `height`, `loading="lazy"` and
   `decoding="async"`. The dimensions are what stop the page jumping while
   images load.
4. Add a card to the work grid in `index.html`.
5. Add the URL to `sitemap.xml` and refresh `lastmod`.
6. Renumber `Project <strong>NN</strong>` and re-point the "Next project" link
   at the bottom of each case study — the chain is a closed loop.

## Images

In-page images are WebP; it cut the asset payload by about 70% with no visible
difference on UI screenshots. To convert a new batch:

```bash
python3 -c "
from PIL import Image; import sys, os
for p in sys.argv[1:]:
    Image.open(p).convert('RGB').save(os.path.splitext(p)[0]+'.webp','WEBP',quality=82,method=6)
" assets/projects/<slug>/*.png
```

Keep the original PNG/JPG **only** for files referenced by an `og:image` /
`twitter:image` meta tag — some social scrapers still do not take WebP. Those
originals are never downloaded by a visitor.

## Before publishing a client project

Client work is the part of this site that can actually cause trouble, so:

- No client logo, name or branding in a screenshot unless you have written
  permission to show it. The Tank 3 screenshots were scrubbed for exactly this.
- Say in the page when screenshots use demo/seeded data — otherwise a careful
  reader assumes you published real customer records.
- Do not claim a licence ("MIT", "open source") without a public repository
  link on the same page. An unverifiable claim costs more than the badge earns.

## Print

`style.css` ends with a `@media print` block that flips the theme to black on
white, drops the chrome and keeps cards from splitting across pages. Recruiters
do print these. If you add a new component, check it there too:

```bash
# renders the print stylesheet to a PDF you can eyeball
chrome --headless --no-pdf-header-footer --print-to-pdf=out.pdf http://localhost:8000/cv/
```

## Language

The homepage is authored in Greek. Every translatable element carries a
`data-i18n="key"` attribute and the English strings live in the `EN` dictionary
at the bottom of `script.js`. Resolution order: `?lang=en` in the URL, then the
choice saved in `localStorage`, then the browser's own language. When you add
copy to `index.html`, add the key to `EN` too, then check nothing was missed:

```bash
python3 - <<'EOF'
import re
html = open("index.html", encoding="utf-8").read()
js = open("script.js", encoding="utf-8").read()
keys = set(re.findall(r'data-i18n="([^"]+)"', html))
en = set(re.findall(r'(?m)^\s{4}([A-Za-z0-9]+):', js[js.index("const EN = {"):]))
print("missing from EN:", sorted(keys - en) or "none")
EOF
```

## Contact details

`PHONE` at the bottom of `script.js` is empty on purpose; the WhatsApp button
stays hidden until you fill it in (international format).

## Design

Tokens at the top of `style.css` follow the "Portfolio v2" design canvas:
steel-blue accent `#7FA3C4`, gold `#D9B27C` for numbers, green `#7FC9A0` for
"live" states, on `#0C1117`. Sora for headings, Figtree for body, Fira Code for
mono. Case-study pages share the same tokens, so a colour change there is a
one-line change here.

## Analytics

Off by default. Set `GOATCOUNTER_CODE` at the top of `script.js` to the code you
register at [goatcounter.com](https://www.goatcounter.com/) and it starts
counting. No cookies, no personal data, so no consent banner.
