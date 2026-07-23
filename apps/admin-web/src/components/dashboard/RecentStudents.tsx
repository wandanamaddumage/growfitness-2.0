import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApiQuery } from '@/hooks/useApiQuery';
import { kidsService } from '@/services/kids.service';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Baby, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Kid } from '@grow-fitness/shared-types';
import { formatSessionType } from '@/lib/formatters';

export function RecentStudents() {
  const navigate = useNavigate();
  const { data, isLoading } = useApiQuery(['kids', 'recent'], () =>
    kidsService.getKids(1, 6)
  );

  const students = data?.data || [];

  return (
    <Card className="border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-paper)] rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-[var(--gf-green-50)]/40 border-b border-[var(--line)]">
        <CardTitle className="text-lg font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Recent Students</CardTitle>
        <button
          onClick={() => navigate('/kids')}
          className="text-xs text-[var(--gf-green)] hover:text-[var(--gf-green-deep)] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-colors"
        >
          View all <ChevronRight className="h-3 w-3" />
        </button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner />
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-[var(--fg-2)]">
            <Baby className="h-8 w-8 mb-2 text-[var(--gf-green)] opacity-40" />
            <p className="text-sm font-semibold">No students yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {students.map((kid: Kid) => (
              <div
                key={kid.id}
                className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-[var(--gf-green-50)]/40 transition-colors"
                onClick={() => navigate(`/kids?kidId=${kid.id}&modal=details`)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[var(--gf-green-50)] border-2 border-[var(--gf-green-deep)] flex items-center justify-center text-[var(--gf-green-deep)] font-bold text-xs">
                    {kid.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[var(--gf-green-deep)] group-hover:text-[var(--gf-green)] transition-colors">
                      {kid.name}
                    </p>
                    <p className="text-xs text-[var(--fg-2)] font-semibold">
                      {kid.gender} • {formatSessionType(kid.sessionType)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[var(--gf-green)] opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
