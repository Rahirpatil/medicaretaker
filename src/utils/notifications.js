import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const scheduleNotification = async (alarm) => {
  try {
    const { time, repeatDays, medicineName, id } = alarm;
    
    // Parse time (format: "HH:MM")
    const [hours, minutes] = time.split(':').map(Number);
    
    // Create trigger for each repeat day
    const triggers = [];
    
    if (repeatDays && repeatDays.length > 0) {
      // Map day names to weekday numbers (0 = Sunday, 1 = Monday, etc.)
      const dayMap = {
        'Sunday': 0,
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5,
        'Saturday': 6,
      };

      repeatDays.forEach(day => {
        const weekday = dayMap[day];
        if (weekday !== undefined) {
          triggers.push({
            weekday,
            hour: hours,
            minute: minutes,
            repeats: true,
          });
        }
      });
    } else {
      // If no repeat days, schedule for today
      const now = new Date();
      const triggerDate = new Date();
      triggerDate.setHours(hours, minutes, 0, 0);
      
      if (triggerDate <= now) {
        triggerDate.setDate(triggerDate.getDate() + 1);
      }

      triggers.push({
        date: triggerDate,
        repeats: false,
      });
    }

    // Schedule notifications
    const notificationIds = [];
    for (const trigger of triggers) {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Medicine Reminder',
          body: `Time to take ${medicineName}`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { alarmId: id, medicineName },
        },
        trigger,
      });
      notificationIds.push(notificationId);
    }

    return notificationIds;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return [];
  }
};

export const cancelNotification = async (notificationIds) => {
  try {
    if (Array.isArray(notificationIds)) {
      await Promise.all(notificationIds.map(id => Notifications.cancelScheduledNotificationAsync(id)));
    } else {
      await Notifications.cancelScheduledNotificationAsync(notificationIds);
    }
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
};

