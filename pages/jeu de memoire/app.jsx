const { useState, useEffect, useRef } = React;

/* ===== Constantes du jeu ===== */
const MEMO_MS = 5000;                                      // durée de mémorisation: 5 secondes
const MAX_LEVEL = 5;                                       // niveaux à réussir pour gagner la partie
const BASE = { debutant: 3, intermediaire: 5, avance: 7 }; // longueur de départ par niveau
const POOLS = {
  chiffres: '0123456789',
  lettres:  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  mixte:    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
};
const NIVEAUX = [
  { key: 'debutant',      title: 'Débutant',      sub: '3-4 caractères', stars: '★' },
  { key: 'intermediaire', title: 'Intermédiaire', sub: '5-6 caractères', stars: '★★' },
  { key: 'avance',        title: 'Avancé',        sub: '7-8 caractères', stars: '★★★' }
];
const MODES = [
  { key: 'chiffres', big: '123', sub: 'Chiffres' },
  { key: 'lettres',  big: 'ABC', sub: 'Lettres' },
  { key: 'mixte',    big: '1A3', sub: 'Chiffres + Lettres' }
];

/* ===== Génère une séquence aléatoire selon le mode ===== */
function generateSequence(len, mode) {
  const pool = POOLS[mode];
  let s = '';
  for (let i = 0; i < len; i++) s += pool[Math.floor(Math.random() * pool.length)];
  return s;
}

