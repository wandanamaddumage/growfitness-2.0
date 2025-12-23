import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Baby, Calendar, FileText } from 'lucide-react';
import { DashboardStats } from '@/services/dashboard.service';

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  // Handle field name variations from API
  const freeSessionRequests = stats.freeSessionRequests ?? stats.freeSessionRequestsCount ?? 0;
  const rescheduleRequests = stats.rescheduleRequests ?? stats.rescheduleRequestsCount ?? 0;

  const cards = [
    {
      title: 'Total Parents',
      value: stats.totalParents ?? 0,
      icon: Users,
      description: 'Registered parents',
    },
    {
      title: 'Total Coaches',
      value: stats.totalCoaches ?? 0,
      icon: Users,
      description: 'Active coaches',
    },
    {
      title: 'Total Kids',
      value: stats.totalKids ?? 0,
      icon: Baby,
      description: 'Registered kids',
    },
    {
      title: "Today's Sessions",
      value: stats.todaysSessions ?? 0,
      icon: Calendar,
      description: 'Sessions scheduled today',
    },
    {
      title: 'Free Session Requests',
      value: freeSessionRequests,
      icon: FileText,
      description: 'Pending requests',
    },
    {
      title: 'Reschedule Requests',
      value: rescheduleRequests,
      icon: FileText,
      description: 'Pending approvals',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value ?? '0'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
