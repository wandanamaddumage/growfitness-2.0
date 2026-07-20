import { useState, useEffect, useRef } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { invoicesService } from '@/services/invoices.service';
import { type Invoice, InvoiceType, InvoiceStatus } from '@grow-fitness/shared-types';
import { DataTable } from '@/components/common/DataTable';
import { Pagination } from '@/components/common/Pagination';
import { FilterBar } from '@/components/common/FilterBar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, Eye, Pencil } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import { useToast } from '@/hooks/useToast';

import {
  formatDate,
  formatCurrency,
  formatInvoiceType,
} from '@/lib/formatters';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ErrorState } from '@/components/common/ErrorState';
import { useModalParams } from '@/hooks/useModalParams';
import { useAuth } from '@/contexts/useAuth';
import { InvoiceDetailsDialog } from '../invoice/InvoiceDetailsDialog';
import { useApiQuery } from '@/hooks/useApiQuery';

export function InvoicesTab() {
  const { page, pageSize, setPage, setPageSize } = usePagination();
  const [typeFilter] = useState<InvoiceType | ''>('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | ''>('');
  const { modal, entityId, isOpen, openModal, closeModal } = useModalParams('invoiceId');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const loadedInvoiceId = useRef<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const coachId = user?.id;

  useEffect(() => {
    let isMounted = true;

    if (entityId && modal) {
      if (loadedInvoiceId.current !== entityId) {
        loadedInvoiceId.current = entityId;
        invoicesService
          .getInvoiceById(entityId)
          .then(response => {
            if (isMounted) {
              setSelectedInvoice(response);
            }
          })
          .catch(() => {
            if (isMounted) {
              closeModal();
              loadedInvoiceId.current = null;
            }
          });
      }
    } else if (!entityId && !modal) {
      // Use setTimeout to defer the state update
      const timer = setTimeout(() => {
        if (isMounted) {
          setSelectedInvoice(null);
          loadedInvoiceId.current = null;
        }
      }, 0);
      return () => clearTimeout(timer);
    }

    return () => {
      isMounted = false;
    };
  }, [entityId, modal, closeModal]);

  const detailsDialogOpen = modal === 'details' && isOpen;

  const { data, isLoading, error } = useApiQuery(
    ['invoices', page.toString(), pageSize.toString(), typeFilter, statusFilter, coachId || ''],
    () =>
      invoicesService.getInvoices(page, pageSize, {
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        coachId, 
      })
  );

  const handleExportCSV = async () => {
    try {
      const blob = await invoicesService.exportCSV({
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        coachId, 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoices.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Invoices exported successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to export invoices: ${errorMessage}`);
    }
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => formatInvoiceType(row.original.type),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(row.original.totalAmount),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ row }) => formatDate(row.original.dueDate),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedInvoice(invoice);
                openModal(invoice.id, 'details');
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedInvoice(invoice);
                openModal(invoice.id, 'edit');
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 gf-scope">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>
          Invoices
        </h1>
        <p className="text-xs sm:text-sm text-[var(--fg-2)] font-semibold mt-0.5">Manage invoices and payments</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={handleExportCSV} className="border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] text-[var(--gf-green-deep)] font-extrabold hover:bg-[var(--gf-green-50)] transition-all duration-200 shadow-[2px_2px_0_0_var(--gf-green-deep)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--gf-green-deep)] active:translate-y-[1px] active:shadow-[0_0_0_0_var(--gf-green-deep)] rounded-xl h-9">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <FilterBar>
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-[var(--gf-green-deep)]">Status:</label>
            <Select
              value={statusFilter || 'all'}
              onValueChange={value =>
                setStatusFilter(value === 'all' ? '' : (value as InvoiceStatus))
              }
            >
              <SelectTrigger className="w-[150px] border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] text-[var(--gf-green-deep)] font-semibold rounded-xl">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--gf-paper)] border border-[var(--line)]">
                <SelectItem value="all" className="text-[var(--gf-green-deep)] focus:bg-[var(--gf-green-50)] focus:text-[var(--gf-green-deep)]">All statuses</SelectItem>
                <SelectItem value={InvoiceStatus.PENDING} className="text-[var(--gf-green-deep)] focus:bg-[var(--gf-green-50)] focus:text-[var(--gf-green-deep)]">Pending</SelectItem>
                <SelectItem value={InvoiceStatus.PAID} className="text-[var(--gf-green-deep)] focus:bg-[var(--gf-green-50)] focus:text-[var(--gf-green-deep)]">Paid</SelectItem>
                <SelectItem value={InvoiceStatus.OVERDUE} className="text-[var(--gf-green-deep)] focus:bg-[var(--gf-green-50)] focus:text-[var(--gf-green-deep)]">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FilterBar>

        {error ? (
          <ErrorState title="Failed to load invoices" onRetry={() => window.location.reload()} />
        ) : (
          <>
            <div className="border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] rounded-2xl bg-[var(--gf-paper)] overflow-hidden">
              <DataTable
                columns={columns}
                data={data?.data || []}
                isLoading={isLoading}
                emptyMessage="No invoices found"
                className="border-0 rounded-none shadow-none"
              />
            </div>
            {data && (
              <Pagination data={data} onPageChange={setPage} onPageSizeChange={setPageSize} />
            )}
          </>
        )}
      </div>

     {(selectedInvoice || entityId) && (
        <>
            {selectedInvoice && (
            <InvoiceDetailsDialog
                open={detailsDialogOpen}
                onOpenChange={closeModal}
                invoice={selectedInvoice}
            />
            )}
        </>
     )}
    </div>
  );
}
