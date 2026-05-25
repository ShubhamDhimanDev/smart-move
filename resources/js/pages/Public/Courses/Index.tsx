import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import SiteLayout from '@/layouts/site-layout';
import * as publicCourseRoutes from '@/routes/courses';
import * as publicApplicationRoutes from '@/routes/applications';
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
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
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
    types: string[];
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
        course_types: TaxonomyLink[];
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

function serializeParams(params: Record<string, string | string[]>): string {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (Array.isArray(v)) {
            v.forEach((item) => sp.append(k, String(item)));
        } else {
            sp.append(k, String(v));
        }
    });
    const s = sp.toString();
    return s ? `?${s}` : '';
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
        types: Array.isArray(filters.applied.types) ? filters.applied.types : [],
    };

    const [showFilters, setShowFilters] = useState(false);
    const [searchInput, setSearchInput] = useState<string>(applied.search ?? '');
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setSearchInput(filters.applied.search ?? '');
    }, [filters.applied.search]);

    // Search is now applied only when the user presses Enter or clicks an explicit control.

    /**
     * Navigate to the correct route based on how many categories/cities are selected.
     *
     * 1 category, 0 cities  → /programmes/{category}
     * 0 categories, 1 city  → /programmes-in-{city}
     * 1 category, 1 city    → /{category}-in-{city}
     * >1 categories OR >1 cities (any combination) → /courses?category=a&category=b&city=x
     */
    function visitWithFilters(next: FilterState): void {
        const { search, categories, cities, types } = next;
        const isMulti = categories.length > 1 || cities.length > 1 || types.length > 1;

        if (isMulti) {
            const query: Record<string, any> = {};
            if (search) query.search = search;
            if (categories.length > 0) query.category = categories;
            if (cities.length > 0) query.city = cities;
            if (types.length > 0) query.course_type = types;
            const url = publicCourseRoutes.index.url({ query });
            const wasFocused = inputRef.current === document.activeElement;
            router.get(url, {}, {
                preserveScroll: true,
                replace: true,
                onFinish: () => {
                    if (wasFocused) inputRef.current?.focus();
                },
            });
            return;
        }

        const params: Record<string, string | string[]> = {};
        if (search) params.search = search;
        if (types.length > 0) params.course_type = types;

        let path = publicCourseRoutes.index.url();
        if (categories.length === 1 && cities.length === 1) {
            path = publicCourseRoutes.categoryCity.url([categories[0], cities[0]]);
        } else if (categories.length === 1) {
            path = publicCourseRoutes.category.url(categories[0]);
        } else if (cities.length === 1) {
            path = publicCourseRoutes.city.url(cities[0]);
        }

        const queryString = serializeParams(params);
        const url = path + queryString;
        const wasFocused = inputRef.current === document.activeElement;
        router.get(url, {}, {
            preserveScroll: true,
            replace: true,
            onFinish: () => {
                if (wasFocused) inputRef.current?.focus();
            },
        });
    }

    function applyFilters(next: Partial<FilterState>): void {
        const searchValue = Object.prototype.hasOwnProperty.call(next, 'search')
            ? next.search
            : applied.search;

        visitWithFilters({
            search: (searchValue as string | null) ?? null,
            categories: Array.isArray(next.categories) ? next.categories : applied.categories,
            cities: Array.isArray(next.cities) ? next.cities : applied.cities,
            types: Array.isArray(next.types) ? next.types : applied.types,
        });
    }

    // search is handled via local state `searchInput` with a debounce; applyFilters is invoked in effect or on Enter

    function clearFilters(): void {
        visitWithFilters({ search: null, categories: [], cities: [], types: [] });
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

    function onTypeToggle(typeSlug: string): void {
        const nextTypes = applied.types.includes(typeSlug)
            ? applied.types.filter((slug) => slug !== typeSlug)
            : [...applied.types, typeSlug];
        applyFilters({ types: nextTypes });
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
                    <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
                        <input
                            ref={inputRef}
                            type="search"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    applyFilters({ search: searchInput.trim() === '' ? null : searchInput });
                                }
                            }}
                            placeholder="Search programmes"
                            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#00b4e0]/70"
                        />
                        <button
                            type="button"
                            onClick={() => applyFilters({ search: searchInput.trim() === '' ? null : searchInput })}
                            className="rounded-xl bg-[#00b4e0] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:opacity-90"
                        >
                            Filter
                        </button>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/75 transition-colors hover:border-white/30 hover:text-white"
                        >
                            Reset filters
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowFilters((v) => !v)}
                            aria-expanded={showFilters}
                            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/75 transition-colors hover:border-white/30 hover:text-white"
                        >
                            {showFilters ? 'Hide filters' : 'More filters'}
                        </button>
                    </div>

                    {showFilters && (
                        <div className="grid gap-6 lg:grid-cols-3">
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

                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#ffd88b]">Course Areas</h2>
                            <div className="flex flex-wrap gap-2">
                                {filters.course_types.map((item) => {
                                    const isSelected = applied.types.includes(item.slug);
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => onTypeToggle(item.slug)}
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                                                isSelected
                                                    ? 'border-[#ffd88b]/50 bg-[#ffd88b]/10 text-[#ffd9b3]'
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
                    )}
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
                                        {course.categories && course.categories.length > 0 ? (
                                            course.categories.map((c) => (
                                                <span key={c.id} className="rounded-full border border-[#00b4e0]/40 bg-[#00b4e0]/10 px-2.5 py-1 text-[#88e5ff]">
                                                    {c.name}
                                                </span>
                                            ))
                                        ) : course.category ? (
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
                                            {course.cities.map((city) => (
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

                <div className="mt-6 text-center">
                    <Link
                        href={publicApplicationRoutes.create.url()}
                        className="inline-flex items-center justify-center rounded-full bg-secondary-container px-6 py-3 text-sm font-semibold text-black hover:opacity-90"
                    >
                        Apply now
                    </Link>
                </div>
            </main>
        </SiteLayout>
    );
}

PublicCoursesIndex.layout = null;
