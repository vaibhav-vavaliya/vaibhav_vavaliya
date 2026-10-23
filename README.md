# Vaibhav Vavaliya — portfolio

Built with Next.js in the **Blockstead** style: an ivory "game lobby" look made of plastic blocks.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out (upload to Vercel, Netlify or GitHub Pages)
```

## Make it yours

- **All text, projects, skills and jobs:** `data/profile.ts`
- **CV:** replace `public/cv.pdf` with your real CV
- **Email for the contact form:** `profile.email` in `data/profile.ts`
- **Colours and spacing:** `app/tokens.css` (Ivory light theme + Black-brick dark theme); component styles are in `app/blockstead.css`
- **Pixel textures:** `public/textures/black-bricks.svg` (dark theme background), `stone-bricks.svg` (badge tray + wall above the footer)
- **XP bar level:** `profile.xp` in `data/profile.ts`

The contact form opens the visitor's mail app, because a static site has no server.
To receive messages directly, swap `onSubmit` in `components/MessageForm.tsx` for Formspree or a similar service.
