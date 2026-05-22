import { Head } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';

type Partner = {
    id: number;
    name: string;
    image: string | null;
    universities_link: string | null;
};

type Props = {
    partners: Partner[];
    title?: string;
    description?: string;
};

export default function UniversityPartners({ partners, title = 'University Partners', description = '' }: Props) {
    return (
        <SiteLayout title={`${title} | Smart Move Education Group`} activePage="partners">
            <Head>
                <meta name="description" content={description} />
            </Head>

            <main className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-bold">Our University Partners</h1>
                    {description ? <p className="mt-3 text-lg text-white/70">{description}</p> : null}
                </header>

                <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center">
                    {partners.map((p) => (
                        <div key={p.id} className="flex items-center justify-center">
                            {p.universities_link ? (
                                <a href={p.universities_link} target="_blank" rel="noopener noreferrer" className="block w-full">
                                    <div className="mx-auto flex h-36 w-full max-w-[220px] items-center justify-center overflow-hidden rounded-lg ">
                                        {p.image ? (
                                            <img src={p.image} alt={p.name} className="max-h-24 max-w-full object-contain" />
                                        ) : (
                                            <span className="text-sm text-white/60">{p.name}</span>
                                        )}
                                    </div>
                                </a>
                            ) : (
                                <div className="mx-auto flex h-36 w-full max-w-[220px] items-center justify-center overflow-hidden rounded-lg">
                                    {p.image ? (
                                        <img src={p.image} alt={p.name} className="max-h-24 max-w-full object-contain" />
                                    ) : (
                                        <span className="text-sm text-white/60">{p.name}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            </main>
        </SiteLayout>
    );
}
