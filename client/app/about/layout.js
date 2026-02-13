export const metadata = {
    title: 'About Us | Our Mission & Team',
    description: 'Learn about Whisk Automator, our mission to democratize creative workflows, and the team behind the #1 bulk AI image generator for Google Whisk.',
    alternates: {
        canonical: '/about',
    },
};

export default function AboutLayout({ children }) {
    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://whisk-image-generator-extension.vercel.app',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'About',
                item: 'https://whisk-image-generator-extension.vercel.app/about',
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            {children}
        </>
    );
}
