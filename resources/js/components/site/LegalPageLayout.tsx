import type { ReactNode } from 'react';
import SiteLayout from '@/layouts/site-layout';

interface LegalSection {
    heading: string;
    body: ReactNode;
}

interface LegalPageLayoutProps {
    metaTitle: string;
    heading: string;
    lastUpdated: string;
    intro?: ReactNode;
    sections: LegalSection[];
}

export default function LegalPageLayout({
    metaTitle,
    heading,
    lastUpdated,
    intro,
    sections,
}: LegalPageLayoutProps) {
    return (
        <SiteLayout title={metaTitle}>
            <section className="relative overflow-hidden pt-24 pb-12">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="glow-orb blob-a absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#00b4e0]/10" />
                </div>
                <div className="relative z-10 container mx-auto max-w-4xl px-6 text-center lg:px-10">
                    <h1 className="mb-4 font-headline text-4xl font-bold text-white lg:text-5xl">
                        {heading}
                    </h1>
                    <p className="font-body text-sm text-[#a09a97]">
                        Last updated: {lastUpdated}
                    </p>
                </div>
            </section>

            <section className="pb-24">
                <div className="relative z-10 container mx-auto max-w-4xl px-6 lg:px-10">
                    {intro && (
                        <div className="mb-12 space-y-4 font-body text-base leading-relaxed text-[#a09a97]">
                            {intro}
                        </div>
                    )}
                    <div className="space-y-8">
                        {sections.map((section) => (
                            <div
                                key={section.heading}
                                className="glass-card rounded-xl p-6 lg:p-8"
                            >
                                <h2 className="mb-4 font-headline text-xl font-bold text-white lg:text-2xl">
                                    {section.heading}
                                </h2>
                                <div className="space-y-4 font-body text-sm leading-relaxed text-[#a09a97] lg:text-base">
                                    {section.body}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
