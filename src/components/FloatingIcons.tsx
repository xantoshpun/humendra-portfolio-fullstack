const ICONS = [
  { file: 'icons8-python-96.png',           left: 8,  top: 15 },
  { file: 'icons8-postgresql-96.png',       left: 90, top: 15 },
  { file: 'icons8-sql-96.png',              left: 5,  top: 50 },
  { file: 'icons8-jupyter-96.png',          left: 92, top: 45 },
  { file: 'icons8-pandas-96.png',           left: 25, top: 77 },
  { file: 'icons8-git-96.png',              left: 80, top: 82 },
  { file: 'icons8-tableau-software-96.png', left: 45, top: 12 },
  { file: 'icons8-excel-96.png',            left: 50, top: 80 },
  { file: 'icons8-power-bi-2021-96.png',    left: 20, top: 35 },
  { file: 'icons8-mongodb-96.png',          left: 70, top: 60 },
  { file: 'icons8-numpy-100.png',           left: 15, top: 68 },
  { file: 'icons8-matplotlib-100.png',      left: 82, top: 28 },
  { file: 'icons8-vs-code-96.png',          left: 65, top: 20 },
  { file: 'icons8-github-100.png',          left: 28, top: 22 },
];

export function FloatingIcons() {
  return (
    <div className="bg-floating" aria-hidden="true">
      {ICONS.map((icon, i) => {
        const dur  = 8 + (i * 0.86) % 6;
        const del  = -(i * 2.3) % 22;
        const size = 32 + (i * 5) % 16;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={icon.file}
            className="float-icon"
            src={`/icons/${icon.file}`}
            alt=""
            width={size}
            height={size}
            style={{
              left: `${icon.left}%`,
              top: `${icon.top}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: `${dur}s`,
              animationDelay: `${del}s`,
            }}
          />
        );
      })}
    </div>
  );
}
