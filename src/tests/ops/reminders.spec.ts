import * as mocha from "mocha"
import { expect } from "chai"

import { createDateWithTimeZone, dateToIsoDate, getTimeTillReminder } from "../../util/date"
import { fromZonedTime, toZonedTime } from "date-fns-tz"

describe("Validate Reminders Timings", () => {
	const newYorkTimezone = "America/New_York"

	function getNextReminderTime(now: Date, start: Date, hour: number, minutes: number, interval: number, timezone: string) {
		return new Date(now.getTime() + getTimeTillReminder(now.getTime(), dateToIsoDate(start), hour, minutes, interval, timezone))
	}

	describe("Validate Functionality", () => {
		const timezone = "Europe/London"
		const start = createDateWithTimeZone(2025, 1, 1, 0, 0, timezone)

		mocha.test("Validate Single Day Interval", async () => {
			const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
			const expected = createDateWithTimeZone(2025, 1, 2, 10, 0, timezone)

			const nextReminderTime = getNextReminderTime(now, start, 10, 0, 1, timezone)

			expect(nextReminderTime).deep.equal(expected)
			expect(nextReminderTime.getTime()).to.equal(expected.getTime())
		})

		mocha.test("Validate 2 Day Interval", async () => {
			const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
			const expected = createDateWithTimeZone(2025, 1, 3, 10, 0, timezone)

			const nextReminderTime = getNextReminderTime(now, start, 10, 0, 2, timezone)

			expect(nextReminderTime).deep.equal(expected)
			expect(nextReminderTime.getTime()).to.equal(expected.getTime())
		})

		mocha.test("Validate 3 Day Interval", async () => {
			const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
			const expected = createDateWithTimeZone(2025, 1, 4, 10, 0, timezone)

			const nextReminderTime = getNextReminderTime(now, start, 10, 0, 3, timezone)

			expect(nextReminderTime).deep.equal(expected)
			expect(nextReminderTime.getTime()).to.equal(expected.getTime())
		})

		mocha.test("Validate 2 Day Interval after 10 days of start", async () => {
			const now = createDateWithTimeZone(2025, 1, 11, 20, 0, timezone)
			const expected = createDateWithTimeZone(2025, 1, 12, 10, 0, timezone)

			const nextReminderTime = getNextReminderTime(now, start, 10, 0, 2, timezone)

			expect(nextReminderTime).deep.equal(expected)
			expect(nextReminderTime.getTime()).to.equal(expected.getTime())
		})

		mocha.test("Validate 3 Day Interval after 10 days of start", async () => {
			const now = createDateWithTimeZone(2025, 1, 11, 20, 0, timezone)
			const expected = createDateWithTimeZone(2025, 1, 12, 10, 0, timezone)

			const nextReminderTime = getNextReminderTime(now, start, 10, 0, 2, timezone)

			expect(nextReminderTime).deep.equal(expected)
			expect(nextReminderTime.getTime()).to.equal(expected.getTime())
		})
	})

	describe("Validate Germany", () => {
		const timezone = "Europe/Berlin"
		const start = createDateWithTimeZone(2025, 1, 1, 0, 0, timezone)

		describe("Validate ST to DST", () => {
			mocha.test("Test 1:59AM", async () => {
				const now = createDateWithTimeZone(2025, 3, 29, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 30, 1, 59, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 1, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 2:01AM", async () => {
				const now = createDateWithTimeZone(2025, 3, 29, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 30, 2, 1, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 2, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 2:59AM", async () => {
				const now = createDateWithTimeZone(2025, 3, 29, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 30, 2, 59, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 2, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 3:01AM", async () => {
				const now = createDateWithTimeZone(2025, 3, 29, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 30, 3, 1, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 3, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate During DST", () => {
			mocha.test("Test 10:00AM", async () => {
				const now = createDateWithTimeZone(2025, 7, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 7, 2, 10, 0, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 10, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 8:00PM", async () => {
				const now = createDateWithTimeZone(2025, 7, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 7, 2, 20, 0, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 20, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate During ST", () => {
			mocha.test("Test 10:00AM", async () => {
				const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 2, 10, 0, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 10, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 8:00PM", async () => {
				const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 2, 20, 0, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 20, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate DST to ST", () => {
			mocha.test("Test 2:59AM", async () => {
				const now = createDateWithTimeZone(2025, 10, 25, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 10, 26, 2, 59, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 2, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 3:01AM", async () => {
				const now = createDateWithTimeZone(2025, 10, 25, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 10, 26, 3, 1, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 3, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 3:59AM", async () => {
				const now = createDateWithTimeZone(2025, 10, 25, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 10, 26, 3, 59, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 3, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 4:01AM", async () => {
				const now = createDateWithTimeZone(2025, 10, 25, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 10, 26, 4, 1, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 4, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})
	})

	describe("Validate Bucharest", () => {
		const timezone = "Europe/Bucharest"
		const start = createDateWithTimeZone(2025, 1, 1, 0, 0, timezone)

		describe("Validate ST to DST", () => {
			mocha.test("Test 1:59AM", async () => {
				const now = createDateWithTimeZone(2025, 3, 29, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 30, 1, 59, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 1, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 2:01AM", async () => {
				const now = createDateWithTimeZone(2025, 3, 29, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 30, 2, 1, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 2, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 2:59AM", async () => {
				const now = createDateWithTimeZone(2025, 3, 29, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 30, 2, 59, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 2, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 3:01AM", async () => {
				const now = createDateWithTimeZone(2025, 3, 29, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 30, 3, 1, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 3, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate During DST", () => {
			mocha.test("Test 10:00AM", async () => {
				const now = createDateWithTimeZone(2025, 7, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 7, 2, 10, 0, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 10, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 8:00PM", async () => {
				const now = createDateWithTimeZone(2025, 7, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 7, 2, 20, 0, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 20, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate During ST", () => {
			mocha.test("Test 10:00AM", async () => {
				const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 2, 10, 0, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 10, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 8:00PM", async () => {
				const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 2, 20, 0, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 20, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate DST to ST", () => {
			mocha.test("Test 2:59AM", async () => {
				const now = createDateWithTimeZone(2025, 10, 25, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 10, 26, 2, 59, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 2, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 3:01AM", async () => {
				const now = createDateWithTimeZone(2025, 10, 25, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 10, 26, 3, 1, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 3, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 3:59AM", async () => {
				const now = createDateWithTimeZone(2025, 10, 25, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 10, 26, 3, 59, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 3, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 4:01AM", async () => {
				const now = createDateWithTimeZone(2025, 10, 25, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 10, 26, 4, 1, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 4, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})
	})

	describe("Validate New York", () => {
		const timezone = "America/New_York"
		const start = createDateWithTimeZone(2025, 1, 1, 0, 0, timezone)

		describe("Validate ST to DST", () => {
			mocha.test("Test 1:59AM", async () => {
				const now = createDateWithTimeZone(2025, 3, 8, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 9, 1, 59, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 1, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 2:01AM", async () => {
				const now = createDateWithTimeZone(2025, 3, 8, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 9, 2, 1, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 2, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 2:59AM", async () => {
				const now = createDateWithTimeZone(2025, 3, 8, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 9, 2, 59, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 2, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 3:01AM", async () => {
				const now = createDateWithTimeZone(2025, 3, 8, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 9, 3, 1, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 3, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate During DST", () => {
			mocha.test("Test 10:00AM", async () => {
				const now = createDateWithTimeZone(2025, 7, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 7, 2, 10, 0, timezone)

				console.log(now)

				const nextReminderTime = getNextReminderTime(now, start, 10, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 8:00PM", async () => {
				const now = createDateWithTimeZone(2025, 7, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 7, 2, 20, 0, timezone)

				console.log(now)

				const nextReminderTime = getNextReminderTime(now, start, 20, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate During ST", () => {
			mocha.test("Test 10:00AM", async () => {
				const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 2, 10, 0, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 10, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 8:00PM", async () => {
				const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 2, 20, 0, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 20, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate DST to ST", () => {
			mocha.test("Test 0:59AM", async () => {
				const now = createDateWithTimeZone(2025, 11, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 11, 2, 0, 59, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 0, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 1:01AM", async () => {
				const now = createDateWithTimeZone(2025, 11, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 11, 2, 1, 1, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 1, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 1:59AM", async () => {
				const now = createDateWithTimeZone(2025, 11, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 11, 2, 1, 59, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 1, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 2:01AM", async () => {
				const now = createDateWithTimeZone(2025, 11, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 11, 2, 2, 1, timezone)

				const nextReminderTime = getNextReminderTime(now, start, 2, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})
	})
})
