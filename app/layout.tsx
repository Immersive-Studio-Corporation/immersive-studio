import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
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
  title: 'Immersive Studio — D’autres mondes. Votre histoire.',
  description:
    'Découvrez les six univers roleplay en développement d’Immersive Studio : L’Héritage de Poudlard, Percy Jackson, Teen Wolf, Les Quatres Nations, Avengers et The Last of Us.',
  metadataBase: new URL('https://immersive-studio.derekhoganclem.chatgpt.site'),
  icons: {
    icon: '/images/studio-mark.webp',
    apple: '/images/studio-mark.webp',
  },
  openGraph: {
    title: 'Immersive Studio — D’autres mondes. Votre histoire.',
    description:
      'Un studio. Six univers roleplay. Votre prochaine histoire commence ici.',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Immersive Studio',
    description: 'D’autres mondes. Votre histoire.',
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="dark">
      <body className={geistSans.variable + ' ' + geistMono.variable}>
        {children}
      </body>
    </html>
  );
}
