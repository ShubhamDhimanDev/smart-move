<?php

use App\Models\City;
use App\Models\User;
use Spatie\Permission\Models\Role;

if (! function_exists('createAdminUser')) {
    function createAdminUser(): User
    {
        Role::findOrCreate('admin', 'web');

        $user = User::factory()->createOne();
        $user->assignRole('admin');

        return $user;
    }
}

it('requires image and short_description when featured on homepage (store)', function () {
    $user = createAdminUser();

    $response = $this->actingAs($user)
        ->post(route('admin.cities.store'), [
            'name' => 'Test City',
            'slug' => 'test-city',
            'is_featured_home' => true,
        ]);

    $response->assertSessionHasErrors(['image', 'short_description']);
});

it('requires image and short_description when featured on homepage (update)', function () {
    $user = createAdminUser();

    $city = City::create([
        'name' => 'Sample City',
        'slug' => 'sample-city',
        'sort_order' => 0,
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)
        ->patch(route('admin.cities.update', $city), [
            'name' => 'Sample City Updated',
            'is_featured_home' => true,
        ]);

    $response->assertSessionHasErrors(['image', 'short_description']);
});
