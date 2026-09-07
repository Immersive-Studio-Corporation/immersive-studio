import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import fr from './locales/fr.json';
import './globals.css';
import './header.css';
import './social-menu.css';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});
export const metadata: Metadata = {
  title: fr.metadataTitle,
  description: fr.metadataDescription,
  applicationName: 'Immersive Studio',
  metadataBase: new URL('https://immersive-studio.fr'),
  alternates: { canonical: '/' },
  icons: {
    icon: '/images/studio-mark.svg',
    apple: '/images/studio-mark.webp',
  },
  openGraph: {
    url: '/',
    siteName: 'Immersive Studio',
    title: fr.metadataTitle,
    description: fr.metadataDescription,
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: fr.metadataTitle,
    description: fr.metadataDescription,
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={geistSans.variable + ' ' + geistMono.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://immersive-studio.fr/#organization',
                  name: 'Immersive Studio',
                  url: 'https://immersive-studio.fr/',
                  description: fr.studioText,
                  logo: 'https://immersive-studio.fr/images/studio-mark.svg',
                  sameAs: ['https://discord.gg/YkPYhhtyPZ'],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://immersive-studio.fr/#website',
                  name: 'Immersive Studio',
                  url: 'https://immersive-studio.fr/',
                  description: fr.metadataDescription,
                  inLanguage: 'fr',
                  publisher: {
                    '@id': 'https://immersive-studio.fr/#organization',
                  },
                },
              ],
            }).replace(/</g, '\\u003c'),
          }}
        />
        {children}
      </body>
    </html>
  );
}
