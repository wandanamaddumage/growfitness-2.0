import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User as UserIcon, Calendar, Phone, MapPin, Briefcase } from 'lucide-react';
import { type User } from '@grow-fitness/shared-types';
import { useAuth } from '@/contexts/useAuth';
import { UpcomingSessions } from '../common/UpcomingSessions';
import { usersService } from '@/services/users.service';

function formatDate(value: Date | string | undefined): string {
  if (!value) return '–';
  const d = typeof value === 'string' ? new Date(value) : value;
  return d.toLocaleDateString();
}

export function OverviewTab() {
  const { user } = useAuth();
  const coachId = user?.id;

  const [coach, setCoach] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coachId) return;

    const fetchCoach = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await usersService.getCoachById(coachId);

        setCoach(response);
      } catch (err) {
        console.error('Failed to fetch coach:', err);
        setError('Failed to load coach profile');
      } finally {
        setLoading(false);
      }
    };

    fetchCoach();
  }, [coachId]);

  return (
    <div className="space-y-8 relative z-0">
      <Card className="border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-paper)] bg-[var(--gf-paper)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[var(--gf-green-50)]/40 border-b border-[var(--line)]">
          <CardTitle className="text-[var(--gf-green-deep)] text-lg sm:text-xl flex items-center font-extrabold uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
            <Calendar className="mr-2 h-5 w-5 text-[var(--gf-green)]" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <UpcomingSessions coachId={coachId} />
        </CardContent>
      </Card>

      <Card className="border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-paper)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[var(--gf-green-50)]/40 border-b border-[var(--line)]">
          <CardTitle className="text-[var(--gf-green-deep)] text-lg sm:text-xl flex items-center font-extrabold uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
            <UserIcon className="mr-2 h-5 w-5 text-[var(--gf-green)]" />
            Coach Profile Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <p className="text-sm text-[var(--fg-2)] font-semibold animate-pulse">Loading coach...</p>
          ) : error ? (
            <p className="text-sm text-red-500 font-bold">{error}</p>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-3">
                  {coach?.coachProfile?.photoUrl ? (
                    <img
                      src={coach.coachProfile.photoUrl}
                      alt=""
                      className="h-12 w-12 rounded-full border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)] object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-[var(--gf-green-50)] rounded-full flex items-center justify-center border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)]">
                      <UserIcon className="h-6 w-6 text-[var(--gf-green)]" />
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-extrabold text-[var(--gf-green-deep)]">
                      {coach?.coachProfile?.name ?? '-'}
                    </h3>
                    <p className="text-xs text-[var(--fg-2)] font-semibold mt-0.5">{coach?.email ?? '-'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={
                      coach?.status === 'ACTIVE'
                        ? 'bg-[var(--gf-sun)] text-[var(--gf-green-deep)] border-2 border-[var(--gf-green-deep)] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full'
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }
                  >
                    {coach?.status ?? '-'}
                  </Badge>
                  {coach?.coachProfile?.employmentType && (
                    <Badge variant="secondary" className="bg-[var(--gf-green-50)] text-[var(--gf-green-deep)] border border-[var(--line)] font-bold uppercase text-[10px] tracking-wide rounded-full px-2 py-0.5">
                      <Briefcase className="mr-1 h-3 w-3" />
                      {coach.coachProfile.employmentType.replace(/_/g, ' ')}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-[var(--gf-green-50)]/30 border border-[var(--line)] px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-2)]">Member Since</p>
                  <p className="text-sm font-bold text-[var(--gf-green-deep)]">
                    {coach?.createdAt ? new Date(coach.createdAt).toLocaleDateString() : '-'}
                  </p>
                </div>

                <div className="rounded-xl bg-[var(--gf-green-50)]/30 border border-[var(--line)] px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-2)]">Date of Birth</p>
                  <p className="text-sm font-bold text-[var(--gf-green-deep)]">
                    {formatDate(
                      typeof coach?.coachProfile?.dateOfBirth === 'string'
                        ? coach.coachProfile.dateOfBirth
                        : (coach?.coachProfile?.dateOfBirth as Date | undefined)
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-[var(--gf-green-50)]/30 border border-[var(--line)] px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-2)] flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Phone
                  </p>
                  <p className="text-sm font-bold text-[var(--gf-green-deep)]">{coach?.phone ?? '-'}</p>
                </div>

                <div className="rounded-xl bg-[var(--gf-green-50)]/30 border border-[var(--line)] px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-2)] flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Address
                  </p>
                  <p className="text-sm font-bold text-[var(--gf-green-deep)] truncate">
                    {coach?.coachProfile?.homeAddress ?? '-'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
