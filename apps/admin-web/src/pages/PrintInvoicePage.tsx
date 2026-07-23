import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Invoice } from '@grow-fitness/shared-types';
import { InvoiceTemplatePrint, invoiceToPdfViewModel } from '@grow-fitness/invoice-print';
import { invoicesService } from '@/services/invoices.service';
import { Button } from '@/components/ui/button';

/**
 * Dedicated print route: same HTML as Puppeteer PDF (see GET /invoices/:id/pdf).
 * Open from admin: `/print/invoice/{invoiceId}` while logged in.
 */
export function PrintInvoicePage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!invoiceId) {
      setError('Missing invoice id');
      return;
    }
    invoicesService
      .getInvoiceById(invoiceId)
      .then(setInvoice)
      .catch(() => setError('Failed to load invoice'));
  }, [invoiceId]);

  if (error) {
    return <div className="p-8 text-red-600 font-semibold">{error}</div>;
  }

  if (!invoice) {
    return <div className="p-8 text-[var(--fg-2)] font-semibold">Loading…</div>;
  }

  const viewModel = invoiceToPdfViewModel(invoice);

  return (
    <div className="min-h-screen bg-[var(--gf-cream)] gf-scope p-6 print:bg-transparent print:p-0">
      <div className="mx-auto max-w-[210mm] overflow-hidden rounded-xl shadow-[2px_2px_0_0_var(--gf-green-deep)] ring-1 ring-black/10 print:shadow-none print:ring-0 print:rounded-none border-2 border-[var(--gf-green-deep)]">
        <div className="mb-4 flex flex-wrap gap-2 p-4 print:hidden">
          <Button type="button" onClick={() => window.print()} className="bg-[var(--gf-green)] text-white font-extrabold uppercase tracking-wider border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--gf-green-deep)] active:translate-y-[1px] active:shadow-[0_0_0_0_var(--gf-green-deep)]">
            Print / Save as PDF
          </Button>
        </div>
        <InvoiceTemplatePrint data={viewModel} renderMode="pdf" />
      </div>
    </div>
  );
}
