import { Head, useForm, usePage, router } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';

type FlashProps = {
    flash?: {
        success?: string;
    };
};

type ApplyNowForm = {
    first_name: string;
    last_name: string;
    dob: string;
    phone: string;
    email: string;
    nationality_immigration_status: string;
    preferred_course_location: string;
    has_taken_sfe_before: 'yes' | 'no';
    previous_qualification_work_experience: string;
};

export default function ApplyNow() {
    const { flash } = usePage<FlashProps>().props;
    const form = useForm<ApplyNowForm>({
        first_name: '',
        last_name: '',
        dob: '',
        phone: '',
        email: '',
        nationality_immigration_status: '',
        preferred_course_location: '',
        has_taken_sfe_before: 'no',
        previous_qualification_work_experience: '',
    });

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        router.post('/apply-now', {
            ...form.data,
            has_taken_sfe_before: form.data.has_taken_sfe_before === 'yes',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
            },
        });
    };

    return (
        <SiteLayout title="Apply Now | Smart Move Education Group" activePage="contact">
            <Head title="Apply Now | Smart Move Education Group" />

            <section className="relative overflow-hidden pt-24 pb-16">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="glow-orb blob-a absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full bg-[#00b4e0]/10" />
                    <div className="glow-orb blob-b absolute right-0 top-20 h-[420px] w-[420px] rounded-full bg-[#efa500]/8" />
                </div>

                <div className="relative z-10 container mx-auto max-w-4xl px-6 lg:px-10">
                    <div className="mb-8 text-center reveal">
                        <span className="mb-4 inline-block rounded-full bg-secondary-container/15 px-3 py-1 text-[11px] font-label font-bold tracking-widest text-secondary-container uppercase">
                            Application Form
                        </span>
                        <h1 className="text-4xl font-headline font-bold leading-tight text-white lg:text-5xl">
                            Apply <span className="text-gradient-gold">Now</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-base font-body text-[#a09a97]">
                            Fill in your details and our admissions team will contact you with your next steps.
                        </p>
                    </div>

                    <div className="glass-card reveal rounded-2xl border border-white/[0.08] p-6 shadow-2xl sm:p-8">
                        {flash?.success && (
                            <div className="mb-6 rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                                {flash.success}
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-white/70">First Name *</label>
                                <input
                                    type="text"
                                    value={form.data.first_name}
                                    onChange={(e) => form.setData('first_name', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-secondary-container focus:outline-none"
                                />
                                {form.errors.first_name && <p className="mt-1 text-xs text-red-300">{form.errors.first_name}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-white/70">Last Name *</label>
                                <input
                                    type="text"
                                    value={form.data.last_name}
                                    onChange={(e) => form.setData('last_name', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-secondary-container focus:outline-none"
                                />
                                {form.errors.last_name && <p className="mt-1 text-xs text-red-300">{form.errors.last_name}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-white/70">DOB *</label>
                                <input
                                    type="date"
                                    value={form.data.dob}
                                    onChange={(e) => form.setData('dob', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-secondary-container focus:outline-none"
                                />
                                {form.errors.dob && <p className="mt-1 text-xs text-red-300">{form.errors.dob}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-white/70">Phone *</label>
                                <input
                                    type="text"
                                    value={form.data.phone}
                                    onChange={(e) => form.setData('phone', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-secondary-container focus:outline-none"
                                />
                                {form.errors.phone && <p className="mt-1 text-xs text-red-300">{form.errors.phone}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-sm font-medium text-white/70">Email *</label>
                                <input
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-secondary-container focus:outline-none"
                                />
                                {form.errors.email && <p className="mt-1 text-xs text-red-300">{form.errors.email}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-sm font-medium text-white/70">Nationality &amp; Immigration Status *</label>
                                <input
                                    type="text"
                                    value={form.data.nationality_immigration_status}
                                    onChange={(e) => form.setData('nationality_immigration_status', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-secondary-container focus:outline-none"
                                />
                                {form.errors.nationality_immigration_status && (
                                    <p className="mt-1 text-xs text-red-300">{form.errors.nationality_immigration_status}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-sm font-medium text-white/70">Preferred Course &amp; Location *</label>
                                <input
                                    type="text"
                                    value={form.data.preferred_course_location}
                                    onChange={(e) => form.setData('preferred_course_location', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-secondary-container focus:outline-none"
                                />
                                {form.errors.preferred_course_location && (
                                    <p className="mt-1 text-xs text-red-300">{form.errors.preferred_course_location}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-white/70">Have you taken any SFE before? *</label>
                                <div className="flex items-center gap-6">
                                    <label className="inline-flex items-center gap-2 text-sm text-white/80">
                                        <input
                                            type="radio"
                                            name="has_taken_sfe_before"
                                            value="yes"
                                            checked={form.data.has_taken_sfe_before === 'yes'}
                                            onChange={() => form.setData('has_taken_sfe_before', 'yes')}
                                        />
                                        Yes
                                    </label>
                                    <label className="inline-flex items-center gap-2 text-sm text-white/80">
                                        <input
                                            type="radio"
                                            name="has_taken_sfe_before"
                                            value="no"
                                            checked={form.data.has_taken_sfe_before === 'no'}
                                            onChange={() => form.setData('has_taken_sfe_before', 'no')}
                                        />
                                        No
                                    </label>
                                </div>
                                {form.errors.has_taken_sfe_before && <p className="mt-1 text-xs text-red-300">{form.errors.has_taken_sfe_before}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-sm font-medium text-white/70">Previous Qualification / Work Experience *</label>
                                <textarea
                                    rows={4}
                                    value={form.data.previous_qualification_work_experience}
                                    onChange={(e) => form.setData('previous_qualification_work_experience', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-secondary-container focus:outline-none"
                                />
                                {form.errors.previous_qualification_work_experience && (
                                    <p className="mt-1 text-xs text-red-300">{form.errors.previous_qualification_work_experience}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex w-full items-center justify-center rounded-full bg-secondary-container px-6 py-3 text-sm font-headline font-bold text-on-secondary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {form.processing ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}

ApplyNow.layout = null;
