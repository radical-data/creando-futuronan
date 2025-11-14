# Creando Futuronan Website

This is the source code for the Creando Futuronan website, a practical school for design and digital culture in Aruba.

Built with Astro and Tailwind CSS.

## 🚀 Getting Started

```bash
pnpm install
pnpm dev
```

Then visit http://localhost:4321 in your browser.

## 🧰 Build for Production

```bash
pnpm build
pnpm preview
```

## 📝 Content Management

This site uses [Decap CMS](https://decapcms.org/) for managing structured content in `src/content/`.

### Admin Access

- **Admin route**: `/admin` (served by `src/pages/admin.html`)
- **Config**: `public/admin/config.yml`
- **Backend**: GitHub, commits to `main` branch

**Production**: Visit `/admin`, log in with GitHub. Requires OAuth setup (Decap Cloud, Netlify Identity, or custom OAuth server).

**Local Development**:
```bash
# Terminal 1
pnpm dev

# Terminal 2
npx decap-server

# Visit http://localhost:4321/admin
```

### Collections

The CMS manages four content collections (all JSON format):

1. **Events** (`src/content/events/`) - Workshops, info sessions, etc. Appear on home page and `/events`.

2. **Programmes** (`src/content/programmes/`) - Spark and Sustain program info. Edit only; don't create new.

3. **Open Calls** (`src/content/open-calls/`) - Application windows. Active calls trigger the urgency banner.

4. **Partners** (`src/content/partners/`) - Partner info. Note: logos must be added via Git; CMS only manages the path reference.

### Workflow

Content changes use Git-based editorial workflow: draft → review → publish. Publishing merges to `main` and triggers site rebuild. All changes are tracked in Git history.
