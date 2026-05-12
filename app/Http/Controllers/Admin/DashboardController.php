<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourseApplication;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        return Inertia::render('Admin/Dashboard/Index', [
            'totalApplications' => CourseApplication::query()->count(),
            'totalPosts' => Post::query()->count(),
            'totalMedia' => Media::query()->count(),
        ]);
    }
}
