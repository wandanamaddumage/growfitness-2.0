import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { CreateInvoiceSchema, CreateInvoiceDto } from '@grow-fitness/shared-schemas';
import { InvoiceType } from '@grow-fitness/shared-types';
import { useApiMutation, useApiQuery } from '@/hooks';
import { invoicesService } from '@/services/invoices.service';
import { kidsService } from '@/services/kids.service';
import { usersService } from '@/services/users.service';
import { useToast } from '@/hooks/useToast';
import { Plus, Trash2 } from 'lucide-react';
import { DatePicker } from '@/components/common/DatePicker';
import { format } from 'date-fns';
import { useModalParams } from '@/hooks/useModalParams';

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInvoiceDialog({ open, onOpenChange }: CreateInvoiceDialogProps) {
  const { closeModal } = useModalParams('invoiceId');

  // Handle close with URL params
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      closeModal();
    }
    onOpenChange(newOpen);
  };
  const { toast } = useToast();

  const { data: parentsData } = useApiQuery(['users', 'parents', 'all'], () =>
    usersService.getParents(1, 100)
  );

  const { data: coachesData } = useApiQuery(['users', 'coaches', 'all'], () =>
    usersService.getCoaches(1, 100)
  );

  const defaultValues = {
    type: InvoiceType.PARENT_INVOICE,
    items: [{ description: '', amount: 0 }],
    dueDate: '',
    kidName: undefined as string | undefined,
  };

  const form = useForm<CreateInvoiceDto>({
    resolver: zodResolver(CreateInvoiceSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const itemsFieldError = form.formState.errors.items;
  const itemsRootError =
    itemsFieldError &&
    !Array.isArray(itemsFieldError) &&
    typeof itemsFieldError.message === 'string'
      ? itemsFieldError.message
      : undefined;

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    } else {
      form.reset(defaultValues);
    }
  }, [open]);

  const createMutation = useApiMutation(
    (data: CreateInvoiceDto) => invoicesService.createInvoice(data),
    {
      invalidateQueries: [['invoices']],
      onSuccess: () => {
        toast.success('Invoice created successfully');
        form.reset(defaultValues);
        setTimeout(() => {
          handleOpenChange(false);
        }, 100);
      },
      onError: error => {
        toast.error('Failed to create invoice', error.message || 'An error occurred');
      },
    }
  );

  const onSubmit = (data: CreateInvoiceDto) => {
    const { kidName, ...rest } = data;
    const trimmedKid = kidName?.trim();
    const formattedData: CreateInvoiceDto = {
      ...rest,
      dueDate:
        typeof data.dueDate === 'string'
          ? data.dueDate
          : format(data.dueDate as Date, 'yyyy-MM-dd'),
      ...(trimmedKid ? { kidName: trimmedKid } : {}),
    };
    createMutation.mutate(formattedData);
  };

  const invoiceType = form.watch('type');
  const parentId = form.watch('parentId');

  const { data: parentKidsData, isLoading: isLoadingParentKids } = useApiQuery(
    ['kids', 'parent', parentId || 'none'],
    () => kidsService.getKids(1, 100, parentId!),
    {
      enabled: open && invoiceType === InvoiceType.PARENT_INVOICE && !!parentId,
    }
  );

  const parentKids = parentKidsData?.data ?? [];
  const selectedKidName = form.watch('kidName');
  const selectedKidId = parentKids.find(kid => kid.name === selectedKidName)?.id ?? '__none__';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl p-0 flex flex-col max-h-[90vh]">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Sticky Header */}
          <div className="pb-3 border-b bg-muted/30 flex-shrink-0">
            <DialogHeader className="space-y-1 px-6 pt-6">
              <DialogTitle className="text-xl">Create Invoice</DialogTitle>
              <DialogDescription className="text-sm">Add a new invoice</DialogDescription>
            </DialogHeader>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4 min-h-0">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              id="create-invoice-form"
              className="space-y-4"
            >
              <CustomFormField label="Type" required error={form.formState.errors.type?.message}>
                <Select
                  value={form.watch('type')}
                  onValueChange={value => {
                    form.setValue('type', value as InvoiceType, { shouldValidate: true });
                    form.setValue('parentId', undefined, { shouldValidate: true });
                    form.setValue('coachId', undefined, { shouldValidate: true });
                    form.setValue('kidName', undefined, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={InvoiceType.PARENT_INVOICE}>Parent Invoice</SelectItem>
                    <SelectItem value={InvoiceType.COACH_PAYOUT}>Coach Payout</SelectItem>
                  </SelectContent>
                </Select>
              </CustomFormField>

              {invoiceType === InvoiceType.PARENT_INVOICE && (
                <CustomFormField
                  label="Parent"
                  required
                  error={form.formState.errors.parentId?.message}
                >
                  <Select
                    value={form.watch('parentId') || ''}
                    onValueChange={value => {
                      form.setValue('parentId', value, { shouldValidate: true });
                      form.setValue('kidName', undefined, { shouldValidate: true });
                    }}
                  >
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
              )}

              {invoiceType === InvoiceType.PARENT_INVOICE && (
                <CustomFormField label="Kid" error={form.formState.errors.kidName?.message}>
                  <Select
                    value={selectedKidId}
                    onValueChange={value => {
                      if (value === '__none__') {
                        form.setValue('kidName', undefined, { shouldValidate: true });
                        return;
                      }
                      const kid = parentKids.find(k => k.id === value);
                      form.setValue('kidName', kid?.name, { shouldValidate: true });
                    }}
                    disabled={!parentId || isLoadingParentKids}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !parentId
                            ? 'Select a parent first'
                            : isLoadingParentKids
                              ? 'Loading kids...'
                              : parentKids.length === 0
                                ? 'No kids for this parent'
                                : 'Select kid (optional)'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">None</SelectItem>
                      {parentKids.map(kid => (
                        <SelectItem key={kid.id} value={kid.id}>
                          {kid.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {parentId && !isLoadingParentKids && parentKids.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      This parent has no kids on file. The invoice PDF will not include a kid name.
                    </p>
                  ) : null}
                </CustomFormField>
              )}

              {invoiceType === InvoiceType.COACH_PAYOUT && (
                <CustomFormField
                  label="Coach"
                  required
                  error={form.formState.errors.coachId?.message}
                >
                  <Select
                    value={form.watch('coachId') || ''}
                    onValueChange={value =>
                      form.setValue('coachId', value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select coach" />
                    </SelectTrigger>
                    <SelectContent>
                      {(coachesData?.data || []).map(coach => (
                        <SelectItem key={coach.id} value={coach.id}>
                          {coach.coachProfile?.name || coach.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CustomFormField>
              )}

              <CustomFormField label="Payment Details" required error={itemsRootError}>
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-1">
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-1">
                        <Input
                          placeholder="Description"
                          {...form.register(`items.${index}.description`)}
                        />
                        {form.formState.errors.items?.[index]?.description?.message ? (
                          <p className="text-xs text-destructive">
                            {form.formState.errors.items[index]?.description?.message}
                          </p>
                        ) : null}
                      </div>
                      <div className="w-32 space-y-1">
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="Amount"
                          {...form.register(`items.${index}.amount`, { valueAsNumber: true })}
                        />
                        {form.formState.errors.items?.[index]?.amount?.message ? (
                          <p className="text-xs text-destructive">
                            {form.formState.errors.items[index]?.amount?.message}
                          </p>
                        ) : null}
                      </div>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ description: '', amount: 0 })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CustomFormField>

              <CustomFormField
                label="Due Date"
                required
                error={form.formState.errors.dueDate?.message}
              >
                <DatePicker
                  date={form.watch('dueDate') ? new Date(form.watch('dueDate')) : undefined}
                  onSelect={date =>
                    form.setValue('dueDate', date ? format(date, 'yyyy-MM-dd') : '', {
                      shouldValidate: true,
                    })
                  }
                />
              </CustomFormField>
            </form>
          </div>

          {/* Sticky Footer */}
          <div className="px-6 py-3 border-t bg-muted/30 flex-shrink-0">
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="create-invoice-form"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Invoice'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
