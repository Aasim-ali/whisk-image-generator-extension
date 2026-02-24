'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

const sections = [
    {
        title: '1. Information We Collect',
        content: [
            {
                subtitle: 'Account Information',
                text: 'When you register for Whiskbot, we collect your name, email address, and password (stored securely as a hashed value). If you sign up using Google OAuth, we collect your Google profile name and email address.'
            },
            {
                subtitle: 'Usage Data',
                text: 'We collect information about how you use our service, including the number of images generated, session activity, and browser extension interactions. This helps us improve performance and enforce fair usage limits.'
            },
            {
                subtitle: 'Device & Session Information',
                text: 'We may collect information about the devices you use to access Whiskbot, including browser type, operating system, and unique device identifiers, to manage device limits and prevent unauthorized access.'
            },
            {
                subtitle: 'Payment Information',
                text: 'If you subscribe to a paid plan, payment details are processed securely by our third-party payment processor. We do not store your full credit card number on our servers.'
            }
        ]
    },
    {
        title: '2. How We Use Your Information',
        content: [
            {
                subtitle: 'To Provide the Service',
                text: 'We use your information to operate Whiskbot, authenticate your account, enforce subscription limits, and deliver the image generation automation features you signed up for.'
            },
            {
                subtitle: 'To Communicate With You',
                text: 'We may send you transactional emails such as account confirmations, password resets, subscription updates, and responses to your support or contact requests.'
            },
            {
                subtitle: 'To Improve Our Service',
                text: 'Usage data helps us understand how our extension and web platform are used, allowing us to fix bugs, optimize performance, and build better features.'
            },
            {
                subtitle: 'To Enforce Our Policies',
                text: 'We use account and device data to enforce our Terms of Service, including device limits, daily image generation quotas, and plan expiry rules.'
            }
        ]
    },
    {
        title: '3. Information Sharing',
        content: [
            {
                subtitle: 'We Do Not Sell Your Data',
                text: 'Whiskbot does not sell, rent, or trade your personal information to third parties for marketing purposes.'
            },
            {
                subtitle: 'Service Providers',
                text: 'We may share data with trusted third-party service providers who help us operate our platform — such as payment processors, email delivery services, and cloud hosting providers — under strict confidentiality agreements.'
            },
            {
                subtitle: 'Legal Requirements',
                text: 'We may disclose your information if required to do so by law or in response to valid legal processes, such as a court order or government request.'
            }
        ]
    },
    {
        title: '4. Your Product Images',
        content: [
            {
                subtitle: 'Local Processing',
                text: 'Whiskbot operates directly with your local files on your device via the Chrome extension. Your product images are NOT uploaded to our servers. We never store, access, or transmit your product photos.'
            },
            {
                subtitle: 'Generated Images',
                text: 'Images generated through Google Whisk are processed on Google\'s infrastructure. Please refer to Google\'s Privacy Policy for how they handle AI-generated content.'
            }
        ]
    },
    {
        title: '5. Cookies & Tracking',
        content: [
            {
                subtitle: 'Session Cookies',
                text: 'We use session cookies to keep you logged in and maintain your authentication state across pages.'
            },
            {
                subtitle: 'No Third-Party Trackers',
                text: 'We do not use advertising trackers or cross-site tracking cookies. Our analytics, if any, are limited to understanding general usage patterns.'
            }
        ]
    },
    {
        title: '6. Data Retention',
        content: [
            {
                subtitle: 'Account Data',
                text: 'We retain your account data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law.'
            },
            {
                subtitle: 'Contact Submissions',
                text: 'Support and contact requests are automatically deleted after 30 days of submission.'
            }
        ]
    },
    {
        title: '7. Security',
        content: [
            {
                subtitle: 'How We Protect Your Data',
                text: 'We implement industry-standard security measures including password hashing, HTTPS encryption, and secure token-based authentication (JWT) to protect your personal information.'
            },
            {
                subtitle: 'Your Responsibility',
                text: 'Please keep your account credentials confidential and notify us immediately if you suspect unauthorized access to your account.'
            }
        ]
    },
    {
        title: '8. Your Rights',
        content: [
            {
                subtitle: 'Access & Correction',
                text: 'You have the right to access the personal data we hold about you and to request corrections if it is inaccurate.'
            },
            {
                subtitle: 'Deletion',
                text: 'You may request deletion of your account and associated personal data by contacting us. We will process your request within 30 days.'
            },
            {
                subtitle: 'Opt-Out',
                text: 'You may opt out of non-essential communications by contacting us directly via our Contact page.'
            }
        ]
    },
    {
        title: '9. Children\'s Privacy',
        content: [
            {
                subtitle: 'Age Requirement',
                text: 'Whiskbot is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will delete it promptly.'
            }
        ]
    },
    {
        title: '10. Changes to This Policy',
        content: [
            {
                subtitle: 'Updates',
                text: 'We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at the top of this page. Continued use of Whiskbot after changes are made constitutes your acceptance of the updated policy.'
            }
        ]
    },
    {
        title: '11. Contact Us',
        content: [
            {
                subtitle: 'Questions?',
                text: 'If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to us through the Contact page on our website.'
            }
        ]
    }
];

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative pt-36 pb-16 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

                <div className="container mx-auto px-4">
                    <motion.div
                        className="max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors mb-10 group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                                <Shield size={28} className="text-black" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Legal</p>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Privacy Policy</h1>
                            </div>
                        </div>

                        <p className="text-gray-500 font-bold text-sm">
                            Last Updated: <span className="text-gray-900">February 24, 2025</span>
                        </p>

                        <p className="mt-6 text-gray-600 font-bold leading-relaxed text-lg">
                            At <span className="text-gray-900 font-black">Whiskbot</span>, we take your privacy seriously.
                            This Privacy Policy explains what information we collect, how we use it, and the choices you have.
                            By using Whiskbot, you agree to the practices described below.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="pb-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto space-y-12">
                        {sections.map((section, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.04 }}
                                className="p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:border-primary/20 transition-colors duration-300"
                            >
                                <h2 className="text-xl font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">
                                    {section.title}
                                </h2>
                                <div className="space-y-5">
                                    {section.content.map((item, j) => (
                                        <div key={j}>
                                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                                                {item.subtitle}
                                            </h3>
                                            <p className="text-gray-500 font-bold text-sm leading-relaxed">
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-primary text-center"
                        >
                            <p className="text-black font-black text-xl mb-2">Still have questions?</p>
                            <p className="text-black/70 font-bold text-sm mb-6">
                                We&apos;re happy to clarify anything about how we handle your data.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white font-black rounded-2xl hover:scale-105 transition-transform"
                            >
                                Contact Us
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
