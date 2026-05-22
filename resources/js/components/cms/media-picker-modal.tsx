import { Image, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type MediaItem = {
    id: number;
    name: string;
    file_name: string;
    url: string;
    mime_type: string;
    size: number;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
};

function humanSize(bytes: number): string {
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPickerModal({ open, onClose, onSelect }: Props) {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);

        try {
            const res = await fetch('/admin/media/library', {
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
            });

            if (res.ok) {
                const data: MediaItem[] = await res.json();
                setItems(data);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            setSelected(null);
            load();
        }
    }, [open, load]);

    function getCsrfToken(): string {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        return token ?? '';
    }

    const uploadToMedia = async () => {
        if (!uploadFile || uploading) return;

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

            const payload = (await response.json()) as { id: number; file_name: string; url: string };

            // Refresh library and select uploaded file
            await load();
            setSelected(payload.url);
            setUploadFile(null);
        } catch (e) {
            setUploadError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const confirm = () => {
        if (selected) {
            onSelect(selected);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-4xl p-0 gap-0">
                <DialogHeader className="px-5 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Choose from Media Library
                    </DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
                    <div className="px-5 pt-4 pb-2 border-b">
                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                accept="image/*"
                                className="text-sm"
                                onChange={(e) => {
                                    setUploadFile(e.target.files?.[0] ?? null);
                                    setUploadError(null);
                                }}
                            />
                            <div className="flex items-center gap-2 ml-auto">
                                <Button type="button" variant="outline" onClick={uploadToMedia} disabled={!uploadFile || uploading}>
                                    {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Upload
                                </Button>
                            </div>
                        </div>
                        {uploadError ? <p className="text-sm text-red-600 mt-2">{uploadError}</p> : null}
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="py-16 text-center text-sm text-neutral-500">
                            No images in the media library yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3 p-5 sm:grid-cols-4 md:grid-cols-5">
                            {items.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setSelected(item.url)}
                                    className={`group relative overflow-hidden rounded-lg border-2 transition-all focus:outline-none ${
                                        selected === item.url
                                            ? 'border-neutral-900 ring-2 ring-neutral-900 ring-offset-1'
                                            : 'border-transparent hover:border-neutral-300'
                                    }`}
                                >
                                    <img
                                        src={item.url}
                                        alt={item.name}
                                        className="aspect-square w-full object-cover"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-neutral-900/70 px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                                        <p className="truncate text-[10px] text-white">{item.file_name}</p>
                                        <p className="text-[9px] text-neutral-400">{humanSize(item.size)}</p>
                                    </div>
                                    {selected === item.url ? (
                                        <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900">
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    ) : null}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-2 border-t px-5 py-3">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="button" disabled={!selected} onClick={confirm}>
                        Use selected image
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
