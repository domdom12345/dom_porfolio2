# Deployment & Custom Domain Guide for Dominic M. Blancaflor

Your portfolio is fully configured and ready for free global hosting with automatic SSL (HTTPS) and custom domain support.

---

## ⚡ Option 1: Deploy with Vercel (Fastest & Best Custom Domain Support)

Vercel provides blazing-fast global edge hosting and lets you assign any free subdomain (`https://dominic-blancaflor.vercel.app`) or link a custom domain (like `dominicblancaflor.com`).

### Steps:
1. Go to [vercel.com/signup](https://vercel.com/signup) and sign in with GitHub or your email.
2. Click **"Add New..."** > **"Project"**.
3. Import your GitHub repository (or use the Vercel CLI / drag & drop).
4. Since this is a static HTML/React project, leave all Build & Output settings as default.
5. Click **"Deploy"**.
6. Your portfolio is instantly live on a public domain like:
   `https://dominic-blancaflor.vercel.app`

### Adding a Custom Domain on Vercel:
1. Go to your Project Dashboard on Vercel > **Settings** > **Domains**.
2. Type your domain (e.g., `dominicblancaflor.com` or `dominic.dev`).
3. Add the DNS records shown (usually a CNAME or A record) at your domain registrar. Vercel automatically generates free SSL certificates.

---

## 🐙 Option 2: Deploy with GitHub Pages (Free `github.io` Domain)

Your local repository is already initialized and committed with a GitHub Actions workflow (`.github/workflows/deploy.yml`) and `.nojekyll` configuration.

### Steps:
1. Open your browser and go to [github.com/new](https://github.com/new).
2. Set the **Repository name**:
   - For a subpath URL: `dominic-portfolio` (Live URL: `https://<username>.github.io/dominic-portfolio/`)
   - For a root domain URL: `<username>.github.io` (Live URL: `https://<username>.github.io/`)
3. Keep it **Public** and **DO NOT** check "Add a README" or ".gitignore" (these are already created).
4. Click **"Create repository"**.
5. In your project directory (`C:\Users\Admin\.gemini\antigravity\scratch\dominic-portfolio`), run:
   ```bash
   git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<REPO-NAME>.git
   git push -u origin main
   ```
6. In GitHub, go to your repository **Settings** > **Pages**:
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
7. The GitHub Action will run automatically and deploy your site to:
   `https://<YOUR-GITHUB-USERNAME>.github.io/`

---

## 🌐 Option 3: Instant Drag & Drop via Netlify (No Terminal / 30 Seconds)

1. Open [app.netlify.com/drop](https://app.netlify.com/drop) in your browser.
2. Drag and drop the `dominic-portfolio` folder directly onto the page.
3. Netlify will deploy it in 5 seconds and give you a live domain like:
   `https://dominic-blancaflor.netlify.app`
4. You can change the site name or connect any custom domain under Site Configuration > Domain Management.
