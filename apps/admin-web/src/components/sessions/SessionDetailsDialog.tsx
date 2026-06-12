import { useState } from 'react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SessionSpecialBadges } from '@/components/sessions/SessionSpecialBadges';
import { Session, SessionType, sessionIsExtraSession } from '@grow-fitness/shared-types';
import { formatDateTime, formatSessionType } from '@/lib/formatters';
import { canAdminRescheduleSession } from '@/components/sessions/RescheduleSessionDialog';
import { useApiQuery } from '@/hooks/useApiQuery';
import { sessionsService } from '@/services/sessions.service';
import { usersService } from '@/services/users.service';
import { locationsService } from '@/services/locations.service';
import { kidsService } from '@/services/kids.service';
import { useModalParams } from '@/hooks/useModalParams';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Target,
  Activity,
  Award,
  Baby,
  ExternalLink,
  CalendarClock,
  Pencil,
  Dumbbell,
  Info,
  AlertCircle,
} from 'lucide-react';

interface SessionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: Session;
  onReschedule?: (session: Session) => void;
  onEdit?: (session: Session) => void;
}

function getName(value: any, fallback = 'N/A'): string {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (value.coachProfile?.name) return value.coachProfile.name;
    if (value.email) return value.email;
    if (value.name) return value.name;
  }
  return fallback;
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 min-w-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-sm font-medium text-foreground break-words">{children}</div>
      </div>
    </div>
  );
}

function QuickStatsCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="border-primary/10">
      <CardContent className="p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground truncate">
          {label}
        </p>
        <p className="mt-1 text-sm sm:text-base font-semibold text-foreground truncate">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function KidCard({ kid }: { kid: any }) {
  return (
       <Card key={kid.id} className="overflow-hidden">
        <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Baby className="h-4 w-4" />
                                  {kid.name}
                                </CardTitle>
                                <Badge variant="outline">{kid.gender}</Badge>
                              </div>
        </CardHeader>
        <CardContent className="space-y-3">
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <p className="text-muted-foreground text-xs">Birth Date</p>
                                  <p className="font-medium">{new Date(kid.birthDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground text-xs">Session Type</p>
                                  <p className="font-medium">{formatSessionType(kid.sessionType)}</p>
                                </div>
                              </div>

                              {kid.goal && (
                                <div className="flex items-start gap-2 pt-2 border-t">
                                  <Target className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Goal</p>
                                    <p className="text-sm">{kid.goal}</p>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-4 pt-2 border-t">
                                <div className="flex items-center gap-2">
                                  <Activity
                                    className={`h-4 w-4 ${
                                      kid.currentlyInSports
                                        ? 'text-green-600'
                                        : 'text-muted-foreground'
                                    }`}
                                  />
                                  <span className="text-xs text-muted-foreground">
                                    {kid.currentlyInSports ? 'In Sports' : 'Not in Sports'}
                                  </span>
                                </div>
                              </div>

                              {kid.medicalConditions && kid.medicalConditions.length > 0 && (
                                <div className="flex items-start gap-2 pt-2 border-t">
                                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Medical Conditions
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                      {kid.medicalConditions.map((condition: string, idx: number) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                          {condition}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {kid.achievements && kid.achievements.length > 0 && (
                                <div className="flex items-start gap-2 pt-2 border-t">
                                  <Award className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Achievements
                                    </p>
                                    <p className="text-xs">
                                      {kid.achievements.length} achievement(s)
                                    </p>
                                  </div>
                                </div>
                              )}
        </CardContent>
      </Card>
  );
}

function EmptyKidsCard() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-8 sm:py-10 text-center">
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-muted">
          <Baby className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
        </div>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">
          No kids enrolled in this session
        </p>
      </CardContent>
    </Card>
  );
}

export function SessionDetailsDialog({
  open,
  onOpenChange,
  session: sessionProp,
  onReschedule,
  onEdit,
}: SessionDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'kids'>('overview');
  const { entityId, closeModal } = useModalParams('sessionId');

  const { data: sessionFromUrl } = useApiQuery(
    ['sessions', entityId || 'no-id'],
    () => {
      if (!entityId) throw new Error('Session ID is required');
      return sessionsService.getSessionById(entityId);
    },
    { enabled: open && !sessionProp && !!entityId },
  );

  const session = sessionProp || sessionFromUrl;
  const sessionId = session?.id || entityId;
  const shouldFetch = open && !!sessionId && !sessionProp;

  const { data: sessionData, isLoading } = useApiQuery(
    ['sessions', sessionId || 'no-id'],
    () => {
      if (!sessionId) throw new Error('Session ID is required');
      return sessionsService.getSessionById(sessionId);
    },
    { enabled: shouldFetch },
  );

  const displaySession = sessionData || session;
  const isGroupSession = displaySession?.type === SessionType.GROUP;

  const coachId =
    typeof displaySession?.coachId === 'string'
      ? displaySession.coachId
      : (displaySession?.coachId as any)?.id;
  const { data: coachData } = useApiQuery(
    ['users', 'coaches', coachId || 'no-id'],
    () => {
      if (!coachId) throw new Error('Coach ID is required');
      return usersService.getCoachById(coachId);
    },
    { enabled: shouldFetch && !!coachId },
  );

  const locationId =
    typeof displaySession?.locationId === 'string'
      ? displaySession.locationId
      : (displaySession?.locationId as any)?.id;
  const { data: locationData } = useApiQuery(
    ['locations', locationId || 'no-id'],
    () => {
      if (!locationId) throw new Error('Location ID is required');
      return locationsService.getLocationById(locationId);
    },
    { enabled: shouldFetch && !!locationId },
  );

  const kidsFromSession = Array.isArray(displaySession?.kids) ? displaySession.kids : [];
  const areKidsPopulated =
    kidsFromSession.length > 0 &&
    typeof kidsFromSession[0] === 'object' &&
    'name' in kidsFromSession[0] &&
    typeof (kidsFromSession[0] as any).name === 'string';

  const kidsIds: string[] = areKidsPopulated
    ? []
    : kidsFromSession
        .map((kid: any) => (typeof kid === 'string' ? kid : kid.id))
        .filter((id): id is string => Boolean(id));

  const individualKidId =
    !isGroupSession && displaySession?.kidId && kidsIds.length === 0 && !areKidsPopulated
      ? typeof displaySession.kidId === 'string'
        ? displaySession.kidId
        : (displaySession.kidId as any)?.id
      : null;

  const shouldFetchKids = open && kidsIds.length > 0 && !areKidsPopulated;
  const shouldFetchIndividualKid =
    open && !isGroupSession && !!individualKidId && kidsIds.length === 0 && !areKidsPopulated;

  const { data: kidsData } = useApiQuery(
    ['kids', 'session', sessionId || 'no-id'],
    async () => {
      if (!sessionId) throw new Error('Session ID is required');
      return Promise.all(kidsIds.map((id) => kidsService.getKidById(id)));
    },
    { enabled: shouldFetchKids && !!sessionId },
  );

  const { data: individualKidData } = useApiQuery(
    ['kids', 'session', sessionId || 'no-id', 'individual'],
    () => {
      if (!individualKidId) throw new Error('Kid ID is required');
      return kidsService.getKidById(individualKidId);
    },
    { enabled: shouldFetchIndividualKid },
  );

  const coachName =
    coachData?.coachProfile?.name ||
    coachData?.email ||
    getName(displaySession?.coachId, 'N/A') ||
    'N/A';
  const locationName = locationData?.name || getName(displaySession?.locationId, 'N/A') || 'N/A';

  const kids = areKidsPopulated
    ? kidsFromSession
    : kidsData || (individualKidData ? [individualKidData] : []);

  const totalKids = kids.length;
  const capacity = displaySession?.capacity || 0;
  const enrolled = totalKids;

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      closeModal();
      setActiveTab('overview');
    }
    onOpenChange(newOpen);
  };

  if (!displaySession) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 sm:rounded-lg">
        {/* Hero header - responsive padding */}
        <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/15 via-primary/5 to-background px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-5 border-b">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
              {isGroupSession ? <Users className="h-5 w-5 sm:h-7 sm:w-7" /> : <Dumbbell className="h-5 w-5 sm:h-7 sm:w-7" />}
            </div>

            <div className="min-w-0 flex-1">
              <DialogHeader className="space-y-1 sm:space-y-1.5">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <DialogTitle className="text-lg sm:text-xl truncate">
                    {displaySession.title || `${formatSessionType(displaySession.type)} Session`}
                  </DialogTitle>
                  <StatusBadge status={displaySession.status as any} />
                </div>
                <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 sm:gap-1.5">
                    <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    {formatDateTime(displaySession.dateTime)}
                  </span>
                  <span className="inline-flex items-center gap-1 sm:gap-1.5">
                    <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    {displaySession.duration} min
                  </span>
                </div>
                <SessionSpecialBadges session={displaySession} />
              </DialogHeader>
            </div>
          </div>

          {(onReschedule || onEdit) && (
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
              {canAdminRescheduleSession(displaySession) && onReschedule && (
                <Button size="sm" variant="outline" onClick={() => onReschedule(displaySession)} className="h-8 sm:h-9 text-xs sm:text-sm">
                  <CalendarClock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                  Reschedule
                </Button>
              )}
              {onEdit && (
                <Button size="sm" variant="outline" onClick={() => onEdit(displaySession)} className="h-8 sm:h-9 text-xs sm:text-sm">
                  <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Tabs - responsive padding */}
        <div className="px-4 sm:px-6 pt-3 sm:pt-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'overview' | 'kids')}>
            <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
              <TabsTrigger value="overview" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="kids" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Kids {totalKids > 0 && `(${totalKids})`}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8 sm:py-12 text-sm text-muted-foreground">
                  Loading session details...
                </div>
              ) : (
                <>
                  {/* Quick stats - responsive grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                    <QuickStatsCard
                      label="Type"
                      value={formatSessionType(displaySession.type)}
                    />
                    <QuickStatsCard
                      label="Duration"
                      value={`${displaySession.duration} min`}
                    />
                    <QuickStatsCard
                      label={isGroupSession ? 'Enrolled' : 'Kids'}
                      value={isGroupSession && capacity > 0 ? `${enrolled} / ${capacity}` : enrolled}
                    />
                    <QuickStatsCard
                      label="Free"
                      value={displaySession.isFreeSession ? 'Yes' : 'No'}
                    />
                  </div>

                  {/* Session info */}
                  <Card>
                    <CardContent className="p-4 sm:p-5">
                      <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-foreground">
                        Session Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        <InfoRow icon={Calendar} label="Date & Time">
                          {formatDateTime(displaySession.dateTime)}
                        </InfoRow>
                        <InfoRow icon={User} label="Coach">
                          <p className="truncate">{coachName}</p>
                        </InfoRow>
                        <InfoRow icon={MapPin} label="Location">
                          <div>
                            <div className="break-words">{locationName}</div>
                            {locationData?.placeUrl && (
                              <a
                                href={locationData.placeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Open map
                              </a>
                            )}
                          </div>
                        </InfoRow>
                        <InfoRow icon={Activity} label="Extra Session">
                          {sessionIsExtraSession(displaySession) ? 'Yes' : 'No'}
                        </InfoRow>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Kids Tab */}
            <TabsContent value="kids" className="mt-4 sm:mt-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8 sm:py-12 text-sm text-muted-foreground">
                  Loading kids details...
                </div>
              ) : totalKids === 0 ? (
                <EmptyKidsCard />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kids.map((kid: any) => (
                    <KidCard key={kid.id} kid={kid} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Bottom padding */}
        <div className="h-3 sm:h-4" />
      </DialogContent>
    </Dialog>
  );
}