import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStatusDialog } from "@/store/user-status-dialog-store";

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar?: string | null;
  is_active: boolean;
}

interface RecentActivityProps {
  recentUsers: User[] | null;
}

export const RecentActivity = React.memo(
  ({ recentUsers }: RecentActivityProps) => {
    const { setDialog } = useUserStatusDialog();

    if (!recentUsers)
      return (
        <div className="text-muted-foreground">Loading recent users...</div>
      );

    return (
      <Card className="col-span-3" aria-label="Recent Users">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Recent Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg p-3 hover:bg-muted transition"
                role="listitem"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.avatar ?? "/placeholder.svg"}
                      alt={user.full_name ?? "User avatar"}
                    />
                    <AvatarFallback>
                      {user.full_name?.slice(0, 2).toUpperCase() ?? "NA"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      {user.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <span
                  className={`cursor-pointer text-xs px-2 py-1 rounded-md font-medium transition ${
                    user.is_active
                      ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                      : "bg-orange-200 text-orange-900 hover:bg-orange-300"
                  }`}
                  onClick={() => setDialog(user.id, user.is_active)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setDialog(user.id, user.is_active);
                  }}
                  aria-pressed={user.is_active}
                  aria-label={`${user.full_name} is currently ${
                    user.is_active ? "active" : "blocked"
                  }. Click to toggle status.`}
                >
                  {user.is_active ? "Active" : "Blocked"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
);
RecentActivity.displayName = "RecentActivity";
