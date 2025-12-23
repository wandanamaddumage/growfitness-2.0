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
import { CreateCoachSchema, CreateCoachDto } from '@grow-fitness/shared-schemas';
import { useApiMutation } from '@/hooks/useApiMutation';
import { usersService } from '@/services/users.service';
import { useToast } from '@/hooks/useToast';

interface CreateCoachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultValues = {
  name: '',
  email: '',
  phone: '',
  password: '',
};

export function CreateCoachDialog({ open, onOpenChange }: CreateCoachDialogProps) {
  const { toast } = useToast();

  const form = useForm<CreateCoachDto>({
    resolver: zodResolver(CreateCoachSchema),
    defaultValues,
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    } else {
      form.reset(defaultValues);
    }
  }, [open, form]);

  const createMutation = useApiMutation(
    (data: CreateCoachDto) => usersService.createCoach(data),
    {
      invalidateQueries: [['users', 'coaches']],
      onSuccess: () => {
        toast.success('Coach created successfully');
        form.reset(defaultValues);
        setTimeout(() => {
          onOpenChange(false);
        }, 100);
      },
      onError: error => {
        toast.error('Failed to create coach', error.message || 'An error occurred');
      },
    }
  );

  const onSubmit = (data: CreateCoachDto) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Coach</DialogTitle>
          <DialogDescription>Add a new coach to the system</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CustomFormField label="Name" required error={form.formState.errors.name?.message}>
            <Input {...form.register('name')} />
          </CustomFormField>

          <CustomFormField label="Email" required error={form.formState.errors.email?.message}>
            <Input type="email" {...form.register('email')} />
          </CustomFormField>

          <CustomFormField label="Phone" required error={form.formState.errors.phone?.message}>
            <Input {...form.register('phone')} />
          </CustomFormField>

          <CustomFormField
            label="Password"
            required
            error={form.formState.errors.password?.message}
          >
            <Input type="password" {...form.register('password')} />
          </CustomFormField>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Coach'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
