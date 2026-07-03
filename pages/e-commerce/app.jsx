const { useState } = React;

/* ===== Données produits ===== */
// img: chemin vers la photo (à ajouter plus tard dans images/); si absente, une icône s'affiche.
// socket et ram valent null quand la composante n'est pas concernée (filtrage convergent correct).
const PRODUITS = [
  // -- Processeurs (CPU) --
  { id:1,  nom:"AMD Ryzen 7 9800X3D",  type:"CPU", marque:"AMD",    socket:"AM5",     ram:null, prix:479.99, specs:"8 cœurs · 16 threads · jusqu'à 5,2 GHz · cache 3D V-Cache", img:"images/ryzen-7-9800x3d.jpg",  nouveau:true,  promo:false },
  { id:2,  nom:"AMD Ryzen 9 9950X",    type:"CPU", marque:"AMD",    socket:"AM5",     ram:null, prix:649.99, specs:"16 cœurs · 32 threads · jusqu'à 5,7 GHz · socket AM5",     img:"images/ryzen-9-9950x.jpg",    nouveau:false, promo:false },
  { id:3,  nom:"AMD Ryzen 5 7600",     type:"CPU", marque:"AMD",    socket:"AM5",     ram:null, prix:229.99, specs:"6 cœurs · 12 threads · jusqu'à 5,1 GHz · ventirad inclus", img:"images/ryzen-5-7600.jpg",     nouveau:false, promo:true  },
  { id:4,  nom:"AMD Ryzen 5 5600",     type:"CPU", marque:"AMD",    socket:"AM4",     ram:null, prix:129.99, specs:"6 cœurs · 12 threads · jusqu'à 4,4 GHz · socket AM4",     img:"images/ryzen-5-5600.jpg",     nouveau:false, promo:false },
  { id:5,  nom:"Intel Core Ultra 9 285K", type:"CPU", marque:"Intel", socket:"LGA1851", ram:null, prix:589.99, specs:"24 cœurs · jusqu'à 5,7 GHz · NPU intégré · socket LGA1851", img:"images/core-ultra-9-285k.jpg", nouveau:true,  promo:false },
  { id:6,  nom:"Intel Core Ultra 7 265K", type:"CPU", marque:"Intel", socket:"LGA1851", ram:null, prix:399.99, specs:"20 cœurs · jusqu'à 5,5 GHz · graphiques Intel · LGA1851",   img:"images/core-ultra-7-265k.jpg", nouveau:false, promo:false },
  { id:7,  nom:"Intel Core i5-14600K", type:"CPU", marque:"Intel",  socket:"LGA1700", ram:null, prix:289.99, specs:"14 cœurs · 20 threads · jusqu'à 5,3 GHz · socket LGA1700",  img:"images/core-i5-14600k.jpg",   nouveau:false, promo:true  },

  // -- Cartes graphiques (GPU) --
  { id:8,  nom:"NVIDIA GeForce RTX 5090", type:"GPU", marque:"NVIDIA", socket:null, ram:null, prix:1999.99, specs:"32 Go GDDR7 · ray tracing · DLSS 4 · 4K ultra",        img:"images/rtx-5090.jpg",    nouveau:true,  promo:false },
  { id:9,  nom:"NVIDIA GeForce RTX 5080", type:"GPU", marque:"NVIDIA", socket:null, ram:null, prix:1199.99, specs:"16 Go GDDR7 · ray tracing · DLSS 4 · 4K haute fréquence", img:"images/rtx-5080.jpg",    nouveau:false, promo:false },
  { id:10, nom:"NVIDIA GeForce RTX 5070", type:"GPU", marque:"NVIDIA", socket:null, ram:null, prix:649.99,  specs:"12 Go GDDR7 · excellent rapport qualité-prix · 1440p",   img:"images/rtx-5070.jpg",    nouveau:false, promo:true  },
  { id:11, nom:"AMD Radeon RX 9070 XT",   type:"GPU", marque:"AMD",    socket:null, ram:null, prix:599.99,  specs:"16 Go GDDR6 · FSR 4 · idéale pour le jeu en 1440p",      img:"images/rx-9070-xt.jpg",  nouveau:true,  promo:false },
  { id:12, nom:"AMD Radeon RX 7800 XT",   type:"GPU", marque:"AMD",    socket:null, ram:null, prix:499.99,  specs:"16 Go GDDR6 · FSR 3 · jeu fluide en 1440p",              img:"images/rx-7800-xt.jpg",  nouveau:false, promo:false },

  // -- Mémoire vive (RAM) --
  { id:13, nom:"Corsair Vengeance 32 Go DDR5-6000", type:"RAM", marque:"Corsair", socket:null, ram:32, prix:114.99, specs:"2 × 16 Go · DDR5-6000 · CL30 · profil EXPO/XMP", img:"images/corsair-vengeance-32-ddr5.jpg", nouveau:false, promo:true  },
  { id:14, nom:"G.Skill Trident Z5 64 Go DDR5-6400", type:"RAM", marque:"G.Skill", socket:null, ram:64, prix:229.99, specs:"2 × 32 Go · DDR5-6400 · CL32 · dissipateur RGB",  img:"images/gskill-trident-z5-64.jpg",      nouveau:false, promo:false },
  { id:15, nom:"Corsair Vengeance 16 Go DDR5-5600", type:"RAM", marque:"Corsair", socket:null, ram:16, prix:59.99,  specs:"2 × 8 Go · DDR5-5600 · CL36 · entrée de gamme",   img:"images/corsair-vengeance-16-ddr5.jpg", nouveau:false, promo:false },
  { id:16, nom:"G.Skill Ripjaws V 32 Go DDR4-3600",  type:"RAM", marque:"G.Skill", socket:null, ram:32, prix:89.99,  specs:"2 × 16 Go · DDR4-3600 · CL18 · compatible AM4/LGA1700", img:"images/gskill-ripjaws-32-ddr4.jpg", nouveau:false, promo:false },

  // -- Cartes mères --
  { id:17, nom:"ASUS ROG Strix B650-A",     type:"Carte mère", marque:"ASUS",     socket:"AM5",     ram:null, prix:269.99, specs:"AMD B650 · DDR5 · PCIe 5.0 · Wi-Fi 6E · socket AM5",   img:"images/asus-rog-strix-b650a.jpg",   nouveau:true,  promo:false },
  { id:18, nom:"MSI MAG B850 Tomahawk",     type:"Carte mère", marque:"MSI",      socket:"AM5",     ram:null, prix:239.99, specs:"AMD B850 · DDR5 · PCIe 5.0 · 2,5G LAN · socket AM5",   img:"images/msi-mag-b850-tomahawk.jpg",  nouveau:false, promo:false },
  { id:19, nom:"Gigabyte B760 Gaming X",    type:"Carte mère", marque:"Gigabyte", socket:"LGA1700", ram:null, prix:159.99, specs:"Intel B760 · DDR5 · PCIe 4.0 · socket LGA1700",        img:"images/gigabyte-b760-gaming-x.jpg", nouveau:false, promo:true  },
  { id:20, nom:"ASUS TUF Gaming Z890-Plus", type:"Carte mère", marque:"ASUS",     socket:"LGA1851", ram:null, prix:329.99, specs:"Intel Z890 · DDR5 · PCIe 5.0 · Wi-Fi 7 · LGA1851",     img:"images/asus-tuf-z890-plus.jpg",     nouveau:false, promo:false },

  // -- Périphériques --
  { id:21, nom:"Logitech G Pro X Superlight 2", type:"Périphérique", marque:"Logitech",    socket:null, ram:null, prix:179.99, specs:"Souris sans fil · 60 g · capteur HERO 2 · 95 h d'autonomie", img:"images/logitech-gpro-superlight2.jpg", nouveau:true,  promo:false },
  { id:22, nom:"Keychron K8 Pro",               type:"Périphérique", marque:"Keychron",    socket:null, ram:null, prix:109.99, specs:"Clavier mécanique · sans fil · rétroéclairé · hot-swap",   img:"images/keychron-k8-pro.jpg",           nouveau:false, promo:false },
  { id:23, nom:"Samsung Odyssey G7 27\"",       type:"Périphérique", marque:"Samsung",     socket:null, ram:null, prix:649.99, specs:"Moniteur 27\" · 1440p · 240 Hz · incurvé · 1 ms",          img:"images/samsung-odyssey-g7.jpg",        nouveau:false, promo:true  },
  { id:24, nom:"SteelSeries Arctis Nova 7",     type:"Périphérique", marque:"SteelSeries", socket:null, ram:null, prix:179.99, specs:"Casque sans fil · son spatial · 38 h d'autonomie",         img:"images/steelseries-arctis-nova7.jpg",  nouveau:false, promo:false },
];

