import { useState, useEffect } from 'react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { useApiQuery, useApiMutation } from '@/hooks';
import {
  LocationSortField,
  LocationStatusFilter,
  SortOrder,
  locationsService,
} from '@/services/locations.service';
import { Location } from '@grow-fitness/shared-types';
import { DataTable } from '@/components/common/DataTable';
import { Pagination } from '@/components/common/Pagination';
import { ClearFiltersButton } from '@/components/common/ClearFiltersButton';
import { SearchInput } from '@/components/common/SearchInput';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Eye, ExternalLink } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/formatters';
import { CreateLocationDialog } from '@/components/locations/CreateLocationDialog';
import { EditLocationDialog } from '@/components/locations/EditLocationDialog';
import { LocationDetailsDialog } from '@/components/locations/LocationDetailsDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useConfirm } from '@/hooks/useConfirm';
import { useModalParams } from '@/hooks/useModalParams';

export function LocationsPage() {
  const { page, pageSize, setPage, setPageSize } = usePagination();
  const { modal, entityId, isOpen, openModal, closeModal } = useModalParams('locationId');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LocationStatusFilter | 'all'>('all');
  const [searchInputKey, setSearchInputKey] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const sortBy = sorting[0]?.id as LocationSortField | undefined;
  const sortOrder = sorting[0]?.desc ? 'desc' : sorting[0] ? 'asc' : undefined;
  const { toast } = useToast();
  const { confirm, confirmState } = useConfirm();
  const hasActiveFilters = Boolean(search || statusFilter !== 'all');

  const clearAllFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setSearchInputKey(key => key + 1);
  };

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [search, statusFilter, sorting]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (entityId && modal) {
      // Fetch location if we have ID in URL but no selectedLocation
      if (!selectedLocation || selectedLocation.id !== entityId) {
        locationsService
          .getLocationById(entityId)
          .then(response => {
            setSelectedLocation(response);
          })
          .catch(() => {
            // Location not found, close modal
            closeModal();
          });
      }
    } else if (!entityId && !modal) {
      setSelectedLocation(null);
    }
  }, [entityId, modal, selectedLocation, closeModal]);

  const detailsDialogOpen = modal === 'details' && isOpen;
  const editDialogOpen = modal === 'edit' && isOpen;
  const createDialogOpen = modal === 'create' && isOpen;

  const { data, isLoading, error } = useApiQuery(
    [
      'locations',
      page.toString(),
      pageSize.toString(),
      search,
      statusFilter,
      sortBy || '',
      sortOrder || '',
    ],
    () =>
      locationsService.getLocations(page, pageSize, {
        search: search || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        sortBy,
        sortOrder: sortOrder as SortOrder | undefined,
      })
  );

  const deleteMutation = useApiMutation((id: string) => locationsService.deleteLocation(id), {
    invalidateQueries: [['locations']],
    onSuccess: () => {
      toast.success('Location deleted successfully');
    },
    onError: error => {
      toast.error('Failed to delete location', error.message);
    },
  });

  const handleDelete = async (location: Location) => {
    const confirmed = await confirm({
      title: 'Delete Location',
      description: `Are you sure you want to delete ${location.name}? This action cannot be undone.`,
      variant: 'destructive',
      confirmText: 'Delete',
    });

    if (confirmed) {
      deleteMutation.mutate(location.id);
    }
  };

  const columns: ColumnDef<Location>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'placeUrl',
      header: 'Place URL',
      cell: ({ row }) => {
        const url = row.original.placeUrl;
        if (!url) return '—';
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1.5 max-w-[200px]"
          >
            <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">View link</span>
          </a>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (row.original.isActive ? 'Active' : 'Inactive'),
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
        const location = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedLocation(location);
                openModal(location.id, 'details');
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedLocation(location);
                openModal(location.id, 'edit');
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(location)}>
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
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Locations</h1>
          <p className="text-xs sm:text-sm text-[var(--fg-2)] font-semibold mt-0.5">Manage training locations</p>
        </div>

      <div className="space-y-4">
       <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            key={`location-search-${searchInputKey}`}
            placeholder="Search locations..."
            onSearch={setSearch}
            className="w-full text-sm sm:w-[200px] border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] text-[var(--gf-green-deep)] font-semibold rounded-xl"
          />
            <Select
              value={statusFilter}
              onValueChange={value => setStatusFilter(value as LocationStatusFilter | 'all')}
            >
              <SelectTrigger className="w-full text-sm sm:w-[200px] border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] text-[var(--gf-green-deep)] font-semibold rounded-xl">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          <ClearFiltersButton onClear={clearAllFilters} disabled={!hasActiveFilters} />
          </div>
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
              Add Location
        </button>
        </div>

        {error ? (
          <div>Error loading locations</div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={data?.data || []}
              isLoading={isLoading}
              emptyMessage="No locations found"
              manualSorting
              sorting={sorting}
              onSortingChange={setSorting}
            />
            {data && (
              <Pagination data={data} onPageChange={setPage} onPageSizeChange={setPageSize} />
            )}
          </>
        )}
      </div>

      <CreateLocationDialog open={createDialogOpen} onOpenChange={closeModal} />

      {(selectedLocation || entityId) && (
        <>
          <EditLocationDialog
            open={editDialogOpen}
            onOpenChange={closeModal}
            location={selectedLocation || undefined}
          />
          <LocationDetailsDialog
            open={detailsDialogOpen}
            onOpenChange={closeModal}
            location={selectedLocation || undefined}
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
    </div>
  );
}
