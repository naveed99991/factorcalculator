import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { siteConfig } from '../lib/siteConfig';
import {
  buildOrganization,
  buildWebSite,
  buildSchemaGraph,
  serializeSchema,
} from '../lib/schema';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingAsk from '../components/FloatingAsk';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

// Body font — optimized for reading long content
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600'],
});

// Display font — headings, brand, numbers
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['500', '600', '700', '800'],
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.publisher.name,
  publisher: siteConfig.publisher.name,
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      { url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    ...(siteConfig.social.twitter && { creator: siteConfig.social.twitter }),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#4F46E5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  const siteSchema = buildSchemaGraph(buildOrganization(), buildWebSite());

  return (
    <html
      lang={siteConfig.language}
      className={`${inter.variable} ${jakarta.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeSchema(siteSchema) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-surface text-ink font-sans antialiased"
      >
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <FloatingAsk />
      </body>
      {siteConfig.gaId ? <GoogleAnalytics gaId={siteConfig.gaId} /> : null}
    </html>
  );
}