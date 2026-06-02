<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAgentEnquiryRequest;
use App\Mail\AgentEnquirySubmitted;
use App\Models\AgentEnquiry;
use App\Models\AppSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class AgentEnquiryController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Public/BecomeAnAgent');
    }

    public function store(StoreAgentEnquiryRequest $request): RedirectResponse
    {
        $enquiry = AgentEnquiry::query()->create($request->validated());

        $recipient = AppSetting::getValue('agent_enquiry_notification_email', config('mail.from.address'));

        if (filled($recipient)) {
            Mail::to($recipient)->send(new AgentEnquirySubmitted($enquiry));
        }

        return back()->with('success', 'Your enquiry has been submitted. We will be in touch shortly.');
    }
}
