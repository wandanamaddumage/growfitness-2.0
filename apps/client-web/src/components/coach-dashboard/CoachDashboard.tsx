import { useMemo } from 'react';
import { DesktopTabs } from '../common/DashboardTabs';
import { MobileTabNav } from '../common/footerTabNavbar';
import { useAuth } from '@/contexts/useAuth';
import { TabsContent } from '../ui/tabs';
import { getTabsForUser } from '@/constants/dashboard';
import { UserRole } from '@grow-fitness/shared-types';
import { OverviewTab } from './OverviewTab';
import ScheduleTab from './ScheduleTab';
import { useSearchParams } from 'react-router-dom';

export default function ClientDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isLoading } = useAuth();

  const tabs = getTabsForUser(UserRole.COACH);
  const activeTab = useMemo(() => {
    const requestedTab = searchParams.get('tab');
    return requestedTab && tabs.some(t => t.id === requestedTab) ? requestedTab : 'overview';
  }, [searchParams, tabs]);

  const handleTabChange = (tabId: string) => {
    setSearchParams(
      prev => {
        const next = new URLSearchParams(prev);
        if (tabId === 'overview') {
          next.delete('tab');
        } else {
          next.set('tab', tabId);
        }
        return next;
      },
      { replace: true }
    );
  };

  const tabComponents: Record<string, JSX.Element> = {
    overview: <OverviewTab />,
    schedule: <ScheduleTab />,
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-white">
      <DesktopTabs activeTab={activeTab} onTabChange={handleTabChange} user={user}>
        {tabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-6 pb-20 md:pb-6">
            {tabComponents[tab.id]}
          </TabsContent>
        ))}
      </DesktopTabs>

      <MobileTabNav activeTab={activeTab} onTabChange={handleTabChange} user={UserRole.COACH} />
    </div>
  );
}
