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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField as CustomFormField } from '@/components/common/FormField';
import { UpdateBannerSchema, UpdateBannerDto } from '@grow-fitness/shared-schemas';
import { Banner, BannerTargetAudience } from '@grow-fitness/shared-types';
import { useApiMutation } from '@/hooks/useApiMutation';
import { bannersService } from '@/services/banners.service';
import { useToast } from '@/hooks/useToast';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useModalParams } from '@/hooks/useModalParams';

interface EditBannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: Banner;
}

export function EditBannerDialog({ open, onOpenChange, banner: bannerProp }: EditBannerDialogProps) {
  const { entityId, closeModal } = useModalParams('bannerId');
  
  // Fetch banner from URL if prop not provided
  const { data: bannerFromUrl } = useApiQuery<Banner>(
    ['banners', entityId || 'no-id'],
    () => {
      if (!entityId) {
        throw new Error('Banner ID is required');
      }
      return bannersService.getBannerById(entityId);
    },
    {
      enabled: open && !bannerProp && !!entityId,
    }
  );

  const banner = bannerProp || bannerFromUrl;

  // Handle close with URL params
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      closeModal();
    }
    onOpenChange(newOpen);
  };

  if (!banner) {
    return null;
  }
  const { toast } = useToast();

  const form = useForm<UpdateBannerDto>({
    resolver: zodResolver(UpdateBannerSchema),
    defaultValues: {
      imageUrl: banner.imageUrl,
      active: banner.active,
      order: banner.order,
      targetAudience: banner.targetAudience,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        imageUrl: banner.imageUrl,
        active: banner.active,
        order: banner.order,
        targetAudience: banner.targetAudience,
      });
    }
  }, [open, banner, form]);

  const updateMutation = useApiMutation(
    (data: UpdateBannerDto) => bannersService.updateBanner(banner.id, data),
    {
      invalidateQueries: [['banners']],
      onSuccess: () => {
        toast.success('Banner updated successfully');
        onOpenChange(false);
      },
      onError: error => {
        toast.error('Failed to update banner', error.message);
      },
    }
  );

  const onSubmit = (data: UpdateBannerDto) => {
    updateMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Banner</DialogTitle>
          <DialogDescription>Update banner information</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CustomFormField
            label="Image URL"
            required
            error={form.formState.errors.imageUrl?.message}
          >
            <Input {...form.register('imageUrl')} />
          </CustomFormField>

          <CustomFormField label="Order" required error={form.formState.errors.order?.message}>
            <Input type="number" {...form.register('order', { valueAsNumber: true })} />
          </CustomFormField>

          <CustomFormField
            label="Target Audience"
            required
            error={form.formState.errors.targetAudience?.message}
          >
            <Select
              value={form.watch('targetAudience')}
              onValueChange={value =>
                form.setValue('targetAudience', value as BannerTargetAudience)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BannerTargetAudience.ALL}>All</SelectItem>
                <SelectItem value={BannerTargetAudience.PARENT}>Parent</SelectItem>
                <SelectItem value={BannerTargetAudience.COACH}>Coach</SelectItem>
              </SelectContent>
            </Select>
          </CustomFormField>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
