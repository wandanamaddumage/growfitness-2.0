import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FreeSessionRequestsTable } from '@/components/requests/FreeSessionRequestsTable';
import { RescheduleRequestsTable } from '@/components/requests/RescheduleRequestsTable';
import { ExtraSessionRequestsTable } from '@/components/requests/ExtraSessionRequestsTable';
import { UserRequestsTable } from '@/components/requests/UserRequestsTable';

export function RequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Requests</h1>
        <p className="text-muted-foreground mt-1">
          Manage free session, reschedule, extra session, and user registration requests
        </p>
      </div>

      <Tabs defaultValue="free-sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="free-sessions">Free Sessions</TabsTrigger>
          <TabsTrigger value="reschedule">Reschedule</TabsTrigger>
          <TabsTrigger value="extra-sessions">Extra Sessions</TabsTrigger>
          <TabsTrigger value="user-requests">User Requests</TabsTrigger>
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
  );
}
