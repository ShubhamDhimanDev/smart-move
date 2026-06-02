<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class NewsletterSubscriberController extends Controller
{
    public function index(Request $request): Response
    {
        $query = NewsletterSubscriber::query()->latest();

        if ($search = $request->input('search')) {
            $query->where('email', 'like', "%{$search}%");
        }

        $subscribers = $query->paginate(30)->appends($request->except('page'))
            ->through(fn (NewsletterSubscriber $sub): array => [
                'id'         => $sub->id,
                'email'      => $sub->email,
                'created_at' => $sub->created_at?->toISOString(),
            ]);

        return Inertia::render('Admin/NewsletterSubscribers/Index', [
            'subscribers' => $subscribers,
            'filters'     => ['search' => $request->input('search', '')],
        ]);
    }

    public function destroy(NewsletterSubscriber $newsletterSubscriber): RedirectResponse
    {
        $newsletterSubscriber->delete();

        return back()->with('success', 'Subscriber removed.');
    }

    public function export(): StreamedResponse
    {
        $headers = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="newsletter-subscribers.csv"',
        ];

        return response()->stream(function () {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Email', 'Subscribed At']);

            NewsletterSubscriber::query()->orderBy('id')->chunk(500, function ($rows) use ($handle) {
                foreach ($rows as $row) {
                    fputcsv($handle, [$row->email, $row->created_at?->toDateTimeString()]);
                }
            });

            fclose($handle);
        }, 200, $headers);
    }
}
