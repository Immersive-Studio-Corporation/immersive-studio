'use client';

import {
  ArrowUpRight,
  ArrowDown,
  Menu,
  X,
  Globe2,
  RotateCcw,
  MoveUpRight,
  Boxes,
  BookOpen,
  Users,
} from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { StudioMark } from './studio-mark';
import { dictionaries, isLocale, languages } from './messages';
import type { Locale } from './messages';

const DISCORD = 'https://discord.gg/YkPYhhtyPZ';
const HERITAGE = 'https://heritagedepoudlard.fr/';
const worlds = [
  {
    id: 'percy',
    name: 'Percy Jackson RP',
    image: '/images/percy.webp',
    color: '#5AACE0',
  },
  {
    id: 'teen',
    name: 'Teen Wolf RP',
    image: '/images/teen-wolf.webp',
    color: '#B0A1DD',
  },
  {
    id: 'nations',
    name: 'Les Quatres Nations',
    image: '/images/nations.webp',
    color: '#E2A359',
  },
  {
    id: 'avengers',
    name: 'Avengers RP',
    image: '/images/avengers.webp',
    color: '#98BC72',
  },
  {
    id: 'last',
    name: 'The Last of Us RP',
    image: '/images/last-of-us.webp',
    color: '#B5C289',
  },
] as const;

