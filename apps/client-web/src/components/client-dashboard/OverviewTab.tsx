import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { kidsService } from "@/services/kids.service";

import {
  type Kid,
  type Session,
  SessionStatus,
  UserRole,
} from "@grow-fitness/shared-types";
import SessionDetailsModal from "../common/SessionDetailsModal";
import { StatsGrid } from "../common/StatGrid";
import type { DashboardStats } from "@/types/dashboard";

// Temporary mock data - replace with actual data fetching
const sessions: Session[] = [];

/* ---------- TEMP STATS ---------- */
const stats: DashboardStats = {
  totalChildren: 1,
  todaySessions: 1,
  upcomingSessions: 2,
  weeklyProgress: 75,
  avgProgress: 75,
};

export function OverviewTab() {
  const { user, role } = useAuth();

  const [selectedKidId, setSelectedKidId] = useState<string | null>(null);
  const [kid, setKid] = useState<Kid | null>(null);
  const [isKidLoading, setIsKidLoading] = useState(false);

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  /* ---------- FETCH FIRST KID (PARENT ONLY) ---------- */
  useEffect(() => {
    if (role !== UserRole.PARENT || !user?.id) return;

    const fetchKids = async () => {
      try {
        const res = await kidsService.getKids(1, 1, user.id);
        const firstKid = res.data?.[0];
        if (firstKid) {
          setSelectedKidId(firstKid._id);
        }
      } catch (error) {
        console.error("Failed to fetch kids", error);
      }
    };

    fetchKids();
  }, [role, user?.id]);

  /* ---------- FETCH SELECTED KID ---------- */
  useEffect(() => {
    if (!selectedKidId) return;

    const fetchKid = async () => {
      try {
        setIsKidLoading(true);
        const data = await kidsService.getKidById(selectedKidId);
        setKid(data);
      } catch (error) {
        console.error("Failed to fetch kid", error);
      } finally {
        setIsKidLoading(false);
      }
    };

    fetchKid();
  }, [selectedKidId]);

  /* ---------- SESSION STATUS BADGE ---------- */
  const getStatusBadge = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.CONFIRMED:
        return <Badge className="bg-[#23B685] text-white">Confirmed</Badge>;
      case SessionStatus.SCHEDULED:
        return <Badge variant="outline">Scheduled</Badge>;
      case SessionStatus.COMPLETED:
        return <Badge variant="secondary">Completed</Badge>;
      case SessionStatus.CANCELLED:
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  /* ---------- SESSION ITEM ---------- */
  const SessionItem = ({ session }: { session: Session }) => (
    <div
      onClick={() => setSelectedSession(session)}
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
        session.status === SessionStatus.CONFIRMED
          ? "bg-[#23B685]/5 hover:bg-[#23B685]/10"
          : "border border-gray-200 hover:bg-gray-50"
      }`}
    >
      <div>
        <h3 className="font-semibold text-[#243E36]">{session.type}</h3>
        <p className="text-sm text-gray-600">{session.dateTime.toLocaleString()}</p>
        <p className="text-xs text-gray-500">
          {/* {session.studentsCount}{" "} */}
          {role === UserRole.COACH
            ? "students enrolled"
            : "spots available"}
        </p>
      </div>
      {getStatusBadge(session.status)}
    </div>
  );

  return (
    <>
      <div className="space-y-6 relative z-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ---------- CHILD PROFILE ---------- */}
          <Card className="border-[#23B685]/20">
            <CardHeader>
              <CardTitle className="text-[#243E36] flex items-center">
                <User className="mr-2 h-5 w-5" />
                Child Profile
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-[#23B685]/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-[#23B685]" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#243E36]">
                      {isKidLoading ? "Loading..." : kid?.name ?? "-"}
                    </h3>
                    <p className="text-gray-600">
                      {kid?.birthDate
                        ? `${new Date().getFullYear() -
                            new Date(kid.birthDate).getFullYear()} years old`
                        : "-"}
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-[#23B685]/10 text-[#23B685]"
                    >
                      Active Member
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Current Coach:
                    </span>
                    <span className="text-sm font-medium text-[#243E36]">
                      {/* {kid?.coachId ?? "-"} */}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Program:</span>
                    <span className="text-sm font-medium text-[#243E36]">
                      Kids Fitness Fun
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Member Since:
                    </span>
                    <span className="text-sm font-medium text-[#243E36]">
                      {kid?.createdAt
                        ? new Date(kid.createdAt).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ---------- UPCOMING / TODAY SESSIONS ---------- */}
          <Card className="border-[#23B685]/20">
            <CardHeader>
              <CardTitle className="text-[#243E36] flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                {role === UserRole.COACH
                  ? "Today's Schedule"
                  : "Upcoming Sessions"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 overflow-y-auto max-h-[400px]">
              {sessions.map((session: Session) => (
                <SessionItem key={session._id} session={session} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ---------- STATS ---------- */}
        <StatsGrid
          stats={stats}
          role={role === UserRole.COACH ? UserRole.COACH : UserRole.PARENT}
        />
      </div>

      {/* ---------- SESSION MODAL ---------- */}
      <SessionDetailsModal
        session={selectedSession}
        open={!!selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </>
  );
}
