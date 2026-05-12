import { Head, Link, useForm } from '@inertiajs/react';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';
import type { CourseApplication, PaginatedResponse } from '@/types/cms';

type Props = {
    applications: PaginatedResponse<CourseApplication>;
    notificationEmail: string | null;
};

type SettingsForm = {
    application_notification_email: string;
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

export default function ApplicationsIndex({ applications, notificationEmail }: Props) {
    const settingsForm = useForm<SettingsForm>({
        application_notification_email: notificationEmail ?? '',
    });

    const submitSettings = (event: React.FormEvent) => {
        event.preventDefault();

        settingsForm.patch('/admin/applications/settings', {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Applications" />

            <div className="space-y-5">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
                    <p className="mt-1 text-sm text-neutral-600">Manage submitted Apply Now forms and update the notification email.</p>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-semibold text-neutral-900">Notification Email</h2>
                    <p className="mt-1 text-sm text-neutral-600">New applications will be sent to this email address.</p>

                    <form onSubmit={submitSettings} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
                        <div className="w-full max-w-xl">
                            <input
                                type="email"
                                value={settingsForm.data.application_notification_email}
                                onChange={(event) => settingsForm.setData('application_notification_email', event.target.value)}
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                                placeholder="admin@example.com"
                            />
                            {settingsForm.errors.application_notification_email && (
                                <p className="mt-1 text-xs text-red-600">{settingsForm.errors.application_notification_email}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={settingsForm.processing}
                            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {settingsForm.processing ? 'Saving...' : 'Save'}
                        </button>
                    </form>
                </div>

                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <table className="w-full divide-y divide-neutral-200 text-sm">
                        <thead className="bg-neutral-50">
                            <tr className="text-left text-neutral-600">
                                <th className="px-4 py-3 font-medium">Applicant</th>
                                <th className="px-4 py-3 font-medium">Contact</th>
                                <th className="px-4 py-3 font-medium">Course &amp; Status</th>
                                <th className="px-4 py-3 font-medium">SFE</th>
                                <th className="px-4 py-3 font-medium">Submitted</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {applications.data.map((application) => (
                                <tr key={application.id}>
                                    <td className="px-4 py-3 align-top">
                                        <p className="font-medium text-neutral-900">{application.first_name} {application.last_name}</p>
                                        <p className="text-xs text-neutral-500">DOB: {application.dob}</p>
                                        <p className="mt-1 text-xs text-neutral-600">
                                            {application.previous_qualification_work_experience}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 align-top text-neutral-700">
                                        <p>{application.email}</p>
                                        <p className="text-xs text-neutral-500">{application.phone}</p>
                                    </td>
                                    <td className="px-4 py-3 align-top text-neutral-700">
                                        <p>{application.preferred_course_location}</p>
                                        <p className="mt-1 text-xs text-neutral-500">{application.nationality_immigration_status}</p>
                                    </td>
                                    <td className="px-4 py-3 align-top text-neutral-700">
                                        {application.has_taken_sfe_before ? 'Yes' : 'No'}
                                    </td>
                                    <td className="px-4 py-3 align-top text-neutral-700">
                                        {formatDate(application.created_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap gap-2">
                    {applications.links.map((link, index) => (
                        <Link
                            key={`${link.label}-${index}`}
                            href={link.url ?? '#'}
                            preserveScroll
                            className={`rounded-md border px-3 py-1.5 text-sm ${
                                link.active
                                    ? 'border-neutral-900 bg-neutral-900 text-white'
                                    : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                            } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            {link.label.replace('&laquo; Previous', 'Previous').replace('Next &raquo;', 'Next')}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

ApplicationsIndex.layout = withAdminLayout;
