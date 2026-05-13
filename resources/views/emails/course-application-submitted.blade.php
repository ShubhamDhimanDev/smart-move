<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Course Application</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
    <h2>New Course Application Received</h2>

    <p>A new application has been submitted with the following details:</p>

    @php
        $qualificationAndWork = $application->previous_qualification_work_experience;

        if (! is_array($qualificationAndWork)) {
            $qualificationAndWork = [
                'qualification' => (string) $application->getRawOriginal('previous_qualification_work_experience'),
                'work_experience' => '',
            ];
        }
    @endphp

    <ul>
        <li><strong>First Name:</strong> {{ $application->first_name }}</li>
        <li><strong>Last Name:</strong> {{ $application->last_name }}</li>
        <li><strong>Date of Birth:</strong> {{ $application->dob?->format('Y-m-d') }}</li>
        <li><strong>Phone:</strong> {{ $application->phone }}</li>
        <li><strong>Email:</strong> {{ $application->email }}</li>
        <li><strong>Nationality:</strong> {{ $application->nationality ?? $application->nationality_immigration_status }}</li>
        <li><strong>Immigration Status:</strong> {{ $application->immigration_status ?? '-' }}</li>
        <li><strong>Preferred Course:</strong> {{ $application->preferred_course ?? $application->preferred_course_location }}</li>
        <li><strong>Preferred Location:</strong> {{ $application->preferred_location ?? '-' }}</li>
        <li><strong>Have Taken SFE Before:</strong> {{ $application->has_taken_sfe_before ? 'Yes' : 'No' }}</li>
        <li><strong>Qualification:</strong> {{ $qualificationAndWork['qualification'] ?? '-' }}</li>
        <li><strong>Work Experience:</strong> {{ $qualificationAndWork['work_experience'] ?? '-' }}</li>
        <li><strong>Submitted At:</strong> {{ $application->created_at?->format('Y-m-d H:i:s') }}</li>
    </ul>
</body>
</html>
