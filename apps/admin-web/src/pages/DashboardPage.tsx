import { useApiQuery } from '@/hooks/useApiQuery';
import { dashboardService } from '@/services/dashboard.service';
import { DashboardStats } from '@/services/dashboard.service';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/ErrorState';
import { DashboardStatsCards } from '@/components/dashboard/DashboardStatsCards';
import { WeeklySessionsChart } from '@/components/dashboard/WeeklySessionsChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { TodaysSessions } from '@/components/dashboard/TodaysSessions';
import { RecentStudents } from '@/components/dashboard/RecentStudents';

export function DashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useApiQuery<DashboardStats>(['dashboard', 'stats'], () => dashboardService.getStats());

  const { data: weeklySessions, isLoading: weeklyLoading } = useApiQuery(
    ['dashboard', 'weekly-sessions'],
    () => dashboardService.getWeeklySessions()
  );

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (statsError) {
    return <ErrorState title="Failed to load dashboard" />;
  }

  return (
    <div className="min-h-screen bg-[var(--gf-cream)] gf-scope pb-8 pt-5 sm:px-6 sm:pt-5">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="text-start space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Dashboard</h1>
          <p className="text-xs sm:text-sm text-[var(--fg-2)] font-semibold mt-0.5">Grow Fitness Platform Overview</p>
        </div>

        {stats && <DashboardStatsCards stats={stats} />}

        <div className="grid gap-6 grid-cols-1">
          <TodaysSessions />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WeeklySessionsChart data={weeklySessions || []} isLoading={weeklyLoading} />
          </div>
          <div className="space-y-6">
            <RecentStudents />
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
