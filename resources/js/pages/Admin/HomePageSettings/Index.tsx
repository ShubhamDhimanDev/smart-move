import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';
import admin from '@/routes/admin';

type Settings = {
    announcement_bar_enabled: boolean;
    announcement_bar_text: string;
    announcement_bar_link_text: string;
    announcement_bar_link_url: string;
    hero_badge_text: string;
    hero_badge_link: string;
    hero_heading_line1: string;
    hero_heading_line2: string;
    hero_heading_line3: string;
    hero_subheading: string;
};

type Props = {
    settings: Settings;
};

export default function HomePageSettingsIndex({ settings }: Props) {
    const form = useForm<Settings>({
        announcement_bar_enabled: settings.announcement_bar_enabled,
        announcement_bar_text: settings.announcement_bar_text,
        announcement_bar_link_text: settings.announcement_bar_link_text,
        announcement_bar_link_url: settings.announcement_bar_link_url,
        hero_badge_text: settings.hero_badge_text,
        hero_badge_link: settings.hero_badge_link,
        hero_heading_line1: settings.hero_heading_line1,
        hero_heading_line2: settings.hero_heading_line2,
        hero_heading_line3: settings.hero_heading_line3,
        hero_subheading: settings.hero_subheading,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch(admin.homePageSettings.update.url(), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Home Page Settings" />

            <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-900">Home Page Settings</h1>
                        <p className="mt-1 text-sm text-neutral-500">Manage the announcement bar and hero section content on the public home page.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Announcement Bar */}
                        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <h2 className="text-base font-semibold text-neutral-900 mb-4">Announcement Bar</h2>
                            <p className="text-sm text-neutral-500 mb-5">The full-width banner displayed at the very top of every page.</p>

                            <div className="space-y-4">
                                {/* Toggle */}
                                <label className="flex items-center justify-between gap-4 cursor-pointer">
                                    <div>
                                        <span className="text-sm font-medium text-neutral-700">Show announcement bar</span>
                                        <p className="text-xs text-neutral-400 mt-0.5">When disabled, the bar is hidden on all pages.</p>
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={form.data.announcement_bar_enabled}
                                        onClick={() => form.setData('announcement_bar_enabled', !form.data.announcement_bar_enabled)}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                                            form.data.announcement_bar_enabled ? 'bg-amber-500' : 'bg-neutral-200'
                                        }`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                form.data.announcement_bar_enabled ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </label>

                                {/* Bar Text */}
                                <div>
                                    <label htmlFor="announcement_bar_text" className="block text-sm font-medium text-neutral-700 mb-1">
                                        Bar text
                                    </label>
                                    <input
                                        id="announcement_bar_text"
                                        type="text"
                                        value={form.data.announcement_bar_text}
                                        onChange={(e) => form.setData('announcement_bar_text', e.target.value)}
                                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        placeholder="e.g. June 2026 Intake is Now Open !"
                                    />
                                    {form.errors.announcement_bar_text && (
                                        <p className="mt-1 text-xs text-red-500">{form.errors.announcement_bar_text}</p>
                                    )}
                                </div>

                                {/* Link Text */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="announcement_bar_link_text" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Link text <span className="text-neutral-400 font-normal">(optional)</span>
                                        </label>
                                        <input
                                            id="announcement_bar_link_text"
                                            type="text"
                                            value={form.data.announcement_bar_link_text}
                                            onChange={(e) => form.setData('announcement_bar_link_text', e.target.value)}
                                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            placeholder="e.g. Apply by 31st March"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="announcement_bar_link_url" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Link URL <span className="text-neutral-400 font-normal">(optional)</span>
                                        </label>
                                        <input
                                            id="announcement_bar_link_url"
                                            type="text"
                                            value={form.data.announcement_bar_link_url}
                                            onChange={(e) => form.setData('announcement_bar_link_url', e.target.value)}
                                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            placeholder="e.g. /apply-now or https://..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hero Section */}
                        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <h2 className="text-base font-semibold text-neutral-900 mb-4">Hero Section</h2>
                            <p className="text-sm text-neutral-500 mb-5">The full-screen banner at the top of the home page.</p>

                            <div className="space-y-4">
                                {/* Badge */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="hero_badge_text" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Badge text
                                        </label>
                                        <input
                                            id="hero_badge_text"
                                            type="text"
                                            value={form.data.hero_badge_text}
                                            onChange={(e) => form.setData('hero_badge_text', e.target.value)}
                                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            placeholder="e.g. June 2026 Intake Open"
                                        />
                                        {form.errors.hero_badge_text && (
                                            <p className="mt-1 text-xs text-red-500">{form.errors.hero_badge_text}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="hero_badge_link" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Badge link URL <span className="text-neutral-400 font-normal">(optional)</span>
                                        </label>
                                        <input
                                            id="hero_badge_link"
                                            type="text"
                                            value={form.data.hero_badge_link}
                                            onChange={(e) => form.setData('hero_badge_link', e.target.value)}
                                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            placeholder="e.g. /apply-now"
                                        />
                                    </div>
                                </div>

                                {/* Heading lines */}
                                <div>
                                    <p className="block text-sm font-medium text-neutral-700 mb-2">Heading (3 lines)</p>
                                    <p className="text-xs text-neutral-400 mb-3">The middle line renders in the gold gradient colour.</p>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={form.data.hero_heading_line1}
                                            onChange={(e) => form.setData('hero_heading_line1', e.target.value)}
                                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            placeholder="Line 1 (white)"
                                        />
                                        {form.errors.hero_heading_line1 && (
                                            <p className="text-xs text-red-500">{form.errors.hero_heading_line1}</p>
                                        )}
                                        <input
                                            type="text"
                                            value={form.data.hero_heading_line2}
                                            onChange={(e) => form.setData('hero_heading_line2', e.target.value)}
                                            className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-amber-50"
                                            placeholder="Line 2 (gold gradient)"
                                        />
                                        {form.errors.hero_heading_line2 && (
                                            <p className="text-xs text-red-500">{form.errors.hero_heading_line2}</p>
                                        )}
                                        <input
                                            type="text"
                                            value={form.data.hero_heading_line3}
                                            onChange={(e) => form.setData('hero_heading_line3', e.target.value)}
                                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            placeholder="Line 3 (white)"
                                        />
                                        {form.errors.hero_heading_line3 && (
                                            <p className="text-xs text-red-500">{form.errors.hero_heading_line3}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Subheading */}
                                <div>
                                    <label htmlFor="hero_subheading" className="block text-sm font-medium text-neutral-700 mb-1">
                                        Subheading
                                    </label>
                                    <textarea
                                        id="hero_subheading"
                                        rows={3}
                                        value={form.data.hero_subheading}
                                        onChange={(e) => form.setData('hero_subheading', e.target.value)}
                                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                                        placeholder="Short paragraph below the heading"
                                    />
                                    {form.errors.hero_subheading && (
                                        <p className="mt-1 text-xs text-red-500">{form.errors.hero_subheading}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-60 transition-colors"
                            >
                                {form.processing ? 'Saving…' : 'Save settings'}
                            </button>
                            {form.recentlySuccessful && (
                                <span className="text-sm text-green-600 font-medium">Saved!</span>
                            )}
                        </div>
                    </form>
            </div>
        </>
    );
}

HomePageSettingsIndex.layout = withAdminLayout;
