export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/dashboard/private/'],
        },
        sitemap: 'https://whiskbot.in/sitemap.xml',
    };
}
