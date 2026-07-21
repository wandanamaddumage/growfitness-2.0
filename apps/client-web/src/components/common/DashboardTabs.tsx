import type React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTabsForUser } from '@/constants/dashboard';
import { SessionType } from '@grow-fitness/shared-types';

interface DesktopTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: { role: string };
  children: React.ReactNode;
  kidType?: SessionType;
}

export function DesktopTabs({
  activeTab,
  onTabChange,
  user,
  children,
  kidType,
}: DesktopTabsProps) {
  // Convert SessionType enum to string literals
  const kidTypeStr =
    kidType === SessionType.GROUP
      ? 'GROUP'
      : kidType === SessionType.INDIVIDUAL || kidType === SessionType.BOTH
        ? 'INDIVIDUAL'
        : undefined;

  const tabs = getTabsForUser(user.role as 'COACH' | 'PARENT', kidTypeStr);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gf-scope">
      <div>
        <Tabs
          value={activeTab}
          onValueChange={onTabChange}
          className="space-y-6 pt-5"
        >
          <TabsList
            className="
              hidden md:grid overflow-x-auto scrollbar-hide 
              md:overflow-visible md:w-full 
              md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] 
              bg-transparent rounded-none border-0
              px-2 py-2 mr-0 h-auto
              border-2 border-[var(--gf-green-deep)] rounded-2xl shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-paper)]
            "
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex-shrink-0 whitespace-nowrap px-4 py-2.5 mx-1 rounded-xl text-sm uppercase tracking-wider transition-all duration-200 text-[var(--gf-deep-green)] hover:text-[var(--gf-green-deep)] hover:bg-[var(--gf-green-50)] data-[state=active]:!bg-[var(--gf-green)] data-[state=active]:text-white data-[state=active]:shadow-sm border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)]"
              >
                <h2 className="text-lg">{tab.label}</h2>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-4 pb-4">{children}</div>
        </Tabs>
      </div>
    </div>
  );
}