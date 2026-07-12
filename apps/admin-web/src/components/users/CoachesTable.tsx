import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useApiQuery, useApiMutation } from '@/hooks';
import { usersService } from '@/services/users.service';
import { EmploymentType, User, UserRole, UserStatus } from '@grow-fitness/shared-types';
import { DataTable } from '@/components/common/DataTable';
import { Pagination } from '@/components/common/Pagination';
import { ClearFiltersButton } from '@/components/common/ClearFiltersButton';
import { SearchInput } from '@/components/common/SearchInput';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import { useToast } from '@/hooks/useToast';
import { formatDate, formatEmploymentType } from '@/lib/formatters';
import { StatusBadge } from '@/components/common/StatusBadge';
import { CreateCoachDialog } from './CreateCoachDialog';
import { EditUserDialog } from './EditUserDialog';
import { UserDetailsDialog } from './UserDetailsDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useConfirm } from '@/hooks/useConfirm';
import { useModalParams } from '@/hooks/useModalParams';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function CoachColorSwatch({ color }: { color?: string }) {
  if (!color) {
    return <span className="text-muted-foreground">N/A</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="h-5 w-10 rounded-md border border-border shadow-sm"
        style={{ backgroundColor: color }}
        title={`Assigned Color: ${color}`}
      />
      <span className="font-mono text-xs uppercase text-muted-foreground">{color}</span>
    </div>
  );
}

export function CoachesTable() {
  const { user: currentUser } = useAuth();
  const { page, pageSize, setPage, setPageSize } = usePagination();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState<EmploymentType | 'ALL'>('ALL');
  const [searchInputKey, setSearchInputKey] = useState(0);

  const hasActiveFilters =
    Boolean(search) || statusFilter !== 'ALL' || employmentTypeFilter !== 'ALL';

  const clearAllFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setEmploymentTypeFilter('ALL');
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
  }, [search, statusFilter, employmentTypeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync selectedUser with URL params
  useEffect(() => {
    if (entityId && modal) {
      // Fetch user if we have ID in URL but no selectedUser
      if (!selectedUser || selectedUser.id !== entityId) {
        usersService
          .getCoachById(entityId)
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
      'coaches',
      page.toString(),
      pageSize.toString(),
      search,
      statusFilter,
      employmentTypeFilter,
    ],
    () =>
      usersService.getCoaches(
        page,
        pageSize,
        search || undefined,
        statusFilter === 'ALL' ? undefined : statusFilter,
        employmentTypeFilter === 'ALL' ? undefined : employmentTypeFilter
      )
  );

  const deleteMutation = useApiMutation((id: string) => usersService.deleteCoach(id), {
    invalidateQueries: [['users', 'coaches'], ['sessions']],
    onSuccess: () => {
      toast.success('Coach deleted successfully');
    },
    onError: error => {
      toast.error('Failed to delete coach', error.message);
    },
  });

  const handleDelete = async (user: User) => {
    const confirmed = await confirm({
      title: 'Delete Coach',
      description: `Permanently delete ${user.coachProfile?.name || user.email} and remove all coaching sessions they own from the system? This cannot be undone.`,
      variant: 'destructive',
      confirmText: 'Delete',
    });

    if (confirmed) {
      deleteMutation.mutate(user.id);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'coachProfile.name',
      header: 'Name',
      cell: ({ row }) => row.original.coachProfile?.name || 'N/A',
    },
    {
      accessorKey: 'coachProfile.assignedColor',
      header: 'Color',
      cell: ({ row }) => <CoachColorSwatch color={row.original.coachProfile?.assignedColor} />,
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
      accessorKey: 'coachProfile.employmentType',
      header: 'Employment Type',
      cell: ({ row }) => formatEmploymentType(row.original.coachProfile?.employmentType),
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
      cell: ({ row }) => {
        const user = row.original;
        const isSelf = currentUser?.id === user.id;
        const isCoach = currentUser?.role === UserRole.COACH;

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
              disabled={isSelf && isCoach}
              onClick={() => {
                setSelectedUser(user);
                openModal(user.id, 'edit');
              }}
              title={isSelf && isCoach ? 'You cannot edit your own profile here' : 'Edit coach'}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={isSelf && isCoach}
              onClick={() => handleDelete(user)}
              title={isSelf && isCoach ? 'You cannot delete your own profile' : 'Delete coach'}
            >
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
            key={`coach-search-${searchInputKey}`}
            placeholder="Search coaches..."
            onSearch={setSearch}
            className="max-w-sm"
          />
          <Select
            value={statusFilter}
            onValueChange={value => setStatusFilter(value as UserStatus | 'ALL')}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
              <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={employmentTypeFilter}
            onValueChange={value => setEmploymentTypeFilter(value as EmploymentType | 'ALL')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Employment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Employment</SelectItem>
              <SelectItem value={EmploymentType.FULL_TIME}>Full Time</SelectItem>
              <SelectItem value={EmploymentType.PART_TIME}>Part Time</SelectItem>
              <SelectItem value={EmploymentType.CONTRACT}>Contract</SelectItem>
              <SelectItem value={EmploymentType.VOLUNTEER}>Volunteer</SelectItem>
              <SelectItem value={EmploymentType.OTHER}>Other</SelectItem>
            </SelectContent>
          </Select>
          <ClearFiltersButton onClear={clearAllFilters} disabled={!hasActiveFilters} />
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => openModal(null, 'create')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Coach
          </Button>
        </div>
      </div>

      {error ? (
        <div>Error loading coaches</div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data?.data || []}
            isLoading={isLoading}
            emptyMessage="No coaches found"
          />
          {data && <Pagination data={data} onPageChange={setPage} onPageSizeChange={setPageSize} />}
        </>
      )}

      <CreateCoachDialog open={createDialogOpen} onOpenChange={closeModal} />

      {editDialogOpen && selectedUser && (
        <EditUserDialog
          open={editDialogOpen}
          onOpenChange={closeModal}
          user={selectedUser}
          userType="coach"
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
