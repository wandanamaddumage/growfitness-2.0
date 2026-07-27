import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { locationsService } from '@/services/locations.service';
import { requestsService } from '@/services/requests.service';
import { useKid } from '@/contexts/kid/useKid';
import { SessionType, type Location } from '@grow-fitness/shared-types';
import { useAuth } from '@/contexts/useAuth';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, MapPin } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function BookSessionModal({ open, onClose }: Props) {
  const { selectedKid } = useKid();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const kidId = selectedKid?.id;
  const parentId = user?.role === 'PARENT' ? user.id : null;

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [preferredDateTime, setPreferredDateTime] = useState('');
  const [loading, setLoading] = useState(false);

  const requestSessionType: SessionType =
    selectedKid?.sessionType === SessionType.GROUP ? SessionType.GROUP : SessionType.INDIVIDUAL;

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const locationRes = await locationsService.getLocations(1, 100);
        setLocations(locationRes.data);
      } catch (error) {
        console.error('Error loading locations', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open]);

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

    if (!selectedLocationId || !preferredDateTime) {
      toast({
        title: 'Missing information',
        description: 'Please select a location and your preferred date and time.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      await requestsService.createExtraSessionRequest({
        kidId,
        sessionType: requestSessionType,
        locationId: selectedLocationId,
        preferredDateTime: new Date(preferredDateTime).toISOString(),
        parentId,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['requests'] }),
        queryClient.invalidateQueries({ queryKey: ['sessions'] }),
        queryClient.invalidateQueries({ queryKey: ['upcoming-sessions'] }),
      ]);

      setSelectedLocationId('');
      setPreferredDateTime('');

      onClose();
    } catch (error: unknown) {
      console.error('Failed to create extra session request', error);

      const message =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message?: string }).message
          : null;
      toast({
        title: 'Request failed',
        description: message || "We couldn't submit your request. Please try again.",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={value => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="max-w-[95vw] sm:max-w-md p-0 bg-[var(--gf-cream)] rounded-2xl border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)]">
        <DialogHeader className="p-4 sm:p-6 bg-[var(--gf-paper)] border-b-2 border-[var(--gf-green-deep)]">
          <DialogTitle className="text-[var(--gf-green-deep)] text-lg sm:text-xl font-extrabold uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
            Request Extra Session
          </DialogTitle>
          <DialogDescription className="text-[var(--gf-green)] text-xs sm:text-sm mt-2">
            A coach will be assigned when your request is reviewed.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div>
            <label className="text-xs sm:text-sm font-extrabold text-[var(--gf-green-deep)] uppercase tracking-wide block mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 inline mr-2" />
              Select Location
            </label>
            <Select
              value={selectedLocationId}
              onValueChange={setSelectedLocationId}
              disabled={loading}
            >
              <SelectTrigger className="w-full h-10 sm:h-11 border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] rounded-xl text-[var(--gf-green-deep)] font-semibold">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--gf-paper)] border-2 border-[var(--gf-green-deep)] rounded-xl">
                {locations.map(location => (
                  <SelectItem key={location.id} value={location.id} className="text-[var(--gf-green-deep)] focus:bg-[var(--gf-green-50)] focus:text-[var(--gf-green-deep)]">
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-extrabold text-[var(--gf-green-deep)] uppercase tracking-wide block mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 inline mr-2" />
              Preferred Date & Time
            </label>
            <Input
              type="datetime-local"
              value={preferredDateTime}
              className="h-10 sm:h-11 border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] rounded-xl text-[var(--gf-green-deep)] font-semibold"
              onChange={e => setPreferredDateTime(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button 
            className="w-full bg-[var(--gf-green)] text-white font-extrabold uppercase tracking-wide border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)] hover:bg-[var(--gf-green)]/90 hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--gf-green-deep)] active:translate-y-[1px] active:shadow-[0_0_0_0_var(--gf-green-deep)] rounded-xl transition-all text-xs sm:text-sm h-10 sm:h-11"
            style={{ fontFamily: 'var(--font-display)' }}
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
