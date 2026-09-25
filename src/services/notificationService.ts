import * as Notifications from 'expo-notifications';
import { verseOfDayService } from './verseOfDayService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  },

  async scheduleDailyVerseNotification(hour = 8, minute = 0, language = 'fr'): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    const vod = await verseOfDayService.getTodayVerse('lsg', language);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Verset du Jour 📖",
        body: vod ? `"${vod.verse.text}" — ${vod.book_name} ${vod.verse.chapter}:${vod.verse.verse}` : "Découvrez votre verset biblique quotidien !",
        data: { type: 'verse_of_day' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  },
};
