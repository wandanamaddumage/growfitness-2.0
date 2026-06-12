import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Kid } from '@grow-fitness/shared-types';
import { formatDate, formatSessionType } from '@/lib/formatters';
import { useApiQuery } from '@/hooks/useApiQuery';
import { kidsService } from '@/services/kids.service';
import { useModalParams } from '@/hooks/useModalParams';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Heart,
  Target,
  Activity,
  Cake,
  UserCircle2,
} from 'lucide-react';

interface KidDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kid?: Kid;
}

export function KidDetailsDialog({ open, onOpenChange, kid: kidProp }: KidDetailsDialogProps) {
  const { entityId, closeModal } = useModalParams('kidId');

  const { data: kidFromUrl } = useApiQuery(
    ['kids', entityId || 'no-id'],
    () => {
      if (!entityId) throw new Error('Kid ID is required');
      return kidsService.getKidById(entityId);
    },
    { enabled: open && !kidProp && !!entityId }
  );

  const kidId = kidProp?.id || entityId;
  const { data: kidData, isLoading } = useApiQuery(
    ['kids', kidId || 'no-id'],
    () => {
      if (!kidId) throw new Error('Kid ID is required');
      return kidsService.getKidById(kidId);
    },
    { enabled: open && !!kidId && !!kidProp }
  );

  const kid = kidProp || kidFromUrl;
  const displayKid = (kidData || kid) as Kid;
  const parent = displayKid?.parent;

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) closeModal();
    onOpenChange(newOpen);
  };

  if (!kid) return null;

  const initials = kid.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const calculateAge = (birthDate: Date | string): number => {
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const age = displayKid?.birthDate ? calculateAge(displayKid.birthDate) : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-5 border-b">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20">
              {displayKid.profilePhotoUrl ? (
                <AvatarImage src={displayKid.profilePhotoUrl} alt={displayKid.name} />
              ) : null}
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl font-semibold tracking-tight">
                {displayKid.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="secondary" className="capitalize">{displayKid.gender}</Badge>
                {age !== null && <Badge variant="outline">{age} years old</Badge>}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Cake className="h-3.5 w-3.5" />
                  Born {formatDate(displayKid.birthDate)}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-h-[70vh] overflow-y-auto">
          {/* Sidebar */}
          <aside className="md:col-span-1 bg-muted/30 p-6 space-y-6 border-r">
            {parent && (
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Parent
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">{parent.parentProfile?.name || 'N/A'}</span>
                  </div>
                  {parent.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="truncate">{parent.email}</span>
                    </div>
                  )}
                  {parent.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{parent.phone}</span>
                    </div>
                  )}
                  {parent.parentProfile?.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span>{parent.parentProfile.location}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {parent && <Separator />}

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Highlights
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Session</span>
                  <Badge variant="secondary">{formatSessionType(displayKid.sessionType)}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">In Sports</span>
                  <Badge variant={displayKid.currentlyInSports ? 'default' : 'outline'}>
                    {displayKid.currentlyInSports ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {displayKid.medicalConditions && displayKid.medicalConditions.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Medical</span>
                    <Badge variant="outline">{displayKid.medicalConditions.length}</Badge>
                  </div>
                )}
              </div>
            </section>
          </aside>

          {/* Main */}
          <main className="md:col-span-2 p-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                Loading...
              </div>
            ) : (
              <>
                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Overview
                  </h2>
                  <Card>
                    <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      <InfoItem icon={<UserCircle2 className="h-4 w-4" />} label="Name" value={displayKid.name} />
                      <InfoItem icon={<User className="h-4 w-4" />} label="Gender" value={displayKid.gender} className="capitalize" />
                      <InfoItem icon={<Calendar className="h-4 w-4" />} label="Birth Date" value={formatDate(displayKid.birthDate)} />
                      {age !== null && (
                        <InfoItem icon={<Cake className="h-4 w-4" />} label="Age" value={`${age} years old`} />
                      )}
                      <InfoItem icon={<Activity className="h-4 w-4" />} label="Session Type" value={formatSessionType(displayKid.sessionType)} />
                      <InfoItem icon={<Activity className="h-4 w-4" />} label="Currently in Sports" value={displayKid.currentlyInSports ? 'Yes' : 'No'} />
                      {displayKid.goal && (
                        <div className="sm:col-span-2">
                          <InfoItem icon={<Target className="h-4 w-4" />} label="Goal" value={displayKid.goal} />
                        </div>
                      )}
                      {parent && (
                        <InfoItem
                          icon={<User className="h-4 w-4" />}
                          label="Parent Name"
                          value={parent.parentProfile?.name || 'N/A'}
                        />
                      )}
                    </CardContent>
                  </Card>
                </section>

                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Medical Conditions
                  </h2>
                  <Card>
                    <CardContent className="p-5">
                      {displayKid.medicalConditions && displayKid.medicalConditions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {displayKid.medicalConditions.map((condition, index) => (
                            <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No medical conditions reported.</p>
                      )}
                    </CardContent>
                  </Card>
                </section>
              </>
            )}
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <p className={`text-sm font-medium text-foreground ${className ?? ''}`}>{value}</p>
    </div>
  );
}
