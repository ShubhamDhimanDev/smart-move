import { Head, Link, router } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';
import type { PaginatedResponse } from '@/types/cms';

interface CourseListItem {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    duration: number | null;
    duration_unit: string | null;
    level: string | null;
    delivery_mode: string | null;
    start_date: string | null;
    category: {
        id: number;
        name: string;
        slug: string;
    } | null;
    cities: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    page_content: {
        featured_image: string | null;
    };
}

interface FilterState {
    search: string | null;
    categories: string[];
    cities: string[];
}

interface TaxonomyLink {
    id: number;
    name: string;
    slug: string;
    url: string;
}

interface Props {
    title: string;
    description: string;
    courses: PaginatedResponse<CourseListItem>;
    context: {
        category: { id: number; name: string; slug: string } | null;
        city: { id: number; name: string; slug: string } | null;
    };
    filters: {
        applied: FilterState;
        categories: TaxonomyLink[];
        cities: TaxonomyLink[];
    };
    breadcrumbs: Array<{ label: string; url: string | null }>;
    seo: {
        title: string;
        description: string;
        canonical: string;
        og_title: string | null;
        og_description: string | null;
        og_image: string | null;
    };
}

function formatStartDate(startDate: string | null): string {
    if (!startDate) {
        return 'Flexible start';
    }

    return new Date(startDate).toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function cleanLabel(value: string): string {
    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function PublicCoursesIndex({
    title,
    description,
    courses,
    context,
    filters,
    breadcrumbs,
    seo,
}: Props) {
    const applied = {
        search: filters.applied.search ?? null,
        categories: Array.isArray(filters.applied.categories) ? filters.applied.categories : [],
        cities: Array.isArray(filters.applied.cities) ? filters.applied.cities : [],
    };

    /**
     * Navigate to the correct route based on how many categories/cities are selected.
     *
     * 1 category, 0 cities  → /programmes/{category}
     * 0 categories, 1 city  → /programmes-in-{city}
     * 1 category, 1 city    → /{category}-in-{city}
     * >1 categories OR >1 cities (any combination) → /courses?category=a&category=b&city=x
     */
    function visitWithFilters(next: FilterState): void {
        const { search, categories, cities } = next;
        const isMulti = categories.length > 1 || cities.length > 1;

        if (isMulti) {
            const parts: string[] = [];
            if (search) parts.push(`search=${encodeURIComponent(search)}`);
            // Use bracket notation so PHP parses repeated keys as an array
            for (const slug of categories) parts.push(`category[]=${encodeURIComponent(slug)}`);
            for (const slug of cities) parts.push(`city[]=${encodeURIComponent(slug)}`);
            const qs = parts.length > 0 ? `?${parts.join('&')}` : '';
            router.get(`/courses${qs}`, {}, { preserveScroll: true, replace: true });
            return;
        }

        const params: Record<string, string> = {};
        if (search) params.search = search;

        let path = '/courses';
        if (categories.length === 1 && cities.length === 1) {
            path = `/${categories[0]}-in-${cities[0]}`;
        } else if (categories.length === 1) {
            path = `/programmes/${categories[0]}`;
        } else if (cities.length === 1) {
            path = `/programmes-in-${cities[0]}`;
        }

        router.get(path, params, { preserveScroll: true, replace: true });
    }

    function applyFilters(next: Partial<FilterState>): void {
        visitWithFilters({
            search: typeof next.search === 'string' ? next.search : applied.search,
            categories: Array.isArray(next.categories) ? next.categories : applied.categories,
            cities: Array.isArray(next.cities) ? next.cities : applied.cities,
        });
    }

    function onFilterChange(key: keyof FilterState, value: string): void {
        if (key === 'search') {
            applyFilters({ search: value.trim() === '' ? null : value });
        }
    }

    function clearFilters(): void {
        visitWithFilters({ search: null, categories: [], cities: [] });
    }

    function onCategoryToggle(categorySlug: string): void {
        const nextCategories = applied.categories.includes(categorySlug)
            ? applied.categories.filter((slug) => slug !== categorySlug)
            : [...applied.categories, categorySlug];
        applyFilters({ categories: nextCategories });
    }

    function onCityToggle(citySlug: string): void {
        const nextCities = applied.cities.includes(citySlug)
            ? applied.cities.filter((slug) => slug !== citySlug)
            : [...applied.cities, citySlug];
        applyFilters({ cities: nextCities });
    }

    return (
        <SiteLayout title={`${title} | Smart Move Education Group`} activePage="courses">
            <Head>
                <meta name="description" content={seo.description} />
                <link rel="canonical" href={seo.canonical} />
                <meta property="og:title" content={seo.og_title ?? seo.title} />
                <meta property="og:description" content={seo.og_description ?? seo.description} />
                {seo.og_image ? <meta property="og:image" content={seo.og_image} /> : null}
            </Head>

            <main className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-white/40">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                            {crumb.url ? (
                                <Link href={crumb.url} className="transition-colors hover:text-white/80">
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-white/70">{crumb.label}</span>
                            )}
                            {index < breadcrumbs.length - 1 ? <span>/</span> : null}
                        </div>
                    ))}
                </nav>

                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
                    <p className="mt-3 max-w-3xl text-sm text-white/55 sm:text-base">{description}</p>
                </header>

                <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                        <input
                            type="search"
                            value={applied.search ?? ''}
                            onChange={(event) => onFilterChange('search', event.target.value)}
                            placeholder="Search programmes"
                            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#00b4e0]/70"
                        />
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/75 transition-colors hover:border-white/30 hover:text-white"
                        >
                            Reset filters
                        </button>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#88e5ff]">Programmes</h2>
                            <div className="flex flex-wrap gap-2">
                                {filters.categories.map((item) => {
                                    const isSelected = applied.categories.includes(item.slug);
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => onCategoryToggle(item.slug)}
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                                                isSelected
                                                    ? 'border-[#00b4e0]/50 bg-[#00b4e0]/10 text-[#88e5ff]'
                                                    : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                                            }`}
                                        >
                                            {item.name}
                                            {isSelected && (
                                                <span aria-hidden="true" className="text-[10px] leading-none opacity-60">&times;</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#d3d7ff]">Study Destinations</h2>
                            <div className="flex flex-wrap gap-2">
                                {filters.cities.map((item) => {
                                    const isSelected = applied.cities.includes(item.slug);
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => onCityToggle(item.slug)}
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                                                isSelected
                                                    ? 'border-[#bcc2ff]/50 bg-[#bcc2ff]/10 text-[#d3d7ff]'
                                                    : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                                            }`}
                                        >
                                            {item.name}
                                            {isSelected && (
                                                <span aria-hidden="true" className="text-[10px] leading-none opacity-60">&times;</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {courses.data.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-white/55">
                        No courses found with the selected filters.
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {courses.data.map((course) => (
                            <article key={course.id} className="glass-card flex h-full flex-col overflow-hidden rounded-2xl border border-white/10">
                                {course.page_content.featured_image ? (
                                    <img
                                        src={course.page_content.featured_image}
                                        alt={course.title}
                                        className="h-44 w-full object-cover"
                                    />
                                ) : null}

                                <div className="flex h-full flex-col p-5">
                                    <div className="mb-3 flex flex-wrap gap-2 text-[11px]">
                                        {course.category ? (
                                            <span className="rounded-full border border-[#00b4e0]/40 bg-[#00b4e0]/10 px-2.5 py-1 text-[#88e5ff]">
                                                {course.category.name}
                                            </span>
                                        ) : null}
                                        {course.level ? (
                                            <span className="rounded-full border border-white/20 bg-white/8 px-2.5 py-1 text-white/70">
                                                {cleanLabel(course.level)}
                                            </span>
                                        ) : null}
                                    </div>

                                    <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                                   {/*  <p className="mt-2 line-clamp-3 text-sm text-white/55">
                                        {course.excerpt ?? 'Explore details about this programme and its available study paths.'}
                                    </p> */}

                                 {/*    <div className="mt-4 space-y-2 text-xs text-white/45">
                                        <p>
                                            <span className="font-semibold text-white/70">Duration:</span>{' '}
                                            {course.duration && course.duration_unit
                                                ? `${course.duration} ${cleanLabel(course.duration_unit)}`
                                                : 'Flexible'}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-white/70">Delivery:</span>{' '}
                                            {course.delivery_mode ? cleanLabel(course.delivery_mode) : 'Flexible'}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-white/70">Start:</span> {formatStartDate(course.start_date)}
                                        </p>
                                    </div> */}

                                    {course.cities.length > 0 ? (
                                        <div className="mt-4 flex flex-wrap gap-1.5">
                                            {course.cities.slice(0, 3).map((city) => (
                                                <span
                                                    key={city.id}
                                                    className="rounded-full border border-white/15 bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-white/55"
                                                >
                                                    {city.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <div className="mt-10 flex flex-wrap gap-2">
                    {courses.links.map((link, index) => (
                        <Link
                            key={`${link.label}-${index}`}
                            href={link.url ?? '#'}
                            preserveScroll
                            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                                link.active
                                    ? 'border-[#00b4e0] bg-[#00b4e0]/10 text-[#00b4e0]'
                                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white'
                            } ${!link.url ? 'pointer-events-none opacity-30' : ''}`}
                        >
                            {link.label.replace('&laquo; Previous', 'Previous').replace('Next &raquo;', 'Next')}
                        </Link>
                    ))}
                </div>
            </main>
        </SiteLayout>
    );
}

PublicCoursesIndex.layout = null;
