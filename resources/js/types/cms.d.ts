export type PageBuilderBlock =
        | {
                    id: string;
                    type: 'heading';
                    level: 1 | 2 | 3;
                    content: string;
            }
        | {
                    id: string;
                    type: 'text';
                    content: string;
            }
        | {
                    id: string;
                    type: 'image';
                    url: string;
                    content?: string;
            }
        | {
                    id: string;
                    type: 'button';
                    text: string;
                    url: string;
            };

export interface Page {
    id: number;
    title: string;
    slug: string;
    content: string;
        builder_data?: PageBuilderBlock[] | null;
    meta_title: string | null;
    meta_description: string | null;
    status: 'draft' | 'published';
    published_at: string | null;
    featured_image_url: string | null;
    created_at: string;
}

export type PostBlock =
    | { id: string; type: 'heading'; level: 1 | 2 | 3; content: string }
    | { id: string; type: 'paragraph'; content: string }
    | { id: string; type: 'image'; url: string; alt: string }
    | { id: string; type: 'list'; listType: 'ul' | 'ol'; items: string[] }
    | { id: string; type: 'quote'; content: string }
    | { id: string; type: 'divider' };

export interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    keywords: string | null;
    content: PostBlock[];
    status: 'draft' | 'published';
    published_at: string | null;
    featured_image_url: string | null;
    categories: Category[];
    author: { id: number; name: string };
    created_at: string;
    comments_enabled: boolean;
    comments_require_approval: boolean;
    comments_count?: number;
    pending_comments_count?: number;
    comments?: PostComment[];
}

export interface PostComment {
    id: number;
    parent_id: number | null;
    name: string;
    website: string | null;
    body: string;
    created_at: string;
    replies: PostComment[];
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

export interface MediaItem {
    id: number;
    name: string;
    file_name: string;
    url: string;
    mime_type: string;
    size: number;
    human_readable_size: string;
    created_at: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export interface Event {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image: string | null;
    type: 'online' | 'in_person';
    starts_at: string;
    ends_at: string | null;
    registration_ends_at: string | null;
    timezone: string;
    location: string;
    location_url: string | null;
    status: 'draft' | 'published' | 'cancelled';
    max_registrants: number | null;
    confirmed_registrants_count?: number;
    created_at: string;
}

export interface EventRegistrant {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    status: 'pending' | 'confirmed' | 'cancelled';
    notes: string | null;
    created_at: string;
}

export interface CourseApplication {
    id: number;
    first_name: string;
    last_name: string;
    dob: string;
    phone: string;
    email: string;
    nationality: string;
    immigration_status: string;
    preferred_course: string;
    preferred_location: string;
    has_taken_sfe_before: boolean;
    previous_qualification_work_experience: {
        qualification: string;
        work_experience: string;
    };
    created_at: string;
}

export interface PageContent {
    page_title: string | null;
    description: string | null;
    body: string | null;
    featured_image: string | null;
    meta_title: string | null;
    meta_description: string | null;
    og_title: string | null;
    og_description: string | null;
    og_image: string | null;
    schema_data: Record<string, unknown> | null;
    custom_data: Record<string, unknown> | null;
}

export interface CourseCategoryTaxonomy {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_featured: boolean;
    sort_order: number;
    is_active: boolean;
}

export interface CityTaxonomy {
    id: number;
    name: string;
    slug: string;
    country_id: number | null;
    country_name?: string | null;
    is_featured: boolean;
    sort_order: number;
    is_active: boolean;
}

export interface UniversityTaxonomy {
    id: number;
    name: string;
    slug: string;
    city_id: number | null;
    city_name?: string | null;
    country_id: number | null;
    country_name?: string | null;
    website: string | null;
    is_featured: boolean;
    is_active: boolean;
}

export interface CourseEntity {
    id: number;
    title: string;
    slug: string;
    course_category_id: number | null;
    category_name?: string | null;
    excerpt: string | null;
    status: 'draft' | 'published';
    is_featured: boolean;
    duration: number | null;
    duration_unit: string | null;
    level: string | null;
    delivery_mode: string | null;
    start_date: string | null;
    sort_order: number;
    city_ids: number[];
    city_names?: string[];
    university_ids: number[];
    university_names?: string[];
    page_content?: PageContent;
}

export interface AgentEnquiry {
    id: number;
    name: string;
    company_name: string | null;
    email: string;
    mobile: string;
    message: string;
    created_at: string;
}
