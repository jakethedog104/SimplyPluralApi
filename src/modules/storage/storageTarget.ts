export interface StorageTarget {
	get(path: string): Promise<Buffer | undefined>
	put(path: string, buffer: Buffer): Promise<boolean>
	delete(path: string): Promise<boolean>
}
