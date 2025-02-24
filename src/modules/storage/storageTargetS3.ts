import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { StorageTarget } from "./storageTarget"

export class StorageTargetS3 implements StorageTarget {
	private s3: S3Client | undefined
	private bucketId: string

	constructor(bucketId: string) {
		this.bucketId = bucketId
	}

	init(endpoint: string, region: string, accessKey: string, secret: string) {
		this.s3 = new S3Client({
			endpoint: endpoint,
			region: region,
			credentials: { accessKeyId: accessKey, secretAccessKey: secret },
		})
	}

	async get(path: string): Promise<Buffer | undefined> {
		if (!this.s3) {
			return undefined
		}

		const params = {
			Bucket: this.bucketId,
			Key: path,
		}
		try {
			const command = new GetObjectCommand(params)

			const file = await this.s3.send(command)
			if (file && file.Body) {
				const buffer = await file.Body.transformToByteArray()
				return Buffer.from(buffer)
			}
		} catch (e) {
			return undefined
		}

		return undefined
	}

	async put(path: string, buffer: Buffer): Promise<boolean> {
		if (!this.s3) {
			return false
		}

		const params = {
			Bucket: this.bucketId,
			Key: path,
			Body: buffer,
		}

		try {
			const command = new PutObjectCommand(params)

			const result = await this.s3.send(command)

			if (result) {
				return true
			}
		} catch (e) {
			return false
		}

		return true
	}

	async delete(path: string): Promise<boolean> {
		if (!this.s3) {
			return false
		}

		const params = {
			Bucket: this.bucketId,
			Key: path,
		}

		const command = new DeleteObjectCommand(params)

		const result = await this.s3.send(command)
		return !!result
	}
}
