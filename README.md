# fibercolorcode.app

Static product homepage + legal site for the **Fiber Color Code** app, served by GitHub Pages.

No build step. The homepage uses a small contact-dialog script and submits inquiries to a Firebase HTTPS function. Edit the HTML, CSS, or JavaScript and push to `main` to publish.

## Why this is a separate repo

The app repo (`fiber-color-code-app`) is **private** and must stay that way — it contains the
security audit history, Cloud Functions billing logic, and API keys. GitHub Pages on a private
repo requires a paid plan, and serving Pages from the app repo's `docs/` folder would publish
those internal documents. So the public surface lives here and here only.

## Pages served

| Path | File | Referenced by |
|------|------|---------------|
| `/` | `index.html` | Product homepage |
| `/privacy` | `privacy/index.html` | `kPrivacyPolicyUrl` in `profile_view.dart` |
| `/terms` | `terms/index.html` | `kTermsOfServiceUrl` in `profile_view.dart` |
| `/delete-account` | `delete-account/index.html` | App Store / Play Store listings |

Directories with `index.html` (rather than `privacy.html`) give extension-less URLs, which is
exactly what the app's URL constants already point at. **Do not rename these to flat `.html`
files** — it would break the in-app links.

## Presentation

The homepage introduces the product with a hero, actual app screenshots with sample project data,
a workflow overview, crew use cases, native FAQ disclosures, and direct web-app links in the navigation, hero,
and closing call to action. These open `https://web.fibercolorcode.app/` in the same tab;
crew inquiries and footer support retain the contact dialog. Inquiries are emailed
to the configured support inbox through the app’s existing Resend service. Customer quotes,
logos, ratings, and usage statistics must come from real, approved sources; none are
currently published. Keep the legal documents available in the homepage footer.

The three documents share a responsive layout with desktop section navigation and a native
collapsible section index on smaller screens. Keep the section links aligned with each
document's heading IDs when adding or renaming a section. Active document links use
`aria-current="page"`. The shared stylesheet includes system dark mode, keyboard focus
styles, horizontally scrollable tables, and a print layout. Policy wording and effective
dates are independent of presentation changes.

Stylesheet URLs include a content version to avoid reusing stale CSS after a deployment.
When editing `style.css`, update the `?v=` value in all five HTML pages to the first 12
characters of its SHA-256 hash (`shasum -a 256 style.css`).

## Browser icon

All five HTML pages link to the orange cable logo in `/favicon.svg`, with a
16/32/48-pixel `/favicon.ico` fallback. Keep the links root-relative so nested
legal pages and missing URLs resolve the same assets. The ICO also supports
browsers that request `/favicon.ico` automatically.

When changing either icon, update its `?v=` in all five HTML pages to the first
12 characters of that file's SHA-256 hash, as with the stylesheet. Regenerate
the ICO after editing the SVG, for example with ImageMagick:

```sh
convert -background none -density 384 favicon.svg -define icon:auto-resize=48,32,16 favicon.ico
```

## DNS setup

Point `fibercolorcode.app` at GitHub Pages. At your registrar, create:

**Apex domain** — four `A` records for `@`:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Optionally the same four as `AAAA` records for IPv6:

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

**`www` subdomain** — one `CNAME` record:

```
www  →  4easterling.github.io
```

Then in this repo: **Settings → Pages → Custom domain**, enter `fibercolorcode.app`, save, and
tick **Enforce HTTPS** once the certificate is issued (usually minutes, occasionally up to 24
hours). The `CNAME` file in this repo holds the domain so the setting survives redeploys.

DNS propagation can take up to 48 hours. Verify with `dig fibercolorcode.app +short`.

## Email aliases

The documents reference two addresses that **must exist** before the pages are truthful:

- `privacy@fibercolorcode.app` — privacy requests and deletion requests
- `support@fibercolorcode.app` — general support

Set these up as forwarding aliases at your registrar or email host. A legal page naming an
address that bounces is worse than naming no address at all.

## Before relying on these documents

They were drafted against what the app actually does — the real data inventory, the real
sub-processors, the real 30-day recovery window and retention of the most recent 14 organization
exports. That is a better starting point than a generic template, but it is not legal advice. Have an attorney review before
selling into a procurement process.

Facts baked in that need updating if they change:

- Operator: **Fiber Education**, a sole proprietorship, Kentucky, USA
- Governing law: **Commonwealth of Kentucky**
- If you incorporate, update the entity name and form in all three documents
- Some privacy laws expect a postal contact address; none is currently listed

## App screenshots

`assets/screenshots/` contains 860 × 1800 PNG captures of the production Flutter
`SpliceEditor`, its expanded results sheet, and `SignaturePadModal`. The sample
project is Vault 12 / North route with a 288-fiber North distribution destination. Both use the count
`97-168+24XD+193-264+24XD+289-336+48XD` (192 live fibers and 96 dead positions).
These contain no customer records. Captures use the app's light theme, Material
icons, and Roboto device font fallback (rather than Flutter test square glyphs).
The homepage labels and frames full captures side by side and opens screenshot links in an on-page image
viewer. The viewer has a discreet X close control, supports Escape and background clicks,
and restores focus to the original screenshot. Without JavaScript, the links still open
the image files. `image-viewer.js` uses the same content-hash versioning as `contact.js`.
Replace captures when the corresponding app UI changes; do not redraw
screens as mockups or add fictional data as customer evidence.

Screenshot links use content-hash query versions. Refresh each image’s version in
`index.html` whenever its PNG changes, so returning visitors get the new capture.

## Contact form

The crew inquiry and footer support buttons open the native dialog in `index.html`. `contact.js`
submits name, email, optional company and phone, message, and CTA source to
`https://us-central1-fiber-color-code-app.cloudfunctions.net/submitWebsiteContact`.
The backend is maintained in the private app repository at `functions/src/website_contact.ts`;
deploy that function before publishing frontend changes that depend on it. It uses
`RESEND_API_KEY`, `INVITE_FROM_EMAIL`, and `WEBSITE_CONTACT_EMAIL` (default:
`support@fibercolorcode.app`). No email credentials belong in this public repository.

The form preserves details on failure, prevents duplicate clicks, and reuses a Resend
idempotency key when retrying unchanged submissions. The backend validates inputs,
restricts browser origins, discards honeypot submissions, and limits attempts to five
per hour per IP/email plus 100 per day globally. Rate-limit records contain HMAC hashes
and counters, not inquiry bodies. Success means the email provider accepted the message.

When editing `contact.js`, update its `?v=` in `index.html` to the first 12 characters
of the file’s SHA-256 hash, as with the stylesheet.
