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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FormField as CustomFormField } from '@/components/common/FormField';
import { CreateTestimonialSchema, CreateTestimonialDto } from '@grow-fitness/shared-schemas';
import { useApiMutation } from '@/hooks/useApiMutation';
import { testimonialsService } from '@/services/testimonials.service';
import { useToast } from '@/hooks/useToast';
import { useModalParams } from '@/hooks/useModalParams';

interface CreateTestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTestimonialDialog({ open, onOpenChange }: CreateTestimonialDialogProps) {
  const { closeModal } = useModalParams('testimonialId');

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      closeModal();
    }
    onOpenChange(newOpen);
  };

  const { toast } = useToast();

  const defaultValues: CreateTestimonialDto = {
    authorName: '',
    content: '',
    childName: '',
    childAge: 0,
    membershipDuration: '',
    rating: 5,
    order: 0,
    isActive: true,
  };

  const form = useForm<CreateTestimonialDto>({
    resolver: zodResolver(CreateTestimonialSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [open]);

  const createMutation = useApiMutation(
    (data: CreateTestimonialDto) => testimonialsService.createTestimonial(data),
    {
      invalidateQueries: [['testimonials']],
      onSuccess: () => {
        toast.success('Testimonial created successfully');
        form.reset(defaultValues);
        setTimeout(() => {
          handleOpenChange(false);
        }, 100);
      },
      onError: error => {
        if (error.errorCode === 'DUPLICATE_TESTIMONIAL_ORDER') {
          form.setError('order', {
            type: 'server',
            message: 'A testimonial with this order already exists',
          });
          return;
        }

        toast.error('Failed to create testimonial', error.message || 'An error occurred');
      },
    }
  );

  const onSubmit = (data: CreateTestimonialDto) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 flex flex-col max-w-2xl max-h-[85vh] border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] shadow-2xl rounded-2xl">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="pb-3 border-b-2 border-[var(--gf-green-deep)]/30 bg-[var(--gf-green-50)] flex-shrink-0">
            <DialogHeader className="space-y-1 px-6 pt-6">
              <DialogTitle className="text-xl font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Create Testimonial</DialogTitle>
              <DialogDescription className="text-sm text-[var(--fg-2)] font-semibold">
                Add a new testimonial from a parent or customer
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4 min-h-0">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              id="create-testimonial-form"
              className="grid grid-cols-2 gap-x-6 gap-y-4"
            >
              <CustomFormField
                label="Author Name"
                required
                error={form.formState.errors.authorName?.message}
              >
                <Input {...form.register('authorName')} placeholder="e.g. Sarah Johnson" />
              </CustomFormField>

              <CustomFormField
                label="Child Name"
                required
                error={form.formState.errors.childName?.message}
              >
                <Input {...form.register('childName')} placeholder="e.g. Emma" />
              </CustomFormField>

              <CustomFormField
                label="Content"
                required
                error={form.formState.errors.content?.message}
                className="col-span-2"
              >
                <Textarea
                  {...form.register('content')}
                  placeholder="The testimonial text..."
                  rows={3}
                  className="resize-none"
                />
              </CustomFormField>

              <CustomFormField
                label="Child Age"
                required
                error={form.formState.errors.childAge?.message}
              >
                <Input
                  type="number"
                  min={0}
                  max={18}
                  {...form.register('childAge', { valueAsNumber: true })}
                  placeholder="e.g. 8"
                />
              </CustomFormField>

              <CustomFormField
                label="Membership Duration"
                required
                error={form.formState.errors.membershipDuration?.message}
              >
                <Input
                  {...form.register('membershipDuration')}
                  placeholder="e.g. Member for 6 months"
                />
              </CustomFormField>

              <CustomFormField
                label="Rating"
                required
                error={form.formState.errors.rating?.message}
              >
                <Input
                  type="number"
                  min={1}
                  max={5}
                  {...form.register('rating', { valueAsNumber: true })}
                />
              </CustomFormField>

              <CustomFormField label="Order" required error={form.formState.errors.order?.message}>
                <Input type="number" min={0} {...form.register('order', { valueAsNumber: true })} />
              </CustomFormField>

              <CustomFormField
                label="Active"
                required
                error={form.formState.errors.isActive?.message}
                className="col-span-2"
              >
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.watch('isActive') ?? true}
                    onCheckedChange={checked => form.setValue('isActive', checked)}
                  />
                  <span className="text-sm text-[var(--fg-2)] font-semibold">
                    Show this testimonial on the website
                  </span>
                </div>
              </CustomFormField>
            </form>
          </div>

          <div className="px-6 py-3 border-t border-[var(--gf-green-deep)]/10 bg-[var(--gf-green-50)]/40 flex-shrink-0">
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl px-4 py-2 text-sm text-[var(--gf-green-deep)] font-extrabold uppercase tracking-wider border-2 border-[var(--gf-green-deep)] hover:bg-[var(--fg-6)] transition-all duration-200">
                Cancel
              </Button>
              <Button
                type="submit"
                form="create-testimonial-form"
                disabled={createMutation.isPending}
                className="rounded-xl px-4 py-2 text-sm text-white font-extrabold uppercase tracking-wider bg-[var(--gf-green-deep)] border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--gf-green-deep)] active:translate-y-[1px] active:shadow-[0_0_0_0_var(--gf-green-deep)] transition-all duration-200"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Testimonial'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
