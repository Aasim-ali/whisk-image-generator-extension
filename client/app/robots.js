export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/dashboard/private/'],
        },
        sitemap: 'https://whisk-image-generator-extension.vercel.app/sitemap.xml',
    };
}
