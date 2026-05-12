<?php

use App\Mail\CourseApplicationSubmitted;
use App\Models\AppSetting;
use App\Models\CourseApplication;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia;
use Spatie\Permission\Models\Role;

function createAdminForApplications(): User
{
    Role::findOrCreate('admin', 'web');

    $user = User::factory()->create();
    $user->assignRole('admin');

    return $user;
}

it('renders apply now page', function () {
    $this->get(route('applications.create'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('Public/ApplyNow')
        );
});

it('stores course application and sends notification email', function () {
    Mail::fake();

    AppSetting::setValue('application_notification_email', 'admin@example.com');

    $response = $this->post(route('applications.store'), [
        'first_name' => 'Ava',
        'last_name' => 'Patel',
        'dob' => '2001-02-15',
        'phone' => '07123456789',
        'email' => 'ava@example.com',
        'nationality_immigration_status' => 'Indian - Student Visa',
        'preferred_course_location' => 'MSc Data Science - London',
        'has_taken_sfe_before' => false,
        'previous_qualification_work_experience' => 'BSc Computer Science with 2 years internship experience.',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertSessionHas('success');

    $application = CourseApplication::query()->firstOrFail();

    expect($application->email)->toBe('ava@example.com');
    expect($application->first_name)->toBe('Ava');

    Mail::assertSent(CourseApplicationSubmitted::class, function (CourseApplicationSubmitted $mail) use ($application): bool {
        return $mail->hasTo('admin@example.com')
            && $mail->application->is($application);
    });
});

it('shows applications in admin panel and updates notification email', function () {
    $admin = createAdminForApplications();

    CourseApplication::query()->create([
        'first_name' => 'Liam',
        'last_name' => 'Smith',
        'dob' => '1999-07-10',
        'phone' => '07987654321',
        'email' => 'liam@example.com',
        'nationality_immigration_status' => 'British - Settled',
        'preferred_course_location' => 'MBA - Birmingham',
        'has_taken_sfe_before' => true,
        'previous_qualification_work_experience' => 'BBA and 3 years work experience in operations.',
    ]);

    AppSetting::setValue('application_notification_email', 'old-admin@example.com');

    $this->actingAs($admin)
        ->get(route('admin.applications.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('Admin/Applications/Index')
            ->where('notificationEmail', 'old-admin@example.com')
            ->has('applications.data', 1)
            ->where('applications.data.0.first_name', 'Liam')
        );

    $this->actingAs($admin)
        ->patch(route('admin.applications.settings.update'), [
            'application_notification_email' => 'new-admin@example.com',
        ])
        ->assertSessionHasNoErrors()
        ->assertSessionHas('success');

    expect(AppSetting::getValue('application_notification_email'))->toBe('new-admin@example.com');
});
