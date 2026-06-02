import SiteLayout from '@/layouts/site-layout';

const servicesList = [
    {
        icon: 'school',
        iconColor: 'text-[#bcc2ff]',
        bgIcon: 'bg-primary-container/20',
        title: 'Course & University Selection',
        description:
            'Using questionnaires and in-depth interviews, we analyse a range of career paths. Our consultants recommend study programmes tailored to your qualifications, experience, and future goals.',
    },
    {
        icon: 'description',
        iconColor: 'text-secondary-container',
        bgIcon: 'bg-secondary-container/20',
        title: 'Document Preparation',
        description:
            'We assist with compiling, reviewing, and organising all required documentation — from academic transcripts to personal statements — ensuring your application is complete and compelling.',
    },
    {
        icon: 'fact_check',
        iconColor: 'text-[#bcc2ff]',
        bgIcon: 'bg-primary-container/20',
        title: 'Initial Assessments & Eligibility',
        description:
            'We conduct thorough initial assessments to evaluate your academic background and help identify the most suitable pathways, saving you time and increasing your chances of acceptance.',
    },
    {
        icon: 'record_voice_over',
        iconColor: 'text-tertiary',
        bgIcon: 'bg-tertiary-container/20',
        title: 'Interview & Test Preparation',
        description:
            'Where required, we provide tailored preparation support for university interviews and admissions tests, helping you present your best self with confidence.',
    },
    {
        icon: 'payments',
        iconColor: 'text-secondary-container',
        bgIcon: 'bg-secondary-container/20',
        title: 'Scholarships & Funding',
        description:
            'Our team identifies scholarship opportunities you may be eligible for and guides you through the application process to maximise your chances of securing financial support.',
    },
    {
        icon: 'travel_explore',
        iconColor: 'text-tertiary',
        bgIcon: 'bg-tertiary-container/20',
        title: 'Induction & Academic Orientation',
        description:
            'We provide a comprehensive induction to help you better understand your academic options in the UK — from entry requirements to progression routes and career outcomes.',
    },
    {
        icon: 'support_agent',
        iconColor: 'text-[#bcc2ff]',
        bgIcon: 'bg-primary-container/20',
        title: 'End-to-End Application Support',
        description:
            'From submitting your UCAS or direct university application to receiving your offer, we guide you through every stage — liaising with institutions on your behalf where needed.',
    },
    {
        icon: 'verified_user',
        iconColor: 'text-secondary-container',
        bgIcon: 'bg-secondary-container/20',
        title: 'Free Professional Consultation',
        description:
            'All of our services are completely free of charge to students. Our goal is to be a trusted point of reference — a safe space where every question gets a real answer.',
    },
];

const whyUs = [
    'British Council Certified counsellors',
    'UCAS Registered Centre',
    '100% free consultation and guidance',
    'Dedicated support for both home & international students',
    'Personal statement review and enhancement',
    'Tailored university and course recommendations',
    'Direct liaison with universities on your behalf',
];

