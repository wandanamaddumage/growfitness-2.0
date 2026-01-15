import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useApiQuery, useApiMutation } from '@/hooks';
import { kidsService } from '@/services/kids.service';
import { Kid } from '@grow-fitness/shared-types';
import { DataTable } from '@/components/common/DataTable';
import { Pagination } from '@/components/common/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Eye, Link2, Unlink } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/formatters';
import { formatSessionType } from '@/lib/formatters';
import { CreateKidDialog } from '@/components/kids/CreateKidDialog';
import { EditKidDialog } from '@/components/kids/EditKidDialog';
import { KidDetailsDialog } from '@/components/kids/KidDetailsDialog';
import { LinkParentDialog } from '@/components/kids/LinkParentDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useConfirm } from '@/hooks/useConfirm';
import { ErrorState } from '@/components/common/ErrorState';

export function KidsPage() {
  const { page, pageSize, setPage, setPageSize } = usePagination();
  const [, setSearch] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const { toast } = useToast();
  const { confirm, confirmState } = useConfirm();

  const { data, isLoading, error } = useApiQuery(
    ['kids', page.toString(), pageSize.toString()],
    () => kidsService.getKids(page, pageSize)
  );

  const deleteMutation = useApiMutation((id: string) => kidsService.unlinkFromParent(id), {
    invalidateQueries: [['kids']],
    onSuccess: () => {
      toast.success('Kid unlinked successfully');
    },
    onError: error => {
      toast.error('Failed to unlink kid', error.message);
    },
  });

  const handleUnlink = async (kid: Kid) => {
    const confirmed = await confirm({
      title: 'Unlink Kid',
      description: `Are you sure you want to unlink ${kid.name} from their parent?`,
      variant: 'destructive',
      confirmText: 'Unlink',
    });

    if (confirmed) {
      deleteMutation.mutate(kid._id);
    }
  };

  const columns: ColumnDef<Kid>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
    },
    {
      accessorKey: 'birthDate',
      header: 'Birth Date',
      cell: ({ row }) => formatDate(row.original.birthDate),
    },
    {
      accessorKey: 'sessionType',
      header: 'Session Type',
      cell: ({ row }) => formatSessionType(row.original.sessionType),
    },
    {
      accessorKey: 'goal',
      header: 'Goal',
      cell: ({ row }) => row.original.goal || 'N/A',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const kid = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedKid(kid);
                setDetailsDialogOpen(true);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedKid(kid);
                setEditDialogOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedKid(kid);
                setLinkDialogOpen(true);
              }}
            >
              <Link2 className="h-4 w-4" />
            </Button>
            {kid.parentId && (
              <Button variant="ghost" size="icon" onClick={() => handleUnlink(kid)}>
                <Unlink className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kids</h1>
        <p className="text-muted-foreground mt-1">Manage kids and their profiles</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SearchInput placeholder="Search kids..." onSearch={setSearch} className="max-w-sm" />
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Kid
          </Button>
        </div>

        {error ? (
          <ErrorState title="Failed to load kids" onRetry={() => window.location.reload()} />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={data?.data || []}
              isLoading={isLoading}
              emptyMessage="No kids found"
            />
            {data && (
              <Pagination data={data} onPageChange={setPage} onPageSizeChange={setPageSize} />
            )}
          </>
        )}
      </div>

      <CreateKidDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

      {selectedKid && (
        <>
          <EditKidDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} kid={selectedKid} />
          <KidDetailsDialog
            open={detailsDialogOpen}
            onOpenChange={setDetailsDialogOpen}
            kid={selectedKid}
          />
          <LinkParentDialog
            open={linkDialogOpen}
            onOpenChange={setLinkDialogOpen}
            kid={selectedKid}
          />
        </>
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
  );
}
