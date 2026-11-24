# Chidy Business Analyst Portfolio — Bootstrap + Pages CMS

## What is ready
- Responsive single-page Bootstrap portfolio with fixed sidebar, smooth section navigation and vertical scrolling.
- Project detail pop-ups, artefact category filters, sector wording, and hide/show controls.
- Pages CMS configuration (`.pages.yml`) with editable profile, project records, artefacts, and media uploads.
- Sample content only. Do not publish confidential client information.

## Important: publishing newly added projects and artefacts
GitHub Pages is a static host and cannot list repository folders at runtime. This prototype uses `data/projects-index.json` and `data/artefacts-index.json` as manifests. A GitHub Actions workflow regenerates these files whenever CMS changes are pushed. If you are editing locally, run `python scripts/build_indexes.py` after adding/removing records.

## Free publishing
1. Create a public GitHub repository and upload **all** the contents of this folder, including `.pages.yml`, `.github` and `scripts`.
2. GitHub repository > Settings > Pages > Build and deployment > Source: **Deploy from a branch** > Branch: `main`, folder `/ (root)`.
3. Visit the GitHub Pages URL displayed by GitHub. It may take a few minutes to publish.
4. Visit https://app.pagescms.org, sign in with GitHub, install/authorize the Pages CMS GitHub App for the repository, and select the repository.
5. Edit `Profile and sections`, `Projects`, and `Artefact library`. CMS saves changes as GitHub commits. The workflow updates the manifests, and GitHub Pages publishes the changed files.
6. To add files, use the Documents and spreadsheets media source, then select the uploaded file in an artefact record.

## Notes
- `index.html` opened directly from disk may not load JSON due to browser security. Use a local web server, e.g. `python -m http.server 8000`, then visit http://localhost:8000.
- The website uses a Bootstrap CSS CDN and therefore requires internet access for Bootstrap styles (custom CSS also applies).
- The Experience timeline is currently static HTML; the sector line is CMS-editable. We can make experience entries CMS-editable next.
- CMS editing is field-based, not direct click-to-edit like WordPress.
- Media stored in a public GitHub repository is public. Redact private data before uploading.