/* ===== Configuration des facettes ===== */
const CONFIG_FACETTES = [
  { id:"type",   label:"Type de composante", type:"checkbox", options:["CPU","GPU","RAM","Carte mère","Périphérique"] },
  { id:"marque", label:"Marque",             type:"checkbox", options:["AMD","Intel","NVIDIA","ASUS","MSI","Gigabyte","Corsair","G.Skill","Logitech","Keychron","Samsung","SteelSeries"] },
  { id:"socket", label:"Socket",             type:"checkbox", options:["AM5","AM4","LGA1700","LGA1851"] },
  { id:"ram",    label:"Capacité de mémoire", type:"checkbox", options:[16,32,64], format:(v)=>`${v} Go` },
  { id:"prix",   label:"Prix maximum",       type:"range",    min:0, max:2000, step:25 },
];

/* ===== Icône de secours par type (si aucune image) ===== */
const ICONES = {
  "CPU":          "bi-cpu-fill",
  "GPU":          "bi-gpu-card",
  "RAM":          "bi-memory",
  "Carte mère":   "bi-motherboard-fill",
  "Périphérique": "bi-mouse2-fill",
};

/* ===== État initial des filtres ===== */
const FILTRES_DEFAUT = { type:[], marque:[], socket:[], ram:[], prixMax:2000 };

