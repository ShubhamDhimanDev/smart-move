<?php

use App\Models\Category;
use App\Models\City;
use App\Models\Country;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\Page;
use App\Models\Post;
use App\Models\University;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

function createAdminUser(): User
{
    Role::findOrCreate('admin', 'web');

    $user = User::factory()->createOne();
    $user->assignRole('admin');

    return $user;
}

it('registers the expected admin CMS routes', function () {
    expect(route('admin.dashboard'))->toContain('/admin');
    // Page builder routes are temporarily disabled:
    // expect(route('admin.pages.index'))->toContain('/admin/pages');
    // expect(route('admin.pages.builder-create'))->toContain('/admin/pages/builder-create');
    // expect(route('admin.pages.builder', 1))->toContain('/admin/pages/1/builder');
    // expect(route('admin.pages.builder-load', 1))->toContain('/admin/pages/1/builder-load');
    // expect(route('admin.pages.builder-save', 1))->toContain('/admin/pages/1/builder-save');
    expect(route('admin.posts.index'))->toContain('/admin/posts');
    expect(route('admin.categories.index'))->toContain('/admin/categories');
    expect(route('admin.media.upload'))->toContain('/admin/media/upload');
    expect(route('admin.media.index'))->toContain('/admin/media');
    expect(route('admin.course-categories.index'))->toContain('/admin/course-categories');
    expect(route('admin.cities.index'))->toContain('/admin/cities');
    expect(route('admin.universities.index'))->toContain('/admin/universities');
    expect(route('admin.courses.index'))->toContain('/admin/courses');
    expect(route('admin.users.index'))->toContain('/admin/users');
    expect(route('admin.permissions.index'))->toContain('/admin/permissions');
});

