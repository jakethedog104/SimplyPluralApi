import * as mocha from "mocha"
import { expect } from "chai"

import { createDateWithTimeZone, getTimeForReminder } from "../../util/date"

describe("Validate Reminders Timings", () => {

	function getNextReminderTime(currentTime: number, targetHours: number, targetMinutes: number, intervalInDays: number, targetTimezone: string) {
		return new Date(getTimeForReminder({
			currentTime,
			startYear: 2025,
			startMonth: 1,
			startDay: 1,
			targetHours,
			targetMinutes,
			targetTimezone,
			intervalInDays
		}))
	}

	describe("Validate Functionality", () => {
		const timezone = "Europe/London"

		mocha.test("Validate schedule before start", () => {
			const now = createDateWithTimeZone(2024, 1, 1, 0, 0, timezone)
			const expected = createDateWithTimeZone(2025, 1, 1, 10, 0, timezone)

			const nextReminderTime = new Date(getTimeForReminder({
				currentTime: now.getTime(),
				startYear: 2025,
				startMonth: 1,
				startDay: 1,
				targetHours: 10,
				targetMinutes: 0,
				targetTimezone: timezone,
				intervalInDays: 1
			}))

			expect(nextReminderTime).deep.equal(expected)
			expect(nextReminderTime.getTime()).to.equal(expected.getTime())
		})

		describe("Validate Intervals", () => {
			mocha.test("Validate Single Day Interval", () => {
				const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 2, 10, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Validate 2 Day Interval", () => {
				const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 3, 10, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 2, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Validate 3 Day Interval", () => {
				const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 4, 10, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 3, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Validate 2 Day Interval after 10 days of start", () => {
				const now = createDateWithTimeZone(2025, 1, 11, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 13, 10, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 2, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Validate 3 Day Interval after 10 days of start", () => {
				const now = createDateWithTimeZone(2025, 1, 11, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 13, 10, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 2, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate Same-day", () => {
			describe("Validate 1-day interval", () => {
				mocha.test("Validate before timer is supposed to go off", () => {
					const now = createDateWithTimeZone(2025, 1, 2, 1, 0, timezone)
					const expected = createDateWithTimeZone(2025, 1, 2, 10, 0, timezone)
	
					const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 1, timezone)
	
					expect(nextReminderTime).deep.equal(expected)
					expect(nextReminderTime.getTime()).to.equal(expected.getTime())
				})
	
				mocha.test("Validate exactly when timer is supposed to go off", () => {
					const now = createDateWithTimeZone(2025, 1, 2, 10, 0, timezone)
					const expected = createDateWithTimeZone(2025, 1, 3, 10, 0, timezone)
	
					const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 1, timezone)
	
					expect(nextReminderTime).deep.equal(expected)
					expect(nextReminderTime.getTime()).to.equal(expected.getTime())
				})
	
				mocha.test("Validate one minute before timer is supposed to go off", () => {
					const now = createDateWithTimeZone(2025, 1, 2, 9, 59, timezone)
					const expected = createDateWithTimeZone(2025, 1, 2, 10, 0, timezone)
	
					const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 1, timezone)
	
					expect(nextReminderTime).deep.equal(expected)
					expect(nextReminderTime.getTime()).to.equal(expected.getTime())
				})
	
				mocha.test("Validate one minute after timer is supposed to go off", () => {
					const now = createDateWithTimeZone(2025, 1, 2, 10, 1, timezone)
					const expected = createDateWithTimeZone(2025, 1, 3, 10, 0, timezone)
	
					const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 1, timezone)
	
					expect(nextReminderTime).deep.equal(expected)
					expect(nextReminderTime.getTime()).to.equal(expected.getTime())
				})
			})

			describe("Validate multi-day interval", () => {
				mocha.test("Validate before timer is supposed to go off", () => {
					const now = createDateWithTimeZone(2025, 1, 4, 1, 0, timezone)
					const expected = createDateWithTimeZone(2025, 1, 4, 10, 0, timezone)

					const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 3, timezone)

					expect(nextReminderTime).deep.equal(expected)
					expect(nextReminderTime.getTime()).to.equal(expected.getTime())
				})

				mocha.test("Validate exactly when timer is supposed to go off", () => {
					const now = createDateWithTimeZone(2025, 1, 4, 10, 0, timezone)
					const expected = createDateWithTimeZone(2025, 1, 7, 10, 0, timezone)

					const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 3, timezone)

					expect(nextReminderTime).deep.equal(expected)
					expect(nextReminderTime.getTime()).to.equal(expected.getTime())
				})

				mocha.test("Validate one minute before timer is supposed to go off", () => {
					const now = createDateWithTimeZone(2025, 1, 4, 9, 59, timezone)
					const expected = createDateWithTimeZone(2025, 1, 4, 10, 0, timezone)

					const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 3, timezone)

					expect(nextReminderTime).deep.equal(expected)
					expect(nextReminderTime.getTime()).to.equal(expected.getTime())
				})

				mocha.test("Validate one minute after timer is supposed to go off", () => {
					const now = createDateWithTimeZone(2025, 1, 4, 10, 1, timezone)
					const expected = createDateWithTimeZone(2025, 1, 7, 10, 0, timezone)

					const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 3, timezone)

					expect(nextReminderTime).deep.equal(expected)
					expect(nextReminderTime.getTime()).to.equal(expected.getTime())
				})
			})
		})

		describe("Validate Same-day - on day of scheduling", () => {
			describe("Validate 1-day interval", () => {
				mocha.test("Validate before timer is supposed to go off", () => {
					const now = createDateWithTimeZone(2025, 1, 1, 1, 0, timezone)
					const expected = createDateWithTimeZone(2025, 1, 1, 10, 0, timezone)

					const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 1, timezone)

					expect(nextReminderTime).deep.equal(expected)
					expect(nextReminderTime.getTime()).to.equal(expected.getTime())
				})

				mocha.test("Validate exactly when timer is supposed to go off", () => {
					const now = createDateWithTimeZone(2025, 1, 1, 10, 0, timezone)
					const expected = createDateWithTimeZone(2025, 1, 2, 10, 0, timezone)

					const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 1, timezone)

					expect(nextReminderTime).deep.equal(expected)
					expect(nextReminderTime.getTime()).to.equal(expected.getTime())
				})

				mocha.test("Validate one minute before timer is supposed to go off", () => {
					const now = createDateWithTimeZone(2025, 1, 1, 9, 59, timezone)
					const expected = createDateWithTimeZone(2025, 1, 1, 10, 0, timezone)

					const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 1, timezone)

					expect(nextReminderTime).deep.equal(expected)
					expect(nextReminderTime.getTime()).to.equal(expected.getTime())
				})

				mocha.test("Validate one minute after timer is supposed to go off", () => {
					const now = createDateWithTimeZone(2025, 1, 1, 10, 1, timezone)
					const expected = createDateWithTimeZone(2025, 1, 2, 10, 0, timezone)

					const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 1, timezone)

					expect(nextReminderTime).deep.equal(expected)
					expect(nextReminderTime.getTime()).to.equal(expected.getTime())
				})
			})

			describe("Validate multi-day interval", () => {
				mocha.test("Validate before timer is supposed to go off", () => {
					const now = createDateWithTimeZone(2025, 1, 1, 1, 0, timezone)
					const expected = createDateWithTimeZone(2025, 1, 1, 10, 0, timezone)

					const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 3, timezone)

					expect(nextReminderTime).deep.equal(expected)
					expect(nextReminderTime.getTime()).to.equal(expected.getTime())
				})

				mocha.test("Validate exactly when timer is supposed to go off", () => {
					const now = createDateWithTimeZone(2025, 1, 1, 10, 0, timezone)
					const expected = createDateWithTimeZone(2025, 1, 4, 10, 0, timezone)

					const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 3, timezone)

					expect(nextReminderTime).deep.equal(expected)
					expect(nextReminderTime.getTime()).to.equal(expected.getTime())
				})

				mocha.test("Validate one minute before timer is supposed to go off", () => {
					const now = createDateWithTimeZone(2025, 1, 1, 9, 59, timezone)
					const expected = createDateWithTimeZone(2025, 1, 1, 10, 0, timezone)

					const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 3, timezone)

					expect(nextReminderTime).deep.equal(expected)
					expect(nextReminderTime.getTime()).to.equal(expected.getTime())
				})

				mocha.test("Validate one minute after timer is supposed to go off", () => {
					const now = createDateWithTimeZone(2025, 1, 1, 10, 1, timezone)
					const expected = createDateWithTimeZone(2025, 1, 4, 10, 0, timezone)

					const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 3, timezone)

					expect(nextReminderTime).deep.equal(expected)
					expect(nextReminderTime.getTime()).to.equal(expected.getTime())
				})
			})
		})
	})

	describe("Validate Germany", () => {
		const timezone = "Europe/Berlin"

		describe("Validate ST to DST", () => {
			mocha.test("Test 1:59AM", () => {
				const now = createDateWithTimeZone(2025, 3, 29, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 30, 1, 59, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 1, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 2:01AM", () => {
				const now = createDateWithTimeZone(2025, 3, 29, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 30, 2, 1, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 2, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 2:59AM", () => {
				const now = createDateWithTimeZone(2025, 3, 29, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 30, 2, 59, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 2, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 3:01AM", () => {
				const now = createDateWithTimeZone(2025, 3, 29, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 30, 3, 1, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 3, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate During DST", () => {
			mocha.test("Test 10:00AM", () => {
				const now = createDateWithTimeZone(2025, 7, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 7, 2, 10, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 8:00PM", () => {
				const now = createDateWithTimeZone(2025, 7, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 7, 2, 20, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 20, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate During ST", () => {
			mocha.test("Test 10:00AM", () => {
				const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 2, 10, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 8:00PM", () => {
				const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 2, 20, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 20, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate DST to ST", () => {
			mocha.test("Test 2:59AM", () => {
				const now = createDateWithTimeZone(2025, 10, 25, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 10, 26, 2, 59, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 2, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 3:01AM", () => {
				const now = createDateWithTimeZone(2025, 10, 25, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 10, 26, 3, 1, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 3, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 3:59AM", () => {
				const now = createDateWithTimeZone(2025, 10, 25, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 10, 26, 3, 59, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 3, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 4:01AM", () => {
				const now = createDateWithTimeZone(2025, 10, 25, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 10, 26, 4, 1, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 4, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})
	})

	describe("Validate Bucharest", () => {
		const timezone = "Europe/Bucharest"

		describe("Validate ST to DST", () => {
			mocha.test("Test 1:59AM", () => {
				const now = createDateWithTimeZone(2025, 3, 29, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 30, 1, 59, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 1, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 2:01AM", () => {
				const now = createDateWithTimeZone(2025, 3, 29, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 30, 2, 1, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 2, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 2:59AM", () => {
				const now = createDateWithTimeZone(2025, 3, 29, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 30, 2, 59, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 2, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 3:01AM", () => {
				const now = createDateWithTimeZone(2025, 3, 29, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 30, 3, 1, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 3, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate During DST", () => {
			mocha.test("Test 10:00AM", () => {
				const now = createDateWithTimeZone(2025, 7, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 7, 2, 10, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 8:00PM", () => {
				const now = createDateWithTimeZone(2025, 7, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 7, 2, 20, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 20, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate During ST", () => {
			mocha.test("Test 10:00AM", () => {
				const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 2, 10, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 8:00PM", () => {
				const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 2, 20, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 20, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate DST to ST", () => {
			mocha.test("Test 2:59AM", () => {
				const now = createDateWithTimeZone(2025, 10, 25, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 10, 26, 2, 59, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 2, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 3:01AM", () => {
				const now = createDateWithTimeZone(2025, 10, 25, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 10, 26, 3, 1, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 3, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 3:59AM", () => {
				const now = createDateWithTimeZone(2025, 10, 25, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 10, 26, 3, 59, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 3, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 4:01AM", () => {
				const now = createDateWithTimeZone(2025, 10, 25, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 10, 26, 4, 1, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 4, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})
	})

	describe("Validate New York", () => {
		const timezone = "America/New_York"

		describe("Validate ST to DST", () => {
			mocha.test("Test 1:59AM", () => {
				const now = createDateWithTimeZone(2025, 3, 8, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 9, 1, 59, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 1, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 2:01AM", () => {
				const now = createDateWithTimeZone(2025, 3, 8, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 9, 2, 1, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 2, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 2:59AM", () => {
				const now = createDateWithTimeZone(2025, 3, 8, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 9, 2, 59, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 2, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 3:01AM", () => {
				const now = createDateWithTimeZone(2025, 3, 8, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 3, 9, 3, 1, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 3, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate During DST", () => {
			mocha.test("Test 10:00AM", () => {
				const now = createDateWithTimeZone(2025, 7, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 7, 2, 10, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 8:00PM", () => {
				const now = createDateWithTimeZone(2025, 7, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 7, 2, 20, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 20, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate During ST", () => {
			mocha.test("Test 10:00AM", () => {
				const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 2, 10, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 10, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 8:00PM", () => {
				const now = createDateWithTimeZone(2025, 1, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 1, 2, 20, 0, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 20, 0, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})

		describe("Validate DST to ST", () => {
			mocha.test("Test 0:59AM", () => {
				const now = createDateWithTimeZone(2025, 11, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 11, 2, 0, 59, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 0, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 1:01AM", () => {
				const now = createDateWithTimeZone(2025, 11, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 11, 2, 1, 1, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 1, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 1:59AM", () => {
				const now = createDateWithTimeZone(2025, 11, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 11, 2, 1, 59, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 1, 59, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})

			mocha.test("Test 2:01AM", () => {
				const now = createDateWithTimeZone(2025, 11, 1, 20, 0, timezone)
				const expected = createDateWithTimeZone(2025, 11, 2, 2, 1, timezone)

				const nextReminderTime = getNextReminderTime(now.getTime(), 2, 1, 1, timezone)

				expect(nextReminderTime).deep.equal(expected)
				expect(nextReminderTime.getTime()).to.equal(expected.getTime())
			})
		})
	})
})