/* ===== Prix effectif (rabais promo de 20 %) ===== */
function prixEffectif(p) {
  return p.promo ? +(p.prix * 0.8).toFixed(2) : p.prix;
}

/* ===== Formate un prix en dollars ===== */
function formatPrix(v) {
  return `${v.toFixed(2)} $`;
}

/* ===== Logique de filtrage ===== */
// AND entre les facettes, OR entre les valeurs d'une même facette.
function filtrerProduits(produits, f) {
  return produits.filter(p => {
    if (f.type.length   > 0 && !f.type.includes(p.type))     return false;
    if (f.marque.length > 0 && !f.marque.includes(p.marque)) return false;
    if (f.socket.length > 0 && !f.socket.includes(p.socket)) return false;
    if (f.ram.length    > 0 && !f.ram.includes(p.ram))       return false;
    if (p.prix > f.prixMax) return false;
    return true;
  });
}

/* ===== Tri ===== */
function trierProduits(produits, mode) {
  const arr = [...produits];
  if (mode === "prix-asc")  return arr.sort((a,b) => prixEffectif(a) - prixEffectif(b));
  if (mode === "prix-desc") return arr.sort((a,b) => prixEffectif(b) - prixEffectif(a));
  if (mode === "nom")       return arr.sort((a,b) => a.nom.localeCompare(b.nom));
  return arr;
}

/* ===== Compte les produits disponibles pour une option ===== */
// On ignore la facette courante pour afficher des comptes réalistes.
function compterOption(facetteId, valeur, f) {
  const temp = { ...f, [facetteId]: [] };
  return filtrerProduits(PRODUITS, temp).filter(p => {
    if (facetteId === "type")   return p.type   === valeur;
    if (facetteId === "marque") return p.marque === valeur;
    if (facetteId === "socket") return p.socket === valeur;
    if (facetteId === "ram")    return p.ram    === valeur;
    return true;
  }).length;
}

/* ===== Image de produit (avec secours en icône) ===== */
function ImageProduit({ produit, classe }) {
  const [erreur, setErreur] = useState(false);
  const icone = ICONES[produit.type] || "bi-box";

  if (!produit.img || erreur) {
    return <div className="card-img-fallback"><i className={`bi ${icone}`}></i></div>;
  }
  return (
    <img className={classe} src={produit.img} alt={produit.nom} onError={() => setErreur(true)} />
  );
}

/* ===== En-tête ===== */
function Header({ nbArticles, onAccueil, onPanier, onAide }) {
  return (
    <header className="ec-header">
      <button className="ec-logo" onClick={onAccueil}>
        <i className="bi bi-pc-display-horizontal"></i>
        Build<span>A</span>Box
      </button>
      <nav className="ec-nav">
        <button className="lien-aide" onClick={onAide}>
          <i className="bi bi-question-circle"></i> Aide
        </button>
        <button className="cart-btn" onClick={onPanier}>
          <i className="bi bi-cart-fill"></i> Panier
          <span className="cart-count">{nbArticles}</span>
        </button>
      </nav>
    </header>
  );
}

