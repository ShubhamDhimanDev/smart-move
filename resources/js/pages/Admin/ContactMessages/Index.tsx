import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';
import type { PaginatedResponse } from '@/types/cms';

type ContactMessage = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    created_at: string;
};

type Props = {
    messages: PaginatedResponse<ContactMessage>;
    notificationEmail: string | null;
    filters?: { search: string };
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ContactMessagesIndex({ messages, notificationEmail, filters = { search: '' } }: Props) {
    const settingsForm = useForm({ contact_notification_email: notificationEmail ?? '' });
    const filtersForm = useForm({ search: filters.search ?? '' });

    return (
        <>
            <Head title="Contact Messages" />
            <div className="space-y-5">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Contact Messages</h1>
                    <p className="mt-1 text-sm text-neutral-600">Submissions from the Contact Us form.</p>
                </div>

                {/* Notification email */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-semibold text-neutral-900">Notification Email</h2>
                    <p className="mt-1 text-sm text-neutral-600">New contact messages will be forwarded to this address.</p>
                    <form
                        onSubmit={(e) => { e.preventDefault(); settingsForm.patch('/admin/contact-messages/settings', { preserveScroll: true }); }}
                        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start"
                    >
                        <div className="w-full max-w-xl">
                            <input
                                type="email"
                                value={settingsForm.data.contact_notification_email}
                                onChange={(e) => settingsForm.setData('contact_notification_email', e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                                placeholder="admin@example.com"
                            />
                            {settingsForm.errors.contact_notification_email && (
                                <p className="mt-1 text-xs text-red-600">{settingsForm.errors.contact_notification_email}</p>
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

                {/* Filters */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                    <form
                        onSubmit={(e) => { e.preventDefault(); filtersForm.get('/admin/contact-messages', { preserveState: true }); }}
                        className="flex gap-3"
                    >
                        <input
                            type="text"
                            placeholder="Search name, email or subject"
                            value={filtersForm.data.search}
                            onChange={(e) => filtersForm.setData('search', e.target.value)}
                            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                        />
                        <button type="submit" className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">Filter</button>
                        <button
                            type="button"
                            onClick={() => { filtersForm.setData('search', ''); filtersForm.get('/admin/contact-messages', { preserveState: true }); }}
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
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Contact</th>
                                <th className="px-4 py-3 font-medium">Subject</th>
                                <th className="px-4 py-3 font-medium">Received</th>
                                <th className="px-4 py-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {messages.data.length === 0 && (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-neutral-500">No messages found.</td></tr>
                            )}
                            {messages.data.map((msg) => (
                                <tr key={msg.id}>
                                    <td className="px-4 py-3 align-top font-medium text-neutral-900">{msg.name}</td>
                                    <td className="px-4 py-3 align-top text-neutral-700">
                                        <p>{msg.email}</p>
                                        {msg.phone && <p className="text-xs text-neutral-500">{msg.phone}</p>}
                                    </td>
                                    <td className="px-4 py-3 align-top text-neutral-700">{msg.subject}</td>
                                    <td className="px-4 py-3 align-top text-neutral-700">{formatDate(msg.created_at)}</td>
                                    <td className="px-4 py-3 align-top">
                                        <Link
                                            href={`/admin/contact-messages/${msg.id}`}
                                            className="inline-flex items-center rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
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
                    {messages.links.map((link, i) => (
                        <Link
                            key={`${link.label}-${i}`}
                            href={link.url ?? '#'}
                            preserveScroll
                            className={`rounded-md border px-3 py-1.5 text-sm ${link.active ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            {link.label.replace('&laquo; Previous', 'Previous').replace('Next &raquo;', 'Next')}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

ContactMessagesIndex.layout = withAdminLayout;
