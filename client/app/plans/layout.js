export const metadata = {
    title: 'Pricing & Plans | Get Started with Bulk AI Automation',
    description: 'Compare Whisk Automator plans. Choose the best premium bulk AI image generation package for your creative workflow. Start for free today.',
    alternates: {
        canonical: '/plans',
    },
};

export default function PlansLayout({ children }) {
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
                name: 'Plans',
                item: 'https://whisk-image-generator-extension.vercel.app/plans',
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
