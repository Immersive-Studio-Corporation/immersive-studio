'use client';

import { ArrowUpRight, ChevronDown, X } from 'lucide-react';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { Messages } from './messages';
import { socialLinks } from './social-links';
import type { ReactNode } from 'react';

export function SocialBrandIcon({
  platform,
}: {
  platform: 'TikTok' | 'YouTube' | 'Instagram';
}) {
  return (
    <Image
      className={'social-brand-logo logo-' + platform.toLowerCase()}
      src={'/images/social/' + platform.toLowerCase() + '.svg'}
      width={24}
      height={24}
      alt=""
      aria-hidden="true"
    />
  );
}

export function SocialMenu({
  t,
  open,
  onOpenChange,
  discordIcon,
  paused,
  rtl,
}: {
  t: Messages;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discordIcon: ReactNode;
  paused: boolean;
  rtl: boolean;
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        className="social-menu-trigger"
        aria-label={'Discord · ' + t.socialTitle}
        title={t.socialTitle}
      >
        <span className="social-trigger-brands" aria-hidden="true">
          <SocialBrandIcon platform="TikTok" />
          <SocialBrandIcon platform="YouTube" />
          <SocialBrandIcon platform="Instagram" />
        </span>
        <span className="social-trigger-mobile" aria-hidden="true">
          {discordIcon}
        </span>
        <ChevronDown
          className="social-trigger-chevron"
          size={16}
          aria-hidden="true"
        />
      </PopoverTrigger>
      <PopoverContent
        className="social-menu-panel"
        align="end"
        sideOffset={12}
        dir={rtl ? 'rtl' : 'ltr'}
        data-paused={paused || undefined}
      >
        <div className="social-menu-heading">
          <div>
            <PopoverTitle className="social-menu-title">
              {t.socialTitle}
            </PopoverTitle>
            <PopoverDescription className="social-menu-description">
              {t.socialText}
            </PopoverDescription>
          </div>
          <button
            className="social-menu-close"
            onClick={() => onOpenChange(false)}
            aria-label={t.menuClose}
          >
            <X size={20} />
          </button>
        </div>
        <a
          className="social-menu-discord"
          href="https://discord.gg/YkPYhhtyPZ"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onOpenChange(false)}
        >
          {discordIcon}
          <span>
            <strong>Immersive Studio</strong>
            <small>{t.join}</small>
          </span>
          <ArrowUpRight size={20} />
        </a>
        {(['heritage', 'creator'] as const).map((owner) => (
          <section
            className="social-menu-group"
            key={owner}
            aria-label={
              owner === 'heritage' ? 'L’Héritage de Poudlard' : t.socialCreator
            }
          >
            <h3>
              {owner === 'heritage'
                ? 'L’Héritage de Poudlard'
                : t.socialCreator}
            </h3>
            {socialLinks
              .filter((social) => social.owner === owner)
              .map((social) => (
                <a
                  className="social-menu-account"
                  href={social.href}
                  key={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onOpenChange(false)}
                >
                  <span
                    className={
                      'social-brand-tile brand-' + social.platform.toLowerCase()
                    }
                  >
                    <SocialBrandIcon platform={social.platform} />
                  </span>
                  <span className="social-menu-account-copy">
                    <strong>{social.platform}</strong>
                    <small dir="ltr">{social.handle}</small>
                  </span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              ))}
          </section>
        ))}
      </PopoverContent>
    </Popover>
  );
}
