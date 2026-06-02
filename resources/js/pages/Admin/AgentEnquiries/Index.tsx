import { Head, Link, useForm } from '@inertiajs/react';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';
import type { PaginatedResponse } from '@/types/cms';

type AgentEnquiry = {
    id: number;
    name: string;
    company_name: string | null;
    email: string;
    mobile: string;
    message: string;
    created_at: string;
};

type Filters = {
    search: string;
};

type Props = {
    enquiries: PaginatedResponse<AgentEnquiry>;
    notificationEmail: string | null;
    filters?: Filters;
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

export default function AgentEnquiriesIndex({ enquiries, notificationEmail, filters = { search: '' } }: Props) {
    const settingsForm = useForm({ agent_enquiry_notification_email: notificationEmail ?? '' });
    const filtersForm = useForm<Filters>({ search: filters.search ?? '' });

    const applyFilters = (event?: React.FormEvent) => {
        event?.preventDefault();
        filtersForm.get('/admin/agent-enquiries', { preserveState: true });
    };

    const clearFilters = () => {
        filtersForm.setData('search', '');
        filtersForm.get('/admin/agent-enquiries', { preserveState: true });
    };

    return (
        <>
            <Head title="Agent Enquiries" />
            <div className="space-y-5">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Agent Enquiries</h1>
                    <p className="mt-1 text-sm text-neutral-600">Partner / Become an Agent form submissions.</p>
                </div>

                {/* Notification email */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-semibold text-neutral-900">Notification Email</h2>
                    <p className="mt-1 text-sm text-neutral-600">New agent enquiries will be forwarded to this address.</p>
                    <form
                        onSubmit={(e) => { e.preventDefault(); settingsForm.patch('/admin/agent-enquiries/settings', { preserveScroll: true }); }}
                        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start"
                    >
                        <div className="w-full max-w-xl">
                            <input
                                type="email"
                                value={settingsForm.data.agent_enquiry_notification_email}
                                onChange={(e) => settingsForm.setData('agent_enquiry_notification_email', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                                placeholder="admin@example.com"
                            />
                            {settingsForm.errors.agent_enquiry_notification_email && (
                                <p className="mt-1 text-xs text-red-600">{settingsForm.errors.agent_enquiry_notification_email}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={settingsForm.processing}
                            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
                        >
                            {settingsForm.processing ? 'Saving…' : 'Save'}
                        </button>
                    </form>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                    <form onSubmit={applyFilters} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <input
                            type="text"
                            placeholder="Search name, email, company or mobile"
                            value={filtersForm.data.search}
                            onChange={(e) => filtersForm.setData('search', e.target.value)}
                            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                            >
                                Filter
                            </button>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                            >
                                Clear
                            </button>
                        </div>
                    </form>
                </div>

                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <table className="w-full divide-y divide-neutral-200 text-sm">
                        <thead className="bg-neutral-50">
                            <tr className="text-left text-neutral-600">
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Contact</th>
                                <th className="px-4 py-3 font-medium">Company</th>
                                <th className="px-4 py-3 font-medium">Submitted</th>
                                <th className="px-4 py-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {enquiries.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">No enquiries found.</td>
                                </tr>
                            )}
                            {enquiries.data.map((enquiry) => (
                                <tr key={enquiry.id}>
                                    <td className="px-4 py-3 align-top">
                                        <p className="font-medium text-neutral-900">{enquiry.name}</p>
                                    </td>
                                    <td className="px-4 py-3 align-top text-neutral-700">
                                        <p>{enquiry.email}</p>
                                        <p className="text-xs text-neutral-500">{enquiry.mobile}</p>
                                    </td>
                                    <td className="px-4 py-3 align-top text-neutral-700">
                                        {enquiry.company_name ?? <span className="text-neutral-400">—</span>}
                                    </td>
                                    <td className="px-4 py-3 align-top text-neutral-700">
                                        {formatDate(enquiry.created_at)}
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <Link
                                            href={`/admin/agent-enquiries/${enquiry.id}`}
                                            className="inline-flex items-center rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap gap-2">
                    {enquiries.links.map((link, index) => (
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

AgentEnquiriesIndex.layout = withAdminLayout;
