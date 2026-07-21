import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { BadgeMap } from './TressureMap';
import { MilestoneProgress } from './MilestoneProgress';


export function AchievementsTab() {
  return (
    <div className="space-y-6 gf-scope">
      <Card className="border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-paper)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[var(--gf-green-50)]/40 border-b border-[var(--line)]">
          <CardTitle className="text-[var(--gf-green-deep)] text-lg sm:text-xl flex items-center font-extrabold uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
            <Trophy className="mr-2 h-5 w-5 text-[var(--gf-green)]" />
            Achievements & Badges
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <BadgeMap/>
          <MilestoneProgress/>
        </CardContent>
      </Card>
    </div>
  );
}