import assert from "assert"
import { StoragePutOptions, StorageTarget } from "./storageTarget"

export class StorageController {
	private storageTargets: StorageTarget[] = []
	private primaryStorageTarget: StorageTarget | undefined

	registerStorageTarget(target: StorageTarget) {
		this.storageTargets.push(target)
	}

	setPrimaryTarget(target: StorageTarget) {
		assert(this.storageTargets.includes(target))
		this.primaryStorageTarget = target
	}

	async get(path: string): Promise<Buffer | undefined> {
		if (this.primaryStorageTarget) {
			const primaryResult: Buffer | undefined = await this.primaryStorageTarget.get(path)
			if (primaryResult) {
				return primaryResult
			}
		}

		for (let i = 0; i < this.storageTargets.length; i++) {
			const storageTarget = this.storageTargets[i]
			if (storageTarget != this.primaryStorageTarget) {
				const targetResult: Buffer | undefined = await storageTarget.get(path)
				if (targetResult) {
					return targetResult
				}
			}
		}

		return undefined
	}

	async put(path: string, buffer: Buffer, options?: StoragePutOptions | undefined): Promise<boolean> {
		if (this.primaryStorageTarget) {
			const primaryResult: boolean = await this.primaryStorageTarget.put(path, buffer, options)
			if (primaryResult) {
				return primaryResult
			}
		}

		return false
	}

	async delete(path: string): Promise<boolean> {
		if (this.primaryStorageTarget) {
			const primaryResult: boolean = await this.primaryStorageTarget.delete(path)
			if (primaryResult) {
				return primaryResult
			}
		}

		for (let i = 0; i < this.storageTargets.length; i++) {
			const storageTarget = this.storageTargets[i]
			if (storageTarget != this.primaryStorageTarget) {
				const targetResult: boolean = await storageTarget.delete(path)
				if (targetResult) {
					return targetResult
				}
			}
		}

		return false
	}

	async deleteFolder(path: string): Promise<boolean> {
		if (this.primaryStorageTarget) {
			const primaryResult: boolean = await this.primaryStorageTarget.deleteFolder(path)
			if (primaryResult) {
				return primaryResult
			}
		}

		for (let i = 0; i < this.storageTargets.length; i++) {
			const storageTarget = this.storageTargets[i]
			if (storageTarget != this.primaryStorageTarget) {
				const targetResult: boolean = await storageTarget.deleteFolder(path)
				if (targetResult) {
					return targetResult
				}
			}
		}

		return false
	}
}

export const initStorageController = () => {
	storageController = new StorageController()
}

export let storageController: StorageController | undefined = undefined
