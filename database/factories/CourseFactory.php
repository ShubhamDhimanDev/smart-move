<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\CourseCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Course>
 */
class CourseFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->sentence(5, false);

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(1, 999),
            'course_category_id' => CourseCategory::factory(),
            'excerpt' => fake()->sentence(),
            'status' => 'published',
            'is_featured' => false,
            'duration' => fake()->optional(0.8)->numberBetween(1, 24),
            'duration_unit' => fake()->optional(0.8)->randomElement(['weeks', 'months', 'years']),
            'level' => fake()->optional(0.8)->randomElement(['beginner', 'intermediate', 'advanced']),
            'delivery_mode' => fake()->randomElement(['online', 'in-person', 'hybrid']),
            'start_date' => fake()->optional(0.7)->dateTimeBetween('+1 week', '+6 months'),
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }

    public function draft(): static
    {
        return $this->state(['status' => 'draft']);
    }

    public function published(): static
    {
        return $this->state(['status' => 'published']);
    }

    public function featured(): static
    {
        return $this->state(['is_featured' => true]);
    }
}