export default function Services() {
    return (
        <SiteLayout title="Our Services | Smart Move Education Group" activePage="services">
            {/* Hero */}
            <section className="relative overflow-hidden pt-32 pb-24 bg-[#1e1e1e]">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="glow-orb blob-a absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#1a3172]/15" />
                    <div className="glow-orb blob-b absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-[#efa500]/8" />
                </div>
                <div className="relative z-10 container mx-auto px-6 lg:px-10 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-label font-bold tracking-widest uppercase bg-secondary-container/15 text-secondary-container mb-6">
                                What We Offer
                            </span>
                            <h1 className="text-4xl lg:text-6xl font-headline font-bold text-white leading-tight mb-6">
                                Our <span className="text-gradient-gold">Services</span>
                            </h1>
                            <p className="text-white/60 font-body text-lg leading-relaxed mb-6">
                                Our highly trained team provide a wide range of services — all completely free of charge to every student.
                            </p>
                            <p className="text-white/60 font-body text-base leading-relaxed mb-8">
                                Our main goal is to become a point of reference for our students — a safe space where they can discuss any issues or concerns they are having. We are happy to find a solution for every prospective student.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="/contact"
                                    className="bg-secondary-container text-on-secondary px-7 py-3.5 rounded-full font-headline font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-secondary-container/20 flex items-center gap-2"
                                >
                                    Book a Free Consultation
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
                                <img
                                    src="/images/The-Value-of-International-Students-to-the-UK-and-Their-Recruitment-e1452532232403.jpg"
                                    alt="Student with UK flag at Tower Bridge, London"
                                    className="w-full h-[460px] object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-5 -left-5 glass-card rounded-xl px-5 py-4 flex items-center gap-3 shadow-lg">
                                <span className="material-symbols-outlined text-secondary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    verified
                                </span>
                                <div>
                                    <p className="text-white text-sm font-headline font-semibold">British Council Certified</p>
                                    <p className="text-white/50 text-xs">UCAS Registered Centre</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Free service banner */}
            <section className="py-10 border-y border-white/[0.06] bg-surface-container-low">
                <div className="container mx-auto px-6 lg:px-10 max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
                        <div className="w-12 h-12 rounded-full bg-secondary-container/15 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-secondary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                volunteer_activism
                            </span>
                        </div>
                        <p className="text-white font-headline font-bold text-xl">
                            All our services are{' '}
                            <span className="text-gradient-gold">completely free of charge</span> to every student.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-28 bg-[#1e1e1e] relative overflow-hidden">
                <div className="glow-orb blob-c absolute w-[500px] h-[500px] bg-[#00b4e0]/5 -right-20 top-20 rounded-full" />
                <div className="container mx-auto px-6 lg:px-10 max-w-7xl relative z-10">
                    <div className="text-center mb-16 reveal">
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-label font-bold tracking-widest uppercase bg-secondary-container/15 text-secondary-container mb-4">
                            How We Help
                        </span>
                        <h2 className="text-3xl lg:text-5xl font-headline font-bold text-white mb-4">
                            Some of the services we offer
                        </h2>
                        <p className="text-white/50 font-body text-base max-w-2xl mx-auto">
                            From your very first enquiry to securing your university place, we provide hands-on, personalised support at every step.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {servicesList.map((service, i) => (
                            <div
                                key={service.title}
                                className={`bg-surface-container-low rounded-xl p-6 hover:ring-1 hover:ring-secondary-container/20 transition-all duration-300 hover:-translate-y-1 reveal ${i % 4 === 1 ? 'reveal-d1' : i % 4 === 2 ? 'reveal-d2' : i % 4 === 3 ? 'reveal-d3' : ''}`}
                            >
                                <div className={`w-11 h-11 rounded-xl ${service.bgIcon} flex items-center justify-center mb-5`}>
                                    <span className={`material-symbols-outlined ${service.iconColor} text-xl`}>{service.icon}</span>
                                </div>
                                <h3 className="text-white font-headline font-bold text-base mb-3 leading-snug">{service.title}</h3>
                                <p className="text-white/50 font-body text-sm leading-relaxed">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Smart Move + image */}
            <section className="py-28 bg-surface-container-low relative overflow-hidden">
                <div className="glow-orb blob-a absolute w-[500px] h-[500px] bg-[#1a3172]/8 -left-20 bottom-0 rounded-full" />
                <div className="container mx-auto px-6 lg:px-10 max-w-7xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="reveal">
                            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-label font-bold tracking-widest uppercase bg-secondary-container/15 text-secondary-container mb-6">
                                Our Advantage
                            </span>
                            <h2 className="text-3xl lg:text-5xl font-headline font-bold text-white leading-tight mb-8">
                                Why Choose <span className="text-gradient-gold">Smart Move?</span>
                            </h2>
                            <p className="text-white/60 font-body text-base leading-relaxed mb-8">
                                We go beyond consultancy — we become your trusted partner in building a successful future through UK education.
                            </p>
                            <ul className="space-y-4">
                                {whyUs.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <span
                                            className="material-symbols-outlined text-secondary-container text-xl mt-0.5 shrink-0"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            check_circle
                                        </span>
                                        <span className="text-white/70 font-body text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10">
                                <a
                                    href="/contact"
                                    className="inline-flex items-center gap-2 text-secondary-container font-bold hover:gap-4 transition-all font-headline group"
                                >
                                    Get in touch today
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                        <div className="relative reveal reveal-d1">
                            <div className="rounded-2xl overflow-hidden border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.5)] bg-surface-container-high flex items-end justify-center pt-8">
                                <img
                                    src="/images/516-5164117_uk-study-visa-design-hd-png-download.jpg"
                                    alt="Students ready for their UK university journey"
                                    className="w-full max-h-[480px] object-contain object-bottom"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-[#1e1e1e] relative overflow-hidden">
                <div className="glow-orb blob-b absolute w-[700px] h-[700px] bg-secondary-container/8 -bottom-60 left-1/2 -translate-x-1/2 rounded-full" />
                <div className="relative z-10 container mx-auto px-6 lg:px-10 max-w-3xl text-center reveal">
                    <p className="font-label text-secondary-container font-bold tracking-[0.2em] mb-4 text-xs uppercase">Start Today</p>
                    <h2 className="text-white font-headline font-bold text-[clamp(2rem,4vw,3.2rem)] tracking-tight mb-5">
                        Ready to Begin Your UK Journey?
                    </h2>
                    <p className="text-white/55 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                        Speak to one of our expert consultants today — completely free of charge, with no obligation.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="/contact"
                            className="bg-secondary-container text-on-secondary px-9 py-4 rounded-full font-headline font-bold text-base hover:scale-105 transition-transform shadow-2xl shadow-secondary-container/20 flex items-center gap-2"
                        >
                            Book Free Consultation
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </a>
                        <a
                            href="tel:02077909233"
                            className="border border-white/20 text-white px-9 py-4 rounded-full font-headline font-bold text-base hover:bg-white/10 transition-colors backdrop-blur-sm flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">call</span>
                            020 7790 9233
                        </a>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
