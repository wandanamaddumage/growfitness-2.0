import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usersService } from '@/services/users.service';
import { locationsService } from '@/services/locations.service';
import { requestsService } from '@/services/requests.service';
import { useKid } from '@/contexts/kid/useKid';
import type { User, Location } from '@grow-fitness/shared-types';
import { useAuth } from '@/contexts/useAuth';
import { toast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function BookSessionModal({ open, onClose }: Props) {
  const { selectedKid } = useKid();
  const { user } = useAuth();

  const kidId = selectedKid?.id;
  const parentId = user?.role === 'PARENT' ? user.id : null;

  const [coaches, setCoaches] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [preferredDateTime, setPreferredDateTime] = useState('');
  const [loading, setLoading] = useState(false);

  /* ---------------- Fetch Coaches & Locations ---------------- */
  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [coachRes, locationRes] = await Promise.all([
          usersService.getCoaches(1, 100),
          locationsService.getLocations(1, 100),
        ]);

        setCoaches(coachRes.data);
        setLocations(locationRes.data);
      } catch (error) {
        console.error('Error loading dropdown data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open]);

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    if (!kidId) {
      toast({
        title: 'No kid selected',
      });
      return;
    }

    if (!parentId) {
      toast({
        title: 'Only parents can request extra sessions.',
      });
      return;
    }

    if (!selectedCoachId || !selectedLocationId || !preferredDateTime) {
      toast({
        title: 'Please fill all fields',
      });
      return;
    }

    try {
      setLoading(true);

      await requestsService.createExtraSessionRequest({
        kidId,
        coachId: selectedCoachId,
        sessionType: 'INDIVIDUAL',
        locationId: selectedLocationId,
        preferredDateTime: new Date(preferredDateTime).toISOString(),
        parentId,
      });

      console.log('Extra session request sent successfully');

      // Reset form
      setSelectedCoachId('');
      setSelectedLocationId('');
      setPreferredDateTime('');

      onClose();
    } catch (error: unknown) {
      console.error('Failed to create extra session request', error);

      if (error && typeof error === 'object' && 'message' in error) {
        alert((error as { message?: string }).message || 'Something went wrong');
      } else {
        alert('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Extra Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Coach Dropdown */}
          <div>
            <label className="text-sm font-medium">Select Coach</label>
            <select
              className="w-full border rounded-md p-2 mt-1"
              value={selectedCoachId}
              onChange={(e) => setSelectedCoachId(e.target.value)}
              disabled={loading}
            >
              <option value="">Select a coach</option>
              {coaches.map((coach) => (
                <option key={coach.id} value={coach.id}>
                  {coach.coachProfile?.name || 'Coach'}
                </option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          <div>
            <label className="text-sm font-medium">Select Location</label>
            <select
              className="w-full border rounded-md p-2 mt-1"
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              disabled={loading}
            >
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          {/* DateTime */}
          <div>
            <label className="text-sm font-medium">
              Preferred Date & Time
            </label>
            <Input
              type="datetime-local"
              value={preferredDateTime}
              className="mt-1"
              onChange={(e) => setPreferredDateTime(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Request Extra Session'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
