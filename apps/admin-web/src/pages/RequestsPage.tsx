import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FreeSessionRequestsTable } from '@/components/requests/FreeSessionRequestsTable';
import { RescheduleRequestsTable } from '@/components/requests/RescheduleRequestsTable';
import { ExtraSessionRequestsTable } from '@/components/requests/ExtraSessionRequestsTable';
import { UserRequestsTable } from '@/components/requests/UserRequestsTable';
import { useSearchParams } from 'react-router-dom';

export function RequestsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'free-sessions';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="min-h-screen bg-[var(--gf-cream)] gf-scope pb-8 pt-5 sm:px-6 sm:pt-5">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="text-start space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Requests</h1>
          <p className="text-xs sm:text-sm text-[var(--fg-2)] font-semibold mt-0.5">
            Manage free session, reschedule, extra session, and user registration requests
          </p>
        </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="mb-4 bg-[var(--gf-paper)] rounded-xl p-1 h-auto grid w-full grid-cols-4 sm:max-w-[700px] gap-2">
          <TabsTrigger value="free-sessions" className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[var(--fg-2)] hover:text-[var(--gf-green-deep)] hover:bg-[var(--gf-green-50)]/40 data-[state=active]:!bg-[var(--gf-green-deep)] data-[state=active]:text-white rounded-lg py-1.5 transition-all border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)]">
            Free Sessions
          </TabsTrigger>
          <TabsTrigger value="reschedule" className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[var(--fg-2)] hover:text-[var(--gf-green-deep)] hover:bg-[var(--gf-green-50)]/40 data-[state=active]:!bg-[var(--gf-green-deep)] data-[state=active]:text-white rounded-lg py-1.5 transition-all border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)]">
            Reschedule
          </TabsTrigger>
           <TabsTrigger value="extra-sessions" className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[var(--fg-2)] hover:text-[var(--gf-green-deep)] hover:bg-[var(--gf-green-50)]/40 data-[state=active]:!bg-[var(--gf-green-deep)] data-[state=active]:text-white rounded-lg py-1.5 transition-all border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)]">
            Extra Sessions
          </TabsTrigger>
          <TabsTrigger value="user-requests" className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[var(--fg-2)] hover:text-[var(--gf-green-deep)] hover:bg-[var(--gf-green-50)]/40 data-[state=active]:!bg-[var(--gf-green-deep)] data-[state=active]:text-white rounded-lg py-1.5 transition-all border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)]">
            User Requests
          </TabsTrigger>
        </TabsList>
        <TabsContent value="free-sessions" className="space-y-4">
          <FreeSessionRequestsTable />
        </TabsContent>
        <TabsContent value="reschedule" className="space-y-4">
          <RescheduleRequestsTable />
        </TabsContent>
        <TabsContent value="extra-sessions" className="space-y-4">
          <ExtraSessionRequestsTable />
        </TabsContent>
        <TabsContent value="user-requests" className="space-y-4">
          <UserRequestsTable />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
