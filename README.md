# aristotelisgkouvas.github.io

Personal portfolio — a static site, no build step, no dependencies. Served by
GitHub Pages straight from `main`.

## Structure

```
index.html            landing: hero, about, skills, work grid, contact
404.html              branded not-found page (GitHub Pages serves it automatically)
style.css             the whole stylesheet
script.js             menu, scroll reveals, lightbox, hero rotator, analytics loader
sitemap.xml           all 8 pages — keep in sync when a case study is added
robots.txt            points crawlers at the sitemap
projects/<slug>/      one case study per folder, same template throughout
assets/projects/      screenshots, one folder per project
```

## Working on it

There is nothing to install. Open `index.html` in a browser, or serve the
folder so that root-relative paths (`/style.css` in `404.html`) resolve:

```bash
python3 -m http.server 8000
```

## Adding a case study

1. Copy an existing folder under `projects/` and edit it — every page uses the
   same template (hero → cover → overview + facts → highlights → screens →
   next project).
2. Put screenshots in `assets/projects/<slug>/`. Desktop shots at 1600px wide,
   mobile at 828px. Use JPEG for photo-heavy images, PNG for UI screenshots so
   the text stays sharp.
3. Add a card to the work grid in `index.html`.
4. Add the URL to `sitemap.xml`.
5. Renumber `Project <strong>NN</strong>` and re-point the "Next project" link
   at the bottom of each case study — the chain is a closed loop.

## Analytics

Off by default. Set `GOATCOUNTER_CODE` at the top of `script.js` to the code you
register at [goatcounter.com](https://www.goatcounter.com/) and it starts
counting. No cookies, no personal data, so no consent banner.
