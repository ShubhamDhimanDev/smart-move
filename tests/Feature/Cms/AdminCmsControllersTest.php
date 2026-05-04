<?php

use App\Models\Category;
use App\Models\Page;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Spatie\Permission\Models\Role;

function createAdminUser(): User
{
    Role::findOrCreate('admin', 'web');

    $user = User::factory()->create();
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
    expect(route('admin.users.index'))->toContain('/admin/users');
    expect(route('admin.permissions.index'))->toContain('/admin/permissions');
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
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('admin.dashboard'));

    $response->assertForbidden();
});