/* ===== Formate un temps en mm:ss ===== */
function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function App() {
  /* ----- État global ----- */
  const [view, setView]   = useState('accueil');           // accueil | config | jeu | resultat
  const [theme, setTheme] = useState('light');

  /* ----- Configuration ----- */
  const [niveau, setNiveau] = useState('debutant');
  const [mode, setMode]     = useState('chiffres');

  /* ----- Partie en cours ----- */
  const [level, setLevel]       = useState(1);
  const [hearts, setHearts]     = useState(3);
  const [score, setScore]       = useState(0);
  const [sequence, setSequence] = useState('');
  const [answer, setAnswer]     = useState([]);
  const [phase, setPhase]       = useState('memo');         // 'memo' | 'answer'
  const [feedback, setFeedback] = useState(null);           // 'correct' | 'wrong' | null
  const [pending, setPending]   = useState(null);           // transition après la rétroaction
  const [roundId, setRoundId]   = useState(0);              // relance l'animation du minuteur
  const [startTime, setStartTime] = useState(0);
  const [result, setResult]     = useState({ title: '', msg: '', score: 0, temps: '', niveau: 1 });

  const inputs = useRef([]);                                // références vers les cases de réponse

  /* ----- Applique le thème sur <html> ----- */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /* ----- Minuteur de mémorisation (5s) puis passage à la saisie ----- */
  useEffect(() => {
    if (view !== 'jeu' || phase !== 'memo') return;
    const id = setTimeout(() => setPhase('answer'), MEMO_MS);
    return () => clearTimeout(id);
  }, [view, phase, roundId]);

  /* ----- Place le curseur sur la première case en phase de réponse ----- */
  useEffect(() => {
    if (phase === 'answer' && inputs.current[0]) inputs.current[0].focus();
  }, [phase]);

  /* ----- Transition après la rétroaction (correct/erreur) ----- */
  useEffect(() => {
    if (!pending) return;
    const id = setTimeout(() => {
      if (pending.type === 'next')       { setLevel(pending.level); startRound(pending.level); }
      else if (pending.type === 'retry') { startRound(pending.level); }
      else if (pending.type === 'win')   { endGame(true,  pending.level, pending.score); }
      else if (pending.type === 'lose')  { endGame(false, pending.level, pending.score); }
      setPending(null);
    }, 800);
    return () => clearTimeout(id);
  }, [pending]);

  /* ----- Prépare un nouveau tour ----- */
  function startRound(lvl) {
    const len = BASE[niveau] + (lvl - 1);
    setSequence(generateSequence(len, mode));
    setAnswer(Array(len).fill(''));
    setFeedback(null);
    setPhase('memo');
    setRoundId(r => r + 1);
  }

  /* ----- Démarre/redémarre une partie ----- */
  function startGame() {
    setLevel(1); setHearts(3); setScore(0);
    setStartTime(Date.now());
    startRound(1);
    setView('jeu');
  }

  /* ----- Vérifie la réponse de l'utilisateur ----- */
  function checkAnswer() {
    if (pending) return;
    const correct = answer.join('').toUpperCase() === sequence.toUpperCase();
    if (correct) {
      const newScore = score + sequence.length * 100;
      setScore(newScore);
      setFeedback('correct');
      // Dernier niveau réussi → victoire ; sinon, on continue
      if (level >= MAX_LEVEL) setPending({ type: 'win',  level: level,     score: newScore });
      else                    setPending({ type: 'next', level: level + 1, score: newScore });
    } else {
      const newHearts = hearts - 1;
      setHearts(newHearts);
      setFeedback('wrong');
      if (newHearts <= 0) setPending({ type: 'lose',  level: level, score: score });
      else                setPending({ type: 'retry', level: level });   // même longueur : on rejoue le tour
    }
  }

  /* ----- Fin de partie: prépare l'écran de résultat selon victoire/défaite ----- */
  function endGame(won, finalLevel, finalScore) {
    let title, msg;
    if (won) {
      // Deux messages de réussite alternés (tirés des 2 scénarimages)
      const variante = Math.random() < 0.5;
      title = variante ? 'Félicitations !!!'   : 'Excellent travail !';
      msg   = variante ? 'Vous êtes LockedIn.' : 'Reste LockedIn.';
    } else {
      // Message de défaite (manque de coeurs)
      title = 'Partie terminée';
      msg   = 'Pas encore LockedIn… réessaie !';
    }
    setResult({ title, msg, score: finalScore, temps: formatTime(Date.now() - startTime), niveau: finalLevel });
    setView('resultat');
  }

  /* ----- Saisie dans les cases de réponse (avance automatiquement) ----- */
  function handleInput(i, val) {
    const ch = val.slice(-1).toUpperCase();
    setAnswer(prev => { const next = [...prev]; next[i] = ch; return next; });
    if (ch && inputs.current[i + 1]) inputs.current[i + 1].focus();
  }
  function handleKey(i, e) {
    if (e.key === 'Backspace' && !answer[i] && inputs.current[i - 1]) inputs.current[i - 1].focus();
    if (e.key === 'Enter') checkAnswer();
  }

  /* ----- Bascule clair/sombre ----- */
  function toggleTheme() { setTheme(t => (t === 'dark' ? 'light' : 'dark')); }

  /* ===== Vue 1: Accueil (logo + bascule de thème + bouton Jouer) ===== */
  function renderAccueil() {
    return (
      <div className="screen menu">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Changer de thème">
          <i className={theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill'}></i>
        </button>
        <h1 className="logo">LockedIn</h1>
        <button className="btn-primary btn-play" onClick={() => setView('config')}>Jouer</button>
      </div>
    );
  }

  /* ===== Vue 2: Configuration (choix du niveau et du mode) ===== */
  function renderConfig() {
    return (
      <div className="screen">
        <h1 className="logo logo-sm">LockedIn</h1>
        <p className="subtitle">Choisis ton défi</p>

        <h2 className="group-label">Niveau</h2>
        <div className="options">
          {NIVEAUX.map(n => (
            <button key={n.key}
              className={'option' + (niveau === n.key ? ' selected' : '')}
              onClick={() => setNiveau(n.key)}>
              <span className="opt-title">{n.title}</span>
              <span className="opt-sub">{n.sub}</span>
              <span className="opt-stars">{n.stars}</span>
            </button>
          ))}
        </div>

        <h2 className="group-label">Mode</h2>
        <div className="options">
          {MODES.map(m => (
            <button key={m.key}
              className={'option' + (mode === m.key ? ' selected' : '')}
              onClick={() => setMode(m.key)}>
              <span className="opt-big">{m.big}</span>
              <span className="opt-sub">{m.sub}</span>
            </button>
          ))}
        </div>

        <button className="btn-primary" onClick={startGame}>Soumettre</button>
      </div>
    );
  }

  /* ===== Vue 3: Jeu (séquence à mémoriser puis à reproduire) ===== */
  function renderJeu() {
    return (
      <div className="screen game">
        {/* Bandeau d'état: niveau, coeurs, score (combinaison des 2 scénarimages) */}
        <div className="hud">
          <span className="hud-tag">Niveau <strong>{level}</strong></span>
          <span className="hud-hearts">
            {[0, 1, 2].map(i => (
              <i key={i} className={i < hearts ? 'bi bi-heart-fill' : 'bi bi-heart'}></i>
            ))}
          </span>
          <span className="hud-tag">Score <strong>{score.toLocaleString('fr-CA')}</strong></span>
        </div>

        <h2 className="game-title">Mémorise La Séquence</h2>

        {phase === 'memo' ? (
          /* Section 1—mémorisation: séquence visible+minuteur de 5s */
          <div className="memo-block">
            <div className="sequence">
              {[...sequence].map((ch, i) => <span key={i} className="seq-char">{ch}</span>)}
            </div>
            <div className="timer-bar"><div key={roundId} className="timer-fill"></div></div>
          </div>
        ) : (
          /* Section 2—réponse: cases de saisie */
          <div className="answer-block">
            <p className="answer-label">Votre Réponse</p>
            <div className="answer">
              {answer.map((ch, i) => (
                <input key={i}
                  ref={el => (inputs.current[i] = el)}
                  className={'answer-box' +
                    (feedback === 'correct' ? ' is-correct' : feedback === 'wrong' ? ' is-wrong' : '')}
                  value={ch}
                  maxLength={1}
                  disabled={!!pending}
                  inputMode={mode === 'chiffres' ? 'numeric' : 'text'}
                  autoComplete="off"
                  onChange={e => handleInput(i, e.target.value)}
                  onKeyDown={e => handleKey(i, e)} />
              ))}
            </div>
            <button className="btn-primary" onClick={checkAnswer} disabled={!!pending}>Soumettre</button>
          </div>
        )}
      </div>
    );
  }

  /* ===== Vue 4: Résultat (fin de partie) ===== */
  function renderResultat() {
    return (
      <div className="screen result">
        <h2 className="result-title">{result.title}</h2>
        <div className="result-row"><span>Score final</span><strong>{result.score.toLocaleString('fr-CA')}</strong></div>
        <div className="result-row"><span>Temps total</span><strong>{result.temps}</strong></div>
        <div className="result-row"><span>Niveau atteint</span><strong>{result.niveau}</strong></div>
        <p className="result-msg">{result.msg}</p>
        <div className="result-actions">
          <button className="btn-primary" onClick={startGame}><i className="bi bi-arrow-repeat"></i> Rejouer</button>
          <button className="btn-ghost" onClick={() => setView('config')}><i className="bi bi-house-door"></i> Menu</button>
        </div>
      </div>
    );
  }

  /* ===== Affiche la vue active ===== */
  return (
    <React.Fragment>
      {view === 'accueil'  && renderAccueil()}
      {view === 'config'   && renderConfig()}
      {view === 'jeu'      && renderJeu()}
      {view === 'resultat' && renderResultat()}
      <a className="back-link" href="../../index.html"><i className="bi bi-arrow-left"></i> Portfolio</a>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);