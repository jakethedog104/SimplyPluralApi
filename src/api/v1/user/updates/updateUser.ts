import LRU from "lru-cache"

import { getCollection } from "../../../../modules/mongo"
import { update122 } from "./update112"
import { update150 } from "./update150"
import { update151 } from "./update151"
import { update300 } from "./update300"
import { ObjectId } from "mongodb"

export const versionMigrationList = [111, 149, 150, 300]

export const FIELD_MIGRATION_VERSION = 300

const versionLRU = new LRU<string, boolean>({ max: 10000, ttl: 1000 * 5 })

export const doesUserHaveVersion = async (uid: string, version: number): Promise<boolean> => {
	const userVersionString = `${uid}${version}`
	const LRUResult = versionLRU.get(userVersionString)
	if (LRUResult === true) {
		return true
	}

	if (LRUResult === false) {
		return false
	}

	const privateDoc: { _id: string | ObjectId; latestVersion: number | undefined } = await getCollection("private").findOne({ uid, _id: uid }, { projection: { latestVersion: 1 } })

	if (privateDoc) {
		const hasVersion: boolean = privateDoc.latestVersion !== null && privateDoc.latestVersion !== undefined && privateDoc.latestVersion >= version
		versionLRU.set(userVersionString, hasVersion)
		return hasVersion
	}

	return false
}

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
