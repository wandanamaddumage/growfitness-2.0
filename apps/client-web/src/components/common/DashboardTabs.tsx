import type React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTabsForUser } from '@/constants/dashboard';
import type { UserRole } from '@/services/auth';


interface DesktopTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: UserRole;
  children: React.ReactNode;
  kidType?: 'GROUP' | 'INDIVIDUAL';
}

export function DesktopTabs({
  activeTab,
  onTabChange,
  user,
  children,
  kidType,
}: DesktopTabsProps) {
  const tabs = getTabsForUser(user, kidType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="space-y-6 pt-5"
      >
        <TabsList
          className="
            flex md:grid overflow-x-auto scrollbar-hide 
            md:overflow-visible md:w-full 
            md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] 
            bg-white rounded-lg border border-gray-200
          "
        >
          {tabs.map((tab: { id: string; label: string }) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="
                flex-shrink-0 whitespace-nowrap px-4 py-2 mx-1 
                rounded-lg border border-primary text-sm font-medium
                hover:bg-primary/10 transition-colors
                data-[state=active]:!bg-primary
                data-[state=active]:text-white 
                data-[state=active]:shadow-md
              "
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4">{children}</div>
      </Tabs>
    </div>
  );
}