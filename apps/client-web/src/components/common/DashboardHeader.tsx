import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

import { useKid } from '@/contexts/kid/useKid';
import { useAuth } from '@/contexts/useAuth';
import { useParentProfile } from '@/contexts/parent-profile/ParentProfileProvider';
import { useCoachProfile } from '@/contexts/coach-profile/CoachProfileProvider';
import { getFirstName } from '@/utils/formatName';

export function DashboardHeader() {
  const { user, role, isLoading } = useAuth();
  const { kids, selectedKid, setSelectedKid, isLoading: isKidLoading } = useKid();
  const parentProfile = useParentProfile();
  const coachProfile = useCoachProfile();

  /* ---------- ROLE CONFIG ---------- */
  const roleConfig = {
    PARENT: {
      greeting: parentProfile.displayName
        ? `Hi ${getFirstName(parentProfile.displayName)}, Welcome Back! 👋`
        : 'Hi, Welcome Back! 👋',
      subtitle: "Track your kid's fitness journey",
    },
    COACH: {
      greeting: coachProfile.displayName
        ? `Hi Coach ${getFirstName(coachProfile.displayName)} 👋`
        : 'Hi Coach 👋',
      subtitle: 'Ready to inspire young athletes today?',
    },
  };

  /* ---------- LOADING STATE ---------- */
  const config = role ? roleConfig[role] : null;

  if (isLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-gray-500">Loading user...</p>
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 gf-scope">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* ---------- LEFT ---------- */}
        <div className="text-center md:text-left">
          <h1 className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>
            {config?.greeting}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--fg-2)] font-semibold mt-0.5">{config?.subtitle}</p>

          {role === 'PARENT' && selectedKid && (
            <p className="text-[11px] sm:text-xs text-[var(--fg-3)] mt-1 font-medium">
              {isKidLoading ? 'Loading...' : `Selected: ${selectedKid.name}`}
            </p>
          )}
        </div>

        {/* ---------- RIGHT (KID SELECTOR) ---------- */}
        {role === 'PARENT' && (
          <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:flex-row sm:items-center">
            <span className="text-sm font-bold text-[var(--gf-green-deep)]">Kid&apos;s Name:</span>

            {kids.length === 1 ? (
              <span className="px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--gf-paper)] text-sm font-bold text-[var(--gf-green-deep)]">
                {kids[0].name}
              </span>
            ) : (
              <Select
                value={selectedKid?.id ?? ''}
                onValueChange={value => {
                  const kid = kids.find(k => k.id === value);
                  if (kid) setSelectedKid(kid);
                }}
              >
                <SelectTrigger className="w-full text-sm sm:w-[200px] border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] text-[var(--gf-green-deep)] font-semibold rounded-xl">
                  <SelectValue placeholder="Select Kid" />
                </SelectTrigger>
                
                <SelectContent className="bg-[var(--gf-paper)] border border-[var(--line)]">
                  {kids.map(kid => (
                    <SelectItem key={kid.id} value={kid.id} className="text-[var(--gf-green-deep)] focus:bg-[var(--gf-green-50)] focus:text-[var(--gf-green-deep)]">
                      {kid.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
