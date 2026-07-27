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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField as CustomFormField } from '@/components/common/FormField';
import {
  UpdateInvoicePaymentStatusSchema,
  UpdateInvoicePaymentStatusDto,
} from '@grow-fitness/shared-schemas';
import { Invoice, InvoiceStatus } from '@grow-fitness/shared-types';
import { useApiMutation } from '@/hooks/useApiMutation';
import { invoicesService } from '@/services/invoices.service';
import { useToast } from '@/hooks/useToast';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useModalParams } from '@/hooks/useModalParams';

interface UpdatePaymentStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice;
}

export function UpdatePaymentStatusDialog({
  open,
  onOpenChange,
  invoice: invoiceProp,
}: UpdatePaymentStatusDialogProps) {
  const { entityId, closeModal } = useModalParams('invoiceId');
  
  // Fetch invoice from URL if prop not provided
  const { data: invoiceFromUrl } = useApiQuery<Invoice>(
    ['invoices', entityId || 'no-id'],
    () => {
      if (!entityId) {
        throw new Error('Invoice ID is required');
      }
      return invoicesService.getInvoiceById(entityId);
    },
    {
      enabled: open && !invoiceProp && !!entityId,
    }
  );

  const invoice = invoiceProp || invoiceFromUrl;

  // Handle close with URL params
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      closeModal();
    }
    onOpenChange(newOpen);
  };

  if (!invoice) {
    return null;
  }
  const { toast } = useToast();

  const form = useForm<UpdateInvoicePaymentStatusDto>({
    resolver: zodResolver(UpdateInvoicePaymentStatusSchema),
    defaultValues: {
      status: invoice.status,
      paidAt: invoice.paidAt ? new Date(invoice.paidAt).toISOString() : undefined,
    },
  });

  const updateMutation = useApiMutation(
    (data: UpdateInvoicePaymentStatusDto) => invoicesService.updatePaymentStatus(invoice.id, data),
    {
      invalidateQueries: [['invoices']],
      onSuccess: () => {
        toast.success('Payment status updated successfully');
        onOpenChange(false);
      },
      onError: error => {
        toast.error('Failed to update payment status', error.message);
      },
    }
  );

  const onSubmit = (data: UpdateInvoicePaymentStatusDto) => {
    updateMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 flex flex-col max-h-[90vh] border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] shadow-2xl rounded-2xl">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Sticky Header */}
          <div className="pb-3 border-b-2 border-[var(--gf-green-deep)]/30 bg-[var(--gf-green-50)] flex-shrink-0">
            <DialogHeader className="space-y-1 px-6 pt-6">
              <DialogTitle className="text-xl font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Update Payment Status</DialogTitle>
              <DialogDescription className="text-sm text-[var(--fg-2)] font-semibold">Update invoice payment status</DialogDescription>
            </DialogHeader>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4 min-h-0">
            <form onSubmit={form.handleSubmit(onSubmit)} id="update-payment-status-form" className="space-y-4">
              <CustomFormField label="Status" required error={form.formState.errors.status?.message}>
                <Select
                  value={form.watch('status')}
                  onValueChange={value => form.setValue('status', value as InvoiceStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={InvoiceStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={InvoiceStatus.PAID}>Paid</SelectItem>
                    <SelectItem value={InvoiceStatus.OVERDUE}>Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </CustomFormField>

              {form.watch('status') === InvoiceStatus.PAID && (
                <CustomFormField label="Paid At" error={form.formState.errors.paidAt?.message}>
                  <input
                    type="datetime-local"
                    {...form.register('paidAt')}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </CustomFormField>
              )}
            </form>
          </div>

          {/* Sticky Footer */}
          <div className="px-6 py-3 border-t border-[var(--gf-green-deep)]/10 bg-[var(--gf-green-50)]/40 flex-shrink-0">
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl px-4 py-2 text-sm text-[var(--gf-green-deep)] font-extrabold uppercase tracking-wider border-2 border-[var(--gf-green-deep)] hover:bg-[var(--fg-6)] transition-all duration-200">
                Cancel
              </Button>
              <Button type="submit" form="update-payment-status-form" disabled={updateMutation.isPending} className="rounded-xl px-4 py-2 text-sm text-white font-extrabold uppercase tracking-wider bg-[var(--gf-green-deep)] border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--gf-green-deep)] active:translate-y-[1px] active:shadow-[0_0_0_0_var(--gf-green-deep)] transition-all duration-200">
                {updateMutation.isPending ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
