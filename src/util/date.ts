import { set, differenceInDays, addDays, parse } from "date-fns"
import { getTimezoneOffset } from "date-fns-tz"

export const dateToIsoDate = (date: Date) => {
	return date.toISOString().split("T")[0]
}

export const createDateWithTimeZone = (year: number, month: number, day: number, hours: number, minutes: number, timezone: string) => {
	const localDate = new Date(year, month - 1, day)
	const isoDate = dateToIsoDate(localDate)

	const targetDate = parse(isoDate, "yyyy-MM-dd", Date.now())

	const timeOffset = getTimezoneOffset(timezone)

	const targetTime = set(targetDate, {
		hours: hours,
		minutes: minutes,
		seconds: 0,
	})

	const timeFound = targetTime.getTime() - timeOffset

	return new Date(timeFound)
}

export const getTimeTillReminder = (now: number, scheduledDate: string /* yyyy-MM-dd */, targetHour: number, targetMinute: number, intervalInDays: number, targetTz: string) => {
	const daysPassed = differenceInDays(now, parse(scheduledDate, "yyyy-MM-dd", now))
	const daysTillNotification = intervalInDays - (daysPassed % (intervalInDays + 1))
	const targetDay = addDays(now, daysTillNotification)
	const targetTime = set(targetDay, {
		hours: targetHour,
		minutes: targetMinute,
		seconds: 0,
	})

	const timeOffset = getTimezoneOffset(targetTz)
	const timeFound = targetTime.getTime() - timeOffset - now
	return timeFound <= 0 ? addDays(timeFound, 1).getTime() : timeFound
}
