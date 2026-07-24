import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useApiQuery, useApiMutation } from '@/hooks';
import { testimonialsService } from '@/services/testimonials.service';
import { Testimonial } from '@grow-fitness/shared-types';
import { DataTable } from '@/components/common/DataTable';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/formatters';
import { CreateTestimonialDialog } from '@/components/testimonials/CreateTestimonialDialog';
import { EditTestimonialDialog } from '@/components/testimonials/EditTestimonialDialog';
import { ErrorState } from '@/components/common/ErrorState';
import { useModalParams } from '@/hooks/useModalParams';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useConfirm } from '@/hooks/useConfirm';

export function TestimonialsPage() {
  const { page, pageSize, setPage, setPageSize } = usePagination();
  const { modal, entityId, isOpen, openModal, closeModal } = useModalParams('testimonialId');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const { toast } = useToast();
  const { confirm, confirmState } = useConfirm();

  const editDialogOpen = modal === 'edit' && isOpen;
  const createDialogOpen = modal === 'create' && isOpen;

  useEffect(() => {
    if (entityId && modal === 'edit') {
      if (!selectedTestimonial || selectedTestimonial.id !== entityId) {
        testimonialsService
          .getTestimonialById(entityId)
          .then(response => setSelectedTestimonial(response))
          .catch(() => closeModal());
      }
    } else if (!entityId && modal !== 'edit') {
      setSelectedTestimonial(null);
    }
  }, [entityId, modal, selectedTestimonial, closeModal]);

  const { data, isLoading, error, refetch } = useApiQuery(
    ['testimonials', page.toString(), pageSize.toString()],
    () => testimonialsService.getTestimonials(page, pageSize, false)
  );

  const toggleActiveMutation = useApiMutation(
    ({ id, isActive }: { id: string; isActive: boolean }) =>
      testimonialsService.updateTestimonial(id, { isActive }),
    {
      invalidateQueries: [['testimonials']],
      onSuccess: () => {
        toast.success('Testimonial updated successfully');
      },
      onError: err => {
        toast.error('Failed to update testimonial', err.message);
      },
    }
  );

  const deleteMutation = useApiMutation((id: string) => testimonialsService.deleteTestimonial(id), {
    invalidateQueries: [['testimonials']],
    onSuccess: () => {
      toast.success('Testimonial deleted successfully');
    },
    onError: err => {
      toast.error('Failed to delete testimonial', err.message);
    },
  });

  const handleDelete = async (testimonial: Testimonial) => {
    const confirmed = await confirm({
      title: 'Delete Testimonial',
      description: `Permanently delete the testimonial from ${testimonial.authorName}? This cannot be undone.`,
      variant: 'destructive',
      confirmText: 'Delete',
    });

    if (confirmed) {
      deleteMutation.mutate(testimonial.id);
    }
  };

  const columns: ColumnDef<Testimonial>[] = [
    {
      accessorKey: 'authorName',
      header: 'Author',
    },
    {
      accessorKey: 'content',
      header: 'Content',
    },
    {
      accessorKey: 'childName',
      header: 'Child',
      cell: ({ row }) => row.original.childName || '—',
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => <span>{row.original.rating ?? 5}/5</span>,
    },
    {
      accessorKey: 'order',
      header: 'Order',
    },
    {
      accessorKey: 'isActive',
      header: 'Active',
      cell: ({ row }) => {
        const testimonial = row.original;
        return (
          <Switch
            checked={testimonial.isActive ?? true}
            onCheckedChange={checked =>
              toggleActiveMutation.mutate({ id: testimonial.id, isActive: checked })
            }
          />
        );
      },
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
        const testimonial = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedTestimonial(testimonial);
                openModal(testimonial.id, 'edit');
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(testimonial)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--gf-cream)] gf-scope pb-8 pt-5 sm:px-6 sm:pt-5">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="text-start space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Testimonials</h1>
          <p className="text-xs sm:text-sm text-[var(--fg-2)] font-semibold mt-0.5">
            Manage customer testimonials displayed on the website
          </p>
        </div>

      <div className="space-y-4">
        <div className="flex items-center justify-end">
           <button 
            onClick={() => openModal(null, 'create')}
            className="gf-btn-pop relative px-5 py-2 mb-10" 
            style={{ 
              marginTop: 36, 
              background: "var(--fg-2)", 
              color: "white", 
              boxShadow: "0 6px 0 var(--gf-green-deep)", 
              fontSize: 16, 
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </button>
        </div>

        {error ? (
          <ErrorState title="Failed to load testimonials" onRetry={() => refetch()} />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={data?.data || []}
              isLoading={isLoading}
              emptyMessage="No testimonials found"
            />
            {data && (
              <Pagination data={data} onPageChange={setPage} onPageSizeChange={setPageSize} />
            )}
          </>
        )}
      </div>

      <CreateTestimonialDialog open={createDialogOpen} onOpenChange={closeModal} />

      {(selectedTestimonial || entityId) && (
        <EditTestimonialDialog
          open={editDialogOpen}
          onOpenChange={closeModal}
          testimonial={selectedTestimonial || undefined}
        />
      )}

      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={open => {
          if (!open) confirmState.onCancel();
        }}
        title={confirmState.options?.title || ''}
        description={confirmState.options?.description || ''}
        confirmText={confirmState.options?.confirmText}
        cancelText={confirmState.options?.cancelText}
        variant={confirmState.options?.variant}
        onConfirm={confirmState.onConfirm}
      />
      </div>
    </div>
  );
}
