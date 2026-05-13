import { Head, Link } from '@inertiajs/react';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';
import type { CourseApplication } from '@/types/cms';

type Props = {
    application: CourseApplication;
};

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">{label}</p>
            <p className="mt-2 text-sm text-neutral-900">{value || '-'}</p>
        </div>
    );
}

export default function ApplicationShow({ application }: Props) {
    return (
        <>
            <Head title={`Application #${application.id}`} />

            <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Application Detail</h1>
                        <p className="mt-1 text-sm text-neutral-600">
                            {application.first_name} {application.last_name} • Submitted {formatDate(application.created_at)}
                        </p>
                    </div>

                    <Link
                        href="/admin/applications"
                        className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                    >
                        Back to Applications
                    </Link>
                </div>

                <section className="space-y-4">
                    <h2 className="text-base font-semibold text-neutral-900">Applicant Information</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <DetailItem label="First Name" value={application.first_name} />
                        <DetailItem label="Last Name" value={application.last_name} />
                        <DetailItem label="Date of Birth" value={application.dob} />
                        <DetailItem label="Email" value={application.email} />
                        <DetailItem label="Phone" value={application.phone} />
                        <DetailItem label="Have Taken SFE Before" value={application.has_taken_sfe_before ? 'Yes' : 'No'} />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-base font-semibold text-neutral-900">Course and Eligibility</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <DetailItem label="Preferred Course" value={application.preferred_course} />
                        <DetailItem label="Preferred Location" value={application.preferred_location} />
                        <DetailItem label="Nationality" value={application.nationality} />
                        <DetailItem label="Immigration Status" value={application.immigration_status} />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-base font-semibold text-neutral-900">Background</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                            <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Qualification</p>
                            <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-900">
                                {application.previous_qualification_work_experience.qualification || '-'}
                            </p>
                        </div>

                        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                            <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Work Experience</p>
                            <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-900">
                                {application.previous_qualification_work_experience.work_experience || '-'}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

ApplicationShow.layout = withAdminLayout;
