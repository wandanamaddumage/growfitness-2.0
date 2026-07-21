import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Calendar } from 'lucide-react';
import { differenceInYears } from 'date-fns';
import { type Kid } from '@grow-fitness/shared-types';
import { formatSessionType } from '@/lib/formatters';
import { UpcomingSessions } from '../common/UpcomingSessions';

interface OverviewTabProps {
  kid: Kid | null;
}

function formatGenderLabel(gender: string | undefined) {
  if (!gender) return '-';
  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
}

export function OverviewTab({ kid }: OverviewTabProps) {
  const photoUrl = kid?.profilePhotoUrl?.trim();
  const ageYears =
    kid?.birthDate != null ? differenceInYears(new Date(), new Date(kid.birthDate)) : null;

  return (
    <div className="space-y-8 relative z-0">
      <Card className="border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-paper)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[var(--gf-green-50)]/40 border-b border-[var(--line)]">
          <CardTitle className="text-[var(--gf-green-deep)] text-lg sm:text-xl flex items-center font-extrabold uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
            <Calendar className="mr-2 h-5 w-5" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <UpcomingSessions kidId={kid?.id} parentKidSessionType={kid?.sessionType} />
        </CardContent>
      </Card>

      <Card className="border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-paper)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[var(--gf-green-50)]/40 border-b border-[var(--line)]">
          <CardTitle className="text-[var(--gf-green-deep)] text-lg sm:text-xl flex items-center font-extrabold uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
            <User className="mr-2 h-5 w-5" />
            Child Profile Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar className="h-14 w-14 shrink-0 border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)]">
                <AvatarImage
                  src={photoUrl || undefined}
                  alt={kid?.name ? `${kid.name} profile photo` : 'Child profile'}
                  className="object-cover object-center"
                />
                <AvatarFallback className="bg-[var(--gf-green-50)]">
                  <User className="h-7 w-7 text-[var(--gf-green)]" strokeWidth={1.75} />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-extrabold text-[var(--gf-green-deep)]">
                  {kid?.name ?? '-'}
                </h3>
                <p className="text-sm text-[var(--fg-2)] font-semibold mt-0.5">
                  {ageYears != null && ageYears >= 0 ? `${ageYears} years old` : '-'}
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="w-fit shrink-0 self-start sm:self-center bg-[var(--gf-sun)] text-[var(--gf-green-deep)] border-2 border-[var(--gf-green-deep)] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
            >
              Active Member
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="flex min-h-[5rem] flex-col justify-center gap-1 rounded-xl bg-[var(--gf-green-50)]/30 border border-[var(--line)] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-2)]">Session Type</p>
              <p className="text-sm font-bold text-[var(--gf-green-deep)]">
                {kid?.sessionType ? formatSessionType(kid.sessionType) : '-'}
              </p>
            </div>
            <div className="flex min-h-[5rem] flex-col justify-center gap-1 rounded-xl bg-[var(--gf-green-50)]/30 border border-[var(--line)] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-2)]">Gender</p>
              <p className="text-sm font-bold text-[var(--gf-green-deep)]">{formatGenderLabel(kid?.gender)}</p>
            </div>
            <div className="flex min-h-[5rem] flex-col justify-center gap-1 rounded-xl bg-[var(--gf-green-50)]/30 border border-[var(--line)] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-2)]">Member Since</p>
              <p className="text-sm font-bold text-[var(--gf-green-deep)]">
                {kid?.createdAt ? new Date(kid.createdAt).toLocaleDateString() : '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
