import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Alarm } from '../types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  }

  static async scheduleAlarmNotification(alarm: Alarm): Promise<string | null> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.warn('Notification permissions not granted');
      return null;
    }

    // Cancel existing notification if any
    if (alarm.id) {
      await this.cancelAlarmNotification(alarm.id);
    }

    const [hours, minutes] = alarm.time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const trigger = scheduledTime;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ 闹钟',
        body: alarm.label || '该起床了！',
        sound: alarm.sound || 'default',
        vibrate: alarm.vibrate ? [0, 250, 250, 250] : undefined,
        priority: Notifications.AndroidNotificationPriority.MAX,
        data: { alarmId: alarm.id }
      },
      trigger
    });

    console.log(`Scheduled alarm notification: ${notificationId}`);
    return notificationId;
  }

  static async cancelAlarmNotification(alarmId: string): Promise<void> {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const notification = scheduledNotifications.find(
      (n) => n.content.data?.alarmId === alarmId
    );

    if (notification) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      console.log(`Cancelled alarm notification for: ${alarmId}`);
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Cancelled all notifications');
  }

  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  static addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
  }

  static addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }
}
