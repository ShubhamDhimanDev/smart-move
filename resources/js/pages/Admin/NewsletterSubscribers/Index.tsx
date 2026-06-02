import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';
import type { PaginatedResponse } from '@/types/cms';

type Subscriber = {
    id: number;
    email: string;
    created_at: string;
};

type Props = {
    subscribers: PaginatedResponse<Subscriber>;
    filters?: { search: string };
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function NewsletterSubscribersIndex({ subscribers, filters = { search: '' } }: Props) {
    const filtersForm = useForm({ search: filters.search ?? '' });

    function handleDelete(id: number) {
        if (!window.confirm('Remove this subscriber?')) return;
        router.delete(`/admin/newsletter-subscribers/${id}`);
    }

    return (
        <>
            <Head title="Newsletter Subscribers" />
            <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Newsletter Subscribers</h1>
                        <p className="mt-1 text-sm text-neutral-600">Manage email newsletter subscriptions.</p>
                    </div>
                    <a
                        href="/admin/newsletter-subscribers/export"
                        className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                        Export CSV
                    </a>
                </div>

                {/* Filters */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                    <form
                        onSubmit={(e) => { e.preventDefault(); filtersForm.get('/admin/newsletter-subscribers', { preserveState: true }); }}
                        className="flex gap-3"
                    >
                        <input
                            type="text"
                            placeholder="Search by email"
                            value={filtersForm.data.search}
                            onChange={(e) => filtersForm.setData('search', e.target.value)}
                            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                        />
                        <button type="submit" className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">Filter</button>
                        <button
                            type="button"
                            onClick={() => { filtersForm.setData('search', ''); filtersForm.get('/admin/newsletter-subscribers', { preserveState: true }); }}
                            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                        >
                            Clear
                        </button>
                    </form>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <table className="w-full divide-y divide-neutral-200 text-sm">
                        <thead className="bg-neutral-50">
                            <tr className="text-left text-neutral-600">
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Subscribed</th>
                                <th className="px-4 py-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {subscribers.data.length === 0 && (
                                <tr><td colSpan={3} className="px-4 py-8 text-center text-neutral-500">No subscribers yet.</td></tr>
                            )}
                            {subscribers.data.map((sub) => (
                                <tr key={sub.id}>
                                    <td className="px-4 py-3 align-top font-medium text-neutral-900">{sub.email}</td>
                                    <td className="px-4 py-3 align-top text-neutral-700">{formatDate(sub.created_at)}</td>
                                    <td className="px-4 py-3 align-top">
                                        <button
                                            onClick={() => handleDelete(sub.id)}
                                            className="inline-flex items-center rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap gap-2">
                    {subscribers.links.map((link, i) => (
                        <a
                            key={`${link.label}-${i}`}
                            href={link.url ?? '#'}
                            className={`rounded-md border px-3 py-1.5 text-sm ${link.active ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            {link.label.replace('&laquo; Previous', 'Previous').replace('Next &raquo;', 'Next')}
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
}

NewsletterSubscribersIndex.layout = withAdminLayout;
