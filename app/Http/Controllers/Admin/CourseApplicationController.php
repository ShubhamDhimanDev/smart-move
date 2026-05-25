<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateApplicationSettingsRequest;
use App\Models\AppSetting;
use App\Models\CourseApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;

class CourseApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = CourseApplication::query()->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if (($sfe = $request->input('has_taken_sfe')) !== null && $sfe !== '') {
            if ($sfe === 'yes') {
                $query->where('has_taken_sfe_before', true);
            } elseif ($sfe === 'no') {
                $query->where('has_taken_sfe_before', false);
            }
        }

        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $perPage = (int) $request->input('per_page', 20);

        $applications = $query->paginate($perPage)->appends($request->except('page'))
            ->through(fn (CourseApplication $application): array => $this->mapApplication($application));

        return Inertia::render('Admin/Applications/Index', [
            'applications' => $applications,
            'notificationEmail' => AppSetting::getValue('application_notification_email', config('mail.from.address')),
            'filters' => [
                'search' => $request->input('search', ''),
                'date_from' => $request->input('date_from', ''),
                'date_to' => $request->input('date_to', ''),
                'has_taken_sfe' => $request->input('has_taken_sfe', ''),
            ],
        ]);
    }

    public function export(Request $request)
    {
        $query = CourseApplication::query()->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if (($sfe = $request->input('has_taken_sfe')) !== null && $sfe !== '') {
            if ($sfe === 'yes') {
                $query->where('has_taken_sfe_before', true);
            } elseif ($sfe === 'no') {
                $query->where('has_taken_sfe_before', false);
            }
        }

        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $applications = $query->get();

        $fileName = 'applications-'.now()->format('Ymd-His').'.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="'.$fileName.'"',
        ];

        $columns = [
            'ID', 'First Name', 'Last Name', 'Email', 'Phone', 'DOB', 'Nationality', 'Immigration Status', 'Preferred Course', 'Preferred Location', 'Has Taken SFE Before', 'Qualification', 'Work Experience', 'Submitted At',
        ];

        return response()->streamDownload(function () use ($applications, $columns) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, $columns);

            foreach ($applications as $application) {
                $qualificationAndWork = $application->previous_qualification_work_experience;

                if (! is_array($qualificationAndWork)) {
                    $qualificationAndWork = [
                        'qualification' => (string) $application->getRawOriginal('previous_qualification_work_experience'),
                        'work_experience' => '',
                    ];
                }

                fputcsv($handle, [
                    $application->id,
                    $application->first_name,
                    $application->last_name,
                    $application->email,
                    $application->phone,
                    $application->dob?->toDateString(),
                    $application->nationality ?? $application->nationality_immigration_status,
                    $application->immigration_status ?? '',
                    $application->preferred_course ?? $application->preferred_course_location,
                    $application->preferred_location ?? '',
                    $application->has_taken_sfe_before ? 'Yes' : 'No',
                    $qualificationAndWork['qualification'] ?? '',
                    $qualificationAndWork['work_experience'] ?? '',
                    $application->created_at?->toISOString(),
                ]);
            }

            fclose($handle);
        }, $fileName, $headers);
    }

    public function show(CourseApplication $application): Response
    {
        return Inertia::render('Admin/Applications/Show', [
            'application' => $this->mapApplication($application),
        ]);
    }

    public function updateSettings(UpdateApplicationSettingsRequest $request): RedirectResponse
    {
        AppSetting::setValue('application_notification_email', $request->validated('application_notification_email'));

        return back()->with('success', 'Application notification email updated successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function mapApplication(CourseApplication $application): array
    {
        $qualificationAndWork = $application->previous_qualification_work_experience;

        if (! is_array($qualificationAndWork)) {
            $qualificationAndWork = [
                'qualification' => (string) $application->getRawOriginal('previous_qualification_work_experience'),
                'work_experience' => '',
            ];
        }

        return [
            'id' => $application->id,
            'first_name' => $application->first_name,
            'last_name' => $application->last_name,
            'dob' => $application->dob?->toDateString(),
            'phone' => $application->phone,
            'email' => $application->email,
            'nationality' => $application->nationality ?? $application->nationality_immigration_status,
            'immigration_status' => $application->immigration_status ?? '',
            'preferred_course' => $application->preferred_course ?? $application->preferred_course_location,
            'preferred_location' => $application->preferred_location ?? '',
            'has_taken_sfe_before' => (bool) $application->has_taken_sfe_before,
            'previous_qualification_work_experience' => [
                'qualification' => (string) Arr::get($qualificationAndWork, 'qualification', ''),
                'work_experience' => (string) Arr::get($qualificationAndWork, 'work_experience', ''),
            ],
            'created_at' => $application->created_at?->toISOString(),
        ];
    }
}
