import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type ReadOnlyProfilePhotoProps = {
  photoUrl?: string | null;
  displayName?: string | null;
  email?: string | null;
  helperText?: string;
};

function initials(displayName?: string | null, email?: string | null): string {
  const name = displayName?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase().slice(0, 2);
    }
    return name.slice(0, 2).toUpperCase();
  }
  const addr = email?.trim();
  return addr ? addr.charAt(0).toUpperCase() : '?';
}

/** Read-only profile photo block (same layout as parent, without upload). */
export function ReadOnlyProfilePhoto({
  photoUrl,
  displayName,
  email,
  helperText = 'Your profile photo is managed by an administrator.',
}: ReadOnlyProfilePhotoProps) {
  const fallback = initials(displayName, email);
  const imageSrc = photoUrl?.trim() || undefined;
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageSrc]);

  const showImage = Boolean(imageSrc) && !imageFailed;

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl bg-[var(--gf-green-50)]/30 border border-[var(--line)] p-6">
      <div
        className={cn(
          'relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)] bg-[var(--gf-green-50)]'
        )}
      >
        {showImage ? (
          <img
            key={imageSrc}
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="text-lg font-extrabold text-[var(--gf-green-deep)]">{fallback}</span>
        )}
      </div>
      <div className="flex-1 space-y-1 w-full text-center">
        <Label className="text-base font-extrabold text-[var(--gf-green-deep)] uppercase tracking-wider block" style={{ fontFamily: 'var(--font-display)' }}>
          Profile photo
        </Label>
        <p className="text-sm font-semibold text-[var(--fg-2)]">{helperText}</p>
      </div>
    </div>
  );
}