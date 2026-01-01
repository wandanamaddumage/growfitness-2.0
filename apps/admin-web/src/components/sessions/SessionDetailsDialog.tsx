import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Session, SessionType } from '@grow-fitness/shared-types';
import { formatDateTime, formatSessionType } from '@/lib/formatters';
import { StatusBadge } from '@/components/common/StatusBadge';

interface SessionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session;
}

// Helper to get name from populated object or return ID
function getName(value: any, fallback: string = 'N/A'): string {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    // Coach object
    if (value.coachProfile?.name) return value.coachProfile.name;
    if (value.email) return value.email;
    // Location object
    if (value.name) return value.name;
    // Kid object
    if (value.name) return value.name;
  }
  return fallback;
}

export function SessionDetailsDialog({ open, onOpenChange, session }: SessionDetailsDialogProps) {
  const coachName = getName(session.coachId, 'N/A');
  const locationName = getName(session.locationId, 'N/A');

  // Handle kids array - might be populated objects or IDs
  const kidsList = Array.isArray(session.kids)
    ? session.kids.map((kid: any) => getName(kid, 'Unknown'))
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Session Details</DialogTitle>
          <DialogDescription>View session information</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date & Time</h3>
              <p className="text-sm font-medium">{formatDateTime(session.dateTime)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Coach</h3>
              <p className="text-sm">{coachName}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
              <p className="text-sm">{locationName}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
              <p className="text-sm">{formatSessionType(session.type)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
              <p className="text-sm">{session.duration} minutes</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <StatusBadge status={session.status} />
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Free Session</h3>
              <p className="text-sm">{session.isFreeSession ? 'Yes' : 'No'}</p>
            </div>

            {session.capacity && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Capacity</h3>
                <p className="text-sm">{session.capacity}</p>
              </div>
            )}

            {kidsList.length > 0 && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {session.type === SessionType.INDIVIDUAL ? 'Kid' : 'Kids'}
                  </h3>
                  <div className="space-y-1">
                    {kidsList.map((kidName, index) => (
                      <p key={index} className="text-sm">
                        {kidName}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
