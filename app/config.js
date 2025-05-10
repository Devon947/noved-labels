// Global configuration settings for Next.js application
export const siteConfig = {
  name: "NOVED Labels",
  description: "Simple and affordable shipping labels for everyone",
  url: "https://novedlabels.vercel.app",
  ogImage: "https://novedlabels.vercel.app/og.jpg",
  links: {
    twitter: "https://twitter.com/novedlabels",
    github: "https://github.com/Devon947/noved-labels",
  },
};

// Dynamic rendering configuration for all routes
export const dynamicConfig = { 
  // Force dynamic rendering to prevent static generation errors
  // This resolves the cookies issue with auth routes
  dynamic: 'force-dynamic',
  
  // Disable static generation
  revalidate: 0,
  
  // Additional dynamic options
  fetchCache: 'force-no-store',
  runtime: 'nodejs',
}; 