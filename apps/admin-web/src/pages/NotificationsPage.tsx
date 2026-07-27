import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Bell, X, ArrowLeft, Check, CheckCheck, Trash2, Search } from 'lucide-react';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApiQuery, useApiMutation } from '@/hooks';
import { useConfirm } from '@/hooks/useConfirm';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { notificationsService, type Notification } from '@/services/notifications.service';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'unread' | 'read';

// Notification types/entities that relate to a session and should route to the sessions page.
const SESSION_NOTIFICATION_TYPES = new Set([
  'FREE_SESSION_REQUEST',
  'RESCHEDULE_REQUEST',
  'EXTRA_SESSION_REQUEST',
  'FREE_SESSION_SELECTED',
  'RESCHEDULE_APPROVED',
  'RESCHEDULE_DENIED',
  'EXTRA_SESSION_APPROVED',
  'EXTRA_SESSION_DENIED',
  'SESSION_CREATED',
  'SESSION_UPDATED',
  'SESSION_CANCELLED',
  'SESSION_COMPLETED',
  'SESSION_DELETED',
  'UPCOMING_SESSION_REMINDER',
]);

function isSessionNotification(n: Notification): boolean {
  const isSessionEntityType = n.entityType === 'Session' || n.entityType === 'SessionRecurringGroup';
  return SESSION_NOTIFICATION_TYPES.has(n.type) || isSessionEntityType;
}

function groupLabel(date: Date) {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
}

