import SiteLayout from '@/layouts/site-layout';
import { useForm } from '@inertiajs/react';

type AgentEnquiryForm = {
    name: string;
    company_name: string;
    email: string;
    mobile: string;
    message: string;
};

export default function BecomeAnAgent() {
    const { data, setData, post, processing, errors, wasSuccessful, reset } = useForm<AgentEnquiryForm>({
        name: '',
        company_name: '',
        email: '',
        mobile: '',
        message: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/become-an-agent');
    }

    return (
        <SiteLayout title="Become an Agent | Smart Move Education Group" activePage="become-an-agent">
            {/* Hero */}
            <section className="relative overflow-hidden pt-24 pb-16">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="glow-orb blob-a absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#00b4e0]/10" />
                    <div className="glow-orb blob-b absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-[#efa500]/8" />
                </div>
                <div className="relative z-10 container mx-auto px-6 lg:px-10 max-w-7xl text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-label font-bold tracking-widest uppercase bg-secondary-container/15 text-secondary-container mb-6">
                        Partner With Us
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-headline font-bold text-white leading-tight mb-5">
                        Become an <span className="text-gradient-gold">Agent</span>
                    </h1>
                    <p className="text-[#a09a97] font-body text-lg max-w-2xl mx-auto">
                        Join our growing network of education agents and help students achieve their UK study goals. Fill in the form below and our partnerships
                        team will be in touch.
                    </p>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-12">
                <div className="container mx-auto px-6 lg:px-10 max-w-7xl">
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: 'handshake',
                                title: 'Trusted Partnership',
                                body: 'Work alongside an established education group with 10+ years of experience placing students at top UK universities.',
                            },
                            {
                                icon: 'payments',
                                title: 'Competitive Commission',
                                body: 'Earn attractive commissions on every successful student enrolment with transparent and timely payments.',
                            },
                            {
                                icon: 'support_agent',
                                title: 'Dedicated Support',
                                body: 'Access marketing materials, training, and a dedicated point of contact to help you grow your business.',
                            },
                        ].map((item) => (
                            <div key={item.title} className="glass-card rounded-xl p-7 reveal flex flex-col gap-3">
                                <div className="w-10 h-10 rounded-lg bg-secondary-container/15 flex items-center justify-center mb-1">
                                    <span className="material-symbols-outlined text-secondary-container text-xl">{item.icon}</span>
                                </div>
                                <h3 className="text-white font-headline font-bold text-base">{item.title}</h3>
                                <p className="text-[#a09a97] text-sm">{item.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form */}
            <section className="py-16">
                <div className="container mx-auto px-6 lg:px-10 max-w-3xl">
                    <div className="reveal">
                        <h2 className="text-2xl lg:text-3xl font-headline font-bold text-white mb-2">Partner Enquiry Form</h2>
                        <p className="text-[#a09a97] text-sm font-body mb-8">Submit your details and our partnerships team will reach out within 2 business days.</p>

                        {wasSuccessful ? (
                            <div className="glass-card rounded-xl p-10 flex flex-col items-center text-center gap-4">
                                <span
                                    className="material-symbols-outlined text-secondary-container text-5xl"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                    check_circle
                                </span>
                                <h3 className="text-white font-headline font-bold text-xl">Enquiry Submitted!</h3>
                                <p className="text-[#a09a97] text-sm">Thank you for your interest. Our partnerships team will be in touch within 2 business days.</p>
                                <button
                                    type="button"
                                    onClick={() => reset()}
                                    className="mt-2 text-secondary-container text-sm font-semibold hover:underline"
                                >
                                    Submit another enquiry
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-label font-bold text-white/50 uppercase tracking-widest mb-2" htmlFor="name">
                                            Full Name <span className="text-secondary-container">*</span>
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Jane Smith"
                                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-secondary-container/50 transition-colors"
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-label font-bold text-white/50 uppercase tracking-widest mb-2" htmlFor="company_name">
                                            Company Name
                                        </label>
                                        <input
                                            id="company_name"
                                            name="company_name"
                                            type="text"
                                            value={data.company_name}
                                            onChange={(e) => setData('company_name', e.target.value)}
                                            placeholder="Acme Education Ltd."
                                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-secondary-container/50 transition-colors"
                                        />
                                        {errors.company_name && <p className="mt-1 text-xs text-red-400">{errors.company_name}</p>}
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-label font-bold text-white/50 uppercase tracking-widest mb-2" htmlFor="email">
                                            Email <span className="text-secondary-container">*</span>
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="jane@example.com"
                                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-secondary-container/50 transition-colors"
                                        />
                                        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-label font-bold text-white/50 uppercase tracking-widest mb-2" htmlFor="mobile">
                                            Mobile <span className="text-secondary-container">*</span>
                                        </label>
                                        <input
                                            id="mobile"
                                            name="mobile"
                                            type="tel"
                                            required
                                            value={data.mobile}
                                            onChange={(e) => setData('mobile', e.target.value)}
                                            placeholder="+44 ..."
                                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-secondary-container/50 transition-colors"
                                        />
                                        {errors.mobile && <p className="mt-1 text-xs text-red-400">{errors.mobile}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-label font-bold text-white/50 uppercase tracking-widest mb-2" htmlFor="message">
                                        Message <span className="text-secondary-container">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={5}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Tell us about yourself, your market, and how you'd like to partner with us..."
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-secondary-container/50 transition-colors resize-none"
                                    />
                                    {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 rounded-full bg-secondary-container text-on-secondary font-headline font-bold text-sm hover:opacity-90 transition-opacity shadow-[0_0_24px_rgba(239,165,0,0.25)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Submitting...' : 'Submit Enquiry'}
                                    <span className="material-symbols-outlined text-base">send</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
