import {
    queryParams,
    type RouteDefinition,
    type RouteQueryOptions,
} from '@/wayfinder';

type PageArgs =
    | { page: number | { id: number } }
    | [page: number | { id: number }]
    | number
    | { id: number };

const resolvePageId = (args: PageArgs): number => {
    if (typeof args === 'number') {
        return args;
    }

    if (Array.isArray(args)) {
        const [page] = args;

        return typeof page === 'number' ? page : page.id;
    }

    return 'page' in args ? (typeof args.page === 'number' ? args.page : args.page.id) : args.id;
};

export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.url = (options?: RouteQueryOptions): string => `/admin/pages${queryParams(options)}`;

export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.url = (options?: RouteQueryOptions): string => `/admin/pages${queryParams(options)}`;

export const update = (args: PageArgs, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.url = (args: PageArgs, options?: RouteQueryOptions): string => {
    const page = resolvePageId(args);

    return `/admin/pages/${page}${queryParams(options)}`;
};

export const destroy = (args: PageArgs, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.url = (args: PageArgs, options?: RouteQueryOptions): string => {
    const page = resolvePageId(args);

    return `/admin/pages/${page}${queryParams(options)}`;
};

export const builderCreate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: builderCreate.url(options),
    method: 'post',
});

builderCreate.url = (options?: RouteQueryOptions): string => `/admin/pages/builder-create${queryParams(options)}`;

export const builder = (args: PageArgs, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: builder.url(args, options),
    method: 'get',
});

builder.url = (args: PageArgs, options?: RouteQueryOptions): string => {
    const page = resolvePageId(args);

    return `/admin/pages/${page}/builder${queryParams(options)}`;
};

export const builderLoad = (args: PageArgs, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: builderLoad.url(args, options),
    method: 'get',
});

builderLoad.url = (args: PageArgs, options?: RouteQueryOptions): string => {
    const page = resolvePageId(args);

    return `/admin/pages/${page}/builder-load${queryParams(options)}`;
};

export const builderSave = (args: PageArgs, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: builderSave.url(args, options),
    method: 'post',
});

builderSave.url = (args: PageArgs, options?: RouteQueryOptions): string => {
    const page = resolvePageId(args);

    return `/admin/pages/${page}/builder-save${queryParams(options)}`;
};

const adminPageRoutes = {
    index,
    store,
    update,
    destroy,
    builderCreate,
    builder,
    builderLoad,
    builderSave,
};

export default adminPageRoutes;
