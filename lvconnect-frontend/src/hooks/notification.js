import { fetchNotifications } from "@/services/axios";

export const loadNotifications = async (setUnread, setRead, setNotifications) => {
  try {
    const { unread, read, notification } = await fetchNotifications();
    setUnread(unread);
    setRead(read);
    setNotifications(notification);
  } catch (err) {
    console.error("Notification fetch failed", err);
  }
};
