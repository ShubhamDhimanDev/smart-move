<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCityRequest;
use App\Http\Requests\Admin\UpdateCityRequest;
use App\Models\City;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CityController extends Controller
{
    private function mapCity(City $city): array
    {
        return [
            'id' => $city->id,
            'name' => $city->name,
            'slug' => $city->slug,
            'image' => $city->image,
            'is_featured_home' => $city->is_featured_home,
            'is_featured_nav' => $city->is_featured_nav,
            'sort_order' => $city->sort_order,
            'is_active' => $city->is_active,
            'page_content' => [
                'page_title' => $city->pageContent?->page_title,
                'meta_title' => $city->pageContent?->meta_title,
                'meta_description' => $city->pageContent?->meta_description,
                'og_title' => $city->pageContent?->og_title,
                'og_description' => $city->pageContent?->og_description,
                'og_image' => $city->pageContent?->og_image,
                'featured_image' => $city->pageContent?->featured_image,
            ],
        ];
    }

    public function index(): Response
    {
        return Inertia::render('Admin/Cities/Index', [
            'cities' => City::query()
                ->with(['pageContent:id,contentable_type,contentable_id,page_title,meta_title,meta_description,og_title,og_description,og_image,featured_image'])
                ->ordered()
                ->get()
                ->map(fn (City $city): array => $this->mapCity($city))
                ->values()
                ->all(),
        ]);
    }

    public function edit(City $city): Response
    {
        $city->loadMissing(['pageContent']);

        return Inertia::render('Admin/Cities/Edit', [
            'city' => $this->mapCity($city),
        ]);
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:cities,id'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            City::whereKey($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return back()->with('success', 'Order saved.');
    }

    public function store(StoreCityRequest $request): RedirectResponse
    {
        $city = City::create($request->safe()->except('page_content'));

        $pageContent = $request->input('page_content');
        if (is_array($pageContent) && $pageContent !== []) {
            $city->pageContent()->create($pageContent);
        }

        return to_route('admin.cities.index')->with('success', 'City created successfully.');
    }

    public function update(UpdateCityRequest $request, City $city): RedirectResponse
    {
        $city->update($request->safe()->except('page_content'));

        $pageContent = $request->input('page_content');
        if (is_array($pageContent) && $pageContent !== []) {
            $city->pageContent()->updateOrCreate([], $pageContent);
        }

        return to_route('admin.cities.index')->with('success', 'City updated successfully.');
    }

    public function destroy(City $city): RedirectResponse
    {
        City::query()->whereKey($city->id)->delete();

        return to_route('admin.cities.index')->with('success', 'City deleted successfully.');
    }
}
