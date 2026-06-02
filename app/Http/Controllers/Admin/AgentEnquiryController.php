<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAgentEnquirySettingsRequest;
use App\Models\AgentEnquiry;
use App\Models\AppSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AgentEnquiryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = AgentEnquiry::query()->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('mobile', 'like', "%{$search}%");
            });
        }

        $enquiries = $query->paginate(20)->appends($request->except('page'))
            ->through(fn (AgentEnquiry $enquiry): array => $this->mapEnquiry($enquiry));

        return Inertia::render('Admin/AgentEnquiries/Index', [
            'enquiries'         => $enquiries,
            'notificationEmail' => AppSetting::getValue('agent_enquiry_notification_email', config('mail.from.address')),
            'filters'           => ['search' => $request->input('search', '')],
        ]);
    }

    public function show(AgentEnquiry $agentEnquiry): Response
    {
        return Inertia::render('Admin/AgentEnquiries/Show', [
            'enquiry' => $this->mapEnquiry($agentEnquiry),
        ]);
    }

    public function destroy(AgentEnquiry $agentEnquiry): RedirectResponse
    {
        $agentEnquiry->delete();

        return redirect()->route('admin.agent-enquiries.index')->with('success', 'Enquiry deleted.');
    }

    public function updateSettings(UpdateAgentEnquirySettingsRequest $request): RedirectResponse
    {
        AppSetting::setValue('agent_enquiry_notification_email', $request->validated('agent_enquiry_notification_email'));

        return back()->with('success', 'Agent enquiry notification email updated.');
    }

    private function mapEnquiry(AgentEnquiry $enquiry): array
    {
        return [
            'id'           => $enquiry->id,
            'name'         => $enquiry->name,
            'company_name' => $enquiry->company_name,
            'email'        => $enquiry->email,
            'mobile'       => $enquiry->mobile,
            'message'      => $enquiry->message,
            'created_at'   => $enquiry->created_at?->toISOString(),
        ];
    }
}
