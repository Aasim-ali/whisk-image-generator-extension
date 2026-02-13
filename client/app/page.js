import HomeClient from './HomeClient';

export default function Page() {
    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: 'Is WhiskAutomator really free?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes! WhiskAutomator is 100% free to use for all basic features. We believe in providing the best automation tools for everyone.'
                    }
                },
                {
                    '@type': 'Question',
                    name: 'Do I need to upload my images?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'No. WhiskAutomator works directly with your local files to ensure maximum speed and privacy. We never store or upload your product images.'
                    }
                },
                {
                    '@type': 'Question',
                    name: 'Which browsers are supported?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Currently, we focus on providing a premium experience for Google Chrome users via our dedicated extension.'
                    }
                },
                {
                    '@type': 'Question',
                    name: 'Is it safe to use with Google Whisk?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Absolutely. Our bot mimics human interactions and follows all Google Whisk safety protocols to ensure your account remains in good standing.'
                    }
                }
            ]
        },
        {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to use Whisk Automator',
            description: 'Generate bulk AI images for Google Whisk in 3 easy steps.',
            step: [
                {
                    '@type': 'HowToStep',
                    name: 'Install Extension',
                    text: 'Add WhiskAutomator to your Chrome browser with one click from the Web Store.',
                    url: 'https://whisk-image-generator-extension.vercel.app/register'
                },
                {
                    '@type': 'HowToStep',
                    name: 'Connect Folder',
                    text: 'Select the local folder containing your product images. No uploads needed.',
                    url: 'https://whisk-image-generator-extension.vercel.app/register'
                },
                {
                    '@type': 'HowToStep',
                    name: 'Run Automator',
                    text: 'Sit back and watch as we generate and download hundreds of images instantly.',
                    url: 'https://whisk-image-generator-extension.vercel.app/register'
                }
            ]
        }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HomeClient />
        </>
    );
}
