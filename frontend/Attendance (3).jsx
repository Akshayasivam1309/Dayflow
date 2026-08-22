:root {
  /* Color: Dayflow — a calm, focused workday palette */
  --df-bg: #F4F5F8;
  --df-surface: #FFFFFF;
  --df-surface-sunken: #EDEFF4;
  --df-border: #E1E4EA;
  --df-text: #1B1E27;
  --df-text-muted: #666C7B;
  --df-text-faint: #9096A3;

  --df-primary: #3C4FE0;       /* flow indigo — the brand's motion color */
  --df-primary-dark: #2E3EC2;
  --df-primary-soft: #EBEDFC;

  --df-amber: #E29C3F;         /* pending / attention */
  --df-amber-soft: #FBF1E1;
  --df-green: #1F9D62;         /* approved / present */
  --df-green-soft: #E7F6EE;
  --df-red: #D6493F;           /* rejected / absent */
  --df-red-soft: #FBEAE8;
  --df-slate: #6B7280;         /* leave / neutral */
  --df-slate-soft: #EEF0F3;

  --df-radius-sm: 6px;
  --df-radius: 10px;
  --df-radius-lg: 16px;

  --df-shadow-sm: 0 1px 2px rgba(20, 24, 38, 0.06);
  --df-shadow: 0 4px 16px rgba(20, 24, 38, 0.07);
  --df-shadow-lg: 0 12px 32px rgba(20, 24, 38, 0.12);

  --df-font-display: 'Sora', system-ui, sans-serif;
  --df-font-body: 'Inter', system-ui, sans-serif;
}

* { box-sizing: border-box; }

html, body, #root {
  height: 100%;
  margin: 0;
}

body {
  background: var(--df-bg);
  color: var(--df-text);
  font-family: var(--df-font-body);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: var(--df-font-display);
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.01em;
}

p { margin: 0; }

button, input, select, textarea {
  font-family: inherit;
  font-size: inherit;
}

a { color: inherit; text-decoration: none; }

:focus-visible {
  outline: 2px solid var(--df-primary);
  outline-offset: 2px;
}

/* Scrollbar - subtle */
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-thumb { background: #D3D7E0; border-radius: 8px; }
::-webkit-scrollbar-track { background: transparent; }

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
