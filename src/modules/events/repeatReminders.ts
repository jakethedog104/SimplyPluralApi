import { format, addDays, differenceInDays, differenceInCalendarDays, constructNow, getDate } from "date-fns"
import TZDate from "date-fns-tz"
import { getCollection } from "../mongo";
import { notifyUser } from "../notifications/notifications";
import promclient from "prom-client";

const scheduleReminder = async (uid: string, data: any, userData: any) => {
	const queuedEvents = getCollection("queuedEvents");

	const now = Date.now()

	const hour: number = data.time.hour;
	const minute: number = data.time.minute;

	const timezone: string = userData.location;
	const startDay = TZDate.toDate(new Date(data.startTime.month, data.startTime.day, data.startTime.year, hour, minute) , {timeZone: timezone});
	
	if (startDay.valueOf() > now.valueOf()) {
		queuedEvents.insertOne({
			uid: uid,
			event: "scheduledRepeatReminder",
			due: startDay.valueOf(),
			message: data.message,
			reminderId: data._id,
		});
		return;
	}

	const intervalInDays: number = data.dayInterval;
	const diffInCalendarDays : number = differenceInCalendarDays(now, startDay);
	const daysUntilNextInterval : number = diffInCalendarDays % intervalInDays;

	const today = getDate(now);

	const nextDueDay = addDays(today, daysUntilNextInterval); 
	const nextDueTime = TZDate.toDate(new Date(nextDueDay.getMonth(), nextDueDay.getDay(), nextDueDay.getFullYear(), hour, minute) , {timeZone: timezone});

	// Delete any reminder already registered under this id, this shouldn't be possible though
	queuedEvents.deleteMany({ uid: uid, reminderId: data._id })
	queuedEvents.insertOne({ uid: uid, event: "scheduledRepeatReminder", due: nextDueTime.getUTCMilliseconds(), message: data.message, reminderId: data._id });
};

const repeat_reminders_counter = new promclient.Counter({
	name: "apparyllis_api_repeat_reminders_event",
	help: "Counter for repeat reminders processed",
});

export const repeatRemindersEvent = async (uid: string) => {
	const repeatReminders = getCollection("repeatedReminders");
	const foundReminders = await repeatReminders.find({ uid: uid }).toArray();

	const privateUserData = await getCollection("private").findOne({ uid: uid, _id: uid });

	// Remove all scheduled repeat reminders
	const queuedEvents = getCollection("queuedEvents");
	await queuedEvents.deleteMany({ uid: uid, event: "scheduledRepeatReminder" });

	// Re-add all repeat reminders
	foundReminders.forEach((value) => scheduleReminder(uid, value, privateUserData));

	repeat_reminders_counter.inc()
};

const automated_reminders_counter = new promclient.Counter({
	name: "apparyllis_api_automated_reminders_event",
	help: "Counter for automated reminders processed",
});

export const repeatRemindersDueEvent = async (uid: string, event: any) => {
	const privateUserData = await getCollection("private").findOne({ uid: uid, _id: uid });
	if (privateUserData) {
		notifyUser(uid, uid, "Reminder", event.message);
		const repeatReminders = getCollection("repeatedReminders");
		const foundReminder = await repeatReminders.findOne({ uid: uid, _id: event.reminderId });
		if (foundReminder) {
			// We can delete the timer
			scheduleReminder(uid, foundReminder, privateUserData);
		}
	}

	automated_reminders_counter.inc()
};
