import { useState, useEffect, useRef, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { invoicesService } from '@/services/invoices.service';
import { type Invoice, InvoiceStatus } from '@grow-fitness/shared-types';
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
import { Eye } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import { formatDate, formatCurrency, formatInvoiceType } from '@/lib/formatters';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ErrorState } from '@/components/common/ErrorState';
import { useModalParams } from '@/hooks/useModalParams';
import { useAuth } from '@/contexts/useAuth';
import { useApiQuery } from '@/hooks/useApiQuery';
import { InvoiceDetailsDialog } from '@/components/invoice/InvoiceDetailsDialog';

export function Payments() {
  const { page, pageSize, setPage, setPageSize } = usePagination();
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | ''>('');
  const { modal, entityId, isOpen, openModal, closeModal } =
    useModalParams('invoiceId');

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const loadedInvoiceId = useRef<string | null>(null);

  const { user } = useAuth();

  // Role-based filters
  const filters = useMemo(() => {
    if (!user) return {};
    if (user.role === 'PARENT') return { parentId: user.id };
    if (user.role === 'COACH') return { coachId: user.id };
    return {};
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    if (entityId && modal) {
      if (loadedInvoiceId.current !== entityId) {
        loadedInvoiceId.current = entityId;
        invoicesService
          .getInvoiceById(entityId)
          .then(res => {
            if (isMounted) setSelectedInvoice(res);
          })
          .catch(() => {
            closeModal();
            loadedInvoiceId.current = null;
          });
      }
    } else {
      setSelectedInvoice(null);
      loadedInvoiceId.current = null;
    }

    return () => {
      isMounted = false;
    };
  }, [entityId, modal, closeModal]);

  const detailsDialogOpen = modal === 'details' && isOpen;

  const { data, isLoading, error } = useApiQuery(
    [
      'invoices',
      page.toString(),
      pageSize.toString(),
      statusFilter,
      user?.id ?? '',
      user?.role ?? '',
    ],
    () =>
      invoicesService.getInvoices(page, pageSize, {
        status: statusFilter || undefined,
        ...filters,
      })
  );

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
          </div>
        );
      },
    },
  ];

  return (
    <div className="mx-4 sm:mx-12 space-y-6 bg-[var(--gf-cream)] pb-12 pt-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>
          Payment Invoices
        </h1>
        <p className="text-xs sm:text-sm text-[var(--fg-2)] font-semibold mt-0.5">
          View and download your invoices
        </p>
      </div>

      <FilterBar>
        <div className="flex items-center gap-2">
          <label className="text-sm font-bold text-[var(--gf-green-deep)]">Status:</label>
          <Select
            value={statusFilter || 'all'}
            onValueChange={v =>
              setStatusFilter(v === 'all' ? '' : (v as InvoiceStatus))
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
        <ErrorState
          title="Failed to load invoices"
          onRetry={() => window.location.reload()}
        />
      ) : (
        <>
          <div className="border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] rounded-2xl bg-[var(--gf-paper)] overflow-hidden">
            <DataTable
              columns={columns}
              data={data?.data ?? []}
              isLoading={isLoading}
              emptyMessage="No invoices found"
              className="border-0 rounded-none shadow-none"
            />
          </div>
          {data && (
            <Pagination
              data={data}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </>
      )}

      {selectedInvoice && (
        <InvoiceDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={closeModal}
          invoice={selectedInvoice}
        />
      )}

    </div>
  );
}
