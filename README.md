# Mathew Aoun: personal website

A fast, dependency-free static site (plain HTML, CSS and JavaScript). No build step.

## Before you publish
1. **Resume:** the "View resume" buttons open `assets/MathewAounResume.pdf`. To update your resume, replace that file (keep the same name).
2. **Email:** your uOttawa address (`maoun045@uottawa.ca`) is used for now. It will likely stop working after you graduate, so switch to a permanent address. Search `index.html` for `maoun045@uottawa.ca` (two places) and replace it.
3. **Phone number:** intentionally not on the site. Public phone numbers attract spam.
4. **Photo:** the hero portrait is `assets/img/mathew.jpg`. Replace it with another image of the same shape (2:3, portrait) to change it.

## Preview locally
```bash
cd ~/Desktop/personal-website
python3 -m http.server 8000
# open http://localhost:8000
```

## Publish (free) with GitHub Pages
1. Create a GitHub repository (for example `personal-website`) and push this folder to it.
2. Repo Settings > Pages > Build and deployment: Deploy from a branch > `main` / root.
3. The site goes live at `https://<username>.github.io/personal-website/`.

## Use your Namecheap domain
1. In the repo, add a file named `CNAME` containing only your domain (for example `mathewaoun.com`).
2. In Namecheap > Domain List > Manage > Advanced DNS, add:
   - four `A` records for host `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - one `CNAME` record: host `www`, value `<username>.github.io.`
3. Back in GitHub Pages settings, enter the custom domain and tick **Enforce HTTPS** once it becomes available (can take up to an hour).
4. Once live, add `<link rel="canonical" href="https://yourdomain.com/">` and an `og:url` tag to `index.html`.

Netlify or Vercel also work: drag the folder in, then add the domain in their settings.

## Editing content
Everything lives in `index.html`. Colours and fonts are CSS variables at the top of `css/styles.css`.
