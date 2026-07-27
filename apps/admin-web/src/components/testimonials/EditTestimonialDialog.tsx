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
import { FormField as CustomFormField } from '@/components/common/FormField';
import { UpdateTestimonialSchema, UpdateTestimonialDto } from '@grow-fitness/shared-schemas';
import { Testimonial } from '@grow-fitness/shared-types';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { testimonialsService } from '@/services/testimonials.service';
import { useToast } from '@/hooks/useToast';
import { useModalParams } from '@/hooks/useModalParams';
import { Switch } from '@/components/ui/switch';

interface EditTestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial?: Testimonial;
}

export function EditTestimonialDialog({
  open,
  onOpenChange,
  testimonial: testimonialProp,
}: EditTestimonialDialogProps) {
  const { entityId, closeModal } = useModalParams('testimonialId');

  const { data: testimonialFromUrl } = useApiQuery<Testimonial>(
    ['testimonials', entityId || 'no-id'],
    () => {
      if (!entityId) throw new Error('Testimonial ID is required');
      return testimonialsService.getTestimonialById(entityId);
    },
    { enabled: open && !testimonialProp && !!entityId }
  );

  const testimonial = testimonialProp || testimonialFromUrl;

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) closeModal();
    onOpenChange(newOpen);
  };

  const { toast } = useToast();

  const form = useForm<UpdateTestimonialDto>({
    resolver: zodResolver(UpdateTestimonialSchema),
    defaultValues: {
      authorName: testimonial?.authorName ?? '',
      content: testimonial?.content ?? '',
      childName: testimonial?.childName ?? '',
      childAge: testimonial?.childAge ?? undefined,
      membershipDuration: testimonial?.membershipDuration ?? '',
      rating: testimonial?.rating ?? 5,
      order: testimonial?.order ?? 0,
      isActive: testimonial?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (open && testimonial) {
      form.reset({
        authorName: testimonial.authorName,
        content: testimonial.content,
        childName: testimonial.childName ?? '',
        childAge: testimonial.childAge ?? undefined,
        membershipDuration: testimonial.membershipDuration ?? '',
        rating: testimonial.rating ?? 5,
        order: testimonial.order ?? 0,
        isActive: testimonial.isActive ?? true,
      });
    }
  }, [open, testimonial, form]);

  const updateMutation = useApiMutation(
    (data: UpdateTestimonialDto) =>
      testimonial ? testimonialsService.updateTestimonial(testimonial.id, data) : Promise.reject(),
    {
      invalidateQueries: [['testimonials']],
      onSuccess: () => {
        toast.success('Testimonial updated successfully');
        handleOpenChange(false);
      },
      onError: error => {
        toast.error('Failed to update testimonial', error.message);
      },
    }
  );

  const onSubmit = (data: UpdateTestimonialDto) => {
    updateMutation.mutate({
      ...data,
      childName: data.childName || undefined,
      childAge: data.childAge ?? undefined,
      membershipDuration: data.membershipDuration || undefined,
    });
  };

  if (!testimonial) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 flex flex-col max-w-2xl max-h-[85vh] border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] shadow-2xl rounded-2xl">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="pb-3 border-b-2 border-[var(--gf-green-deep)]/30 bg-[var(--gf-green-50)] flex-shrink-0">
            <DialogHeader className="space-y-1 px-6 pt-6">
              <DialogTitle className="text-xl font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Edit Testimonial</DialogTitle>
              <DialogDescription className="text-sm text-[var(--fg-2)] font-semibold">Update testimonial information</DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4 min-h-0">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              id="edit-testimonial-form"
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
                error={form.formState.errors.membershipDuration?.message}
              >
                <Input
                  {...form.register('membershipDuration')}
                  placeholder="e.g. Member for 6 months"
                />
              </CustomFormField>

              <CustomFormField label="Rating" error={form.formState.errors.rating?.message}>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  {...form.register('rating', { valueAsNumber: true })}
                />
              </CustomFormField>

              <CustomFormField label="Order" error={form.formState.errors.order?.message}>
                <Input type="number" min={0} {...form.register('order', { valueAsNumber: true })} />
              </CustomFormField>

              <CustomFormField
                label="Active"
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
                form="edit-testimonial-form"
                disabled={updateMutation.isPending}
                className="rounded-xl px-4 py-2 text-sm text-white font-extrabold uppercase tracking-wider bg-[var(--gf-green-deep)] border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--gf-green-deep)] active:translate-y-[1px] active:shadow-[0_0_0_0_var(--gf-green-deep)] transition-all duration-200"
              >
                {updateMutation.isPending ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
