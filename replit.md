# Vikas Jaiswal – Developer Portfolio

A modern single-page portfolio for Vikas Jaiswal, a Java Backend Developer. Built with React 19 + Vite 6 + TypeScript + Tailwind CSS 4.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Motion (Framer Motion)
- **Build tool**: Vite 6
- **Package manager**: npm
- **Icons**: Lucide React

## Project Structure

```
/
├── src/
│   ├── components/       # Hero, About, Skills, Experience, etc.
│   ├── hooks/            # useTheme.ts
│   ├── App.tsx           # Main app with lazy loading & prefetching
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles & design tokens
├── public/               # Static assets
├── index.html
├── vite.config.ts
└── package.json
```

## Development

```bash
npm install
npm run dev   # runs on http://0.0.0.0:5000
```

## Deployment

Configured as a **static** deployment:
- Build: `npm run build`
- Output: `dist/`

## Configuration Notes

- Vite dev server runs on `0.0.0.0:5000` with `allowedHosts: true` for Replit proxy compatibility.
- No backend — purely a static frontend portfolio.
