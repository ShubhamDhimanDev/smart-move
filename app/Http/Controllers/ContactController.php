<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Models\AppSetting;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(StoreContactMessageRequest $request): RedirectResponse
    {
        ContactMessage::query()->create($request->validated());

        $recipient = AppSetting::getValue('contact_notification_email', config('mail.from.address'));

        if (filled($recipient)) {
            $data = $request->validated();
            Mail::html(
                "<h2>New Contact Message</h2>
                <ul>
                <li><strong>Name:</strong> {$data['name']}</li>
                <li><strong>Email:</strong> {$data['email']}</li>
                <li><strong>Phone:</strong> ".($data['phone'] ?? '-')."</li>
                <li><strong>Subject:</strong> {$data['subject']}</li>
                <li><strong>Message:</strong> {$data['message']}</li>
                </ul>",
                fn ($msg) => $msg->to($recipient)->subject("New Contact Message: {$data['subject']} from {$data['name']}")
            );
        }

        return back()->with('success', 'Your message has been sent. We will get back to you within one business day.');
    }
}
