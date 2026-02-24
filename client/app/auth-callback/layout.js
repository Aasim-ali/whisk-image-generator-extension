export const metadata = {
    title: 'Authentication Callback | Whiskbot',
    description: 'Completing your authentication process. Just a moment while we redirect you to Whiskbot.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function AuthCallbackLayout({ children }) {
    return <>{children}</>;
}
