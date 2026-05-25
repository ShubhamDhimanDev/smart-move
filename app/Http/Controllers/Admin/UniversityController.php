<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\ImageUrlHelpers;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUniversityRequest;
use App\Http\Requests\Admin\UpdateUniversityRequest;
use App\Models\City;
use App\Models\Country;
use App\Models\University;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UniversityController extends Controller
{
    use ImageUrlHelpers;
    public function index(): Response
    {
        return Inertia::render('Admin/Universities/Index', [
            'universities' => University::query()
                ->with([
                    'city:id,name',
                    'country:id,name',
                    'pageContent:id,contentable_type,contentable_id,page_title,meta_title',
                ])
                ->orderBy('name')
                ->get()
                ->map(fn (University $university): array => [
                    'id' => $university->id,
                    'name' => $university->name,
                    'slug' => $university->slug,
                    'city_id' => $university->city_id,
                    'city_name' => $university->city?->name,
                    'country_id' => $university->country_id,
                    'country_name' => $university->country?->name,
                    'website' => $university->website,
                    'is_featured' => $university->is_featured,
                    'is_active' => $university->is_active,
                    'page_content' => [
                        'page_title' => $university->pageContent?->page_title,
                        'meta_title' => $university->pageContent?->meta_title,
                    ],
                ])
                ->values()
                ->all(),
            'cities' => City::query()->select(['id', 'name'])->get(),
            'countries' => Country::query()->select(['id', 'name'])->get(),
        ]);
    }

    public function store(StoreUniversityRequest $request): RedirectResponse
    {
        $payload = $request->safe()->except('page_content');
        $university = University::create($payload);

        $pageContent = $request->input('page_content');
        if (is_array($pageContent) && $pageContent !== []) {
            $pageContent = $this->sanitizeImageFieldsInArray($pageContent, ['featured_image', 'og_image']);
            $university->pageContent()->create($pageContent);
        }

        return to_route('admin.universities.index')->with('success', 'University created successfully.');
    }

    public function update(UpdateUniversityRequest $request, University $university): RedirectResponse
    {
        $payload = $request->safe()->except('page_content');
        $university->update($payload);

        $pageContent = $request->input('page_content');
        if (is_array($pageContent) && $pageContent !== []) {
            $pageContent = $this->sanitizeImageFieldsInArray($pageContent, ['featured_image', 'og_image']);
            $university->pageContent()->updateOrCreate([], $pageContent);
        }

        return to_route('admin.universities.index')->with('success', 'University updated successfully.');
    }

    public function destroy(University $university): RedirectResponse
    {
        University::query()->whereKey($university->id)->delete();

        return to_route('admin.universities.index')->with('success', 'University deleted successfully.');
    }
}
