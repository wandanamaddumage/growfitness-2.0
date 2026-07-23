import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Location } from '@grow-fitness/shared-types';
import { formatDate } from '@/lib/formatters';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useApiQuery } from '@/hooks/useApiQuery';
import { locationsService } from '@/services/locations.service';
import { useModalParams } from '@/hooks/useModalParams';
import { MapPicker } from '@/components/common/MapPicker';
import { MapPin, Calendar, CheckCircle2, XCircle } from 'lucide-react';

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

  // const initials = location.name
  //   .split(' ')
  //   .map(n => n[0])
  //   .join('')
  //   .toUpperCase()
  //   .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 flex flex-col border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] shadow-2xl rounded-2xl">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="px-6 py-4 border-b-2 border-[var(--gf-green-deep)]/30 bg-[var(--gf-green-50)] flex-shrink-0">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>{location.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={location.isActive ? 'default' : 'secondary'} className="font-extrabold uppercase tracking-wider border-2 border-[var(--gf-green-deep)] text-white">
                    {location.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--fg-2)] font-semibold mt-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-[var(--gf-green-deep)]" />
                  Created {formatDate(location.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-80 border-r border-[var(--gf-green-deep)]/10 bg-[var(--gf-green-50)]/30 p-6 overflow-y-auto min-h-0">
              {/* Profile Section */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold uppercase tracking-wider text-sm text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Location</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 flex-shrink-0 rounded-full bg-[var(--gf-green-deep)]/10 border-2 border-[var(--gf-green-deep)] flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-[var(--gf-green-deep)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{location.name}</p>
                    <p className="text-xs text-[var(--fg-2)] font-semibold mt-0.5">Training Location</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-[var(--gf-green-deep)]/10" />

              {/* Contact Section */}
              <div className="space-y-4 mb-6">
                <h3 className="font-extrabold uppercase tracking-wider text-sm text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Address</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-[var(--gf-green-deep)] mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--fg-2)] font-semibold">{location.address}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-[var(--gf-green-deep)]/10" />

              {/* Highlights Section */}
              <div className="space-y-4">
                <h3 className="font-extrabold uppercase tracking-wider text-sm text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Highlights</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--fg-2)] font-semibold">Status</span>
                    <Badge variant={location.isActive ? 'default' : 'secondary'} className="font-extrabold uppercase tracking-wider border-2 border-[var(--gf-green-deep)] text-white">
                      {location.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--fg-2)] font-semibold">Created</span>
                    <span className="text-[var(--fg-2)] font-semibold">{formatDate(location.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* About Section */}
                <div>
                  <h3 className="font-extrabold uppercase tracking-wider mb-3 text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Location Information</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--fg-2)] mb-1">Name</h4>
                      <p className="text-sm font-semibold">{location.name}</p>
                    </div>
                    {location.geo && (
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--fg-2)] mb-1">
                          Location Map
                        </h4>
                        <div className="h-[200px] w-full rounded-xl border-2 border-[var(--gf-green-deep)]/30 overflow-hidden mt-1">
                          <MapPicker
                            value={location.geo}
                            onChange={() => {}}
                            readOnly={true}
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--fg-2)] mb-1">Address</h4>
                      <p className="text-sm font-semibold">{location.address}</p>
                    </div>
                    {location.placeUrl ? (
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--fg-2)] mb-1">Place link</h4>
                        <a
                          href={location.placeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[var(--gf-green-deep)] font-semibold hover:underline break-all"
                        >
                          {location.placeUrl}
                        </a>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--fg-2)] mb-1">Place link</h4>
                        <p className="text-sm text-[var(--fg-2)] font-semibold">Not set</p>
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--fg-2)] mb-1">Status</h4>
                      <div className="flex items-center gap-2">
                        {location.isActive ? (
                          <CheckCircle2 className="h-4 w-4 text-[var(--gf-green-deep)]" />
                        ) : (
                          <XCircle className="h-4 w-4 text-[var(--fg-2)]" />
                        )}
                        <span className="text-sm font-semibold">{location.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--fg-2)] mb-1">Created At</h4>
                      <p className="text-sm font-semibold">{formatDate(location.createdAt)}</p>
                    </div>
                    {location.updatedAt && (
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--fg-2)] mb-1">
                          Last Updated
                        </h4>
                        <p className="text-sm font-semibold">{formatDate(location.updatedAt)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
