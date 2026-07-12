/* ============================================================
   Influx — Tableau de bord boursier interactif bilingue
   Devoir 5 · SEG3525
   React (CDN) + Chart.js (CDN), compilé dans le navigateur par Babel
   Thème « terminal » sombre
   ============================================================ */

const { useState, useEffect, useRef } = React;

/* ============================================================
   DONNÉES — Prix de clôture mensuels 2024 (USD)
   Extrait simplifié de Yahoo Finance (valeurs ajustées pour les
   fractionnements d'actions). Données à des fins de démonstration.
   ============================================================ */
const MONTHS = {
  en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  fr: ['Jan','Fév','Mars','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'],
};

const STOCKS = {
  keys:   ['SPY','QQQ','NVDA','ARM','SMCI','QCOM'],
  labels: {
    en: ['SPY — S&P 500 ETF','QQQ — Nasdaq 100 ETF','NVDA — NVIDIA','ARM — Arm Holdings','SMCI — Super Micro','QCOM — Qualcomm'],
    fr: ['SPY — FNB S&P 500','QQQ — FNB Nasdaq 100','NVDA — NVIDIA','ARM — Arm Holdings','SMCI — Super Micro','QCOM — Qualcomm'],
  },
  icons:  ['🏦','💻','🎮','📱','🖥️','📶'],
  colors: ['#4F8CFF','#A78BFA','#22C55E','#22D3EE','#F59E0B','#EC4899'],

  /* Clôture de décembre 2023 — sert de référence pour le rendement de janvier */
  baseline: { SPY:475, QQQ:402, NVDA:49.5, ARM:75, SMCI:28.5, QCOM:144.6 },

  /* Prix de clôture mensuels 2024 (jan → déc) */
  prices: {
    SPY:  [479,509,523,502,527,544,550,564,574,568,598,587],
    QQQ:  [409,435,444,424,452,480,476,476,490,492,509,511],
    NVDA: [61.5,79.1,90.4,86.4,109.6,123.5,117.0,119.4,121.4,132.8,138.3,134.3],
    ARM:  [77,131,120,95,108,155,130,125,140,137,148,123],
    SMCI: [29,60,100,85,82,81,62,55,41,44,33,30],
    QCOM: [143,152,170,168,200,212,178,165,168,170,157,154],
  },
};

/* Rendement mensuel (%) : (clôture - clôture du mois précédent) / clôture précédente.
   Pour janvier (mois 0), on utilise la clôture de référence de décembre 2023. */
function monthlyReturn(key, month) {
  const p    = STOCKS.prices[key];
  const prev = month === 0 ? STOCKS.baseline[key] : p[month - 1];
  return ((p[month] - prev) / prev) * 100;
}

/* Rendement de l'année (%) : clôture de décembre vs référence de décembre 2023 */
function yearReturn(key) {
  const p = STOCKS.prices[key];
  return ((p[p.length - 1] - STOCKS.baseline[key]) / STOCKS.baseline[key]) * 100;
}

/* ============================================================
   TRADUCTIONS + FORMATAGE DES NOMBRES (localisation)
   ============================================================ */