it('stores and updates courses with taxonomy relationships and page content', function () {
    $user = createAdminUser();

    DB::table('countries')->insert([
        'name' => 'United Kingdom',
        'nationality' => 'British',
        'iso2' => 'GB',
        'iso3' => 'GBR',
        'phone_code' => '+44',
        'currency_code' => 'GBP',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $country = Country::query()->firstOrFail();

    $category = CourseCategory::query()->create([
        'name' => 'Business',
        'slug' => 'business',
        'description' => null,
        'is_featured' => false,
        'sort_order' => 0,
        'is_active' => true,
    ]);

    $city = City::query()->create([
        'name' => 'London',
        'slug' => 'london',
        'country_id' => $country->id,
        'is_featured' => false,
        'sort_order' => 0,
        'is_active' => true,
    ]);

    $university = University::query()->create([
        'name' => 'London Global University',
        'slug' => 'london-global-university',
        'city_id' => $city->id,
        'country_id' => $country->id,
        'website' => 'https://example.edu',
        'is_featured' => false,
        'is_active' => true,
    ]);

    $createResponse = $this->actingAs($user)
        ->post(route('admin.courses.store'), [
            'title' => 'MBA Global Management',
            'slug' => 'mba-global-management',
            'course_category_id' => $category->id,
            'excerpt' => 'One-year international MBA',
            'status' => 'published',
            'is_featured' => true,
            'duration' => 12,
            'duration_unit' => 'months',
            'level' => 'advanced',
            'delivery_mode' => 'hybrid',
            'start_date' => now()->addMonth()->toDateString(),
            'sort_order' => 5,
            'city_ids' => [$city->id],
            'university_ids' => [$university->id],
            'page_content' => [
                'page_title' => 'MBA in London',
                'meta_title' => 'Top MBA London',
                'meta_description' => 'MBA program with global pathways',
            ],
        ]);

    $createResponse
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.courses.index'));

    $course = Course::query()->firstOrFail();

    expect($course->cities()->pluck('cities.id')->all())->toEqual([$city->id]);
    expect($course->universities()->pluck('universities.id')->all())->toEqual([$university->id]);
    expect($course->pageContent?->meta_title)->toBe('Top MBA London');

    $updateResponse = $this->actingAs($user)
        ->patch(route('admin.courses.update', $course), [
            'title' => 'MBA International Management',
            'slug' => 'mba-global-management',
            'course_category_id' => $category->id,
            'excerpt' => 'Updated excerpt',
            'status' => 'draft',
            'is_featured' => false,
            'duration' => 10,
            'duration_unit' => 'months',
            'level' => 'advanced',
            'delivery_mode' => 'online',
            'start_date' => now()->addMonths(2)->toDateString(),
            'sort_order' => 8,
            'city_ids' => [],
            'university_ids' => [$university->id],
            'page_content' => [
                'page_title' => 'MBA Updated',
                'meta_title' => 'Updated MBA Meta',
            ],
        ]);

    $updateResponse
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.courses.index'));

    $course->refresh();

    expect($course->title)->toBe('MBA International Management');
    expect($course->status)->toBe('draft');
    expect($course->cities()->count())->toBe(0);
    expect($course->pageContent?->meta_title)->toBe('Updated MBA Meta');
});

// Page builder tests are temporarily disabled while builder routes are commented out
// it('loads and saves page builder layouts via admin endpoints', ...

// it('creates a draft page and redirects directly to builder', ...

// it('creates, updates, and soft-deletes a page via admin controller', ...

it('stores and updates posts while syncing categories', function () {
    $user = createAdminUser();

    $firstCategory = Category::create([
        'name' => 'Laravel',
        'slug' => 'laravel',
        'description' => null,
    ]);

    $secondCategory = Category::create([
        'name' => 'Inertia',
        'slug' => 'inertia',
        'description' => null,
    ]);

    $thirdCategory = Category::create([
        'name' => 'React',
        'slug' => 'react',
        'description' => null,
    ]);

    $createResponse = $this->actingAs($user)
        ->post(route('admin.posts.store'), [
            'title' => 'First Post',
            'slug' => 'first-post',
            'excerpt' => 'Excerpt',
            'content' => [
                ['id' => 'block-1', 'type' => 'paragraph', 'content' => 'Post body'],
            ],
            'status' => 'published',
            'published_at' => now()->toDateTimeString(),
            'category_ids' => [$firstCategory->id, $secondCategory->id],
        ]);

    $createResponse
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.posts.index'));

    $post = Post::query()->firstOrFail();

    expect($post->user_id)->toBe($user->id);
    expect($post->categories()->pluck('categories.id')->all())
        ->toContain($firstCategory->id, $secondCategory->id);

    $updateResponse = $this->actingAs($user)
        ->patch(route('admin.posts.update', $post), [
            'title' => 'Updated Post',
            'slug' => 'first-post',
            'excerpt' => null,
            'content' => [
                ['id' => 'block-1', 'type' => 'paragraph', 'content' => 'Updated body'],
            ],
            'status' => 'draft',
            'published_at' => null,
            'category_ids' => [$thirdCategory->id],
        ]);

    $updateResponse
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.posts.index'));

    expect($post->fresh()->categories()->pluck('categories.id')->all())
        ->toEqual([$thirdCategory->id]);
});

it('updates a post via method spoofed multipart request', function () {
    $user = createAdminUser();

    $category = Category::create([
        'name' => 'News',
        'slug' => 'news',
        'description' => null,
    ]);

    $post = Post::create([
        'user_id' => $user->id,
        'title' => 'Original title',
        'slug' => 'original-title',
        'excerpt' => 'Original excerpt',
        'content' => [
            ['id' => 'block-1', 'type' => 'paragraph', 'content' => 'Original body'],
        ],
        'status' => 'draft',
        'comments_enabled' => true,
        'comments_require_approval' => true,
    ]);

    $response = $this->actingAs($user)
        ->post(route('admin.posts.update', $post), [
            '_method' => 'PUT',
            'title' => 'Updated via spoofing',
            'slug' => 'original-title',
            'excerpt' => 'Updated excerpt',
            'content' => [
                ['id' => 'block-1', 'type' => 'paragraph', 'content' => 'Updated body'],
            ],
            'status' => 'published',
            'published_at' => now()->toDateTimeString(),
            'category_ids' => [$category->id],
            'featured_image' => UploadedFile::fake()->image('post-cover.jpg'),
            'comments_enabled' => true,
            'comments_require_approval' => false,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.posts.index'));

    $updatedPost = $post->fresh();

    expect($updatedPost->title)->toBe('Updated via spoofing');
    expect($updatedPost->status)->toBe('published');
    expect($updatedPost->categories()->pluck('categories.id')->all())->toEqual([$category->id]);
});

// it('validates required fields when storing a page', ...

it('stores, updates, and deletes categories via admin endpoints', function () {
    $user = createAdminUser();

    $createResponse = $this->actingAs($user)
        ->post(route('admin.categories.store'), [
            'name' => 'Backend',
            'slug' => 'backend',
            'description' => 'Server-side topics',
        ]);

    $createResponse
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.categories.index'));

    $category = Category::query()->firstOrFail();

    $updateResponse = $this->actingAs($user)
        ->patch(route('admin.categories.update', $category), [
            'name' => 'Backend Engineering',
            'slug' => 'backend',
            'description' => null,
        ]);

    $updateResponse
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.categories.index'));

    expect($category->fresh()->name)->toBe('Backend Engineering');

    $deleteResponse = $this->actingAs($user)
        ->delete(route('admin.categories.destroy', $category));

    $deleteResponse
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.categories.index'));

    expect($category->fresh())->toBeNull();
});

it('lists and deletes media items from the admin media manager', function () {
    $user = createAdminUser();

    $page = Page::create([
        'title' => 'Media page',
        'slug' => 'media-page',
        'content' => 'Media content',
        'status' => 'draft',
    ]);

    $media = $page
        ->addMedia(UploadedFile::fake()->image('asset.jpg'))
        ->toMediaCollection('featured_image');

    $deleteResponse = $this->actingAs($user)
        ->delete(route('admin.media.destroy', $media->id));

    $deleteResponse
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.media.index'));

    $this->assertDatabaseMissing('media', ['id' => $media->id]);
});

it('forbids authenticated non-admin users from the admin area', function () {
    $user = User::factory()->createOne();
    expect($user)->toBeInstanceOf(User::class);

    $response = $this->actingAs($user)->get(route('admin.dashboard'));

    $response->assertForbidden();
});