/* ===== Panneau de facettes ===== */
function FacetPanel({ filtres, setFiltres }) {
  const [replies, setReplies] = useState({});         // groupes repliés (réduits)

  // Coche/décoche une valeur dans une facette
  const basculer = (fid, val) => setFiltres(prev => {
    const arr = prev[fid];
    return { ...prev, [fid]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] };
  });

  const basculerGroupe = (fid) => setReplies(prev => ({ ...prev, [fid]: !prev[fid] }));

  return (
    <aside className="facet-panel">
      <div className="facet-head">
        <h2>Filtres</h2>
        <button className="btn-clear" onClick={() => setFiltres(FILTRES_DEFAUT)}>Effacer tout</button>
      </div>

      {CONFIG_FACETTES.map(facette => (
        <div className="facet-group" key={facette.id}>
          <div className={`facet-group-label ${replies[facette.id] ? "replie" : ""}`} onClick={() => basculerGroupe(facette.id)}>
            {facette.label}
            <i className="bi bi-chevron-down toggle-icon"></i>
          </div>

          <div className={`facet-options ${replies[facette.id] ? "cachee" : ""}`}>
            {/* Facette à cases à cocher */}
            {facette.type === "checkbox" && facette.options.map(opt => {
              const compte    = compterOption(facette.id, opt, filtres);
              const coche     = filtres[facette.id].includes(opt);
              const desactive = compte === 0 && !coche;
              const affichage = facette.format ? facette.format(opt) : opt;
              return (
                <label className="facet-option" key={opt} style={{ opacity: desactive ? 0.45 : 1 }}>
                  <input type="checkbox" checked={coche} disabled={desactive} onChange={() => basculer(facette.id, opt)} />
                  <span className="facet-option-label">{affichage}</span>
                  <span className="facet-count">{compte}</span>
                </label>
              );
            })}

            {/* Facette à curseur (prix) */}
            {facette.type === "range" && (
              <div className="range-wrap">
                <input type="range" min={facette.min} max={facette.max} step={facette.step}
                  value={filtres.prixMax}
                  onChange={(e) => setFiltres(prev => ({ ...prev, prixMax: Number(e.target.value) }))} />
                <div className="range-info">
                  <span>0 $</span>
                  <span>Jusqu'à <strong>{filtres.prixMax} $</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </aside>
  );
}

/* ===== Barre des filtres actifs ===== */
function FiltresActifs({ filtres, setFiltres }) {
  const tags = [];

  // Tags des facettes à cases à cocher
  CONFIG_FACETTES.forEach(f => {
    if (f.type !== "checkbox") return;
    filtres[f.id].forEach(val => {
      const affichage = f.format ? f.format(val) : val;
      tags.push(
        <button className="tag" key={`${f.id}-${val}`}
          onClick={() => setFiltres(prev => ({ ...prev, [f.id]: prev[f.id].filter(v => v !== val) }))}>
          {affichage} <i className="bi bi-x-lg"></i>
        </button>
      );
    });
  });

  // Tag du prix maximum
  if (filtres.prixMax < 2000) {
    tags.push(
      <button className="tag" key="prix"
        onClick={() => setFiltres(prev => ({ ...prev, prixMax: 2000 }))}>
        Max : {filtres.prixMax} $ <i className="bi bi-x-lg"></i>
      </button>
    );
  }

  if (tags.length === 0) return null;

  return (
    <div className="filtres-actifs">
      <span className="filtres-actifs-label">Filtres actifs :</span>
      {tags}
    </div>
  );
}

/* ===== Carte produit ===== */
function CarteProduit({ produit, onAjouter }) {
  const [ajoute, setAjoute] = useState(false);

  const ajouter = () => {
    onAjouter(produit.id);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 1200);          // rétroaction temporaire
  };

  return (
    <div className="carte">
      <div className="carte-img-wrap">
        {produit.nouveau && <span className="badge-nouveau">Nouveau</span>}
        {produit.promo   && <span className="badge-promo">-20 %</span>}
        <ImageProduit produit={produit} classe="card-img" />
      </div>
      <div className="carte-corps">
        <p className="carte-meta">{produit.type} · {produit.marque}</p>
        <h3 className="carte-titre">{produit.nom}</h3>
        <p className="carte-specs">{produit.specs}</p>
        <div className="carte-pied">
          <span className="prix">
            {formatPrix(prixEffectif(produit))}
            {produit.promo && <span className="ancien-prix">{formatPrix(produit.prix)}</span>}
          </span>
          <button className={`btn-ajouter ${ajoute ? "ajoute" : ""}`} onClick={ajouter}>
            {ajoute ? <><i className="bi bi-check-lg"></i> Ajouté</> : <><i className="bi bi-cart-plus"></i> Panier</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Indicateur d'étapes (suivi des instructions) ===== */
function Stepper({ etapes, courant }) {
  return (
    <ol className="stepper">
      {etapes.map((titre, i) => {
        const etat = i < courant ? "fait" : i === courant ? "actif" : "avenir";
        return (
          <li className={`stepper-item ${etat}`} key={titre}>
            <span className="stepper-num">{i < courant ? <i className="bi bi-check-lg"></i> : i + 1}</span>
            <span className="stepper-label">{titre}</span>
          </li>
        );
      })}
    </ol>
  );
}

/* ===== Champ de formulaire réutilisable ===== */
function Champ({ label, name, value, onChange, erreur, type = "text", placeholder, large }) {
  return (
    <div className={`champ ${large ? "large" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={value} placeholder={placeholder}
        className={erreur ? "invalide" : ""} onChange={onChange} />
      {erreur && <span className="champ-erreur"><i className="bi bi-exclamation-circle"></i> {erreur}</span>}
    </div>
  );
}

/* ===== Étoiles du sondage ===== */
function Etoiles({ note, setNote }) {
  return (
    <div className="etoiles">
      {[1,2,3,4,5].map(n => (
        <button type="button" key={n} className={`etoile ${n <= note ? "pleine" : ""}`}
          aria-label={`${n} étoile${n > 1 ? "s" : ""}`} onClick={() => setNote(n)}>
          <i className={`bi ${n <= note ? "bi-star-fill" : "bi-star"}`}></i>
        </button>
      ))}
    </div>
  );
}

/* ===== Fenêtre d'aide (aide et documentation) ===== */
function Aide({ onFermer }) {
  return (
    <div className="aide-overlay" onClick={onFermer}>
      <div className="aide-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Besoin d'aide ? <button className="fermer" onClick={onFermer}><i className="bi bi-x-lg"></i></button></h2>
        <dl>
          <dt>Comment trouver une pièce ?</dt>
          <dd>Utilisez les filtres à gauche (type, marque, socket, capacité, prix) pour réduire les résultats.</dd>
          <dt>Comment acheter ?</dt>
          <dd>Ajoutez des pièces au panier, puis suivez les 4 étapes : panier, informations, paiement et confirmation.</dd>
          <dt>Mes filtres ne donnent rien ?</dt>
          <dd>Cliquez sur « Effacer tout » dans le panneau de filtres pour repartir à zéro.</dd>
        </dl>
      </div>
    </div>
  );
}

/* ===== Vue boutique (exploration par facettes) ===== */
function Boutique({ filtres, setFiltres, tri, setTri, onAjouter }) {
  const produits = trierProduits(filtrerProduits(PRODUITS, filtres), tri);
  const nb = produits.length;

  return (
    <>
      {/* Hero—inciter à l'action */}
      <section className="hero">
        <h1>Assemblez le PC de vos <span>rêves</span></h1>
        <p>Trouvez les pièces idéales pour votre configuration, au meilleur prix. Commencez dès maintenant !</p>
        <a href="#catalogue"><button className="hero-cta">Commencez votre configuration</button></a>
      </section>

      {/* Bandeau promotionnel—inciter à l'action */}
      <div className="promo-bar">
        🔥 Offres du jour : jusqu'à 20 % de rabais sur une sélection de pièces. Profitez-en !
      </div>

      {/* Les 3 processus interactifs, clairement indiqués */}
      <div className="process-strip">
        <div className="process-card">
          <i className="bi bi-search"></i>
          <div><h3>1. Explorez</h3><p>Filtrez les composantes selon vos besoins grâce à la recherche par facettes.</p></div>
        </div>
        <div className="process-card">
          <i className="bi bi-bag-check"></i>
          <div><h3>2. Achetez</h3><p>Suivez les 4 étapes guidées, du panier jusqu'à la confirmation.</p></div>
        </div>
        <div className="process-card">
          <i className="bi bi-chat-heart"></i>
          <div><h3>3. Évaluez</h3><p>Partagez votre avis après l'achat pour nous aider à nous améliorer.</p></div>
        </div>
      </div>

      {/* Catalogue+facettes */}
      <div className="boutique-wrap" id="catalogue">
        <div className="facet-col">
          <FacetPanel filtres={filtres} setFiltres={setFiltres} />
        </div>

        <div className="produit-col">
          <FiltresActifs filtres={filtres} setFiltres={setFiltres} />

          <div className="results-head">
            <p className="result-count"><strong>{nb}</strong> produit{nb !== 1 ? "s" : ""} trouvé{nb !== 1 ? "s" : ""}</p>
            <select className="tri-select" value={tri} onChange={(e) => setTri(e.target.value)}>
              <option value="defaut">Trier par : pertinence</option>
              <option value="prix-asc">Prix croissant</option>
              <option value="prix-desc">Prix décroissant</option>
              <option value="nom">Nom A → Z</option>
            </select>
          </div>

          <div className="produit-grid">
            {nb === 0 ? (
              <div className="vide">
                <i className="bi bi-search"></i>
                <h3>Aucune pièce ne correspond à vos critères</h3>
                <p>Essayez de modifier ou de retirer certains filtres.</p>
                <button className="btn-primaire" style={{ marginTop: "1rem" }} onClick={() => setFiltres(FILTRES_DEFAUT)}>
                  Effacer tous les filtres
                </button>
              </div>
            ) : (
              produits.map(p => <CarteProduit key={p.id} produit={p} onAjouter={onAjouter} />)
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ===== Vue tunnel d'achat ===== */
function Checkout({ etape, setEtape, lignes, total, nbArticles, changerQte, retirer,
                    infos, setInfos, paiement, setPaiement, erreurs, onValiderInfos,
                    onConfirmer, onAccueil, noCommande, onResetTout }) {

  const ETAPES = ["Panier", "Informations", "Paiement", "Confirmation"];

  // Mise à jour générique d'un champ de formulaire
  const majInfos    = (e) => setInfos(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const majPaiement = (e) => setPaiement(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="checkout-wrap">
      <Stepper etapes={ETAPES} courant={etape} />

      <div className="checkout-card">

        {/* ----- Étape 1: panier ----- */}
        {etape === 0 && (
          <>
            <h2 className="checkout-titre">Votre panier</h2>
            {lignes.length === 0 ? (
              <div className="panier-vide">
                <i className="bi bi-cart-x"></i>
                <p>Votre panier est vide pour l'instant.</p>
                <button className="btn-primaire" style={{ marginTop: "1rem" }} onClick={onAccueil}>Explorer les pièces</button>
              </div>
            ) : (
              <>
                {lignes.map(p => (
                  <div className="panier-ligne" key={p.id}>
                    <div className="panier-img"><ImageProduit produit={p} classe="" /></div>
                    <div className="panier-info">
                      <div className="panier-nom">{p.nom}</div>
                      <div className="panier-specs">{p.type} · {p.marque}</div>
                    </div>
                    <div className="panier-qte">
                      <button className="qte-btn" onClick={() => changerQte(p.id, -1)}>−</button>
                      <span>{p.qte}</span>
                      <button className="qte-btn" onClick={() => changerQte(p.id, 1)}>+</button>
                    </div>
                    <div className="panier-prix">{formatPrix(prixEffectif(p) * p.qte)}</div>
                    <button className="panier-suppr" aria-label="Retirer" onClick={() => retirer(p.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))}

                <div className="recap">
                  <div className="recap-ligne"><span>Sous-total ({nbArticles} article{nbArticles !== 1 ? "s" : ""})</span><span>{formatPrix(total)}</span></div>
                  <div className="recap-ligne"><span>Livraison</span><span>Gratuite</span></div>
                  <div className="recap-total"><span>Total</span><span>{formatPrix(total)}</span></div>
                </div>

                <div className="checkout-actions">
                  <button className="btn-retour" onClick={onAccueil}><i className="bi bi-arrow-left"></i> Continuer mes achats</button>
                  <button className="btn-primaire" onClick={() => setEtape(1)}>Continuer vers les informations</button>
                </div>
              </>
            )}
          </>
        )}

        {/* ----- Étape 2: informations personnelles ----- */}
        {etape === 1 && (
          <>
            <h2 className="checkout-titre">Vos informations</h2>
            <div className="form-grid">
              <Champ label="Nom complet"  name="nom"        value={infos.nom}        onChange={majInfos} erreur={erreurs.nom}        placeholder="Jean Price" large />
              <Champ label="Courriel"     name="courriel"   value={infos.courriel}   onChange={majInfos} erreur={erreurs.courriel}   placeholder="vous@exemple.com" type="email" large />
              <Champ label="Adresse"      name="adresse"    value={infos.adresse}    onChange={majInfos} erreur={erreurs.adresse}    placeholder="123 rue Principale" large />
              <Champ label="Ville"        name="ville"      value={infos.ville}      onChange={majInfos} erreur={erreurs.ville}      placeholder="Ottawa" />
              <Champ label="Code postal"  name="codePostal" value={infos.codePostal} onChange={majInfos} erreur={erreurs.codePostal} placeholder="K1N 6N5" />
            </div>
            <div className="checkout-actions">
              <button className="btn-retour" onClick={() => setEtape(0)}><i className="bi bi-arrow-left"></i> Retour</button>
              <button className="btn-primaire" onClick={onValiderInfos}>Continuer vers le paiement</button>
            </div>
          </>
        )}

        {/* ----- Étape 3: paiement ----- */}
        {etape === 2 && (
          <>
            <h2 className="checkout-titre">Paiement</h2>
            <div className="form-grid">
              <Champ label="Titulaire de la carte" name="titulaire" value={paiement.titulaire} onChange={majPaiement} erreur={erreurs.titulaire} placeholder="Jean Price" large />
              <Champ label="Numéro de carte"       name="carte"     value={paiement.carte}     onChange={majPaiement} erreur={erreurs.carte}     placeholder="1234 5678 9012 3456" large />
              <Champ label="Expiration (MM/AA)"    name="exp"       value={paiement.exp}       onChange={majPaiement} erreur={erreurs.exp}       placeholder="08/29" />
              <Champ label="CVV"                   name="cvv"       value={paiement.cvv}       onChange={majPaiement} erreur={erreurs.cvv}       placeholder="123" />
            </div>
            <div className="checkout-actions">
              <button className="btn-retour" onClick={() => setEtape(1)}><i className="bi bi-arrow-left"></i> Retour</button>
              <button className="btn-primaire" onClick={onConfirmer}>Confirmer la commande</button>
            </div>
          </>
        )}

        {/* ----- Étape 4: confirmation+sondage ----- */}
        {etape === 3 && (
          <Confirmation noCommande={noCommande} courriel={infos.courriel} onResetTout={onResetTout} />
        )}

      </div>
    </div>
  );
}

/* ===== Confirmation et sondage (communication) ===== */
function Confirmation({ noCommande, courriel, onResetTout }) {
  const [note, setNote]       = useState(0);
  const [commentaire, setCom] = useState("");
  const [envoye, setEnvoye]   = useState(false);

  return (
    <>
      <div className="confirmation">
        <i className="bi bi-check-circle-fill conf-icone"></i>
        <h2>Merci d'avoir choisi BuildABox !</h2>
        <p>Votre commande est confirmée. Un courriel de confirmation a été envoyé à <strong>{courriel || "votre adresse"}</strong>.</p>
        <span className="conf-num">Commande n° {noCommande}</span>
      </div>

      {/* Sondage affiché seulement après l'achat—établir une connexion */}
      <div className="sondage">
        {envoye ? (
          <div className="sondage-merci">
            <i className="bi bi-emoji-smile"></i>
            Merci pour votre retour ! Votre avis nous aide à nous améliorer.
          </div>
        ) : (
          <>
            <h3>Comment évalueriez-vous votre expérience ?</h3>
            <p>Quelques secondes suffisent — c'est entièrement optionnel.</p>
            <Etoiles note={note} setNote={setNote} />
            <textarea placeholder="Un commentaire à partager ? (optionnel)" value={commentaire} onChange={(e) => setCom(e.target.value)}></textarea>
            <button className="btn-primaire" disabled={note === 0} onClick={() => setEnvoye(true)}>Envoyer mon avis</button>
          </>
        )}
      </div>

      <div className="checkout-actions" style={{ justifyContent: "center" }}>
        <button className="btn-retour" onClick={onResetTout}><i className="bi bi-house"></i> Retour à la boutique</button>
      </div>
    </>
  );
}

/* ===== Application principale ===== */
function App() {
  /* ----- État global ----- */
  const [vue, setVue]         = useState("boutique");  // boutique | checkout
  const [aide, setAide]       = useState(false);

  /* ----- Exploration ----- */
  const [filtres, setFiltres] = useState(FILTRES_DEFAUT);
  const [tri, setTri]         = useState("defaut");

  /* ----- Panier ----- */
  const [panier, setPanier]   = useState([]);          // [{ id, qte }]

  /* ----- Tunnel d'achat ----- */
  const [etape, setEtape]         = useState(0);
  const [infos, setInfos]         = useState({ nom:"", courriel:"", adresse:"", ville:"", codePostal:"" });
  const [paiement, setPaiement]   = useState({ titulaire:"", carte:"", exp:"", cvv:"" });
  const [erreurs, setErreurs]     = useState({});
  const [noCommande, setNoCommande] = useState("");

  /* ----- Actions du panier ----- */
  const ajouter = (id) => setPanier(prev => {
    const existant = prev.find(x => x.id === id);
    if (existant) return prev.map(x => x.id === id ? { ...x, qte: x.qte + 1 } : x);
    return [...prev, { id, qte: 1 }];
  });
  const changerQte = (id, d) => setPanier(prev => prev.map(x => x.id === id ? { ...x, qte: Math.max(1, x.qte + d) } : x));
  const retirer    = (id) => setPanier(prev => prev.filter(x => x.id !== id));

  const nbArticles = panier.reduce((s, x) => s + x.qte, 0);
  const lignes     = panier.map(x => ({ ...PRODUITS.find(p => p.id === x.id), qte: x.qte }));
  const total      = lignes.reduce((s, p) => s + prixEffectif(p) * p.qte, 0);

  /* ----- Navigation ----- */
  const allerAccueil = () => { setVue("boutique"); window.scrollTo(0, 0); };
  const ouvrirPanier = () => { setVue("checkout"); setEtape(0); setErreurs({}); window.scrollTo(0, 0); };

  /* ----- Validation des informations (prévention des erreurs) ----- */
  const validerInfos = () => {
    const e = {};
    if (!infos.nom.trim())      e.nom = "Veuillez entrer votre nom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(infos.courriel)) e.courriel = "Adresse courriel invalide.";
    if (!infos.adresse.trim())  e.adresse = "Veuillez entrer votre adresse.";
    if (!infos.ville.trim())    e.ville = "Veuillez entrer votre ville.";
    if (!/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(infos.codePostal.trim())) e.codePostal = "Code postal invalide (ex. K1N 6N5).";
    setErreurs(e);
    if (Object.keys(e).length === 0) { setEtape(2); window.scrollTo(0, 0); }
  };

  /* ----- Validation du paiement et confirmation ----- */
  const confirmer = () => {
    const e = {};
    if (!paiement.titulaire.trim())                       e.titulaire = "Nom du titulaire requis.";
    if (!/^\d{16}$/.test(paiement.carte.replace(/\s/g,""))) e.carte = "Numéro de carte à 16 chiffres.";
    if (!/^\d{2}\/\d{2}$/.test(paiement.exp))             e.exp = "Format MM/AA attendu.";
    if (!/^\d{3,4}$/.test(paiement.cvv))                  e.cvv = "CVV à 3 chiffres.";
    setErreurs(e);
    if (Object.keys(e).length === 0) {
      setNoCommande("BB-" + Math.floor(100000 + Math.random() * 900000));
      setEtape(3);
      window.scrollTo(0, 0);
    }
  };

  /* ----- Réinitialise tout après la commande ----- */
  const resetTout = () => {
    setPanier([]);
    setInfos({ nom:"", courriel:"", adresse:"", ville:"", codePostal:"" });
    setPaiement({ titulaire:"", carte:"", exp:"", cvv:"" });
    setErreurs({});
    setEtape(0);
    allerAccueil();
  };

  return (
    <>
      <Header nbArticles={nbArticles} onAccueil={allerAccueil} onPanier={ouvrirPanier} onAide={() => setAide(true)} />

      {vue === "boutique" ? (
        <Boutique filtres={filtres} setFiltres={setFiltres} tri={tri} setTri={setTri} onAjouter={ajouter} />
      ) : (
        <Checkout
          etape={etape} setEtape={setEtape}
          lignes={lignes} total={total} nbArticles={nbArticles}
          changerQte={changerQte} retirer={retirer}
          infos={infos} setInfos={setInfos}
          paiement={paiement} setPaiement={setPaiement}
          erreurs={erreurs}
          onValiderInfos={validerInfos} onConfirmer={confirmer}
          onAccueil={allerAccueil} noCommande={noCommande} onResetTout={resetTout}
        />
      )}

      {aide && <Aide onFermer={() => setAide(false)} />}

      <footer className="ec-footer">
        <p><strong>BuildABox</strong> — Votre boutique de pièces d'ordinateur</p>
        <p style={{ marginTop: ".4rem" }}>
          <a href="../../index.html">Marven Monalliance — SEG3525</a>
        </p>
      </footer>
    </>
  );
}

/* ===== Montage ===== */
ReactDOM.createRoot(document.getElementById("root")).render(<App />);