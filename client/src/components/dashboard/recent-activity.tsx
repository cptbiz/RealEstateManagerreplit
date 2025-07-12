import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import type { Activity } from "@shared/schema";

interface RecentActivityProps {
  activities: Activity[];
}

const getActivityColor = (activityType: string) => {
  switch (activityType) {
    case "lead_created":
      return "bg-blue-500";
    case "property_created":
      return "bg-green-500";
    case "appointment_scheduled":
      return "bg-orange-500";
    case "task_created":
      return "bg-purple-500";
    case "document_uploaded":
      return "bg-indigo-500";
    default:
      return "bg-gray-500";
  }
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.activityType)}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(activity.createdAt!), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
