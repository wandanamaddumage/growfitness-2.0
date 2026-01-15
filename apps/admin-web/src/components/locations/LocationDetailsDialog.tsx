import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Location } from '@grow-fitness/shared-types';
import { formatDate } from '@/lib/formatters';
import { Separator } from '@/components/ui/separator';
import { useApiQuery } from '@/hooks/useApiQuery';
import { locationsService } from '@/services/locations.service';
import { useModalParams } from '@/hooks/useModalParams';

interface LocationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location?: Location;
}

export function LocationDetailsDialog({
  open,
  onOpenChange,
  location: locationProp,
}: LocationDetailsDialogProps) {
  const { entityId, closeModal } = useModalParams('locationId');
  
  // Fetch location from URL if prop not provided
  const { data: locationFromUrl } = useApiQuery<Location>(
    ['locations', entityId || 'no-id'],
    () => {
      if (!entityId) {
        throw new Error('Location ID is required');
      }
      return locationsService.getLocationById(entityId);
    },
    {
      enabled: open && !locationProp && !!entityId,
    }
  );

  const location = locationProp || locationFromUrl;

  // Handle close with URL params
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      closeModal();
    }
    onOpenChange(newOpen);
  };

  if (!location) {
    return null;
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Location Details</DialogTitle>
          <DialogDescription>View location information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
            <p className="text-sm font-medium">{location.name}</p>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
            <p className="text-sm">{location.address}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <p className="text-sm">{location.isActive ? 'Active' : 'Inactive'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
            <p className="text-sm">{formatDate(location.createdAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
