import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField as CustomFormField } from '@/components/common/FormField';
import { Kid } from '@grow-fitness/shared-types';
import { useApiMutation, useApiQuery } from '@/hooks';
import { kidsService } from '@/services/kids.service';
import { usersService } from '@/services/users.service';
import { useToast } from '@/hooks/useToast';

interface LinkParentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kid: Kid;
}

export function LinkParentDialog({ open, onOpenChange, kid }: LinkParentDialogProps) {
  const [parentId, setParentId] = useState('');
  const { toast } = useToast();

  // Set initial parentId when dialog opens or kid changes
  useEffect(() => {
    if (open) {
      // Check if kid has a parentId (string) or parent object with id
      // Handle both cases: direct parentId or populated parent object
      const currentParentId =
        kid.parentId || (kid as any).parent?.id || (kid as any).parent?.id || '';
      setParentId(currentParentId);
    } else {
      // Reset when dialog closes
      setParentId('');
    }
  }, [open, kid]);

  const { data: parentsData } = useApiQuery(['users', 'parents', 'all'], () =>
    usersService.getParents(1, 100)
  );

  const linkMutation = useApiMutation(
    (parentId: string) => kidsService.linkToParent(kid.id, parentId),
    {
      invalidateQueries: [['kids']],
      onSuccess: () => {
        toast.success('Kid linked to parent successfully');
        setParentId('');
        onOpenChange(false);
      },
      onError: error => {
        toast.error('Failed to link kid', error.message);
      },
    }
  );

  const handleSubmit = () => {
    if (!parentId) {
      toast.error('Please select a parent');
      return;
    }
    linkMutation.mutate(parentId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 flex flex-col max-h-[90vh] border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] shadow-2xl rounded-2xl">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Sticky Header */}
          <div className="pb-3 border-b-2 border-[var(--gf-green-deep)]/30 bg-[var(--gf-green-50)] flex-shrink-0">
            <DialogHeader className="space-y-1 px-6 pt-6">
              <DialogTitle className="text-xl font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Link Kid to Parent</DialogTitle>
              <DialogDescription className="text-sm text-[var(--fg-2)] font-semibold">Link {kid.name} to a parent</DialogDescription>
            </DialogHeader>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4 min-h-0">
            <div className="space-y-4">
              <CustomFormField label="Parent" required>
                <Select value={parentId} onValueChange={setParentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent" />
                  </SelectTrigger>
                  <SelectContent>
                    {(parentsData?.data || []).map(parent => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.parentProfile?.name || parent.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CustomFormField>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="px-6 py-3 border-t border-[var(--gf-green-deep)]/10 bg-[var(--gf-green-50)]/40 flex-shrink-0">
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl px-4 py-2 text-sm text-[var(--gf-green-deep)] font-extrabold uppercase tracking-wider border-2 border-[var(--gf-green-deep)] hover:bg-[var(--fg-6)] transition-all duration-200">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={linkMutation.isPending} className="rounded-xl px-4 py-2 text-sm text-white font-extrabold uppercase tracking-wider bg-[var(--gf-green-deep)] border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--gf-green-deep)] active:translate-y-[1px] active:shadow-[0_0_0_0_var(--gf-green-deep)] transition-all duration-200">
                {linkMutation.isPending ? 'Linking...' : 'Link'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
