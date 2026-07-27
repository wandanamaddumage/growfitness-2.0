import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApiQuery } from '@/hooks/useApiQuery';
import { dashboardService } from '@/services/dashboard.service';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { formatRelativeTime } from '@/lib/formatters';
import { Activity } from 'lucide-react';
import { AuditLog } from '@grow-fitness/shared-types';

export function RecentActivity() {
  const { data, isLoading, error } = useApiQuery(['dashboard', 'activity-logs'], () =>
    dashboardService.getActivityLogs(1, 5)
  );

  if (isLoading) {
    return (
      <Card className="border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-paper)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[var(--gf-green-50)]/40 border-b border-[var(--line)]">
          <CardTitle className="text-lg font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-paper)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[var(--gf-green-50)]/40 border-b border-[var(--line)]">
          <CardTitle className="text-lg font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState title="Failed to load activity" />
        </CardContent>
      </Card>
    );
  }

  const logs = data?.data || [];

  return (
    <Card className="border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-paper)] rounded-2xl overflow-hidden">
      <CardHeader className="bg-[var(--gf-green-50)]/40 border-b border-[var(--line)]">
        <CardTitle className="text-lg font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No recent activity"
            description="Activity logs will appear here."
          />
        ) : (
          <div className="space-y-3">
            {logs.map((log: AuditLog) => (
              <div key={log.id} className="flex items-start space-x-3 p-2 rounded-xl hover:bg-[var(--gf-green-50)]/40 transition-colors">
                <div className="mt-1">
                  <div className="h-2 w-2 rounded-full bg-[var(--gf-green)]" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-extrabold text-[var(--gf-green-deep)]">{log.action}</p>
                  <p className="text-xs text-[var(--fg-2)] font-semibold">
                    {log.entityType} • {formatRelativeTime(log.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
