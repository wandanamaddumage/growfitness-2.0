import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { FormField as CustomFormField } from '@/components/common/FormField';
import { UpdateCodeDto, Code } from '@/services/codes.service';
import { useApiMutation } from '@/hooks/useApiMutation';
import { codesService } from '@/services/codes.service';
import { useToast } from '@/hooks/useToast';
import { format } from 'date-fns';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useModalParams } from '@/hooks/useModalParams';

interface EditCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code?: Code;
}

function formatDateForInput(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return format(d, "yyyy-MM-dd'T'HH:mm");
}

export function EditCodeDialog({ open, onOpenChange, code: codeProp }: EditCodeDialogProps) {
  const { entityId, closeModal } = useModalParams('codeId');
  
  // Fetch code from URL if prop not provided
  const { data: codeFromUrl } = useApiQuery<Code>(
    ['codes', entityId || 'no-id'],
    () => {
      if (!entityId) {
        throw new Error('Code ID is required');
      }
      return codesService.getCodeById(entityId);
    },
    {
      enabled: open && !codeProp && !!entityId,
    }
  );

  const code = codeProp || codeFromUrl;

  // Handle close with URL params
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      closeModal();
    }
    onOpenChange(newOpen);
  };

  if (!code) {
    return null;
  }
  const { toast } = useToast();

  const form = useForm<UpdateCodeDto>({
    defaultValues: {
      status: code.status,
      expiryDate: formatDateForInput(code.expiryDate),
      usageLimit: code.usageLimit,
      description: code.description || '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        status: code.status,
        expiryDate: formatDateForInput(code.expiryDate),
        usageLimit: code.usageLimit,
        description: code.description || '',
      });
    }
  }, [open, code, form]);

  const updateMutation = useApiMutation(
    (data: UpdateCodeDto) => codesService.updateCode(code.id, data),
    {
      invalidateQueries: [['codes']],
      onSuccess: () => {
        toast.success('Code updated successfully');
        onOpenChange(false);
      },
      onError: error => {
        toast.error('Failed to update code', error.message);
      },
    }
  );

  const onSubmit = (data: UpdateCodeDto) => {
    updateMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Code</DialogTitle>
          <DialogDescription>Update code information</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Code</label>
            <p className="text-sm font-mono mt-1">{code.code}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Type</label>
            <p className="text-sm mt-1">{code.type}</p>
          </div>

          <CustomFormField label="Status" error={form.formState.errors.status?.message}>
            <Select
              value={form.watch('status')}
              onValueChange={value => form.setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
          </CustomFormField>

          <CustomFormField
            label="Usage Limit"
            error={form.formState.errors.usageLimit?.message}
          >
            <Input
              type="number"
              min="1"
              {...form.register('usageLimit', {
                valueAsNumber: true,
                min: { value: 1, message: 'Usage limit must be at least 1' },
              })}
            />
          </CustomFormField>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Usage Count</label>
            <p className="text-sm mt-1">{code.usageCount} / {code.usageLimit}</p>
          </div>

          <CustomFormField
            label="Expiry Date"
            error={form.formState.errors.expiryDate?.message}
          >
            <Input type="datetime-local" {...form.register('expiryDate')} />
          </CustomFormField>

          <CustomFormField
            label="Description"
            error={form.formState.errors.description?.message}
          >
            <Textarea {...form.register('description')} rows={3} />
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

