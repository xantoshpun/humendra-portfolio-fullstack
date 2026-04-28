import { getSiteMeta } from '@/lib/content';

const NAV_LINKS = [
  { href: '#about',     label: 'About' },
  { href: '#skills',    label: 'Skills' },
  { href: '#projects',  label: 'Projects' },
  { href: '#education', label: 'Experience' },
  { href: '#contact',   label: 'Contact' },
];

export async function Footer() {
  const meta = await getSiteMeta();
  const socials = (meta?.socials ?? {}) as Record<string, string>;
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <h3>{meta?.name}</h3>
            <p>Data Analyst · Python Developer · Power BI Specialist</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Navigation</h4>
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href}>{l.label}</a>
              ))}
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener">LinkedIn</a>
              )}
              {socials.github && (
                <a href={socials.github} target="_blank" rel="noopener">GitHub</a>
              )}
              {socials.kaggle && (
                <a href={socials.kaggle} target="_blank" rel="noopener">Kaggle</a>
              )}
              {socials.resume && (
                <a href={socials.resume} target="_blank" rel="noopener">Resume</a>
              )}
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <span>
            © {year} {meta?.name}. Built with{' '}
            <a href="https://nextjs.org" target="_blank" rel="noopener">Next.js</a>.
          </span>
          <div className="footer-socials">
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className="soc-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            )}
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noopener" aria-label="GitHub" className="soc-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </a>
            )}
            {socials.kaggle && (
              <a href={socials.kaggle} target="_blank" rel="noopener" aria-label="Kaggle" className="soc-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.334z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
