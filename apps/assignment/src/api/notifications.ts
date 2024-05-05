import type { ServiceResponse } from "./api.types";
import { getApi } from "./axios";
import { generateQueryKey } from "./config";
import type { Employee } from "./employees";

export const NOTIFICATION_TYPE = {
  PROJECT_END: "ProjectEndDateNotification",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export interface Notification {
  id: string;
  notifiableType: "User" | "Project";
  notifiableId: number;
  notificationType: NotificationType;
  readAt: Date;
  notificationData: NotificationData;
}

interface NotificationData {
  projectId: number;
  projectName: string;
  endDate: Date;
  employees: Employee[];
}

export const getNotificationsQuery = () => ({
  queryKey: generateQueryKey("getNotificationsQuery"),
  queryFn: async () => {
    const response =
      await getApi().get<ServiceResponse<Notification[]>>("/notifications");
    return response.data.data;
  },
});
