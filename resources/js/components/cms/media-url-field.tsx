import { Loader2, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import MediaPickerModal from '@/components/cms/media-picker-modal';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    className?: string;
};

function getCsrfToken(): string {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    return token ?? '';
}

export default function MediaUrlField({ id, label, value, onChange, error, className }: Props) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const uploadToMedia = async () => {
        if (!uploadFile || uploading) {
            return;
        }

        setUploading(true);
        setUploadError(null);

        try {
            const body = new FormData();
            body.append('file', uploadFile);

            const response = await fetch('/admin/media/upload', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
                body,
            });

            if (!response.ok) {
                const payload = (await response.json().catch(() => null)) as
                    | { message?: string; errors?: Record<string, string[]> }
                    | null;

                const message = payload?.errors?.file?.[0] ?? payload?.message ?? 'Failed to upload image.';
                setUploadError(message);
                return;
            }

            const payload = (await response.json()) as { url: string };
            onChange(payload.url);
            setUploadFile(null);
        } catch {
            setUploadError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`grid gap-2 ${className ?? ''}`}>
            <Label htmlFor={id}>{label}</Label>

            <div className="flex flex-wrap items-center gap-2">
                <Input
                    id={id}
                    type="file"
                    accept="image/*"
                    className="flex-1"
                    onChange={(event) => {
                        setUploadFile(event.target.files?.[0] ?? null);
                        setUploadError(null);
                    }}
                />
                <Button type="button" variant="outline" onClick={uploadToMedia} disabled={!uploadFile || uploading}>
                    {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                    Upload
                </Button>
                <Button type="button" variant="outline" onClick={() => setPickerOpen(true)}>
                    Choose from media
                </Button>
            </div>

            {value ? (
                <div className="relative mt-1 w-44">
                    <img src={value} alt={`${label} preview`} className="h-28 w-44 rounded-md border border-neutral-200 object-cover" />
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900/70 text-white hover:bg-neutral-900"
                        aria-label={`Remove ${label}`}
                    >
                        ×
                    </button>
                </div>
            ) : null}

            {uploadError ? <p className="text-sm text-red-600">{uploadError}</p> : null}
            <InputError message={error} />

            <MediaPickerModal
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={(url) => {
                    onChange(url);
                    setUploadError(null);
                }}
            />
        </div>
    );
}
