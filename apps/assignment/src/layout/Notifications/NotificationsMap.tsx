import { Menu } from "@headlessui/react";

import { NOTIFICATION_TYPE } from "~/api/notifications";
import type { Notification } from "~/api/notifications";
import { ProjectEndNotification } from "./ProjectEndNotification";

export const NotificationsMap = ({
  notifications,
}: {
  notifications: Notification[];
}) => {
  const notificationMapper = {
    [NOTIFICATION_TYPE.PROJECT_END]: ProjectEndNotification,
  };

  return (
    <>
      {notifications.map((notification) => (
        <Menu.Item key={notification.id}>
          {notificationMapper[notification.notificationType]({ notification })}
        </Menu.Item>
      ))}

      {!notifications.length && (
        <p className="px-4 py-6 text-center text-sm text-neutrals-dark-500">
          There are no notifications to display.
        </p>
      )}
    </>
  );
};
