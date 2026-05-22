<?php

namespace App\Http\Controllers;

use App\Models\UniversityPartner;
use Inertia\Inertia;
use Inertia\Response;

class PublicUniversityPartnerController extends Controller
{
    public function index(): Response
    {
        $partners = UniversityPartner::query()
            ->where('is_active', true)
            ->get()
            ->map(fn (UniversityPartner $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'image' => $p->image,
                'universities_link' => $p->universities_link,
            ])
            ->values()
            ->all();

        return Inertia::render('Public/UniversityPartners/Index', [
            'partners' => $partners,
            'title' => 'University Partners',
            'description' => 'We work closely with leading universities and higher education institutions to provide students with globally recognised qualifications, flexible study pathways, and opportunities to achieve their academic and career goals.',
        ]);
    }
}
