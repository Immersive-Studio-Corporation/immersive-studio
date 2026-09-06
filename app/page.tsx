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
  Pause,
  Play,
  MessageCircle,
  Megaphone,
  Headphones,
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
import { CinemaField } from './cinema-field';
import { ProjectBanner } from './project-banner';
import { dictionaries, isLocale, languages } from './messages';
import type { Locale } from './messages';

const DISCORD = 'https://discord.gg/YkPYhhtyPZ';
const HERITAGE = 'https://heritagedepoudlard.fr/';
const worlds = [
  {
    id: 'percy',
    backdrop: '/images/percy-world.webp',
    name: 'Percy Jackson RP',
    image: '/images/percy-emblem.webp',
    color: '#5AACE0',
  },
  {
    id: 'teen',
    backdrop: '/images/teen-world.webp',
    name: 'Teen Wolf RP',
    image: '/images/teen-wordmark.webp',
    color: '#B0A1DD',
  },
  {
    id: 'nations',
    backdrop: '/images/nations-world.webp',
    name: 'Avatar — Les Quatre Nations',
    image: '/images/nations-emblem.webp',
    color: '#E2A359',
  },
  {
    id: 'avengers',
    backdrop: '/images/avengers-world.webp',
    name: 'Avengers RP',
    image: '/images/avengers-wordmark.webp',
    color: '#98BC72',
  },
  {
    id: 'last',
    backdrop: '/images/survival-world.webp',
    name: 'The Last of Us RP',
    image: '/images/last-of-us.webp',
    color: '#B5C289',
  },
] as const;
const newgen = {
  id: 'newgen',
  name: 'Newgen',
  image: '/images/newgen-wordmark.webp',
  backdrop: '/images/newgen-world.webp',
  color: '#b4ecfa',
} as const;

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
  const [paused, setPaused] = useState(false);
  const [activeProject, setActiveProject] = useState('');
  const [introKey, setIntroKey] = useState(0);
  const scene = useRef<HTMLElement>(null);
  const introProgress = useRef(0);
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
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
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
    const sticky = element?.querySelector<HTMLElement>('.intro-sticky');
    if (!element || !sticky) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const compact = matchMedia('(max-height: 580px)');
    let frame = 0,
      last = 0,
      startY = 0,
      extent = 1;
    let current = introProgress.current,
      painted = -1,
      visible = true;
    const targetProgress = () =>
      reduced.matches || compact.matches
        ? 0
        : Math.max(0, Math.min(1, (scrollY - startY) / extent));
    const paint = (p: number) => {
      if (p === painted) return;
      painted = p;
      introProgress.current = p;
      const ramp = (start: number, end: number) => {
        const x = Math.max(0, Math.min(1, (p - start) / (end - start)));
        return x * x * (3 - 2 * x);
      };
      const center = ramp(0.13, 0.56);
      const flight = ramp(0.2, 0.82);
      const bloom = Math.sin(flight * Math.PI);
      element.style.setProperty('--progress', String(p));
      element.style.setProperty('--center', String(center));
      element.style.setProperty('--bloom', String(bloom));
      element.style.setProperty('--finale', String(ramp(0.82, 0.96)));
      element.style.setProperty(
        '--cube-x',
        Math.sin(flight * Math.PI * 4) * 150 * bloom + 'px',
      );
      element.style.setProperty('--cube-y', -bloom * 75 + 'px');
      element.style.setProperty('--cube-r', flight * 720 + 'deg');
      element.style.setProperty('--split', bloom * 115 + 'px');
      element.style.setProperty(
        '--letter-turn',
        Math.sin(flight * Math.PI * 2) * 8 + 'deg',
      );
      const phase = p > 0.22 ? 'logo' : 'intro';
      const chapter = p < 0.29 ? '1' : p < 0.74 ? '2' : '3';
      if (element.dataset.phase !== phase) element.dataset.phase = phase;
      if (element.dataset.chapter !== chapter)
        element.dataset.chapter = chapter;
    };
    const tick = (now: number) => {
      frame = 0;
      if (paused || document.hidden) {
        last = 0;
        return;
      }
      const target = targetProgress();
      const dt = Math.min((now - (last || now - 16.67)) / 1000, 0.05);
      last = now;
      // Time-based easing fills the gaps between wheel events at any refresh rate.
      current += (target - current) * (1 - Math.exp(-dt / 0.065));
      if (
        !visible ||
        reduced.matches ||
        compact.matches ||
        Math.abs(target - current) < 0.00005
      )
        current = target;
      paint(current);
      if (current !== target) frame = requestAnimationFrame(tick);
      else last = 0;
    };
    const schedule = () => {
      if (!frame && !paused && !document.hidden)
        frame = requestAnimationFrame(tick);
    };
    const measure = () => {
      const rect = element.getBoundingClientRect();
      startY = rect.top + scrollY;
      extent = Math.max(1, element.offsetHeight - sticky.offsetHeight);
      element.style.setProperty('--stage-width', sticky.offsetWidth + 'px');
      element.style.setProperty('--stage-height', sticky.offsetHeight + 'px');
      schedule();
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (!document.hidden) schedule();
    };
    const preference = () => {
      if (reduced.matches || compact.matches) {
        current = 0;
        paint(0);
      }
      measure();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
        if (!paused) {
          current = targetProgress();
          paint(current);
        }
      } else schedule();
    });
    const sizes = new ResizeObserver(measure);
    sizes.observe(element);
    sizes.observe(sticky);
    observer.observe(element);
    measure();
    if (reduced.matches || compact.matches) current = 0;
    paint(current);
    window.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', preference);
    compact.addEventListener('change', preference);
    return () => {
      cancelAnimationFrame(frame);
      sizes.disconnect();
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', preference);
      compact.removeEventListener('change', preference);
    };
  }, [paused, introKey]);
  useEffect(() => {
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          visible.set(entry.target.id, entry.intersectionRatio),
        );
        const closest = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        setActiveProject(closest && closest[1] > 0 ? closest[0] : '');
      },
      { rootMargin: '-145px 0px -20% 0px', threshold: [0, 0.15, 0.4, 0.65] },
    );
    document
      .querySelectorAll('.project-panorama')
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (menu) document.querySelector<HTMLAnchorElement>('#main-nav a')?.focus();
  }, [menu]);
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.header');
    if (!header) return;
    const sync = () =>
      document.documentElement.style.setProperty(
        '--header-height',
        header.offsetHeight + 'px',
      );
    const observer = new ResizeObserver(sync);
    observer.observe(header);
    sync();
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--header-height');
    };
  }, []);
  function replay() {
    introProgress.current = 0;
    setPaused(false);
    setIntroKey((key) => key + 1);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  return (
    <div className="site-shell" data-motion={paused ? 'paused' : 'running'}>
      <a href="#heritage" className="skip-link">
        {t.skip}
      </a>
      <header className="header" dir="ltr">
        <Brand label={t.home} />
        <nav
          id="main-nav"
          className={menu ? 'main-nav is-open' : 'main-nav'}
          aria-label={t.footerStudio}
        >
          {[
            {
              id: 'heritage',
              name: 'L’Héritage de Poudlard',
              image: '/images/heritage-logo.webp',
              backdrop: '/images/heritage-luminous.webp',
              color: '#b887ef',
            },
            ...worlds,
            newgen,
          ].map((world) => (
            <a
              key={world.id}
              href={'#' + world.id}
              aria-label={world.name}
              title={world.name}
              onClick={() => setMenu(false)}
              aria-current={activeProject === world.id ? 'location' : undefined}
            >
              <span
                className={'nav-project-icon nav-icon-' + world.id}
                style={{ '--icon-color': world.color } as CSSProperties}
                aria-hidden="true"
              >
                <Image
                  className="nav-icon-logo"
                  src={world.image}
                  alt=""
                  width={100}
                  height={100}
                />
              </span>
              <span dir="auto">
                {world.id === 'heritage'
                  ? t.navHeritage
                  : world.id === 'nations'
                    ? 'Avatar'
                    : world.name.replace(' RP', '')}
              </span>
            </a>
          ))}
          <a
            className="mobile-studio-link"
            href="#studio"
            onClick={() => setMenu(false)}
          >
            {t.navStudio}
            <ArrowUpRight size={18} />
          </a>
        </nav>
        <div className="header-actions">
          <button
            className="motion-toggle"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? t.motionResume : t.motionPause}
            title={paused ? t.motionResume : t.motionPause}
          >
            {paused ? <Play size={18} /> : <Pause size={18} />}
          </button>
          <a className="header-studio-link" href="#studio">
            {t.navStudio}
          </a>
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
            aria-label={t.join}
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
            <CinemaField paused={paused} progress={introProgress} />
            <div className="intro-chapters" aria-hidden="true">
              <span>{t.introChapter1}</span>
              <span>{t.introChapter2}</span>
              <span>{t.introChapter3}</span>
            </div>
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
              <div className="intro-controls">
                <span className="hero-side">{t.heroSide}</span>
              </div>
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
        <section className="heritage-section" aria-labelledby="heritage-title">
          <div className="section-wrap heritage-heading reveal">
            <p className="eyebrow">{t.heritageLabel}</p>
            <h2>{t.heritageIntro}</h2>
          </div>
          <ProjectBanner
            id="heritage"
            name="L’Héritage de Poudlard"
            title={
              <>
                L’Héritage
                <br />
                de Poudlard
              </>
            }
            image="/images/heritage-logo.webp"
            backdrop="/images/heritage-luminous.webp"
            color="#eac998"
            genre={t.heritageGenre}
            status={t.development}
            text={t.heritageText}
            cta={t.heritageCta}
            href={HERITAGE}
            note={t.heritageNote}
            illustration={t.visualNote}
            paused={paused}
          />
        </section>
        <section
          className="worlds-section"
          id="univers"
          aria-labelledby="worlds-title"
        >
          <div className="section-heading section-wrap reveal">
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
          <div className="worlds-panoramas">
            {worlds.map((world) => (
              <ProjectBanner
                key={world.id}
                {...world}
                genre={t[(world.id + 'Genre') as keyof typeof t]}
                status={t.preparation}
                line={t[(world.id + 'Line') as keyof typeof t]}
                text={t[(world.id + 'Text') as keyof typeof t]}
                cta={t.followProject}
                href={DISCORD}
                illustration={t.visualNote}
                paused={paused}
              />
            ))}
          </div>
        </section>
        <section className="newgen-section" aria-labelledby="newgen-heading">
          <div className="section-wrap newgen-heading reveal">
            <p className="eyebrow">{t.newgenLabel}</p>
            <h2 id="newgen-heading">{t.newgenHeading}</h2>
          </div>
          <ProjectBanner
            {...newgen}
            genre={t.newgenGenre}
            status={t.newgenStatus}
            line={t.newgenLine}
            text={t.newgenText}
            cta={t.newgenCta}
            href={DISCORD}
            note={t.newgenNote}
            illustration={t.visualNote}
            paused={paused}
          />
        </section>
        <section
          className="studio-section section-wrap"
          id="studio"
          aria-labelledby="studio-title"
        >
          <div className="studio-layout">
            <div className="studio-intro reveal">
              <p className="eyebrow">{t.studioLabel}</p>
              <h2 id="studio-title">
                {t.studioTitle1}
                <br />
                <em>{t.studioTitle2}</em>
              </h2>
              <p>{t.studioText}</p>
            </div>
            <div className="studio-mosaic reveal">
              {[
                {
                  image: '/images/heritage-luminous.webp',
                  name: 'L’Héritage de Poudlard',
                  id: 'heritage',
                },
                {
                  image: '/images/nations-world.webp',
                  name: 'Avatar — Les Quatre Nations',
                  id: 'nations',
                },
                {
                  image: '/images/percy-world.webp',
                  name: 'Percy Jackson RP',
                  id: 'percy',
                },
              ].map((world) => (
                <a
                  key={world.id}
                  href={'#' + world.id}
                  className={'studio-scene studio-scene-' + world.id}
                >
                  <Image
                    src={world.image}
                    alt=""
                    width={1000}
                    height={700}
                    loading="lazy"
                  />
                  <span>
                    {world.name}
                    <ArrowUpRight size={20} />
                  </span>
                </a>
              ))}
              <div className="studio-mosaic-stamp" aria-hidden="true">
                <StudioMark />
              </div>
            </div>
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
            {[1, 2, 3, 4, 5].map((n) => (
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
          <div className="discord-stage reveal">
            <div className="discord-orbit-label discord-orbit-one">
              <Megaphone size={21} />
              {t.discordAnnouncements}
            </div>
            <div className="discord-orbit-label discord-orbit-two">
              <Headphones size={21} />
              {t.discordMeetups}
            </div>
            <div className="discord-server-card">
              <div className="discord-card-cover">
                <Image
                  src="/images/nations-world.webp"
                  alt=""
                  width={1000}
                  height={650}
                  loading="lazy"
                />
                <span>
                  <DiscordIcon size={22} />
                  Discord
                </span>
              </div>
              <div className="discord-server-avatar">
                <StudioMark />
              </div>
              <div className="discord-card-content">
                <p className="discord-eyebrow">{t.discordEyebrow}</p>
                <h3>Immersive Studio</h3>
                <p>{t.discordTagline}</p>
                <div className="discord-world-icons" aria-hidden="true">
                  {[
                    '/images/heritage-logo.webp',
                    ...worlds.map((world) => world.image),
                    newgen.image,
                  ].map((image) => (
                    <Image
                      key={image}
                      src={image}
                      alt=""
                      width={80}
                      height={80}
                      loading="lazy"
                    />
                  ))}
                </div>
                <div className="discord-welcome">
                  <MessageCircle size={21} />
                  <span>{t.discordWelcome}</span>
                </div>
                <a
                  href={DISCORD}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button discord-join-button"
                >
                  {t.join}
                  <ArrowUpRight size={23} />
                </a>
              </div>
            </div>
            <div className="discord-orbit-label discord-orbit-three">
              <MessageCircle size={21} />
              {t.discordBackstage}
            </div>
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
            {[...worlds, newgen].map((world) => (
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
    </div>
  );
}
