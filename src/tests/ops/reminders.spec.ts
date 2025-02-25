import * as mocha from "mocha"
import { expect } from "chai"

import { getNextReminderTime } from "../../modules/events/repeatReminders"
import { fromZonedTime, toDate, toZonedTime } from "date-fns-tz"

describe("Validate Reminders Timings", () => {
	const timezone = "Europe/Berlin"

	mocha.test("Test one day from DST to ST at 1:59AM", async () => {
		const now = fromZonedTime(new Date(2025, 2, 29, 20, 0), timezone)
		const start = toZonedTime(new Date(2025, 2, 28, 20, 0), timezone)
		const expected = fromZonedTime(new Date(2025, 2, 30, 1, 59), timezone)

		const nextReminderTime = getNextReminderTime(now.getTime(), start, 1, timezone, 1, 59)

		console.log(nextReminderTime)

		expect(nextReminderTime.getTime()).to.equal(expected.getTime())
		expect(nextReminderTime).deep.equal(expected)
	})

	mocha.test("Test one day from DST to ST at 2:01AM", async () => {
		const now = fromZonedTime(new Date(2025, 2, 29, 20, 0), timezone)
		const start = toZonedTime(new Date(2025, 2, 28, 20, 0), timezone)
		const expected = fromZonedTime(new Date(2025, 2, 30, 3, 1), timezone)

		const nextReminderTime = getNextReminderTime(now.getTime(), start, 1, timezone, 2, 1)

		console.log(nextReminderTime)

		expect(nextReminderTime.getTime()).to.equal(expected.getTime())
		expect(nextReminderTime).deep.equal(expected)
	})

	mocha.test("Test one day from DST to ST at 2:59AM", async () => {
		const now = fromZonedTime(new Date(2025, 2, 29, 20, 0), timezone)
		const start = toZonedTime(new Date(2025, 2, 28, 20, 0), timezone)
		const expected = fromZonedTime(new Date(2025, 2, 30, 3, 59), timezone)

		const nextReminderTime = getNextReminderTime(now.getTime(), start, 1, timezone, 2, 59)

		console.log(nextReminderTime)

		expect(nextReminderTime.getTime()).to.equal(expected.getTime())
		expect(nextReminderTime).deep.equal(expected)
	})

	mocha.test("Test one day from DST to ST at 3:01AM", async () => {
		const now = fromZonedTime(new Date(2025, 2, 29, 20, 0), timezone)
		const start = toZonedTime(new Date(2025, 2, 28, 20, 0), timezone)
		const expected = fromZonedTime(new Date(2025, 2, 30, 3, 1), timezone)

		const nextReminderTime = getNextReminderTime(now.getTime(), start, 1, timezone, 3, 1)

		console.log(nextReminderTime)

		expect(nextReminderTime.getTime()).to.equal(expected.getTime())
		expect(nextReminderTime).deep.equal(expected)
	})

	mocha.test("Test one day from DST to ST at 4:01AM", async () => {
		const now = fromZonedTime(new Date(2025, 2, 29, 20, 0), timezone)
		const start = toZonedTime(new Date(2025, 2, 28, 20, 0), timezone)
		const expected = fromZonedTime(new Date(2025, 2, 30, 4, 1), timezone)

		const nextReminderTime = getNextReminderTime(now.getTime(), start, 1, timezone, 4, 1)

		console.log(nextReminderTime)

		expect(nextReminderTime.getTime()).to.equal(expected.getTime())
		expect(nextReminderTime).deep.equal(expected)
	})
})
