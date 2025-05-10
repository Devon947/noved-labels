export const metadata = {
  title: 'NovedLabels Shipping',
  description: 'Create and manage shipping labels with ease. Get the best rates from top carriers.',
  keywords: 'shipping labels, ecommerce shipping, shipping rates, shipping calculator, shipping api',
  openGraph: {
    title: 'NovedLabels - Professional Shipping Labels & E-commerce Solutions',
    description: 'Premium shipping labels and e-commerce solutions. Fast, reliable, and professional shipping services for your business needs.',
    url: 'https://novedlabels.com/',
    siteName: 'NovedLabels',
    images: [
      {
        url: 'https://novedlabels.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NovedLabels Shipping Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NovedLabels - Professional Shipping Labels & E-commerce Solutions',
    description: 'Premium shipping labels and e-commerce solutions. Fast, reliable, and professional shipping services for your business needs.',
    images: [
      {
        url: 'https://novedlabels.com/twitter-image.jpg',
        alt: 'NovedLabels Shipping Platform',
      }
    ],
    creator: '@novedlabels',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icons/favicon-16x16.png',
    apple: '/icons/apple-touch-icon.png',
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/safari-pinned-tab.svg',
        color: '#3b82f6',
      },
    ],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://novedlabels.com'),
  alternates: {
    canonical: '/',
  },
};

export const viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark',
}; 