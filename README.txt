Psychotherapy.care website (static + Markdown CMS)

Overview
- Static HTML/CSS site with content loaded from Markdown files in /content.
- Admin editing is handled by Decap CMS at /admin.
- Designed for deployment on Netlify with GitHub.

Editable content
- content/home.md
- content/approach.md
- content/services.md
- content/about.md
- content/contact.md

How content loading works
- script.js fetches the page-specific Markdown file.
- YAML frontmatter is parsed and rendered into each page layout.
- You can update text in Markdown without editing HTML.

CMS setup
- Admin UI: /admin/index.html
- CMS config: /admin/config.yml
- Netlify Identity + Git Gateway are required for login and publishing.

Local preview
- Use a local web server (recommended), then open index.html through that server.
- Example with Python: python -m http.server 8080

GitHub repository
- https://github.com/Ljmorrisproscore/Psychotherapy.care

Netlify setup checklist
1. In Netlify, create a new site from the GitHub repo above.
2. Build command: none (leave blank)
3. Publish directory: .
4. After first deploy, enable Identity (Site settings -> Identity).
5. In Identity -> Services, enable Git Gateway.
6. Invite your wife as a user from Identity -> Invite users.
7. Visit /admin, log in, edit content, publish.

Before production launch
- Replace placeholder contact details.
- Replace placeholder images in /assets.
- Confirm all clinical claims, modalities, and licensure wording.
