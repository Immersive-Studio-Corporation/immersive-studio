'use client';

import {
  ArrowUpRight,
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
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
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
import { ProjectJourney } from './project-journey';
import { JourneySound } from './journey-sound';
import type { JourneyProject } from './project-journey';
import { sceneryFor, responsiveScenery } from './journey-art';
import { projectCatalog } from './journey-catalog';
import { emptyAudioFrame } from './journey-audio-frame';
import { dictionaries, isLocale, languages } from './messages';
import type { Locale } from './messages';
import { socialLinks } from './social-links';
import { SocialBrandIcon, SocialMenu } from './social-menu';

const DISCORD = 'https://discord.gg/YkPYhhtyPZ';
const HERITAGE = 'https://heritagedepoudlard.fr/';

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
  const [socialOpen, setSocialOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeProject, setActiveProject] = useState('');
  const audioFrame = useRef(emptyAudioFrame());
  const [introKey, setIntroKey] = useState(0);
  const menuButton = useRef<HTMLButtonElement>(null);

  const journeyProjects = useMemo<JourneyProject[]>(
    () =>
      projectCatalog.map((project) => {
        if (project.id === 'heritage')
          return {
            ...project,
            genre: t.heritageGenre,
            status: t.development,
            line: t.heritageIntro,
            text: t.heritageText,
            cta: t.heritageCta,
            href: HERITAGE,
            note: t.heritageNote,
          };
        return {
          ...project,
          genre: t[(project.id + 'Genre') as keyof typeof t],
          status: t.preparation,
          line: t[(project.id + 'Line') as keyof typeof t],
          text: t[(project.id + 'Text') as keyof typeof t],
          cta: t.followProject,
          href: DISCORD,
        };
      }),
    [t],
  );

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
    document
      .querySelector('meta[name="twitter:title"]')
      ?.setAttribute('content', t.metadataTitle);
    document
      .querySelector('meta[name="twitter:description"]')
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
          {projectCatalog.map((world) => (
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
          <JourneySound
            frame={audioFrame}
            projectName={
              journeyProjects.find((project) => project.id === activeProject)
                ?.name || ''
            }
            t={t}
          />
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
          <div className="header-community">
            <a
              className="header-discord"
              aria-label={t.join}
              href={DISCORD}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DiscordIcon size={21} />
              <span>Discord</span>
            </a>
            <SocialMenu
              t={t}
              open={socialOpen}
              onOpenChange={(open) => {
                setSocialOpen(open);
                if (open) setMenu(false);
              }}
              discordIcon={<DiscordIcon size={21} />}
              paused={paused}
              rtl={locale === 'ar'}
            />
          </div>
          <button
            ref={menuButton}
            className="menu-toggle"
            aria-expanded={menu}
            aria-controls="main-nav"
            aria-label={menu ? t.menuClose : t.menuOpen}
            onClick={() => {
              setMenu(!menu);
              setSocialOpen(false);
            }}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main>
        <ProjectJourney
          audioFrame={audioFrame}
          projects={journeyProjects}
          t={t}
          paused={paused}
          replayKey={introKey}
          onProjectChange={setActiveProject}
        />
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
              {projectCatalog.slice(0, 3).map((world) => (
                <a
                  key={world.id}
                  href={'#' + world.id}
                  className={'studio-scene studio-scene-' + world.id}
                >
                  <Image
                    {...responsiveScenery(world.backdrop)}
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
                <AccordionContent className="faq-answer" keepMounted>
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
                  {...responsiveScenery(sceneryFor('nations')[0])}
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
                  {projectCatalog
                    .map((project) => project.image)
                    .map((image) => (
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
        <nav className="footer-socials" aria-label={t.socialTitle}>
          <p>{t.socialTitle}</p>
          <div className="footer-social-links">
            {socialLinks.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label={
                  social.platform +
                  ' · ' +
                  (social.owner === 'heritage'
                    ? 'L’Héritage de Poudlard'
                    : t.socialCreator) +
                  ' · ' +
                  social.handle
                }
              >
                <SocialBrandIcon platform={social.platform} />
                <span dir="ltr">{social.handle}</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            ))}
          </div>
        </nav>
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
            {projectCatalog.slice(1).map((world) => (
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
