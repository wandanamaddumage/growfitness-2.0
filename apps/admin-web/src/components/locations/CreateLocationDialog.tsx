import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField as CustomFormField } from '@/components/common/FormField';
import { CreateLocationSchema, CreateLocationDto } from '@grow-fitness/shared-schemas';
import { useApiMutation } from '@/hooks/useApiMutation';
import { locationsService } from '@/services/locations.service';
import { useToast } from '@/hooks/useToast';
import { useModalParams } from '@/hooks/useModalParams';
import { MapPicker } from '@/components/common/MapPicker';

interface CreateLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLocationDialog({ open, onOpenChange }: CreateLocationDialogProps) {
  const { closeModal } = useModalParams('locationId');

  // Handle close with URL params
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      closeModal();
    }
    onOpenChange(newOpen);
  };
  const { toast } = useToast();

  const defaultValues = {
    name: '',
    address: '',
    placeUrl: '',
    geo: undefined,
  };

  const form = useForm<CreateLocationDto>({
    resolver: zodResolver(CreateLocationSchema),
    defaultValues,
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    } else {
      form.reset(defaultValues);
    }
  }, [open]);

  const createMutation = useApiMutation(
    (data: CreateLocationDto) => locationsService.createLocation(data),
    {
      invalidateQueries: [['locations'], ['locations', 'all']],
      onSuccess: () => {
        toast.success('Location created successfully');
        form.reset(defaultValues);
        setTimeout(() => {
          handleOpenChange(false);
        }, 100);
      },
      onError: error => {
        toast.error('Failed to create location', error.message || 'An error occurred');
      },
    }
  );

  const onSubmit = (data: CreateLocationDto) => {
    const placeUrl = form.getValues('placeUrl')?.trim() ?? '';
    createMutation.mutate({ ...data, placeUrl: placeUrl || undefined });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 flex flex-col max-h-[90vh] border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] shadow-2xl rounded-2xl">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Sticky Header */}
          <div className="pb-3 border-b-2 border-[var(--gf-green-deep)]/30 bg-[var(--gf-green-50)] flex-shrink-0">
            <DialogHeader className="space-y-1 px-6 pt-6">
              <DialogTitle className="text-xl font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Create Location</DialogTitle>
              <DialogDescription className="text-sm text-[var(--fg-2)] font-semibold">Add a new training location</DialogDescription>
            </DialogHeader>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4 min-h-0">
            <form onSubmit={form.handleSubmit(onSubmit)} id="create-location-form" className="space-y-4">
              <CustomFormField label="Name" required error={form.formState.errors.name?.message}>
                <Input {...form.register('name')} />
              </CustomFormField>

              <CustomFormField label="Address" required error={form.formState.errors.address?.message}>
                <Input {...form.register('address')} />
              </CustomFormField>

              <CustomFormField label="Place URL" error={form.formState.errors.placeUrl?.message}>
                <Input
                  {...form.register('placeUrl')}
                  type="url"
                  placeholder="https://maps.google.com/..."
                />
              </CustomFormField>
              <p className="text-[0.8rem] text-muted-foreground -mt-2">
                Optional link to map or place page (e.g. Google Maps).
              </p>

              <div className="space-y-2">
                <label className="text-sm font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" style={{ fontFamily: 'var(--font-display)' }}>
                  Location Map
                </label>
                <div className="h-[300px] w-full rounded-xl border-2 border-[var(--gf-green-deep)]/30 overflow-hidden">
                  <MapPicker
                    value={form.watch('geo')}
                    onChange={value => form.setValue('geo', value)}
                  />
                </div>
                <p className="text-[0.8rem] text-[var(--fg-2)] font-semibold">
                  Click on the map to select the location coordinates.
                </p>
              </div>
            </form>
          </div>

          {/* Sticky Footer */}
          <div className="px-6 py-3 border-t border-[var(--gf-green-deep)]/10 bg-[var(--gf-green-50)]/40 flex-shrink-0">
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl px-4 py-2 text-sm text-[var(--gf-green-deep)] font-extrabold uppercase tracking-wider border-2 border-[var(--gf-green-deep)] hover:bg-[var(--fg-6)] transition-all duration-200">
                Cancel
              </Button>
              <Button type="submit" form="create-location-form" disabled={createMutation.isPending} className="rounded-xl px-4 py-2 text-sm text-white font-extrabold uppercase tracking-wider bg-[var(--gf-green-deep)] border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--gf-green-deep)] active:translate-y-[1px] active:shadow-[0_0_0_0_var(--gf-green-deep)] transition-all duration-200">
                {createMutation.isPending ? 'Creating...' : 'Create Location'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
