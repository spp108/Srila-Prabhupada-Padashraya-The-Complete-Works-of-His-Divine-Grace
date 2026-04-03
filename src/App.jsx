import { useState, useRef, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * CORE DATA CONFIGURATION
 */
const WALL_DATA = {
  1: { title: "The Complete Works of His Divine Grace", file: "/guruvashtakam.mp3", img: "/logo.png", text: "His Divine Grace’s literary legacy is a transcendental compass for the lost soul. Within these pages, the absolute truth descends as sound, offering a lifeline of pure devotion. We humbly present these works as an eternal offering, hoping to illuminate the path back to the lotus feet of the Divine." },
  2: { title: "His Divine Grace A.C. Bhaktivedanta Swami Prabhupada", file: "/yadiprabhupada.mp3", img: "/wall-1.png", text: "Srila Prabhupada, the world’s eternal preceptor, carried the message of love across the vast oceans. With unparalleled compassion, he planted the seeds of Bhakti in barren hearts, building a global house where the whole world can live. We bow to the savior of the fallen and the master of devotion." },
  3: { title: "Srila Bhaktisiddhanta Saraswati Goswami Maharaja Prabhupada", file: "/ohevaishnava.mp3", img: "/wall-2.png", text: "The Lion Guru, a visionary of the Saraswat line, fearlessly crushed the illusions of the age. He established the printing press as the Brhad Mrdanga, Great Drum, broadcasted the message of the Goswamis, and demanded uncompromising purity. To his revolutionary spirit and brilliant scholarship, we offer our most respectful, prostrate obeisances." },
  4: { title: "Srila Gaura Kishora Das Babaji Maharaja", file: "/yeaniloprema.mp3", img: "/wall-3.png", text: "The personification of renunciation, Srila Gaura Kishora lived in the dust of Vraja, intoxicated by the Holy Name. Possessing nothing but his love for Krishna, he taught us that the highest realization is found only in a heart completely emptied of material desire and filled with divine longing." },
  5: { title: "Srila Sachidananda Bhaktivinoda Thakura", file: "/jayaradhamadhava.mp3", img: "/wall-4.png", text: "The Seventh Goswami and pioneer of the modern age, he bridged the gap between tradition and the contemporary world. Through his songs and books, he rediscovered the holy birthplace and prophesied a global family chanting Jai Sachinandana. His vision is the foundation upon which this entire sacred archive stands today." },
  6: { title: "The Six Goswamis of Sri Vrindavana Dhama", file: "/sadgoswami.mp3", img: "/wall-6.png", text: "The Sri Sad-Goswamis of Vrindavana excavated the lost pastimes of the Lord. Living under the trees, wearing only loincloths, they codified the science of Rasa. Their humility and scholarship are the twin pillars of our Sampradaya. We seek the dust of their feet to understand the mystery of Bhakti." },
  7: { title: "Sri Sri Pancha-Tattva", file: "/srikrsnachaitanya.mp3", img: "/wall-7.png", text: "Sri Pancha Tattva—the five-fold Absolute—descends to distribute the nectar of love for God without discrimination. Lord Chaitanya and His associates broke the storehouse of Prem, flooding the universe with the Maha-mantra. In their mercy, even the most unworthy can find a place in the dance of devotion." },
  8: { title: "Sri Sri Radha-Krishna", file: "/govindam.mp3", img: "/radhakrishna.png", text: "The source of all beauty and the goal of all existence, Sri Sri Radha Krishna reside eternally in the groves of Vrindavan. Their love is the highest truth, the origin of every soul’s longing. We conclude our darshan here, surrendering everything at Their lotus feet in silent, humble prayer." }
};

const VAULT_LINKS = {
  Gaudiya_Books: "https://archive.org/details/srila-prabhupada-padashraya-subvault-gaudiya-v2",
  ISKCON_Media: "https://archive.org/details/srila-prabhupada-padashraya-subvault-media-images",
  SP_Photos: "https://archive.org/details/srila-prabhupada-padashraya-subvault-photos",
  SP_Vani: "https://archive.org/details/srila-prabhupada-padashraya-subvault-vani"
};

const flowerAssets = ['/petals/marigold_gold.png', '/petals/marigold_orange.png', '/petals/lotus_pink.png', '/petals/jasmine_white.png'];

/**
 * PETAL & ABHISHEKA COMPONENTS
 */
const Petal = memo(({ p, onComplete }) => (
  <motion.img 
    src={p.img} className="sacred-petal" 
    style={{ left: p.xStart, top: p.yStart, width: p.size }}
    initial={{ y: p.yStart, opacity: 0, rotate: p.r }}
    animate={{ y: 1300, x: `calc(${p.xStart} + ${p.drift}px)`, opacity: [0, 1, 1, 0], rotate: p.r + 1440 }}
    transition={{ duration: p.dur, ease: "linear" }}
    onAnimationComplete={() => onComplete(p.id)} 
  />
));

const FlowerAbhisheka = ({ isActive }) => {
  const [petals, setPetals] = useState([]);
  useEffect(() => {
    if (!isActive) { setPetals([]); return; }
    const interval = setInterval(() => {
      if (petals.length > 400) return;
      setPetals(prev => [...prev, { 
        id: Math.random(), img: flowerAssets[Math.floor(Math.random() * 4)], 
        xStart: (Math.random() * 100) + "%", yStart: -150, 
        drift: (Math.random() - 0.5) * 600, dur: 4 + Math.random() * 3, 
        size: 18 + Math.random() * 25, r: Math.random() * 360 
      }]);
    }, 15); 
    return () => clearInterval(interval);
  }, [isActive, petals.length]);
  return <div className="abhisheka-container">{petals.map(p => <Petal key={p.id} p={p} onComplete={(id) => setPetals(prev => prev.filter(pet => pet.id !== id))} />)}</div>;
};

export default function App() {
  const [wallLevel, setWallLevel] = useState(0); 
  const [isOpening, setIsOpening] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [vaultSection, setVaultSection] = useState("entrance");

  const conch = useRef(new Audio("/conch.mp3"));
  const bhajan = useRef(new Audio(""));

  const triggerNextWall = () => {
    const next = wallLevel + 1;
    conch.current.currentTime = 0;
    conch.current.play().catch(() => {});
    bhajan.current.pause();
    setIsOpening(false);
    setShowNext(false);

    setTimeout(() => {
      setWallLevel(next);
      if (next <= 8) {
        setIsOpening(true);
        bhajan.current.src = WALL_DATA[next].file;
        bhajan.current.loop = true;
        bhajan.current.play().catch(() => {});
      }
    }, 1400);
  };

  const handlePassword = (e) => {
    const val = e.target.value.toLowerCase();
    setPasswordInput(val);
    if (val === "nitaigaurharibol") {
      setIsVaultUnlocked(true);
      bhajan.current.src = "/prabhupada_kirtan.mp3";
      bhajan.current.play().catch(() => {});
    }
  };

  const getButtonText = () => {
    if (wallLevel === 1) return "Enter the Compound";
    if (wallLevel >= 2 && wallLevel <= 6) return `Proceed to Wall ${wallLevel - 1}`;
    if (wallLevel === 7) return "Proceed to Goloka Vrindavan";
    return "Enter The Vault";
  };

  // --- VAULT RENDER ---
  if (wallLevel > 8) {
    if (!isVaultUnlocked) {
      return (
        <div className="wall-container vault-gate">
          <img src="/jayavijaya.png" className="guardian left-guard" alt="Jaya" />
          <img src="/jayavijaya.png" className="guardian right-guard" alt="Vijaya" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="password-screen">
            <h2 className="acharya-title">Sacred Archive Vault</h2>
            <p className="hint-text">Password: nitaigaurharibol</p>
            <input type="password" value={passwordInput} onChange={handlePassword} placeholder="Type Password..." className="vault-input" autoFocus />
          </motion.div>
        </div>
      );
    }

    return (
      <div className="wall-container vault-internal">
        <FlowerAbhisheka isActive={true} />
        <div className="title-wrapper">
           <h2 className="acharya-title">{vaultSection === "entrance" ? "Mangala Charana Prayers" : `${vaultSection.replace('_', ' ')} Archive`}</h2>
        </div>
        
        <div className="vault-main-content">
          {vaultSection === "entrance" ? (
            <div className="entrance-flow">
              <div className="glorification-box mangala-box extended-prayers">
                <div className="glorification-text">
                  <p>oṁ ajñāna-timirāndhasya<br/>jñānāñjana-śalākayā<br/>cakṣur unmīlitaṁ yena<br/>tasmai śrī-gurave namaḥ</p>
                  <p>śrī-caitanya-mano-'bhīṣṭaṁ<br/>sthāpitaṁ yena bhū-tale<br/>svayaṁ rūpaḥ kadā mahyaṁ<br/>dadāti sva-padāntikam</p>
                  <p className="translation-text">I was born in the darkest ignorance, and my spiritual master opened my eyes with the torch of knowledge. I offer my respectful obeisances unto him. When will Śrīla Rūpa Gosvāmī Prabhupāda, who has established within this material world the mission to fulfill the desire of Lord Caitanya, give me shelter under his lotus feet?</p>
                  
                  <p>vande 'haṁ śrī-guroḥ śrī-yuta-pada-kamalaṁ śrī-gurūn vaiṣṇavāṁś ca<br/>śrī-rūpaṁ sāgrajātaṁ saha-gaṇa-raghunāthānvitaṁ taṁ sa-jīvam<br/>sādvaitaṁ sāvadhūtaṁ parijana-sahitaṁ kṛṣṇa-caitanya-devaṁ<br/>śrī-rādhā-kṛṣṇa-pādān saha-gaṇa-lalitā-śrī-viśākhānvitāṁś ca</p>
                  <p className="translation-text">I offer my respectful obeisances unto the lotus feet of my spiritual master and unto the feet of all Vaiṣṇavas... [and] to Śrīmatī Rādhārāṇī and Śrī Kṛṣṇa along with Their associates Śrī Lalitā and Viśākhā.</p>
                  
                  <p>he kṛṣṇa karuṇā-sindho<br/>dīna-bandho jagat-pate<br/>gopeśa gopikā-kānta<br/>rādhā-kānta namo 'stu te</p>
                  <p className="translation-text">O my dear Kṛṣṇa, You are the friend of the distressed and the source of creation. You are the master of the gopīs and the lover of Rādhārāṇī. I offer my respectful obeisances unto You.</p>
                  
                  <p>tapta-kāñcana-gaurāṅgi<br/>rādhe vṛndāvaneśvari<br/>vṛṣabhānu-sute devi<br/>praṇamāmi hari-priye</p>
                  <p className="translation-text">I offer my respects to Rādhārāṇī, whose bodily complexion is like molten gold and who is the Queen of Vṛndāvana...</p>
                  
                  <p>vāñchā-kalpatarubhyaś ca<br/>kṛpā-sindhubhya eva ca<br/>patitānāṁ pāvanebhyo<br/>vaiṣṇavebhyo namo namaḥ</p>
                  
                  <p>śrī-kṛṣṇa-caitanya prabhu-nityānanda<br/>śrī-advaita gadādhara śrīvāsādi-gaura-bhakta-vṛnda</p>
                  
                  <p className="maha-mantra">hare kṛṣṇa hare kṛṣṇa kṛṣṇa kṛṣṇa hare hare<br/>hare rāma hare rāma rāma rāma hare hare</p>
                </div>
              </div>
              <button className="proceed-btn" onClick={() => setVaultSection("Gaudiya_Books")}>Open The Archives</button>
            </div>
          ) : (
            <div className="archive-interface">
              <nav className="vault-nav">
                {Object.keys(VAULT_LINKS).map(sec => (
                  <button key={sec} onClick={() => setVaultSection(sec)} className={vaultSection === sec ? "active-nav" : ""}>
                    {sec.replace('_', ' ')}
                  </button>
                ))}
              </nav>
              <div className="drive-container">
                <div className="drive-header"><span>Resource</span><span>Source</span><span>Action</span></div>
                <div className="drive-list">
                    <div className="drive-item">
                      <div className="file-info"><span className="file-icon">📁</span><span className="file-name">{vaultSection.replace('_', ' ')} Library</span></div>
                      <span className="file-size">Direct Archive Link</span>
                      <a href={VAULT_LINKS[vaultSection]} target="_blank" rel="noopener noreferrer" className="download-btn">📥 Open Folder</a>
                    </div>
                </div>
                <div className="ia-footer-note">Eternally preserved via Internet Archive.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- DARSHAN RENDER ---
  return (
    <div className="wall-container">
      <motion.img src="/chakra.png" className="chakra-icon top-l" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} />
      <motion.img src="/chakra.png" className="chakra-icon top-r" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} />
      <motion.img src="/chakra.png" className="chakra-icon bot-l" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} />
      <motion.img src="/chakra.png" className="chakra-icon bot-r" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} />

      <AnimatePresence mode="wait">
        {wallLevel === 0 ? (
          <motion.div key="gate" exit={{ opacity: 0, scale: 0.95 }} className="entrance-gate">
            <button className="enter-button" onClick={triggerNextWall}>Begin Darshan</button>
          </motion.div>
        ) : (
          <motion.div key={`wall-${wallLevel}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="wall-content-wrapper">
            {wallLevel !== 1 && (
              <div className="title-wrapper">
                <h2 className="acharya-title">{WALL_DATA[wallLevel].title}</h2>
              </div>
            )}
            <div className="darshan-stage">
              <FlowerAbhisheka isActive={isOpening} />
              <img src={WALL_DATA[wallLevel].img} alt="Darshan" />
              <motion.div initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 8, ease: "easeInOut" }} onAnimationComplete={() => setShowNext(true)} className="curtain-panel left" />
              <motion.div initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 8, ease: "easeInOut" }} className="curtain-panel right" />
            </div>
            {wallLevel === 1 && (
              <div className="title-wrapper logo-below">
                <h2 className="acharya-title">{WALL_DATA[wallLevel].title}</h2>
              </div>
            )}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3 }} className="glorification-box">
              <p className="glorification-text">{WALL_DATA[wallLevel].text}</p>
            </motion.div>
            <div className="footer-area">
              {showNext && <button className="proceed-btn" onClick={triggerNextWall}>{getButtonText()}</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
