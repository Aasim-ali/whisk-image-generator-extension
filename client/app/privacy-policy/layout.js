export const metadata = {
    title: 'Privacy Policy | Whiskbot',
    description: 'Read the Whiskbot Privacy Policy to understand how we collect, use, and protect your personal information when you use our Chrome extension and web platform.',
    alternates: {
        canonical: '/privacy-policy',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function PrivacyPolicyLayout({ children }) {
    return <>{children}</>;
}
