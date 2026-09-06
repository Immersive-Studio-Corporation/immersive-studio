'use client';

import {
  ArrowUpRight,
  ArrowDown,
  Menu,
  X,
  Sparkles,
  Waves,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';

const DISCORD = 'https://discord.gg/YkPYhhtyPZ';
const worlds = [
  {
    name: 'Percy Jackson RP',
    genre: 'MYTHOLOGIE',
    line: 'Les dieux ont leurs légendes. Écrivez la vôtre.',
    color: '#7dcfdc',
    id: 'percy',
    image: null,
  },
  {
    name: 'Teen Wolf RP',
    genre: 'SURNATUREL',
    line: 'La nuit révèle votre vraie nature.',
    color: '#b7afe7',
    id: 'teen-wolf',
    image: '/images/teen-wolf.webp',
  },
  {
    name: 'Les Quatres Nations',
    genre: 'ÉLÉMENTS & AVENTURE',
    line: 'Quatre nations. Un équilibre à réinventer.',
    color: '#d7c3a0',
    id: 'nations',
    image: '/images/nations.webp',
  },
  {
    name: 'Avengers RP',
    genre: 'SUPER-HÉROS',
    line: 'Derrière chaque héros, il y a votre histoire.',
    color: '#a5c698',
    id: 'avengers',
    image: '/images/avengers.webp',
  },
  {
    name: 'The Last of Us RP',
    genre: 'SURVIE',
    line: 'Quand tout s’effondre, les liens restent.',
    color: '#b5c79b',
    id: 'last-of-us',
    image: '/images/last-of-us.webp',
  },
];

function DiscordIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.7 5.1A18 18 0 0 0 15.3 3.8l-.5 1a16.2 16.2 0 0 0-5.6 0l-.5-1a18 18 0 0 0-4.4 1.3C1.5 9.3.8 13.4 1.2 17.4a18 18 0 0 0 5.4 2.7l1.1-1.8-1.7-.8.4-.3a12.6 12.6 0 0 0 11.2 0l.4.3-1.7.8 1.1 1.8a18 18 0 0 0 5.4-2.7c.5-4.6-.8-8.7-3.1-12.3ZM8.5 14.9c-1.1 0-1.9-1-1.9-2.2s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.2-1.9 2.2Zm7 0c-1.1 0-1.9-1-1.9-2.2s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.2-1.9 2.2Z" />
    </svg>
  );
}
function Brand() {
  return (
    <a
      className="brand"
      href="#accueil"
      aria-label="Immersive Studio — accueil"
    >
      <Image src="/images/studio-mark.webp" alt="" width={38} height={44} />
      <span>
        IMMERSIVE<small>STUDIO</small>
      </span>
    </a>
  );
}
export default function Home() {
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll('.reveal')
      .forEach((node) => observer.observe(node));
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(false);
    };
    document.addEventListener('keydown', close);
    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', close);
    };
  }, []);
  return (
    <>
      <a href="#univers" className="skip-link">
        Aller aux projets
      </a>
      <header className="header">
        <Brand />
        <nav
          id="main-nav"
          className={menu ? 'nav nav-open' : 'nav'}
          aria-label="Navigation principale"
        >
          <a href="#univers" onClick={() => setMenu(false)}>
            Nos univers <span>06</span>
          </a>
          <a href="#studio" onClick={() => setMenu(false)}>
            Le studio
          </a>
          <a
            className="nav-discord"
            href={DISCORD}
            target="_blank"
            rel="noopener noreferrer"
          >
            <DiscordIcon size={17} /> Rejoindre le Discord{' '}
            <ArrowUpRight size={15} />
          </a>
        </nav>
        <button
          className="mobile-menu"
          onClick={() => setMenu(!menu)}
          aria-expanded={menu}
          aria-controls="main-nav"
          aria-label={menu ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <main>
        <section className="hero" id="accueil" aria-labelledby="hero-title">
          <Image
            className="hero-backdrop"
            src="/images/hero-world.webp"
            alt=""
            width={1536}
            height={1024}
            fetchPriority="high"
          />
          <div className="hero-atmosphere" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="particles" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <i
                key={i}
                style={{
                  left: ((i * 37 + 11) % 100) + '%',
                  top: ((i * 29 + 8) % 100) + '%',
                  animationDelay: -(i * 0.7) + 's',
                  animationDuration: 5 + (i % 5) + 's',
                }}
              />
            ))}
          </div>
          <div className="hero-content">
            <p className="eyebrow">
              <span className="live-dot" /> CRÉATEURS D’UNIVERS ROLEPLAY
            </p>
            <h1 id="hero-title">
              D’autres mondes.
              <br />
              <span>Votre histoire.</span>
            </h1>
            <p className="hero-description">
              Des univers qui vous transportent.
              <br />
              Des rencontres qui restent. Et vous, au cœur du récit.
            </p>
            <a className="button button-primary" href="#univers">
              Explorer nos univers <ArrowDown size={18} />
            </a>
            <div className="hero-note">
              <span className="note-line" /> L’IMAGINAIRE N’EST QUE LE DÉBUT.
            </div>
          </div>
          <div className="hero-emblem" aria-hidden="true">
            <div className="emblem-orbit" />
            <div className="emblem-parallax">
              <Image
                src="/images/studio-mark.webp"
                alt=""
                width={1175}
                height={1339}
              />
            </div>
            <span className="emblem-caption">
              IMMERSIVE STUDIO / WORLDS IN THE MAKING
            </span>
          </div>
          <div className="hero-bottom">
            <span>UN STUDIO. DES MONDES. MILLE POSSIBLES.</span>
            <a href="#univers">
              DÉFILER POUR EXPLORER <ArrowDown size={14} />
            </a>
            <span className="hero-coordinate">L’AVENTURE SE VIT ENSEMBLE.</span>
          </div>
        </section>
        <section className="worlds-section section-wrap" id="univers">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">01 / NOS UNIVERS</p>
              <h2>
                Choisissez votre
                <br />
                <span>prochaine vie.</span>
              </h2>
            </div>
            <p>
              Six projets. Six façons de vivre le roleplay.
              <br />
              Une même envie : vous faire vibrer.
            </p>
          </div>
          <a
            className="featured-world reveal"
            href="https://heritagedepoudlard.fr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="featured-art"
              src="/images/heritage-background.webp"
              alt="Le château de L’Héritage de Poudlard, illuminé au clair de lune"
              width={1920}
              height={1080}
              loading="lazy"
            />
            <div className="featured-top">
              <span className="pill">
                <span className="live-dot" /> EN DÉVELOPPEMENT
              </span>
              <span className="feature-number">UNIVERS 01 / 06</span>
            </div>
            <div className="featured-content">
              <p className="eyebrow">MINECRAFT ROLEPLAY · MAGIE</p>
              <h3>
                L’Héritage
                <br />
                de Poudlard
              </h3>
              <p>
                Une lettre. Un château. Votre héritage.
                <br />
                Entrez dans un monde de magie où votre histoire reste à écrire.
              </p>
              <span className="text-link">
                Découvrir le projet <ArrowUpRight size={20} />
              </span>
            </div>
            <Image
              className="featured-logo"
              src="/images/heritage-logo.webp"
              alt=""
              width={420}
              height={420}
              loading="lazy"
            />
          </a>
          <div className="project-grid">
            {worlds.map((world, index) => (
              <a
                className={'project-card reveal project-' + world.id}
                href={DISCORD}
                target="_blank"
                rel="noopener noreferrer"
                style={{ '--world-color': world.color } as CSSProperties}
                key={world.id}
                aria-label={
                  world.name + ' — suivre le développement sur Discord'
                }
              >
                <div className="card-heading">
                  <span>
                    0{index + 2} / {world.genre}
                  </span>
                  <ArrowUpRight size={18} />
                </div>
                <div className="project-art">
                  {world.image ? (
                    <Image
                      src={world.image}
                      alt=""
                      loading="lazy"
                      width={600}
                      height={300}
                    />
                  ) : (
                    <div className="percy-wordmark">
                      <Waves size={28} strokeWidth={1} />
                      <span>
                        PERCY
                        <br />
                        JACKSON
                      </span>
                      <small>ROLEPLAY</small>
                    </div>
                  )}
                </div>
                <div className="project-info">
                  <div className="project-status">
                    <span /> EN DÉVELOPPEMENT
                  </div>
                  <h3>{world.name}</h3>
                  <p>{world.line}</p>
                  <span className="project-link">
                    Suivre le projet sur Discord <ArrowUpRight size={15} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
        <section className="studio-section section-wrap" id="studio">
          <div className="studio-label reveal">
            <p className="eyebrow">02 / L’ESPRIT IMMERSIVE</p>
            <Sparkles
              className="studio-spark"
              strokeWidth={0.65}
              aria-hidden="true"
            />
          </div>
          <div className="studio-copy reveal">
            <h2>
              On crée les mondes.
              <br />
              <span>Vous les rendez vivants.</span>
            </h2>
            <p>
              Nous croyons aux histoires qui se construisent ensemble. À ce
              personnage qui vous ressemble. À cette rencontre imprévue. À ce
              moment de jeu dont on parle encore longtemps après.
            </p>
            <p>
              Immersive Studio rassemble des projets roleplay avec une ambition
              commune : donner à votre imagination un monde à habiter.
            </p>
            <div className="studio-principles">
              <span>L’immersion dans le détail.</span>
              <span>La communauté au cœur.</span>
              <span>La liberté d’écrire la suite.</span>
            </div>
          </div>
        </section>
        <section className="community-section section-wrap" id="communaute">
          <div className="community-glow" aria-hidden="true" />
          <div className="reveal">
            <p className="eyebrow">
              <span className="live-dot" /> L’HISTOIRE COMMENCE ENSEMBLE
            </p>
            <h2>
              Il manque quelqu’un
              <br />
              dans nos univers.
              <br />
              <span>Vous.</span>
            </h2>
            <p>
              Les premières annonces. Les coulisses. Les prochaines rencontres.
              <br />
              Retrouvez Immersive Studio sur Discord.
            </p>
            <a
              className="button button-primary"
              href={DISCORD}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DiscordIcon /> Rejoindre l’aventure <ArrowUpRight size={18} />
            </a>
          </div>
          <Image
            className="community-decoration"
            src="/images/studio-mark.webp"
            alt=""
            width={340}
            height={388}
            loading="lazy"
          />
        </section>
      </main>
      <footer className="footer section-wrap">
        <div className="footer-top">
          <Brand />
          <a href="#accueil">
            Retour en haut <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Immersive Studio</span>
          <span>Des mondes imaginés. Des histoires partagées.</span>
          <a href={DISCORD} target="_blank" rel="noopener noreferrer">
            Discord <ArrowUpRight size={13} />
          </a>
        </div>
        <p className="fan-note">
          Projets communautaires indépendants, sans affiliation officielle avec
          les ayants droit des univers présentés.
        </p>
      </footer>
    </>
  );
}
