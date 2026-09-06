import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './header.css';
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
  title: 'Immersive Studio — L’imaginaire. En grand.',
  description:
    'Immersive Studio imagine des mondes dans Minecraft : L’Héritage de Poudlard, cinq univers roleplay en préparation et Newgen, notre futur projet de mini-jeux.',
  metadataBase: new URL('https://immersive-studio.derekhoganclem.chatgpt.site'),
  icons: {
    icon: '/images/studio-mark.svg',
    apple: '/images/studio-mark.webp',
  },
  openGraph: {
    title: 'Immersive Studio — L’imaginaire. En grand.',
    description:
      'Immersive Studio imagine des mondes dans Minecraft : L’Héritage de Poudlard, cinq univers roleplay en préparation et Newgen, notre futur projet de mini-jeux.',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Immersive Studio',
    description: 'L’imaginaire. En grand.',
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={geistSans.variable + ' ' + geistMono.variable}>
        {children}
      </body>
    </html>
  );
}
