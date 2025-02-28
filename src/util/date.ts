import { differenceInDays, addDays } from "date-fns"
import { TZDate } from '@date-fns/tz'

export const createDateWithTimeZone = (year: number, month: number, day: number, hours: number, minutes: number, timezone: string): Date => {
	const targetDate = new TZDate(year, month-1, day, hours, minutes, 0, timezone)
	return new Date(targetDate.getTime())
}

interface GetTimeForReminderConfig {
	currentTime?: number
	startYear: number
	startMonth: number // Calendar Month
	startDay: number
	targetHours: number
	targetMinutes: number
	targetTimezone: string
	intervalInDays: number
}

export const getTimeForReminder = (config: GetTimeForReminderConfig): number => {
	const {
		currentTime = Date.now(),
		startYear,
		startMonth,
		startDay,
		targetHours,
		targetMinutes,
		targetTimezone
	} = config

	const scheduledStart = new TZDate(startYear, startMonth -1, startDay, targetHours, targetMinutes, targetTimezone)
	const todayScheduledDate= new TZDate(currentTime, targetTimezone)
	const daysSince = differenceInDays(todayScheduledDate, scheduledStart)

	const numEvents = Math.floor((daysSince) / config.intervalInDays);
	const daysSinceStartForLastEvent = (numEvents) * config.intervalInDays

	const daysTillNextNotificationFromStart = numEvents == 0 ? 0 : daysSinceStartForLastEvent + config.intervalInDays

	const nextNotification = addDays(scheduledStart, daysTillNextNotificationFromStart).getTime()

	if (nextNotification < scheduledStart.getTime())
	{
		return scheduledStart.getTime()
	}
	
	if (nextNotification <= currentTime)
	{
		return addDays(nextNotification, config.intervalInDays).getTime();
	}
	
	return nextNotification
}
