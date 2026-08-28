# fibercolorcode.app

Static legal + landing site for the **Fiber Color Code** app, served by GitHub Pages.

No build step, no JavaScript, no external requests. Edit the HTML, push to `main`, done.

## Why this is a separate repo

The app repo (`fiber-color-code-app`) is **private** and must stay that way — it contains the
security audit history, Cloud Functions billing logic, and API keys. GitHub Pages on a private
repo requires a paid plan, and serving Pages from the app repo's `docs/` folder would publish
those internal documents. So the public surface lives here and here only.

## Pages served

| Path | File | Referenced by |
|------|------|---------------|
| `/` | `index.html` | — |
| `/privacy` | `privacy/index.html` | `kPrivacyPolicyUrl` in `profile_view.dart` |
| `/terms` | `terms/index.html` | `kTermsOfServiceUrl` in `profile_view.dart` |
| `/delete-account` | `delete-account/index.html` | App Store / Play Store listings |

Directories with `index.html` (rather than `privacy.html`) give extension-less URLs, which is
exactly what the app's URL constants already point at. **Do not rename these to flat `.html`
files** — it would break the in-app links.

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
sub-processors, the real 30-day purge and 14-day backup retention. That is a better starting
point than a generic template, but it is not legal advice. Have an attorney review before
selling into a procurement process.

Facts baked in that need updating if they change:

- Operator: **Fiber Education**, a sole proprietorship, Kentucky, USA
- Governing law: **Commonwealth of Kentucky**
- If you incorporate, update the entity name and form in all three documents
- Some privacy laws expect a postal contact address; none is currently listed
