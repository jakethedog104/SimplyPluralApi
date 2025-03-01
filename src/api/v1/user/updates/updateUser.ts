import { versionMigrationList } from "../../../../util/version"
import { update122 } from "./update112"
import { update150 } from "./update150"
import { update151 } from "./update151"
import { update300 } from "./update300"

export const updateUser = async (lastVersion: number, newVersion: number, uid: string) => {
	if (lastVersion >= newVersion) return
	if (lastVersion >= versionMigrationList[versionMigrationList.length - 1]) return

	if (lastVersion < 111 && newVersion >= 111) {
		// Custom fields update
		await update122(uid)
	}

	if (lastVersion < 149 && newVersion >= 149) {
		// Public api update
		await update150(uid)
	}

	if (lastVersion < 150 && newVersion >= 150) {
		// Remove null info fields in members
		await update151(uid)
	}

	if (lastVersion < 300 && newVersion >= 300) {
		// Convert privacy fields to privacy buckets
		await update300(uid)
	}
}
