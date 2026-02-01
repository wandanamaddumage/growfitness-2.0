import { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';

import { DesktopTabs } from '@/components/common/DashboardTabs';
import { MobileTabNav } from '@/components/common/footerTabNavbar';
import { DashboardHeader } from '@/components/common/DashboardHeader';
import { OverviewTab } from '@/components/client-dashboard/OverviewTab';
import { AchievementsTab } from '@/components/client-dashboard/achievements/AchievementsTab';
import ScheduleTab from '@/components/client-dashboard/schedule/ScheduleTab';
import { MessagesTab } from '@/components/client-dashboard/MessagesTab';
import { ProgressTab } from '@/components/client-dashboard/ProgressTab';
import { UserRole, type Kid, type SessionType, type User } from '@grow-fitness/shared-types';


/* ------------------ STATE ------------------ */
export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const [user] = useState<User | null>(null);
  const [kidData] = useState<Kid | null>(null);

  const selectedKidType: SessionType | undefined =
    kidData?.sessionType;

  /* ------------------ SAFE GUARD ------------------ */
  if (!UserRole || !kidData || !selectedKidType) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex items-center justify-center py-20 text-gray-500">
          Loading dashboard...
        </div>
      </div>
    );
  }

  /* ------------------ TABS ------------------ */
  const tabsConfig = [
    { value: 'overview', component: <OverviewTab /> },
    { value: 'achievements', component: <AchievementsTab /> },
    { value: 'schedule', component: <ScheduleTab /> },
    { value: 'progress', component: <ProgressTab /> },
    { value: 'messages', component: <MessagesTab /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <DesktopTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        kidType={selectedKidType}
      >
        {tabsConfig.map(({ value, component }) => (
          <TabsContent
            key={value}
            value={value}
            className="space-y-6 pb-20 md:pb-6"
          >
            {component}
          </TabsContent>
        ))}
      </DesktopTabs>

      <MobileTabNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user!.role}  
        kidType={selectedKidType}
      />
    </div>
  );
}
