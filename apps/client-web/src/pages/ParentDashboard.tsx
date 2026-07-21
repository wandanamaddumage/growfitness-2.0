import { useState, useEffect, useMemo } from 'react';
import { TabsContent } from '@/components/ui/tabs';

import { DesktopTabs } from '@/components/common/DashboardTabs';
import { MobileTabNav } from '@/components/common/footerTabNavbar';
import { DashboardHeader } from '@/components/common/DashboardHeader';
import { OverviewTab } from '@/components/client-dashboard/OverviewTab';
import { AchievementsTab } from '@/components/client-dashboard/achievements/AchievementsTab';
import ScheduleTab from '@/components/client-dashboard/schedule/ScheduleTab';
import { SessionType, UserRole, type Kid } from '@grow-fitness/shared-types';
import { useKid } from '@/contexts/kid/useKid';

import { kidsService } from '@/services/kids.service';
import { getTabsForUser } from '@/constants/dashboard';
import { KidProfileTab } from '@/components/client-dashboard/KidProfileTab';
import { useAuth } from '@/contexts/useAuth';
import { useSearchParams } from 'react-router-dom';

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchParams, setSearchParams] = useSearchParams();
  const [kidData, setKidData] = useState<Kid | null>(null);
  const [isKidDataLoading, setIsKidDataLoading] = useState(false);

  const { selectedKid, isLoading: isKidLoading } = useKid();
  const { user, isLoading: isAuthLoading } = useAuth();

  const selectedKidId = selectedKid?.id;

  useEffect(() => {
    if (!selectedKidId) return;

    const fetchKidData = async () => {
      setIsKidDataLoading(true);
      try {
        const response = await kidsService.getKidById(selectedKidId);
        setKidData(response);
      } catch {
        setKidData(null);
      } finally {
        setIsKidDataLoading(false);
      }
    };

    fetchKidData();
  }, [selectedKidId]);

  /** ---------------- NORMALIZER ---------------- */
  const normalizeKidType = (
    sessionType?: SessionType
  ): 'GROUP' | 'INDIVIDUAL' | undefined => {
    if (sessionType === SessionType.GROUP) return 'GROUP';

    if (
      sessionType === SessionType.INDIVIDUAL ||
      sessionType === SessionType.BOTH
    ) {
      return 'INDIVIDUAL';
    }

    return undefined;
  };

  /** ---------------- DERIVED VALUE (IMPORTANT FIX) ---------------- */
  const kidTypeForTabs = useMemo(
    () => normalizeKidType(kidData?.sessionType),
    [kidData?.sessionType]
  );

  /** ---------------- AUTO TAB RESOLUTION ---------------- */
  useEffect(() => {
    const resolved = getTabsForUser(
      user?.role as 'COACH' | 'PARENT',
      kidTypeForTabs
    );

    if (resolved.length && !resolved.some(t => t.id === activeTab)) {
      setActiveTab(resolved[0].id);
    }
  }, [user?.role, kidTypeForTabs, activeTab]);

  const isDashboardLoading = isAuthLoading || isKidLoading || isKidDataLoading;

  const showDashboard = Boolean(
    user && user.role === UserRole.PARENT && kidData
  );

  /** ---------------- TABS ---------------- */
  const tabs = useMemo(
    () =>
      showDashboard
        ? getTabsForUser(
            user!.role as 'COACH' | 'PARENT',
            kidTypeForTabs
          )
        : [],
    [showDashboard, user, kidTypeForTabs]
  );

  /** ---------------- URL TAB SYNC ---------------- */
  useEffect(() => {
    const requestedTab = searchParams.get('tab');

    if (
      requestedTab &&
      tabs.some(t => t.id === requestedTab) &&
      requestedTab !== activeTab
    ) {
      setActiveTab(requestedTab);
    }
  }, [searchParams, tabs, activeTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

    setSearchParams(prev => {
      const next = new URLSearchParams(prev);

      if (tabId === 'overview') {
        next.delete('tab');
      } else {
        next.set('tab', tabId);
      }

      return next;
    }, { replace: true });
  };

  return (
    <div className="space-y-6 bg-[var(--gf-cream)] gf-scope pb-12">
      <DashboardHeader />

      {isDashboardLoading ? (
        <div className="bg-[var(--gf-green-50)]/30 flex items-center justify-center py-20 rounded-2xl border border-dashed border-[var(--line)]">
          <p className="text-[var(--gf-green)] font-bold animate-pulse">Loading dashboard...</p>
        </div>
      ) : showDashboard && user && kidData ? (
        <>
          {/* ---------------- DESKTOP ---------------- */}
          <DesktopTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            user={user}
            kidType={kidTypeForTabs as SessionType}
          >
            {tabs.map(tab => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="space-y-6 pb-20 md:pb-6"
              >
                {tab.id === 'overview' && <OverviewTab kid={kidData} />}
                {tab.id === 'schedule' && <ScheduleTab />}
                {tab.id === 'achievements' && <AchievementsTab />}
                {tab.id === 'kidProfile' && <KidProfileTab />}
              </TabsContent>
            ))}
          </DesktopTabs>

          {/* ---------------- MOBILE ---------------- */}
          <MobileTabNav
            activeTab={activeTab}
            onTabChange={handleTabChange}
            user={UserRole.PARENT}
            kidType={kidTypeForTabs as SessionType}
          />
        </>
      ) : (
        <div className="bg-[var(--gf-paper)] border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] rounded-2xl p-8 flex flex-col items-center justify-center gap-4">
          <div className="text-[var(--gf-green-deep)] font-extrabold uppercase text-lg tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
            Please select a child to continue.
          </div>
        </div>
      )}
    </div>
  );
}