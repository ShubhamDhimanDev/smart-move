import { Link, router, usePage } from '@inertiajs/react';
import { LayoutDashboard, Newspaper, Tags, Image, MessageSquare, Calendar, Users, Shield, LogOut, ClipboardList, GraduationCap, MapPin, Building2 } from 'lucide-react';
import type { ReactNode } from 'react';
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

type NavItem = {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
    permission?: string;
    role?: string;
};

const navItems: NavItem[] = [
    { label: 'Dashboard', href: admin.dashboard.url(), icon: LayoutDashboard },
    // { label: 'Pages', href: admin.pages.index.url(), icon: FileText },
    { label: 'Posts', href: admin.posts.index.url(), icon: Newspaper, permission: 'manage posts' },
    { label: 'Events', href: admin.events.index.url(), icon: Calendar, permission: 'manage events' },
    { label: 'Applications', href: '/admin/applications', icon: ClipboardList, permission: 'manage applications' },
    { label: 'Categories', href: admin.categories.index.url(), icon: Tags, permission: 'manage categories' },
    { label: 'Course Categories', href: '/admin/course-categories', icon: Tags, permission: 'manage course categories' },
    { label: 'Cities', href: '/admin/cities', icon: MapPin, permission: 'manage course cities' },
    // { label: 'Universities', href: '/admin/universities', icon: Building2, permission: 'manage courses' },
    { label: 'Courses', href: '/admin/courses', icon: GraduationCap, permission: 'manage courses' },
    { label: 'Media', href: admin.media.index.url(), icon: Image, permission: 'manage media' },
    { label: 'Comments', href: admin.comments.index.url(), icon: MessageSquare, permission: 'manage comments' },
    { label: 'Users', href: admin.users.index.url(), icon: Users, permission: 'manage users' },
    { label: 'Permissions', href: admin.permissions.index.url(), icon: Shield, permission: 'manage permissions' },
];

export function withAdminLayout({ children }: { children: ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const page = usePage<SharedProps>();
    const currentPath = page.url.split('?')[0].replace(/\/$/, '') || '/';
    const userRoles = page.props.auth?.user?.roles ?? [];
    const userPermissions = page.props.auth?.user?.permissions ?? [];
    const userName = page.props.auth?.user?.name ?? '';
    const userEmail = page.props.auth?.user?.email ?? '';


    const hasGlobalAdminAccess = userRoles.includes('super-admin');

    const handleLogout = () => {
        router.post(logout().url);
    };

    const visibleNavItems = navItems.filter((item) => {
        if (item.role && !userRoles.includes(item.role)) {
            return false;
        }

        if (item.permission && !hasGlobalAdminAccess && !userPermissions.includes(item.permission)) {
            return false;
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
            <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-6 lg:px-6">
                <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm lg:flex lg:flex-col">
                    <p className="px-2 text-xs font-semibold tracking-[0.18em] text-neutral-500 uppercase">
                        CMS Admin
                    </p>

                    <nav className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto">
                        {visibleNavItems.map((item) => {
                            const itemPath = item.href.replace(/\/$/, '') || '/';
                            const isDashboard = item.label === 'Dashboard';
                            const isActive = isDashboard
                                ? currentPath === itemPath
                                : currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                                        isActive
                                            ? 'bg-neutral-900 text-white'
                                            : 'text-neutral-700 hover:bg-neutral-100'
                                    }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
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
