import { useState } from "react";
import { type Invoice, InvoiceType, InvoiceStatus } from "@grow-fitness/shared-types";
import { useApiQuery } from "@/hooks/useApiQuery";
import { invoicesService } from "@/services/invoices.service";

import { DataTable } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileText } from "lucide-react";
import { formatDate, formatCurrency, formatInvoiceType } from "@/lib/formatters";
import { StatusBadge } from "@/components/common/StatusBadge";
import { usePagination } from "@/hooks/usePagination";
import { InvoiceDetailsDialog } from "../invoice/InvoiceDetailsDialog";

interface KidInvoicesTabProps {
  kidId: string;
}

export function InvoicesTab({ kidId }: KidInvoicesTabProps) {
  const { page, pageSize, setPage, setPageSize } = usePagination();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data, isLoading, error } = useApiQuery(
    ["kid-invoices", kidId, page.toString(), pageSize.toString()],
    () => invoicesService.getInvoices(page, pageSize, { parentId: kidId })
  );

  const columns = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: { row: { original: Invoice } }) => formatInvoiceType(row.original.type as InvoiceType),
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }: { row: { original: Invoice } }) => formatCurrency(row.original.totalAmount),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: Invoice } }) => <StatusBadge status={row.original.status as InvoiceStatus} />,
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }: { row: { original: Invoice } }) => formatDate(row.original.dueDate),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }: { row: { original: Invoice } }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Invoice } }) => {
        const invoice = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedInvoice(invoice);
                setDetailsOpen(true);
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
    <div>
      <Card className="border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-paper)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[var(--gf-green-50)]/40 border-b border-[var(--line)]">
          <CardTitle className="text-[var(--gf-green-deep)] text-lg sm:text-xl flex items-center font-extrabold uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
            <FileText className="mr-2 h-5 w-5 text-[var(--gf-green-deep)]" />
            Invoices
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {error ? (
            <ErrorState title="Failed to load invoices" onRetry={() => window.location.reload()} />
          ) : (
            <>
              <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} className="border-0 rounded-none shadow-none" />
              {data && data.totalPages > 1 && (
                <Pagination
                  data={data}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {selectedInvoice && (
        <InvoiceDetailsDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          invoice={selectedInvoice}
        />
      )}
    </div>
  );
}
