<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsMedia;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MediaUploadController extends Controller
{
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $request->validate([
            'file' => ['nullable', 'file', 'max:10240', 'mimes:jpg,jpeg,png,gif,webp,pdf,svg'],
            'files' => ['nullable', 'array'],
            'files.*' => ['file', 'max:10240', 'mimes:jpg,jpeg,png,gif,webp,pdf,svg'],
        ]);

        $record = CmsMedia::query()->firstOrCreate([
            'key' => 'library',
        ]);

        $uploaded = [];

        $files = $request->file('files') ?? ($request->file('file') ? [$request->file('file')] : []);

        foreach ($files as $file) {
            $extension = $file->getClientOriginalExtension() ?: pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION) ?: $file->extension();
            $filename = (string) Str::uuid().($extension ? '.'.$extension : '');

            $media = $record->addMedia($file)
                ->usingFileName($filename)
                ->toMediaCollection('cms');

            $uploaded[] = [
                'id' => $media->id,
                'file_name' => $media->file_name,
                'url' => $media->getUrl(),
            ];
        }

        if ($request->expectsJson()) {
            if (count($uploaded) === 1) {
                return response()->json($uploaded[0], 201);
            }

            return response()->json($uploaded, 201);
        }

        return back()->with('success', count($uploaded).' file(s) uploaded.');
    }
}
