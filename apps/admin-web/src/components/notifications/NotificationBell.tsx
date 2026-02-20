import { useState } from 'react';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useApiQuery, useApiMutation } from '@/hooks';
import { notificationsService, Notification } from '@/services/notifications.service';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function NotificationBell() {
  const [open, setOpen] = useState(false);

  const { data: unreadData } = useApiQuery(
    ['notifications', 'unread-count'],
    () => notificationsService.getUnreadCount(),
    { refetchInterval: 60_000 }
  );
  const { data: listData } = useApiQuery(
    ['notifications', 'list', open ? 'open' : 'closed'],
    () => notificationsService.getNotifications(1, 20),
    { enabled: open }
  );

  const markReadMutation = useApiMutation(
    (id: string) => notificationsService.markAsRead(id),
    { invalidateQueries: [['notifications', 'unread-count'], ['notifications', 'list']] }
  );
  const markAllReadMutation = useApiMutation(
    () => notificationsService.markAllAsRead(),
    { invalidateQueries: [['notifications', 'unread-count'], ['notifications', 'list']] }
  );

  const unreadCount = unreadData?.count ?? 0;
  const notifications = listData?.data ?? [];

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleMarkAsRead = (n: Notification) => {
    if (!n.read) markReadMutation.mutate(n.id);
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5 border-b">
          <span className="text-sm font-medium">Notifications</span>
          {unreadCount > 0 && (
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => markAllReadMutation.mutate(undefined!)}
            >
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-[320px] overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                className={cn(
                  'w-full text-left px-3 py-2.5 text-sm border-b last:border-b-0 transition-colors hover:bg-accent',
                  !n.read && 'bg-muted/50'
                )}
                onClick={() => handleMarkAsRead(n)}
              >
                <p className="font-medium truncate">{n.title}</p>
                <p className="text-muted-foreground text-xs line-clamp-2 mt-0.5">{n.body}</p>
                <p className="text-muted-foreground text-[10px] mt-1">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
