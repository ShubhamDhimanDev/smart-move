import { Link, router, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Newspaper, Tags, Image, MessageSquare, Calendar,
    Users, LogOut, ClipboardList, GraduationCap, MapPin, Building2,
    Handshake, Mail, ChevronDown, Layers, LayoutTemplate,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { logout } from '@/routes';
import admin from '@/routes/admin';

type SharedProps = {
    auth: {
        user?: {
            name?: string;
            email?: string;
            roles?: string[];
            permissions?: string[];
        } | null;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

type NavLeaf = {
    kind: 'item';
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
    permission?: string;
};

type NavGroup = {
    kind: 'group';
    label: string;
    icon: typeof LayoutDashboard;
    permission?: string;
    children: NavLeaf[];
};

type NavEntry = NavLeaf | NavGroup;

const navConfig: NavEntry[] = [
    { kind: 'item', label: 'Dashboard', href: admin.dashboard.url(), icon: LayoutDashboard },
    { kind: 'item', label: 'Home Page Settings', href: admin.homePageSettings.index.url(), icon: LayoutTemplate },
    { kind: 'item', label: 'Events', href: admin.events.index.url(), icon: Calendar, permission: 'manage events' },
    {
        kind: 'group',
        label: 'Forms',
        icon: ClipboardList,
        permission: 'manage applications',
        children: [
            { kind: 'item', label: 'Applications', href: admin.applications.index.url(), icon: ClipboardList, permission: 'manage applications' },
            { kind: 'item', label: 'Agent Enquiries', href: admin.agentEnquiries.index.url(), icon: Handshake, permission: 'manage applications' },
            { kind: 'item', label: 'Contact Messages', href: admin.contactMessages.index.url(), icon: Mail, permission: 'manage applications' },
            { kind: 'item', label: 'Newsletter', href: '/admin/newsletter-subscribers', icon: Mail, permission: 'manage applications' },
        ],
    },
    {
        kind: 'group',
        label: 'Blog',
        icon: Newspaper,
        permission: 'manage posts',
        children: [
            { kind: 'item', label: 'Posts', href: admin.posts.index.url(), icon: Newspaper, permission: 'manage posts' },
            { kind: 'item', label: 'Comments', href: admin.comments.index.url(), icon: MessageSquare, permission: 'manage comments' },
            { kind: 'item', label: 'Categories', href: admin.categories.index.url(), icon: Tags, permission: 'manage categories' },
        ],
    },
    {
        kind: 'group',
        label: 'Courses',
        icon: GraduationCap,
        permission: 'manage courses',
        children: [
            { kind: 'item', label: 'Course Categories', href: admin.courseCategories.index.url(), icon: Tags, permission: 'manage course categories' },
            { kind: 'item', label: 'Course Areas', href: admin.courseTypes.index.url(), icon: Layers, permission: 'manage course types' },
            { kind: 'item', label: 'Course Cities', href: admin.cities.index.url(), icon: MapPin, permission: 'manage course cities' },
            { kind: 'item', label: 'Courses', href: admin.courses.index.url(), icon: GraduationCap, permission: 'manage courses' },
        ],
    },
    { kind: 'item', label: 'University Partners', href: admin.universityPartners.index.url(), icon: Building2, permission: 'manage courses' },
    { kind: 'item', label: 'Media', href: admin.media.index.url(), icon: Image, permission: 'manage media' },
    { kind: 'item', label: 'Users', href: admin.users.index.url(), icon: Users, permission: 'manage users' },
];

export function withAdminLayout({ children }: { children: ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>;
}

function NavGroupItem({
    group,
    currentPath,
    hasAccess,
}: {
    group: NavGroup;
    currentPath: string;
    hasAccess: (permission?: string) => boolean;
}) {
    const visibleChildren = group.children.filter((c) => hasAccess(c.permission));
    if (visibleChildren.length === 0) return null;

    const isAnyChildActive = visibleChildren.some((c) => {
        const p = c.href.replace(/\/$/, '') || '/';
        return currentPath === p || currentPath.startsWith(`${p}/`);
    });

    const [open, setOpen] = useState(isAnyChildActive);

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isAnyChildActive ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
            >
                <span className="flex items-center gap-2">
                    <group.icon className="h-4 w-4 shrink-0" />
                    {group.label}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="mt-0.5 ml-3 space-y-0.5 border-l border-neutral-200 pl-3">
                    {visibleChildren.map((child) => {
                        const itemPath = child.href.replace(/\/$/, '') || '/';
                        const isActive = currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
                        return (
                            <Link
                                key={child.label}
                                href={child.href}
                                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                                    isActive ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                }`}
                            >
                                <child.icon className="h-3.5 w-3.5 shrink-0" />
                                {child.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const page = usePage<SharedProps>();
    const currentPath = page.url.split('?')[0].replace(/\/$/, '') || '/';
    const userRoles = page.props.auth?.user?.roles ?? [];
    const userPermissions = page.props.auth?.user?.permissions ?? [];
    const userName = page.props.auth?.user?.name ?? '';
    const userEmail = page.props.auth?.user?.email ?? '';

    const hasGlobalAdminAccess = userRoles.includes('super-admin');

    const hasAccess = (permission?: string) => {
        if (!permission) return true;
        return hasGlobalAdminAccess || userPermissions.includes(permission);
    };

    const handleLogout = () => {
        router.post(logout().url);
    };

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
            <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-6 lg:px-6">
                <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm lg:flex lg:flex-col">
                    <p className="px-2 text-xs font-semibold tracking-[0.18em] text-neutral-500 uppercase">CMS Admin</p>

                    <nav className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto">
                        {navConfig.map((entry) => {
                            if (entry.kind === 'group') {
                                return (
                                    <NavGroupItem
                                        key={entry.label}
                                        group={entry}
                                        currentPath={currentPath}
                                        hasAccess={hasAccess}
                                    />
                                );
                            }

                            if (!hasAccess(entry.permission)) return null;

                            const itemPath = entry.href.replace(/\/$/, '') || '/';
                            const isDashboard = entry.label === 'Dashboard';
                            const isActive = isDashboard
                                ? currentPath === itemPath
                                : currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);

                            return (
                                <Link
                                    key={entry.label}
                                    href={entry.href}
                                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                                        isActive ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
                                    }`}
                                >
                                    <entry.icon className="h-4 w-4" />
                                    {entry.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-4 border-t border-neutral-100 pt-4">
                        <div className="mb-3 px-2">
                            <p className="text-sm font-medium text-neutral-900 truncate">{userName}</p>
                            <p className="text-xs text-neutral-500 truncate">{userEmail}</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                        >
                            <LogOut className="h-4 w-4" />
                            Log out
                        </button>
                    </div>
                </aside>

                <main className="min-w-0 flex-1">
                    {page.props.flash?.success ? (
                        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            {page.props.flash.success}
                        </div>
                    ) : null}
                    {page.props.flash?.error ? (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {page.props.flash.error}
                        </div>
                    ) : null}
                    {children}
                </main>
            </div>
        </div>
    );
}
