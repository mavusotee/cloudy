export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://steamhaus.vercel.app/sitemap.xml',
  }
}