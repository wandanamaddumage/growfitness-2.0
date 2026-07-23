import { useState, useEffect } from 'react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { useApiQuery, useApiMutation } from '@/hooks';
import { ParentSortField, SortOrder, usersService } from '@/services/users.service';
import { User } from '@grow-fitness/shared-types';
import { DataTable } from '@/components/common/DataTable';
import { Pagination } from '@/components/common/Pagination';
import { ClearFiltersButton } from '@/components/common/ClearFiltersButton';
import { SearchInput } from '@/components/common/SearchInput';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/formatters';
import { StatusBadge } from '@/components/common/StatusBadge';
import { CreateParentDialog } from './CreateParentDialog';
import { EditUserDialog } from './EditUserDialog';
import { UserDetailsDialog } from './UserDetailsDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useConfirm } from '@/hooks/useConfirm';
import { useModalParams } from '@/hooks/useModalParams';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserStatus } from '@grow-fitness/shared-types';

export function ParentsTable() {
  const { page, pageSize, setPage, setPageSize } = usePagination();
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
  const [searchInputKey, setSearchInputKey] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const sortBy = sorting[0]?.id as ParentSortField | undefined;
  const sortOrder = sorting[0]?.desc ? 'desc' : sorting[0] ? 'asc' : undefined;

  const hasActiveFilters = Boolean(search) || Boolean(locationFilter) || statusFilter !== 'ALL';

  const clearAllFilters = () => {
    setSearch('');
    setLocationFilter('');
    setStatusFilter('ALL');
    setSearchInputKey(key => key + 1);
  };
  const { modal, entityId, isOpen, openModal, closeModal } = useModalParams('userId');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();
  const { confirm, confirmState } = useConfirm();

  // Reset to page 1 when filters change
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [search, locationFilter, statusFilter, sorting]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync selectedUser with URL params
  useEffect(() => {
    if (entityId && modal) {
      // Fetch user if we have ID in URL but no selectedUser
      if (!selectedUser || selectedUser.id !== entityId) {
        usersService
          .getParentById(entityId, true)
          .then(response => {
            setSelectedUser(response);
          })
          .catch(() => {
            // User not found, close modal
            closeModal();
          });
      }
    } else if (!entityId && !modal) {
      setSelectedUser(null);
    }
  }, [entityId, modal, selectedUser, closeModal]);

  const detailsDialogOpen = modal === 'details' && isOpen;
  const editDialogOpen = modal === 'edit' && isOpen;
  const createDialogOpen = modal === 'create' && isOpen;

  const { data, isLoading, error } = useApiQuery(
    [
      'users',
      'parents',
      page.toString(),
      pageSize.toString(),
      search,
      locationFilter,
      statusFilter,
      sortBy || '',
      sortOrder || '',
    ],
    () =>
      usersService.getParents(
        page,
        pageSize,
        search || undefined,
        locationFilter || undefined,
        statusFilter === 'ALL' ? undefined : statusFilter,
        sortBy,
        sortOrder as SortOrder | undefined
      )
  );

  const deleteMutation = useApiMutation((id: string) => usersService.deleteParent(id), {
    invalidateQueries: [['users', 'parents'], ['sessions']],
    onSuccess: () => {
      toast.success('Parent deleted successfully');
    },
    onError: error => {
      toast.error('Failed to delete parent', error.message);
    },
  });

  const handleDelete = async (user: User) => {
    const confirmed = await confirm({
      title: 'Delete Parent',
      description: `Permanently remove ${user.parentProfile?.name || user.email} and their kids from the database? Related invoices will be deleted and kids will be removed from session rosters. This cannot be undone.`,
      variant: 'destructive',
      confirmText: 'Delete',
    });

    if (confirmed) {
      deleteMutation.mutate(user.id);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      id: 'name',
      accessorFn: row => row.parentProfile?.name || '',
      header: 'Name',
      cell: ({ row }) => row.original.parentProfile?.name || 'N/A',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      id: 'location',
      accessorFn: row => row.parentProfile?.location || '',
      header: 'Location',
      cell: ({ row }) => row.original.parentProfile?.location || 'N/A',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedUser(user);
                openModal(user.id, 'details');
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedUser(user);
                openModal(user.id, 'edit');
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(user)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <SearchInput
              key={`parent-search-${searchInputKey}`}
              placeholder="Search parents..."
              onSearch={setSearch}
              className="w-full text-sm sm:w-[200px] border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] text-[var(--gf-green-deep)] font-semibold rounded-xl"
            />
            <Select
              value={statusFilter}
              onValueChange={value => setStatusFilter(value as UserStatus | 'ALL')}
            >
              <SelectTrigger className="w-full text-sm sm:w-[200px] border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] text-[var(--gf-green-deep)] font-semibold rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
              </SelectContent>
            </Select>
            <ClearFiltersButton onClear={clearAllFilters} disabled={!hasActiveFilters} />
          </div>
          <div className="flex items-center gap-2">
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
                Add Parent
            </button>
          </div>
        </div>
      {error ? (
        <div>Error loading parents</div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data?.data || []}
            isLoading={isLoading}
            emptyMessage="No parents found"
            manualSorting
            sorting={sorting}
            onSortingChange={setSorting}
          />
          {data && <Pagination data={data} onPageChange={setPage} onPageSizeChange={setPageSize} />}
        </>
      )}

      <CreateParentDialog open={createDialogOpen} onOpenChange={closeModal} />

      {editDialogOpen && selectedUser && (
        <EditUserDialog
          open={editDialogOpen}
          onOpenChange={closeModal}
          user={selectedUser}
          userType="parent"
        />
      )}

      {detailsDialogOpen && (selectedUser || entityId) && (
        <UserDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={closeModal}
          user={selectedUser || undefined}
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
  );
}