function subscribeLocale(onChange: () => void) {
  window.addEventListener('immersive-language', onChange);
  window.addEventListener('popstate', onChange);
  return () => {
    window.removeEventListener('immersive-language', onChange);
    window.removeEventListener('popstate', onChange);
  };
}
function getLocale(): Locale {
  const query = new URLSearchParams(window.location.search).get('lang');
  if (isLocale(query)) return query;
  try {
    const saved = localStorage.getItem('immersive-language');
    if (isLocale(saved)) return saved;
  } catch {
    /* Storage is optional. */
  }
  return 'fr';
}
function serverLocale(): Locale {
  return 'fr';
}
function DiscordIcon({ size = 23 }: { size?: number }) {
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
function Brand({ label }: { label: string }) {
  return (
    <a
      className="brand"
      href="#accueil"
      aria-label={'Immersive Studio — ' + label}
    >
      <StudioMark />
      <span>
        IMMERSIVE<small>STUDIO</small>
      </span>
    </a>
  );
}

export default function Home() {
  const locale = useSyncExternalStore(subscribeLocale, getLocale, serverLocale);
  const t = dictionaries[locale];
  const [menu, setMenu] = useState(false);
  const [introKey, setIntroKey] = useState(0);
  const scene = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  function changeLanguage(value: string | null) {
    if (!isLocale(value)) return;
    const url = new URL(window.location.href);
    if (value === 'fr') url.searchParams.delete('lang');
    else url.searchParams.set('lang', value);
    window.history.replaceState(null, '', url);
    try {
      localStorage.setItem('immersive-language', value);
    } catch {
      /* The URL preserves the selection without storage. */
    }
    window.dispatchEvent(new Event('immersive-language'));
  }
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.metadataTitle;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', t.metadataDescription);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute('content', t.metadataTitle);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', t.metadataDescription);
  }, [locale, t]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menu && !event.defaultPrevented) {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [menu]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    document
      .querySelectorAll('.reveal')
      .forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const paint = () => {
      const rect = element.getBoundingClientRect();
      const stickyHeight =
        element.querySelector<HTMLElement>('.intro-sticky')?.offsetHeight ??
        window.innerHeight;
      const p = reduced.matches
        ? 0
        : Math.max(
            0,
            Math.min(
              1,
              -rect.top / Math.max(1, element.offsetHeight - stickyHeight),
            ),
          );
      const arc = Math.sin(p * Math.PI);
      element.style.setProperty('--progress', String(p));
      element.style.setProperty(
        '--cube-x',
        Math.sin(p * Math.PI * 2) * 85 + 'px',
      );
      element.style.setProperty('--cube-y', -arc * 130 + 'px');
      element.style.setProperty('--cube-r', p * 360 + 'deg');
      element.style.setProperty('--split', arc * 90 + 'px');
      element.dataset.phase = p > 0.28 ? 'logo' : 'intro';
      frame = 0;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', schedule);
    };
  }, []);
  function replay() {
    setIntroKey((key) => key + 1);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  return (
    <>
      <a href="#heritage" className="skip-link">
        {t.skip}
      </a>
      <header className="header">
        <Brand label={t.home} />
        <nav
          id="main-nav"
          className={menu ? 'main-nav is-open' : 'main-nav'}
          aria-label={t.footerStudio}
        >
          <a href="#heritage" onClick={() => setMenu(false)}>
            {t.navHeritage}
          </a>
          <a href="#univers" onClick={() => setMenu(false)}>
            {t.navWorlds}
          </a>
          <a href="#studio" onClick={() => setMenu(false)}>
            {t.navStudio}
          </a>
        </nav>
        <div className="header-actions">
          <Select value={locale} onValueChange={changeLanguage}>
            <SelectTrigger className="language-trigger" aria-label={t.language}>
              <Globe2 size={20} />
              <span>{locale.toUpperCase()}</span>
            </SelectTrigger>
            <SelectContent
              className="language-content"
              align="end"
              alignItemWithTrigger={false}
            >
              {languages.map((language) => (
                <SelectItem
                  key={language.code}
                  value={language.code}
                  className="language-option"
                >
                  <span lang={language.code}>{language.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <a
            className="header-discord"
            href={DISCORD}
            target="_blank"
            rel="noopener noreferrer"
          >
            <DiscordIcon size={21} />
            <span>Discord</span>
            <ArrowUpRight size={18} />
          </a>
          <button
            ref={menuButton}
            className="menu-toggle"
            aria-expanded={menu}
            aria-controls="main-nav"
            aria-label={menu ? t.menuClose : t.menuOpen}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main>
        <section
          ref={scene}
          className="intro-scroll"
          id="accueil"
          aria-labelledby="hero-title"
        >
          <div className="intro-sticky">
            <div className="intro-color" aria-hidden="true" />
            <div className="hero-copy">
              <p className="eyebrow">{t.heroTag}</p>
              <h1 id="hero-title">
                {t.heroLine1}
                <span>{t.heroLine2}</span>
              </h1>
              <p className="hero-text">{t.heroText}</p>
              <a className="button button-dark" href="#heritage">
                {t.explore}
                <ArrowDown size={22} />
              </a>
            </div>
            <div className="intro-logo" aria-hidden="true" key={introKey}>
              <StudioMark className="logo-assembly" />
              <div className="logo-shadow" />
            </div>
            <div className="intro-finale" aria-hidden="true">
              <span>IMMERSIVE STUDIO</span>
              <p>
                {t.introLine1}
                <br />
                <strong>{t.introLine2}</strong>
              </p>
            </div>
            <div className="intro-bottom">
              <span className="hero-side">{t.heroSide}</span>
              <a href="#heritage" className="scroll-cue">
                <ArrowDown size={22} />
                <span>{t.scroll}</span>
              </a>
              <a className="skip-animation" href="#heritage">
                {t.skipAnimation}
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </section>
        <section
          className="heritage-section"
          id="heritage"
          aria-labelledby="heritage-title"
        >
          <div className="section-wrap heritage-heading reveal">
            <p className="eyebrow">{t.heritageLabel}</p>
            <h2>{t.heritageIntro}</h2>
          </div>
          <div className="heritage-panorama">
            <Image
              className="heritage-background"
              src="/images/heritage-background.webp"
              alt=""
              width={1920}
              height={1080}
              loading="lazy"
            />
            <div className="heritage-shade" aria-hidden="true" />
            <div className="section-wrap heritage-inner">
              <div className="heritage-copy reveal">
                <span className="status-chip">
                  <i />
                  {t.development}
                </span>
                <p className="heritage-genre">{t.heritageGenre}</p>
                <h3 id="heritage-title">
                  L’Héritage
                  <br />
                  de Poudlard
                </h3>
                <p>{t.heritageText}</p>
                <a
                  className="button button-light"
                  href={HERITAGE}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.heritageCta}
                  <ArrowUpRight size={22} />
                </a>
                <small>{t.heritageNote}</small>
              </div>
              <Image
                className="heritage-brand reveal"
                src="/images/heritage-logo.webp"
                alt=""
                width={650}
                height={650}
                loading="lazy"
              />
            </div>
          </div>
        </section>
        <section
          className="worlds-section section-wrap"
          id="univers"
          aria-labelledby="worlds-title"
        >
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">{t.worldsLabel}</p>
              <h2 id="worlds-title">
                {t.worldsTitle1}
                <br />
                <em>{t.worldsTitle2}</em>
              </h2>
            </div>
            <p>{t.worldsText}</p>
          </div>
          <div className="worlds-grid">
            {worlds.map((world) => (
              <article
                id={world.id}
                key={world.id}
                className={'world-card reveal world-' + world.id}
                style={{ '--world-color': world.color } as CSSProperties}
              >
                <a
                  href={DISCORD}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="world-link"
                  aria-label={world.name + ' — ' + t.followProject}
                >
                  <div className="world-art">
                    {(world.id === 'percy' || world.id === 'avengers') && (
                      <Image
                        className="world-wash"
                        src={world.image}
                        alt=""
                        width={1200}
                        height={700}
                        loading="lazy"
                      />
                    )}
                    {world.id === 'nations' && (
                      <Image
                        className="world-backdrop"
                        src="/images/nations-world.webp"
                        alt=""
                        width={1536}
                        height={1024}
                        loading="lazy"
                      />
                    )}
                    {world.id === 'last' && (
                      <Image
                        className="world-backdrop"
                        src="/images/survival-world.webp"
                        alt=""
                        width={1536}
                        height={1024}
                        loading="lazy"
                      />
                    )}
                    <Image
                      className="world-image"
                      src={world.image}
                      alt=""
                      width={1200}
                      height={700}
                      loading="lazy"
                    />
                    <span className="world-genre">
                      {t[(world.id + 'Genre') as keyof typeof t]}
                    </span>
                    <span className="world-open" aria-hidden="true">
                      <ArrowUpRight size={28} />
                    </span>
                  </div>
                  <div className="world-copy">
                    <div className="world-title-row">
                      <h3>{world.name}</h3>
                      <span className="world-status">{t.preparation}</span>
                    </div>
                    <h4>{t[(world.id + 'Line') as keyof typeof t]}</h4>
                    <p>{t[(world.id + 'Text') as keyof typeof t]}</p>
                    <span className="text-link">
                      {t.followProject}
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>
        <section
          className="studio-section section-wrap"
          id="studio"
          aria-labelledby="studio-title"
        >
          <div className="studio-intro reveal">
            <p className="eyebrow">{t.studioLabel}</p>
            <h2 id="studio-title">
              {t.studioTitle1}
              <br />
              <em>{t.studioTitle2}</em>
            </h2>
            <p>{t.studioText}</p>
          </div>
          <div className="studio-values">
            <article className="value-card reveal">
              <Boxes strokeWidth={1.3} />
              <h3>{t.craftTitle}</h3>
              <p>{t.craftText}</p>
            </article>
            <article className="value-card reveal">
              <BookOpen strokeWidth={1.3} />
              <h3>{t.storiesTitle}</h3>
              <p>{t.storiesText}</p>
            </article>
            <article className="value-card reveal">
              <Users strokeWidth={1.3} />
              <h3>{t.peopleTitle}</h3>
              <p>{t.peopleText}</p>
            </article>
          </div>
        </section>
        <section
          className="faq-section section-wrap"
          id="informations"
          aria-labelledby="faq-title"
        >
          <div className="faq-heading reveal">
            <p className="eyebrow">{t.faqLabel}</p>
            <h2 id="faq-title">{t.faqTitle}</h2>
            <div className="faq-mark" aria-hidden="true">
              <StudioMark />
            </div>
          </div>
          <Accordion className="faq-list reveal" defaultValue={['question-1']}>
            {[1, 2, 3, 4].map((n) => (
              <AccordionItem
                className="faq-item"
                key={n}
                value={'question-' + n}
              >
                <AccordionTrigger className="faq-trigger">
                  {t[('faq' + n + 'Q') as keyof typeof t]}
                </AccordionTrigger>
                <AccordionContent className="faq-answer">
                  <p>{t[('faq' + n + 'A') as keyof typeof t]}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
        <section
          className="community-section section-wrap"
          id="communaute"
          aria-labelledby="community-title"
        >
          <div className="community-copy reveal">
            <p className="eyebrow">{t.communityLabel}</p>
            <h2 id="community-title">
              {t.communityTitle1}
              <br />
              {t.communityTitle2}
              <br />
              <em>{t.communityTitle3}</em>
            </h2>
            <p>{t.communityText}</p>
            <a
              className="button button-dark"
              href={DISCORD}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DiscordIcon />
              {t.communityCta}
              <ArrowUpRight size={23} />
            </a>
          </div>
          <div className="community-icon" aria-hidden="true">
            <DiscordIcon size={330} />
          </div>
        </section>
      </main>
      <footer className="footer section-wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand label={t.home} />
            <p>{t.footerTag}</p>
            <button className="replay-button" onClick={replay}>
              <RotateCcw size={18} />
              {t.replay}
            </button>
          </div>
          <div className="footer-column">
            <h3>{t.footerWorks}</h3>
            <a href={HERITAGE} target="_blank" rel="noopener noreferrer">
              L’Héritage de Poudlard
            </a>
            {worlds.map((world) => (
              <a key={world.id} href={'#' + world.id}>
                {world.name}
              </a>
            ))}
          </div>
          <div className="footer-column">
            <h3>{t.footerStudio}</h3>
            <a href="#studio">{t.footerAbout}</a>
            <a href={DISCORD} target="_blank" rel="noopener noreferrer">
              {t.footerNews}
            </a>
            <a href={DISCORD} target="_blank" rel="noopener noreferrer">
              {t.footerContact}
            </a>
          </div>
          <div className="footer-column">
            <h3>{t.footerInfo}</h3>
            <a href="#informations">{t.footerFaq}</a>
            <a href="#heritage">{t.footerStatus}</a>
            <a href="#accueil">
              {t.backTop}
              <MoveUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          IMMERSIVE
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Immersive Studio</span>
          <span>{t.footerBottom}</span>
        </div>
        <p className="fan-note">{t.fanNote}</p>
      </footer>
    </>
  );
}
