import { getTimeForReminder } from "../../util/date"
import { getCollection } from "../mongo"
import { notifyUser } from "../notifications/notifications"
import promclient from "prom-client"

const scheduleReminder = async (uid: string, data: any, userData: any) => {
	const queuedEvents = getCollection("queuedEvents")

	// Early out if the user has no location set
	if (!userData.location) {
		return
	}

	const nextReminderTime = getTimeForReminder({
		currentTime: Date.now(),
		startYear: data.startTime.year,
		startMonth: data.startTime.month,
		startDay: data.startTime.day,
		targetHours: data.time.hour,
		targetMinutes: data.time.minute,
		targetTimezone: userData.location,
		intervalInDays: data.dayInterval,
	})

	// Delete any reminder already registered under this id, this shouldn't be possible though
	await queuedEvents.deleteMany({ uid: uid, reminderId: data._id })
	queuedEvents.insertOne({ uid: uid, event: "scheduledRepeatReminder", due: nextReminderTime, message: data.message, reminderId: data._id })
}

const repeat_reminders_counter = new promclient.Counter({
	name: "apparyllis_api_repeat_reminders_event",
	help: "Counter for repeat reminders processed",
})

export const repeatRemindersEvent = async (uid: string) => {
	const repeatReminders = getCollection("repeatedReminders")
	const foundReminders = await repeatReminders.find({ uid: uid }).toArray()

	const privateUserData = await getCollection("private").findOne({ uid: uid, _id: uid })

	// Remove all scheduled repeat reminders
	const queuedEvents = getCollection("queuedEvents")
	await queuedEvents.deleteMany({ uid: uid, event: "scheduledRepeatReminder" })

	// Re-add all repeat reminders
	foundReminders.forEach((value) => scheduleReminder(uid, value, privateUserData))

	repeat_reminders_counter.inc()
}

const automated_reminders_counter = new promclient.Counter({
	name: "apparyllis_api_automated_reminders_event",
	help: "Counter for automated reminders processed",
})

export const repeatRemindersDueEvent = async (uid: string, event: any) => {
	const privateUserData = await getCollection("private").findOne({ uid: uid, _id: uid })
	if (privateUserData) {
		notifyUser(uid, uid, "Reminder", event.message)
		const repeatReminders = getCollection("repeatedReminders")
		const foundReminder = await repeatReminders.findOne({ uid: uid, _id: event.reminderId })
		if (foundReminder) {
			// We can delete the timer
			scheduleReminder(uid, foundReminder, privateUserData)
		}
	}

	automated_reminders_counter.inc()
}
