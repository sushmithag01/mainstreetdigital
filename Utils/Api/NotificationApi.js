import { executePost } from "../ServiceMethods";

export const NotificationApi = async (data) => {
  try {
    const UserNotifications = await executePost("/vms/notifications", data);
    const UserNotificationsData = UserNotifications.data
      ? UserNotifications.data
      : {};
    return UserNotificationsData;
  } catch (error) {
    return error;
  }
};