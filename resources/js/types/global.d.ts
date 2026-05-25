import type { Auth } from '@/types/auth';
import type { CourseCategoryTaxonomy, CityTaxonomy } from '@/types/cms';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            featuredCategories: Pick<CourseCategoryTaxonomy, 'id' | 'name' | 'slug'>[];
            featuredCities: Pick<CityTaxonomy, 'id' | 'name' | 'slug'>[];
            navFeaturedCities: Pick<CityTaxonomy, 'id' | 'name' | 'slug'>[];
            [key: string]: unknown;
        };
    }
}