export default function NotificationsPage() {
    const navigate = useNavigate();
    const { confirm, confirmState } = useConfirm();
    const [filter, setFilter] = useState<Filter>('all');
    const [query, setQuery] = useState('');

    const { data: listData, isLoading } = useApiQuery(
        ['notifications', 'list', 'page'],
        () => notificationsService.getNotifications(1, 100),
        { refetchInterval: 30_000 }
    );
    const { data: unreadData } = useApiQuery(
        ['notifications', 'unread-count'],
        () => notificationsService.getUnreadCount(),
        { refetchInterval: 30_000 }
    );

    const notifications: Notification[] = listData?.data ?? [];
    const unreadCount = unreadData?.count ?? 0;

    const markReadMutation = useApiMutation((id: string) => notificationsService.markAsRead(id), {
        invalidateQueries: [['notifications', 'unread-count'], ['notifications', 'list']],
    });
    const markAllReadMutation = useApiMutation(() => notificationsService.markAllAsRead(), {
        invalidateQueries: [['notifications', 'unread-count'], ['notifications', 'list']],
    });
    const deleteOneMutation = useApiMutation((id: string) => notificationsService.deleteOne(id), {
        invalidateQueries: [['notifications', 'unread-count'], ['notifications', 'list']],
    });
    const clearAllMutation = useApiMutation(() => notificationsService.clearAll(), {
        invalidateQueries: [['notifications', 'unread-count'], ['notifications', 'list']],
    });

    const filtered = useMemo(() => {
        let list = notifications;
        if (filter === 'unread') list = list.filter(n => !n.read);
        if (filter === 'read') list = list.filter(n => n.read);
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(
                n => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
            );
        }
        return list;
    }, [notifications, filter, query]);

    const grouped = useMemo(() => {
        const map = new Map<string, Notification[]>();
        for (const n of filtered) {
            const label = groupLabel(new Date(n.createdAt));
            if (!map.has(label)) map.set(label, []);
            map.get(label)!.push(n);
        }
        return Array.from(map.entries());
    }, [filtered]);

    const handleClearAll = async () => {
        const ok = await confirm({
            title: 'Clear all notifications',
            description: 'This permanently removes every notification. Continue?',
            confirmText: 'Clear all',
            cancelText: 'Cancel',
            variant: 'destructive',
        });
        if (ok) clearAllMutation.mutate(undefined!);
    };

    const handleNotificationClick = (n: Notification) => {
        if (!n.read) markReadMutation.mutate(n.id);

        // 1. Requests (Free Session, Reschedule, Extra Session, User Registration Requests)
        if (
            n.type === 'FREE_SESSION_REQUEST' ||
            n.type === 'FREE_SESSION_SELECTED' ||
            n.entityType === 'FreeSessionRequest'
        ) {
            navigate('/requests?tab=free-sessions');
            return;
        }
        if (
            n.type === 'RESCHEDULE_REQUEST' ||
            n.type === 'RESCHEDULE_APPROVED' ||
            n.type === 'RESCHEDULE_DENIED' ||
            n.entityType === 'RescheduleRequest'
        ) {
            navigate('/requests?tab=reschedule');
            return;
        }
        if (
            n.type === 'EXTRA_SESSION_REQUEST' ||
            n.type === 'EXTRA_SESSION_APPROVED' ||
            n.type === 'EXTRA_SESSION_DENIED' ||
            n.entityType === 'ExtraSessionRequest'
        ) {
            navigate('/requests?tab=extra-sessions');
            return;
        }
        if (
            n.type === 'USER_REGISTRATION_REQUEST' ||
            n.type === 'REGISTRATION_APPROVED' ||
            n.type === 'REGISTRATION_REJECTED' ||
            n.entityType === 'UserRegistrationRequest'
        ) {
            navigate('/requests?tab=user-requests');
            return;
        }

        // 2. Invoices
        if (
            n.type === 'INVOICE_CREATED' ||
            n.type === 'INVOICE_STATUS_UPDATED' ||
            n.type === 'INVOICE_PAYMENT_REMINDER' ||
            n.type === 'MONTH_END_PAYMENT_REMINDER' ||
            n.entityType === 'Invoice'
        ) {
            if (n.entityId) {
                navigate(`/invoices?invoiceId=${n.entityId}&modal=details`);
            } else {
                navigate('/invoices');
            }
            return;
        }

        // 3. User profiles (Parents and Coaches)
        if (n.type === 'PROFILE_UPDATED' || n.entityType === 'User') {
            if (n.entityId) {
                const isCoach =
                    n.title?.toLowerCase().includes('coach') || n.body?.toLowerCase().includes('coach');
                const tab = isCoach ? 'coaches' : 'parents';
                navigate(`/users?tab=${tab}&userId=${n.entityId}&modal=details`);
            } else {
                navigate('/users');
            }
            return;
        }

        // 4. Sessions
        if (
            n.type === 'SESSION_CREATED' ||
            n.type === 'SESSION_UPDATED' ||
            n.type === 'SESSION_CANCELLED' ||
            n.type === 'SESSION_COMPLETED' ||
            n.type === 'UPCOMING_SESSION_REMINDER' ||
            n.entityType === 'Session' ||
            n.entityType === 'SessionRecurringGroup'
        ) {
            if (n.type === 'SESSION_DELETED') {
                navigate('/sessions');
            } else if (n.entityId && n.entityType === 'Session') {
                navigate(`/sessions?sessionId=${n.entityId}&modal=details`);
            } else {
                navigate('/sessions');
            }
            return;
        }

        if (n.type === 'INVOICE_CREATION_REMINDER') {
            navigate('/invoices');
            return;
        }

        // Fallback
        if (isSessionNotification(n)) {
            navigate('/sessions');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--gf-cream)] gf-scope">
            <div className="mx-auto max-w-3xl px-4 py-8">
                {/* Header */}
                <div className="mb-6 flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-full hover:bg-[var(--fg-6)] text-[var(--gf-green-deep)]"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Notifications</h1>
                        <p className="text-sm text-[var(--fg-2)] font-semibold">
                            {unreadCount > 0 ? `${unreadCount} unread of ${notifications.length}` : `${notifications.length} total`}
                        </p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--gf-green-deep)] text-white shadow-[2px_2px_0_0_var(--gf-green-deep)]">
                        <Bell className="h-5 w-5" />
                    </div>
                </div>

                {/* Toolbar */}
                <div className="mb-4 rounded-2xl border-2 border-[var(--line)] bg-[var(--gf-paper)] p-3 shadow-[2px_2px_0_0_var(--gf-green-deep)]">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(---deep)]" />
                            <Input
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Search notifications…"
                                className="pl-9 border-2 border-[var(--line)] bg-[var(--gf-green-50)]/40 focus-visible:ring-[var(--gf-green)] focus-visible:border-[var(--gf-green-deep)]"
                            />
                        </div>
                        <div className="flex gap-1 rounded-xl bg-[var(--gf-green-50)]/40 p-1 border-2 border-[var(--line)]">
                            {(['all', 'unread', 'read'] as Filter[]).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={cn(
                                        'px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-lg capitalize transition-all',
                                        filter === f
                                            ? 'bg-[var(--gf-paper)] text-[var(--gf-green-deep)] shadow-sm border-2 border-[var(--gf-green-deep)]'
                                            : 'text-[var(--fg-2)] hover:text-[var(--gf-green-deep)]'
                                    )}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {(unreadCount > 0 || notifications.length > 0) && (
                        <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-[var(--line)]">
                            {unreadCount > 0 && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => markAllReadMutation.mutate(undefined!)}
                                    className="border-2 border-[var(--gf-green-deep)] text-[var(--gf-green-deep)] hover:bg-[var(--gf-green-50)]/40 font-extrabold uppercase tracking-wider"
                                >
                                    <CheckCheck className="h-4 w-4 mr-1.5" />
                                    Mark all read
                                </Button>
                            )}
                            {notifications.length > 0 && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleClearAll}
                                    className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-extrabold uppercase tracking-wider"
                                >
                                    <Trash2 className="h-4 w-4 mr-1.5" />
                                    Clear all
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* List */}
                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 rounded-2xl bg-[var(--gf-green-50)]/60 animate-pulse" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="rounded-3xl border-2 border-dashed border-[var(--line)] bg-[var(--gf-paper)] py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--gf-green-50)] mb-4 border-2 border-[var(--gf-green-deep)]">
                            <Bell className="h-7 w-7 text-[var(--gf-green-deep)]" />
                        </div>
                        <h3 className="text-lg font-extrabold text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>No notifications</h3>
                        <p className="text-sm text-[var(--fg-2)] font-semibold mt-1">
                            {query ? 'Try a different search term.' : "You're all caught up!"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {grouped.map(([label, items]) => (
                            <section key={label}>
                                <h2 className="px-1 mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--fg-2)]">
                                    {label}
                                </h2>
                                <div className="space-y-2">
                                    {items.map(n => (
                                        <article
                                            key={n.id}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => handleNotificationClick(n)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    handleNotificationClick(n);
                                                }
                                            }}
                                            className={cn(
                                                'group relative rounded-2xl border-2 bg-[var(--gf-paper)] p-4 transition-all hover:shadow-md hover:shadow-[var(--gf-green-deep)]/10 cursor-pointer',
                                                !n.read
                                                    ? 'border-[var(--gf-green-deep)] ring-1 ring-[var(--gf-green-50)]'
                                                    : 'border-[var(--line)]'
                                            )}
                                        >
                                            <div className="flex gap-3">
                                                <div
                                                    className={cn(
                                                        'flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border-2',
                                                        !n.read ? 'bg-[var(--gf-green-deep)] text-white border-[var(--gf-green-deep)]' : 'bg-[var(--gf-green-50)] text-[var(--gf-green-deep)] border-[var(--gf-green-deep)]'
                                                    )}
                                                >
                                                    <Bell className="h-4 w-4" />
                                                </div>

                                                <div className="flex-1 min-w-0 pr-8">
                                                    <div className="flex items-start gap-2 flex-wrap">
                                                        <h3
                                                            className={cn(
                                                                'text-sm leading-snug break-words',
                                                                !n.read ? 'font-extrabold text-[var(--gf-green-deep)]' : 'font-semibold text-[var(--fg-2)]'
                                                            )}
                                                        >
                                                            {n.title}
                                                        </h3>
                                                        {!n.read && (
                                                            <span className="inline-flex items-center rounded-full bg-[var(--gf-sun)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--gf-green-deep)] border-2 border-[var(--gf-green-deep)] uppercase tracking-wider">
                                                                NEW
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Full body, no truncation */}
                                                    <p className="text-sm text-[var(--fg-2)] font-semibold mt-1.5 whitespace-pre-wrap break-words leading-relaxed">
                                                        {n.body}
                                                    </p>

                                                    <div className="mt-3 flex items-center gap-3 text-[11px] text-[var(--fg-3)] font-medium">
                                                        <span>{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</span>
                                                        <span>·</span>
                                                        <span>{format(new Date(n.createdAt), 'p')}</span>
                                                    </div>

                                                    {!n.read && (
                                                        <button
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                markReadMutation.mutate(n.id);
                                                            }}
                                                            className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-[var(--gf-green)] hover:text-[var(--gf-green-deep)] uppercase tracking-wider"
                                                        >
                                                            <Check className="h-3.5 w-3.5" />
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    deleteOneMutation.mutate(n.id);
                                                }}
                                                aria-label="Delete notification"
                                                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-[var(--fg-3)] opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={confirmState.open}
                onOpenChange={open => !open && confirmState.onCancel()}
                title={confirmState.options?.title ?? ''}
                description={confirmState.options?.description ?? ''}
                confirmText={confirmState.options?.confirmText}
                cancelText={confirmState.options?.cancelText}
                variant={confirmState.options?.variant}
                onConfirm={confirmState.onConfirm}
            />
        </div>
    );
}
