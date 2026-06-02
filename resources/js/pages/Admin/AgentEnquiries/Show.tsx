import { Head, Link, useForm } from '@inertiajs/react';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';

type AgentEnquiry = {
    id: number;
    name: string;
    company_name: string | null;
    email: string;
    mobile: string;
    message: string;
    created_at: string;
};

type Props = {
    enquiry: AgentEnquiry;
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

export default function AgentEnquiryShow({ enquiry }: Props) {
    const deleteForm = useForm({});

    const handleDelete = () => {
        if (!confirm('Delete this enquiry? This cannot be undone.')) return;
        deleteForm.delete(`/admin/agent-enquiries/${enquiry.id}`);
    };

    return (
        <>
            <Head title={`Enquiry — ${enquiry.name}`} />
            <div className="space-y-5 max-w-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/admin/agent-enquiries" className="text-sm text-neutral-500 hover:text-neutral-900">← Back to enquiries</Link>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{enquiry.name}</h1>
                        <p className="mt-1 text-sm text-neutral-500">Submitted {formatDate(enquiry.created_at)}</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteForm.processing}
                        className="inline-flex items-center rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                        Delete
                    </button>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
                    {[
                        { label: 'Full Name', value: enquiry.name },
                        { label: 'Company', value: enquiry.company_name ?? '—' },
                        { label: 'Email', value: enquiry.email },
                        { label: 'Mobile', value: enquiry.mobile },
                    ].map((row) => (
                        <div key={row.label} className="flex flex-col sm:flex-row sm:gap-6">
                            <dt className="w-32 shrink-0 text-xs font-semibold uppercase tracking-wider text-neutral-500">{row.label}</dt>
                            <dd className="mt-1 sm:mt-0 text-sm text-neutral-900">{row.value}</dd>
                        </div>
                    ))}
                    <div className="flex flex-col sm:flex-row sm:gap-6">
                        <dt className="w-32 shrink-0 text-xs font-semibold uppercase tracking-wider text-neutral-500">Message</dt>
                        <dd className="mt-1 sm:mt-0 text-sm text-neutral-900 whitespace-pre-wrap">{enquiry.message}</dd>
                    </div>
                </div>
            </div>
        </>
    );
}

AgentEnquiryShow.layout = withAdminLayout;
