<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\ImageUrlHelpers;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUniversityPartnerRequest;
use App\Http\Requests\Admin\UpdateUniversityPartnerRequest;
use App\Models\UniversityPartner;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UniversityPartnerController extends Controller
{
    use ImageUrlHelpers;
    private function mapPartner(UniversityPartner $partner): array
    {
        return [
            'id' => $partner->id,
            'name' => $partner->name,
            'universities_link' => $partner->universities_link,
            'image' => $partner->image,
            'is_active' => $partner->is_active,
        ];
    }

    public function index(): Response
    {
        return Inertia::render('Admin/UniversityPartners/Index', [
            'partners' => UniversityPartner::query()
                ->get()
                ->map(fn (UniversityPartner $p): array => $this->mapPartner($p))
                ->values()
                ->all(),
        ]);
    }

    public function store(StoreUniversityPartnerRequest $request): RedirectResponse
    {
        $data = $request->safe()->all();
        $data = $this->sanitizeImageFieldsInArray($data, ['image']);

        UniversityPartner::create($data);

        return to_route('admin.university-partners.index')->with('success', 'Partner created successfully.');
    }

    public function update(UpdateUniversityPartnerRequest $request, UniversityPartner $university_partner): RedirectResponse
    {
        $data = $request->safe()->all();
        $data = $this->sanitizeImageFieldsInArray($data, ['image']);

        $university_partner->update($data);

        return to_route('admin.university-partners.index')->with('success', 'Partner updated successfully.');
    }

    public function destroy(UniversityPartner $university_partner): RedirectResponse
    {
        UniversityPartner::query()->whereKey($university_partner->id)->delete();

        return to_route('admin.university-partners.index')->with('success', 'Partner deleted successfully.');
    }
}
