import { Head, Link, useForm } from '@inertiajs/react';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';

type ContactMessage = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    created_at: string;
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ContactMessageShow({ message }: { message: ContactMessage }) {
    const deleteForm = useForm({});

    const handleDelete = () => {
        if (!confirm('Delete this message? This cannot be undone.')) return;
        deleteForm.delete(`/admin/contact-messages/${message.id}`);
    };

    return (
        <>
            <Head title={`Message — ${message.name}`} />
            <div className="space-y-5 max-w-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/admin/contact-messages" className="text-sm text-neutral-500 hover:text-neutral-900">← Back to messages</Link>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{message.name}</h1>
                        <p className="mt-1 text-sm text-neutral-500">Received {formatDate(message.created_at)}</p>
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
                        { label: 'Name', value: message.name },
                        { label: 'Email', value: message.email },
                        { label: 'Phone', value: message.phone ?? '—' },
                        { label: 'Subject', value: message.subject },
                    ].map((row) => (
                        <div key={row.label} className="flex flex-col sm:flex-row sm:gap-6">
                            <dt className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wider text-neutral-500">{row.label}</dt>
                            <dd className="mt-1 sm:mt-0 text-sm text-neutral-900">{row.value}</dd>
                        </div>
                    ))}
                    <div className="flex flex-col sm:flex-row sm:gap-6 pt-4 border-t border-neutral-100">
                        <dt className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wider text-neutral-500">Message</dt>
                        <dd className="mt-1 sm:mt-0 text-sm text-neutral-900 whitespace-pre-wrap">{message.message}</dd>
                    </div>
                </div>
            </div>
        </>
    );
}

ContactMessageShow.layout = withAdminLayout;
