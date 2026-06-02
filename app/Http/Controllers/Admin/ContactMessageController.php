<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateContactSettingsRequest;
use App\Models\AppSetting;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ContactMessage::query()->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        $messages = $query->paginate(20)->appends($request->except('page'))
            ->through(fn (ContactMessage $msg): array => $this->mapMessage($msg));

        return Inertia::render('Admin/ContactMessages/Index', [
            'messages'          => $messages,
            'notificationEmail' => AppSetting::getValue('contact_notification_email', config('mail.from.address')),
            'filters'           => ['search' => $request->input('search', '')],
        ]);
    }

    public function show(ContactMessage $contactMessage): Response
    {
        return Inertia::render('Admin/ContactMessages/Show', [
            'message' => $this->mapMessage($contactMessage),
        ]);
    }

    public function destroy(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->delete();

        return redirect()->route('admin.contact-messages.index')->with('success', 'Message deleted.');
    }

    public function updateSettings(UpdateContactSettingsRequest $request): RedirectResponse
    {
        AppSetting::setValue('contact_notification_email', $request->validated('contact_notification_email'));

        return back()->with('success', 'Contact notification email updated.');
    }

    private function mapMessage(ContactMessage $msg): array
    {
        return [
            'id'         => $msg->id,
            'name'       => $msg->name,
            'email'      => $msg->email,
            'phone'      => $msg->phone,
            'subject'    => $msg->subject,
            'message'    => $msg->message,
            'created_at' => $msg->created_at?->toISOString(),
        ];
    }
}
