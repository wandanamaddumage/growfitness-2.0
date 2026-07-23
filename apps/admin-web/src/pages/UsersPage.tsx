import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParentsTable } from '@/components/users/ParentsTable';
import { CoachesTable } from '@/components/users/CoachesTable';
import { useSearchParams } from 'react-router-dom';

export function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'parents';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="min-h-screen bg-[var(--gf-cream)] gf-scope pb-8 pt-5 sm:px-6 sm:pt-5">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="text-start space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Users</h1>
          <p className="text-xs sm:text-sm text-[var(--fg-2)] font-semibold mt-0.5">Manage parents and coaches</p>
        </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="mb-4 bg-[var(--gf-paper)] rounded-xl p-1 h-auto grid w-full grid-cols-2 sm:max-w-[240px] gap-2">
          <TabsTrigger value="parents" className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[var(--fg-2)] hover:text-[var(--gf-green-deep)] hover:bg-[var(--gf-green-50)]/40 data-[state=active]:!bg-[var(--gf-green-deep)] data-[state=active]:text-white rounded-lg py-1.5 transition-all border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)]">
            Parents
          </TabsTrigger>
          <TabsTrigger value="coaches" className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[var(--fg-2)] hover:text-[var(--gf-green-deep)] hover:bg-[var(--gf-green-50)]/40 data-[state=active]:!bg-[var(--gf-green-deep)] data-[state=active]:text-white rounded-lg py-1.5 transition-all border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)]">
            Coaches
          </TabsTrigger>
        </TabsList>
        <TabsContent value="parents" className="space-y-4">
          <ParentsTable />
        </TabsContent>
        <TabsContent value="coaches" className="space-y-4">
          <CoachesTable />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
