import { format } from 'date-fns';
import type { Session } from '@grow-fitness/shared-types';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { formatSessionType } from '@/lib/formatters';
import { SessionSpecialBadges } from '../common/SessionSpecialBadges';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface SessionsTableProps {
  data: Session[];
  isLoading?: boolean;
  onSessionClick?: (session: Session) => void;
}

const getSessionLabel = (session: Session): string => {
  switch (session.type) {
    case 'INDIVIDUAL':
      return 'Private Session';
    case 'GROUP':
      return 'Group Session';
    default:
      return 'Session';
  }
};

export function SessionsTable({
  data,
  isLoading,
  onSessionClick,
}: SessionsTableProps) {
  const columns: ColumnDef<Session>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div className="flex max-w-[220px] flex-wrap items-center gap-2 sm:max-w-none">
            <span className="min-w-0">
              {session.title?.trim() || getSessionLabel(session)}
            </span>
            <SessionSpecialBadges session={session} className="shrink-0" />
          </div>
        );
      },
    },
    {
      accessorKey: 'dateTime',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.original.dateTime), 'dd MMM yyyy'),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => formatSessionType(row.original.type),
    },
    {
      accessorKey: 'dateTime',
      header: 'Time',
      cell: ({ row }) => {
        const session = row.original;
        return (
          <>
            {format(new Date(session.dateTime), 'hh:mm a')} -{' '}
            {format(
              new Date(
                new Date(session.dateTime).getTime() + session.duration * 60000
              ),
              'hh:mm a'
            )}
          </>
        );
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => row.original.location?.name ?? '-',
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: ({ row }) => `${row.original.duration} min`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div className="flex items-center gap-2">
            {onSessionClick && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSessionClick(session)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="No sessions found"
    />
  );
}
