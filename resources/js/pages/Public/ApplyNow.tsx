import { Head, useForm, usePage } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';
import * as applicationRoutes from '@/routes/applications';

type ApplyNowForm = {
    first_name: string;
    last_name: string;
    dob: string;
    phone: string;
    email: string;
    nationality: string;
    immigration_status: string;
    immigration_status_other: string;
    preferred_course: string;
    selected_courses: number[];
    other_course: string;
    preferred_location: string;
    selected_locations: string[];
    has_taken_sfe_before: 'yes' | 'no';
    qualifications_summary: string;
    work_experience_summary: string;
};

type Country = {
    id: number;
    name: string;
    nationality: string | null;
};

type PageProps = {
    flash?: {
        success?: string;
    };
    countries: Country[];
    featuredCourseCategories: {
        id: number;
        name: string;
        label?: string | null;
        course_types: { id: number; name: string; slug?: string | null }[];
    }[];
    featuredCities: { id: number; name: string; slug?: string | null }[];
};

export default function ApplyNow() {
    // Course groups and featured cities are provided by the server
    const { flash, countries, featuredCourseCategories, featuredCities } = usePage<PageProps>().props;
    const form = useForm<ApplyNowForm>({
        first_name: '',
        last_name: '',
        dob: '',
        phone: '',
        email: '',
        nationality: '',
        immigration_status: '',
        immigration_status_other: '',
        preferred_course: '',
        selected_courses: [],
        other_course: '',
        preferred_location: '',
        selected_locations: [],
        has_taken_sfe_before: 'no',
        qualifications_summary: '',
        work_experience_summary: '',
    });
    const qualificationError = (form.errors as Record<string, string | undefined>)['previous_qualification_work_experience.qualification'];
    const workExperienceError = (form.errors as Record<string, string | undefined>)['previous_qualification_work_experience.work_experience'];

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // build a map of course type id -> name from server props
        const courseTypeMap = featuredCourseCategories.reduce<Record<number, string>>((acc, cat) => {
            cat.course_types.forEach((t) => { acc[t.id] = t.name; });
            return acc;
        }, {});

        form.transform((data) => ({
            ...data,
            // if user provided a custom immigration status, prefer that value
            immigration_status: data.immigration_status === 'Others' && data.immigration_status_other.trim().length > 0
                ? data.immigration_status_other.trim()
                : data.immigration_status,
            preferred_course: data.selected_courses.map((id) => courseTypeMap[id] ?? String(id)).join(', '),
            preferred_location: data.selected_locations.join(', '),
            has_taken_sfe_before: data.has_taken_sfe_before === 'yes',
            previous_qualification_work_experience: {
                qualification: data.qualifications_summary,
                work_experience: data.work_experience_summary,
            },
        }));

        form.post(applicationRoutes.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
            },
        });
    };

    const toggleCourseSelection = (courseId: number) => {
        form.setData('selected_courses',
            form.data.selected_courses.includes(courseId)
                ? form.data.selected_courses.filter((selectedCourse) => selectedCourse !== courseId)
                : [...form.data.selected_courses, courseId],
        );
    };

    const toggleLocationSelection = (location: string) => {
        form.setData('selected_locations',
            form.data.selected_locations.includes(location)
                ? form.data.selected_locations.filter((selectedLocation) => selectedLocation !== location)
                : [...form.data.selected_locations, location],
        );
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
                            Start <span className="text-gradient-gold">your application</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-base font-body text-[#a09a97]">
                            All our services are free! We offer free consultation and guidance before and during studies. Fill in the form below and we will be in touch.
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
                                {/* <label className="mb-2 block text-sm font-medium text-white/70">Nationality &amp; Immigration Status *</label> */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-white/70">Nationality *</label>
                                        <select
                                            value={form.data.nationality}
                                            onChange={(e) => form.setData('nationality', e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-secondary-container focus:outline-none"
                                        >
                                            <option value="" className="bg-slate-900">Select nationality</option>
                                            {countries.map((country) => (
                                                <option
                                                    key={country.id}
                                                    value={country.nationality ?? country.name}
                                                    className="bg-slate-900"
                                                >
                                                    {country.nationality ?? country.name}
                                                </option>
                                            ))}
                                        </select>
                                        {form.errors.nationality && <p className="mt-1 text-xs text-red-300">{form.errors.nationality}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-white/70">Immigration Status *</label>
                                        <select
                                            value={form.data.immigration_status}
                                            onChange={(e) => form.setData('immigration_status', e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-secondary-container focus:outline-none"
                                        >
                                            <option value="" className="bg-slate-900">Select immigration status</option>
                                            <option value="British citizen" className="bg-slate-900">British citizen</option>
                                            <option value="Pre settlement" className="bg-slate-900">Pre settlement</option>
                                            <option value="Refugees" className="bg-slate-900">Refugees</option>
                                            <option value="Others" className="bg-slate-900">Others</option>
                                        </select>
                                        {form.errors.immigration_status && <p className="mt-1 text-xs text-red-300">{form.errors.immigration_status}</p>}
                                        {form.data.immigration_status === 'Others' && (
                                            <div className="mt-3">
                                                <label className="mb-1.5 block text-sm font-medium text-white/70">Please specify immigration status *</label>
                                                <input
                                                    type="text"
                                                    value={form.data.immigration_status_other}
                                                    onChange={(e) => form.setData('immigration_status_other', e.target.value)}
                                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-secondary-container focus:outline-none"
                                                />
                                                {form.errors.immigration_status_other && <p className="mt-1 text-xs text-red-300">{form.errors.immigration_status_other}</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="rounded-lg border border-white/10 bg-white/5 p-4 md:col-span-2">
                                        <label className="mb-2 block text-sm font-medium text-white/70">Preferred Course(s) * (You can select multiple)</label>
                                        <div className="space-y-3">
                                            {featuredCourseCategories.map((category) => (
                                                <div key={category.id}>
                                                    <p className="mb-1 text-xs font-semibold tracking-wide text-white/60 uppercase">{category.label?.trim() ? category.label : category.name}</p>
                                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                        {category.course_types.map((type) => (
                                                            <label key={type.id} className="inline-flex items-start gap-2 text-sm text-white/85">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={form.data.selected_courses.includes(type.id)}
                                                                    onChange={() => toggleCourseSelection(type.id)}
                                                                    className="mt-0.5"
                                                                />
                                                                <span>{type.name}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {(() => {
                                            const isOtherTypeSelected = form.data.selected_courses.some((id) =>
                                                featuredCourseCategories.some((cat) =>
                                                    cat.course_types.some((t) => t.id === id && String((t.slug ?? t.name)).toLowerCase().includes('other')),
                                                ),
                                            );

                                            return isOtherTypeSelected ? (
                                                <div className="mt-3">
                                                    <label className="mb-1.5 block text-xs font-medium text-white/60">Other course (please specify)</label>
                                                    <input
                                                        type="text"
                                                        value={form.data.other_course}
                                                        onChange={(event) => form.setData('other_course', event.target.value)}
                                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-secondary-container focus:outline-none"
                                                    />
                                                    {form.errors.other_course && <p className="mt-1 text-xs text-red-300">{form.errors.other_course}</p>}
                                                </div>
                                            ) : null;
                                        })()}

                                        {form.errors.selected_courses && <p className="mt-1 text-xs text-red-300">{form.errors.selected_courses}</p>}
                                        {form.errors.preferred_course && <p className="mt-1 text-xs text-red-300">{form.errors.preferred_course}</p>}
                                    </div>

                                    <div className="rounded-lg border border-white/10 bg-white/5 p-4 md:col-span-2">
                                        <label className="mb-2 block text-sm font-medium text-white/70">Preferred Location(s) * (You can select multiple)</label>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            {featuredCities.map((city) => (
                                                <label key={city.id} className="inline-flex items-start gap-2 text-sm text-white/85">
                                                    <input
                                                        type="checkbox"
                                                        checked={form.data.selected_locations.includes(city.name)}
                                                        onChange={() => toggleLocationSelection(city.name)}
                                                        className="mt-0.5"
                                                    />
                                                    <span>{city.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {form.errors.selected_locations && <p className="mt-1 text-xs text-red-300">{form.errors.selected_locations}</p>}
                                        {form.errors.preferred_location && <p className="mt-1 text-xs text-red-300">{form.errors.preferred_location}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-white/70">Previous Qualification &amp; Work Experience *</label>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-white/60">Qualification *</label>
                                        <textarea
                                            rows={4}
                                            value={form.data.qualifications_summary}
                                            onChange={(e) => form.setData('qualifications_summary', e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-secondary-container focus:outline-none"
                                        />
                                        {qualificationError && (
                                            <p className="mt-1 text-xs text-red-300">{qualificationError}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-white/60">Work Experience *</label>
                                        <textarea
                                            rows={4}
                                            value={form.data.work_experience_summary}
                                            onChange={(e) => form.setData('work_experience_summary', e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-secondary-container focus:outline-none"
                                        />
                                        {workExperienceError && (
                                            <p className="mt-1 text-xs text-red-300">{workExperienceError}</p>
                                        )}
                                    </div>
                                </div>
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
