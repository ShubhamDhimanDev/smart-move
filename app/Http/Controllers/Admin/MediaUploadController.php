<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsMedia;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MediaUploadController extends Controller
{
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:10240', 'mimes:jpg,jpeg,png,gif,webp,pdf,svg'],
        ]);

        $record = CmsMedia::query()->firstOrCreate([
            'key' => 'library',
        ]);

        $media = $record
            ->addMediaFromRequest('file')
            ->toMediaCollection('cms');

        if ($request->expectsJson()) {
            return response()->json([
                'id' => $media->id,
                'file_name' => $media->file_name,
                'url' => $media->getUrl(),
            ], 201);
        }

        return back()->with('success', 'File uploaded.');
    }
}
