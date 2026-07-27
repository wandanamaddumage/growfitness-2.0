import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Baby, Calendar, FileText } from 'lucide-react';
import { DashboardStats } from '@/services/dashboard.service';
import { useNavigate } from 'react-router-dom';

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  const navigate = useNavigate();
  // Handle field name variations from API
  const freeSessionRequests = stats.freeSessionRequests ?? stats.freeSessionRequestsCount ?? 0;
  const rescheduleRequests = stats.rescheduleRequests ?? stats.rescheduleRequestsCount ?? 0;

  const cards = [
    {
      title: 'Total Parents',
      value: stats.totalParents ?? 0,
      icon: Users,
      description: 'Registered parents',
      onClick: () => navigate('/users?tab=parents'),
    },
    {
      title: 'Total Coaches',
      value: stats.totalCoaches ?? 0,
      icon: Users,
      description: 'Active coaches',
      onClick: () => navigate('/users?tab=coaches'),
    },
    {
      title: 'Total Students',
      value: stats.totalStudents ?? stats.totalKids ?? 0,
      icon: Baby,
      description: 'Registered students',
      onClick: () => navigate('/kids'),
    },
    {
      title: "Today's Sessions",
      value: stats.todaysSessions ?? 0,
      icon: Calendar,
      description: 'Sessions scheduled today',
      onClick: () => navigate('/sessions'),
    },
    {
      title: 'Free Session Requests',
      value: freeSessionRequests,
      icon: FileText,
      description: 'Pending requests',
      onClick: () => navigate('/requests?tab=free-sessions'),
    },
    {
      title: 'Reschedule Requests',
      value: rescheduleRequests,
      icon: FileText,
      description: 'Pending approvals',
      onClick: () => navigate('/requests?tab=reschedule'),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className="border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-paper)] rounded-2xl overflow-hidden cursor-pointer hover:bg-[var(--gf-green-50)]/40 transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_var(--gf-green-deep)] active:translate-y-[1px] active:shadow-[2px_2px_0_0_var(--gf-green-deep)]"
            onClick={card.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[var(--gf-green-50)]/40 border-b border-[var(--line)]">
              <CardTitle className="text-sm font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-[var(--gf-green)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-[var(--gf-green-deep)]">
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value ?? '0'}
              </div>
              <p className="text-xs text-[var(--fg-2)] font-semibold mt-1">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
