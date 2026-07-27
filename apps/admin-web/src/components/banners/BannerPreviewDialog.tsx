import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Banner } from '@grow-fitness/shared-types';
import { formatBannerTargetAudience } from '@/lib/formatters';

interface BannerPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: Banner;
}

export function BannerPreviewDialog({ open, onOpenChange, banner }: BannerPreviewDialogProps) {
  if (!banner) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Banner Preview</DialogTitle>
          <DialogDescription className="text-sm text-[var(--fg-2)] font-semibold">Preview banner image</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <img src={banner.imageUrl} alt="Banner preview" className="w-full h-auto rounded-xl border-2 border-[var(--gf-green-deep)]/30 shadow-[2px_2px_0_0_var(--gf-green-deep)]" />
          <div className="text-sm text-[var(--fg-2)] font-semibold">
            <p>Order: {banner.order}</p>
            <p>Target Audience: {formatBannerTargetAudience(banner.targetAudience)}</p>
            <p>Status: {banner.active ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
