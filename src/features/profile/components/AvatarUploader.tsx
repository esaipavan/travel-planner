import { useRef } from 'react';
import { Camera, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateAvatarFile } from '../services/profile.service';
import { useUploadAvatar, useRemoveAvatar } from '../hooks/useProfile';
import { toast } from 'sonner';

interface Props {
  avatarUrl: string | null;
  fullName:  string | null;
}

export function AvatarUploader({ avatarUrl, fullName }: Props) {
  const inputRef          = useRef<HTMLInputElement>(null);
  const uploadMutation    = useUploadAvatar();
  const removeMutation    = useRemoveAvatar();
  const isLoading         = uploadMutation.isPending || removeMutation.isPending;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateAvatarFile(file);
    if (err) { toast.error(err); return; }
    uploadMutation.mutate(file);
    e.target.value = '';
  }

  const initials = fullName
    ? fullName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar display */}
      <div className="relative h-24 w-24">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile photo"
            className="h-24 w-24 rounded-full object-cover border-2 border-border"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 border-2 border-border text-xl font-semibold text-primary">
            {fullName ? initials : <User className="h-10 w-10 text-muted-foreground" />}
          </div>
        )}

        {/* Upload overlay button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
          title="Change photo"
        >
          <Camera className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Remove button */}
      {avatarUrl && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isLoading}
          className="h-7 gap-1.5 text-xs text-destructive hover:text-destructive"
          onClick={() => removeMutation.mutate(avatarUrl)}
        >
          <Trash2 className="h-3 w-3" />
          Remove photo
        </Button>
      )}

      <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP — max 5 MB</p>
    </div>
  );
}
