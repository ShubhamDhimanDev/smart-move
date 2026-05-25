<?php

namespace App\Concerns;

trait ImageUrlHelpers
{
    /**
     * Strip the scheme/host from a URL and return only the path portion.
     * If the value is already a path (starts with '/'), it will be returned unchanged.
     */
    protected function stripDomainFromUrl(?string $url): ?string
    {
        if ($url === null || $url === '') {
            return $url;
        }

        if (str_starts_with($url, '/')) {
            return $url;
        }

        $path = parse_url($url, PHP_URL_PATH);

        return $path ?? $url;
    }

    /**
     * Sanitize common image fields inside an array by stripping domain from any URL-like values.
     * Defaults to `image`, `featured_image`, and `og_image`.
     * Returns the sanitized array.
     *
     * @param array<string,mixed> $data
     * @param array<int,string> $fields
     * @return array<string,mixed>
     */
    protected function sanitizeImageFieldsInArray(array $data, array $fields = ['image', 'featured_image', 'og_image']): array
    {
        foreach ($fields as $field) {
            if (array_key_exists($field, $data) && is_string($data[$field]) && filled($data[$field])) {
                $data[$field] = $this->stripDomainFromUrl($data[$field]);
            }
        }

        return $data;
    }

    /**
     * Ensure a stored image path is converted to a full absolute URL for public responses.
     * If the value already appears to be an absolute URL (has a scheme), it's returned unchanged.
     */
    protected function ensureFullUrl(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return $value;
        }

        if (parse_url($value, PHP_URL_SCHEME) !== null) {
            return $value;
        }

        return url($value);
    }
}
