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
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Location</DialogTitle>
          <DialogDescription>Add a new training location</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CustomFormField label="Name" required error={form.formState.errors.name?.message}>
            <Input {...form.register('name')} />
          </CustomFormField>

          <CustomFormField label="Address" required error={form.formState.errors.address?.message}>
            <Input {...form.register('address')} />
          </CustomFormField>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Location'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