const T = {
  en: {
    title:      'Influx',
    subtitle:   'Stock market terminal',
    highlights: 'Market Highlights',
    statsLabel: ['Best performer (year)','Worst performer (year)','Biggest monthly gain','Stocks tracked'],
    lineTitle:  'Price Trend Over Time',
    lineIcon:   '📈',
    lineDesc:   'Pick a stock to see how its closing price moved throughout 2024.',
    lineYAxis:  'Closing price (USD $)',
    lineXAxis:  'Month',
    barTitle:   'Monthly Return Comparison',
    barIcon:    '📊',
    barDesc:    'Choose a month to compare the monthly return (%) of every stock side by side.',
    barSelect:  'Month:',
    barYAxis:   'Monthly return (%)',
    barXAxis:   'Stock',
    footer:     'Source: Yahoo Finance (simplified extract) · SEG3525 Devoir 5 · Not investment advice',
    backLink:   '← Back to portfolio',
    langBtn:    '🇫🇷 FR',
    priceFmt:   (v) => `$${v.toFixed(2)}`,
    pctFmt:     (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`,
  },
  fr: {
    title:      'Influx',
    subtitle:   'Terminal boursier',
    highlights: 'Faits saillants du marché',
    statsLabel: ['Meilleure performance (année)','Pire performance (année)','Plus forte hausse mensuelle','Actions suivies'],
    lineTitle:  'Évolution du prix dans le temps',
    lineIcon:   '📈',
    lineDesc:   'Choisissez une action pour suivre l\u2019évolution de son prix de clôture en 2024.',
    lineYAxis:  'Prix de clôture ($ US)',
    lineXAxis:  'Mois',
    barTitle:   'Comparaison des rendements mensuels',
    barIcon:    '📊',
    barDesc:    'Choisissez un mois pour comparer côte à côte le rendement mensuel (%) de chaque action.',
    barSelect:  'Mois :',
    barYAxis:   'Rendement mensuel (%)',
    barXAxis:   'Action',
    footer:     'Source : Yahoo Finance (extrait simplifié) · SEG3525 Devoir 5 · Aucune valeur de conseil',
    backLink:   '← Retour au portfolio',
    langBtn:    '🇨🇦 EN',
    priceFmt:   (v) => `${v.toFixed(2).replace('.',',')} $`,
    pctFmt:     (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2).replace('.',',')} %`,
  },
};

/* Réglages par défaut de Chart.js pour le thème sombre */
Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
Chart.defaults.color       = '#8A99AD';
const GRID_COLOR  = '#1F2A3A';
const AXIS_COLOR  = '#8A99AD';

/* ============================================================
   BANDE DE COTATION (ticker) — rendement annuel de chaque action
   ============================================================ */
function TickerStrip({ lang }) {
  const t = T[lang];
  return (
    <div className="ticker-strip">
      {STOCKS.keys.map((k, i) => {
        const r = yearReturn(k);
        return (
          <div className="ticker-chip" key={k}>
            <span className="ticker-sym">{STOCKS.icons[i]} {k}</span>
            <span className="ticker-val" style={{ color: r >= 0 ? 'var(--gain)' : 'var(--loss)' }}>
              {r >= 0 ? '▲' : '▼'} {t.pctFmt(r)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   GRAPHIQUE LINÉAIRE — évolution du prix d'une action
   Sélecteur : onglets cliquables (un onglet par ticker)
   ============================================================ */
function LineChart({ lang }) {
  const canvasRef         = useRef(null);
  const chartRef          = useRef(null);
  const [stock, setStock] = useState('NVDA');
  const t = T[lang];

  useEffect(() => {
    /* Détruire l'instance précédente pour éviter les fuites de mémoire */
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

    const idx = STOCKS.keys.indexOf(stock);
    const ctx = canvasRef.current.getContext('2d');

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: MONTHS[lang],
        datasets: [{
          label:                STOCKS.labels[lang][idx],
          data:                 STOCKS.prices[stock],
          borderColor:          STOCKS.colors[idx],
          backgroundColor:      STOCKS.colors[idx] + '22',
          borderWidth:          2.5,
          pointRadius:          3,
          pointHoverRadius:     7,
          pointBackgroundColor: STOCKS.colors[idx],
          fill:                 true,
          tension:              0.35,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend:  { labels: { font: { size: 12 }, padding: 16 } },
          tooltip: { callbacks: { label: (c) => '  ' + t.priceFmt(c.parsed.y) } }
        },
        scales: {
          x: {
            title: { display: true, text: t.lineXAxis, font: { size: 11 }, color: AXIS_COLOR },
            grid:  { color: GRID_COLOR },
            ticks: { font: { size: 11 } },
          },
          y: {
            title: { display: true, text: t.lineYAxis, font: { size: 11 }, color: AXIS_COLOR },
            grid:  { color: GRID_COLOR },
            ticks: { callback: (v) => t.priceFmt(v), font: { size: 11 } },
          }
        }
      }
    });

    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [lang, stock]);

  return (
    <section className="panel chart-panel">
      <div className="panel-head">
        <span className="panel-icon">{t.lineIcon}</span>
        <div>
          <h2>{t.lineTitle}</h2>
          <p>{t.lineDesc}</p>
        </div>
      </div>

      {/* Onglets de sélection d'action (une interaction du graphique linéaire) */}
      <div className="ticker-tabs" role="tablist">
        {STOCKS.keys.map((k, i) => {
          const active = stock === k;
          return (
            <button
              key={k}
              role="tab"
              aria-selected={active}
              className={'tab' + (active ? ' tab-active' : '')}
              style={active ? { color: STOCKS.colors[i], borderColor: STOCKS.colors[i] } : null}
              onClick={() => setStock(k)}
            >
              {k}
            </button>
          );
        })}
      </div>

      <div className="canvas-wrapper canvas-lg">
        <canvas ref={canvasRef}></canvas>
      </div>
    </section>
  );
}

/* ============================================================
   GRAPHIQUE À BARRES — comparaison des rendements mensuels
   (vert = hausse, rouge = baisse). Sélecteur : menu déroulant du mois
   ============================================================ */
function BarChart({ lang }) {
  const canvasRef         = useRef(null);
  const chartRef          = useRef(null);
  const [month, setMonth] = useState(1); // Février par défaut (mois très animé)
  const t = T[lang];

  useEffect(() => {
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

    const ctx     = canvasRef.current.getContext('2d');
    const returns = STOCKS.keys.map(k => monthlyReturn(k, month));

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: STOCKS.keys,
        datasets: [{
          label:           MONTHS[lang][month],
          data:            returns,
          backgroundColor: returns.map(r => r >= 0 ? '#22C55ECC' : '#F43F5ECC'),
          borderColor:     returns.map(r => r >= 0 ? '#22C55E'   : '#F43F5E'),
          borderWidth:     1.5,
          borderRadius:    6,
          borderSkipped:   false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend:  { display: false },
          tooltip: { callbacks: { label: (c) => '  ' + t.pctFmt(c.parsed.y) } }
        },
        scales: {
          x: {
            title: { display: true, text: t.barXAxis, font: { size: 11 }, color: AXIS_COLOR },
            grid:  { display: false },
            ticks: { font: { size: 11 } },
          },
          y: {
            title: { display: true, text: t.barYAxis, font: { size: 11 }, color: AXIS_COLOR },
            grid:  { color: GRID_COLOR },
            ticks: { callback: (v) => t.pctFmt(v), font: { size: 11 } },
          }
        }
      }
    });

    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [lang, month]);

  return (
    <section className="panel chart-panel">
      <div className="panel-head">
        <span className="panel-icon">{t.barIcon}</span>
        <div>
          <h2>{t.barTitle}</h2>
          <p>{t.barDesc}</p>
        </div>
      </div>

      <div className="control-row">
        <label htmlFor="bar-select">{t.barSelect}</label>
        <select id="bar-select" value={month} onChange={e => setMonth(Number(e.target.value))}>
          {MONTHS[lang].map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>
      </div>

      <div className="canvas-wrapper">
        <canvas ref={canvasRef}></canvas>
      </div>
    </section>
  );
}

/* ============================================================
   PANNEAU « FAITS SAILLANTS » (KPIs sous forme de liste)
   ============================================================ */
function Highlights({ lang }) {
  const t = T[lang];

  /* Meilleure et pire action de l'année (par rendement annuel) */
  let best = STOCKS.keys[0], worst = STOCKS.keys[0];
  STOCKS.keys.forEach(k => {
    if (yearReturn(k) > yearReturn(best))  best  = k;
    if (yearReturn(k) < yearReturn(worst)) worst = k;
  });

  /* Plus forte hausse mensuelle, toutes actions et tous mois confondus */
  let topGain = { key: STOCKS.keys[0], month: 0, val: -Infinity };
  STOCKS.keys.forEach(k => {
    STOCKS.prices[k].forEach((_, m) => {
      const r = monthlyReturn(k, m);
      if (r > topGain.val) topGain = { key: k, month: m, val: r };
    });
  });

  const idx  = (k) => STOCKS.keys.indexOf(k);
  const rows = [
    { icon: STOCKS.icons[idx(best)],  label: t.statsLabel[0], value: `${best} ${t.pctFmt(yearReturn(best))}`,   color: 'var(--gain)' },
    { icon: STOCKS.icons[idx(worst)], label: t.statsLabel[1], value: `${worst} ${t.pctFmt(yearReturn(worst))}`, color: yearReturn(worst) < 0 ? 'var(--loss)' : 'var(--text)' },
    { icon: '🚀',                     label: t.statsLabel[2], value: `${topGain.key} · ${MONTHS[lang][topGain.month]} ${t.pctFmt(topGain.val)}`, color: 'var(--gain)' },
    { icon: '📋',                     label: t.statsLabel[3], value: String(STOCKS.keys.length), color: 'var(--text)' },
  ];

  return (
    <section className="panel highlights">
      <div className="panel-head">
        <span className="panel-icon">⚡</span>
        <div><h2>{t.highlights}</h2></div>
      </div>
      <ul className="hl-list">
        {rows.map((r, i) => (
          <li className="hl-row" key={i}>
            <span className="hl-icon">{r.icon}</span>
            <span className="hl-label">{r.label}</span>
            <span className="hl-value" style={{ color: r.color }}>{r.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ============================================================
   COMPOSANT RACINE
   ============================================================ */
function App() {
  const [lang, setLang] = useState('fr'); // Français par défaut
  const t = T[lang];

  const toggleLang = () => {
    const next = lang === 'fr' ? 'en' : 'fr';
    setLang(next);
    document.getElementById('html-root').setAttribute('lang', next);
  };

  return (
    <>
      <header>
        <div className="header-brand">
          <span className="brand-mark">▲</span>
          <div className="header-text">
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
        </div>
        <button className="lang-btn" onClick={toggleLang} aria-label="Switch language / Changer de langue">
          {t.langBtn}
        </button>
      </header>

      <main>
        <TickerStrip lang={lang} />
        <LineChart lang={lang} />
        <div className="lower-grid">
          <BarChart   lang={lang} />
          <Highlights lang={lang} />
        </div>
      </main>

      <footer>
        <a className="back-link" href="../../index.html">{t.backLink}</a>
        <span className="footer-sep">·</span>
        <span>{t.footer}</span>
      </footer>
    </>
  );
}

/* Montage de l'application React */
ReactDOM.createRoot(document.getElementById('root')).render(<App />);