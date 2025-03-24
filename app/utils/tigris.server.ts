import { createHash, createHmac } from 'crypto'
import { type FileUpload } from '@mjackson/form-data-parser'
import { createId } from '@paralleldrive/cuid2'
import { aws4fetch } from 'aws4fetch'

const STORAGE_ENDPOINT = process.env.TIGRIS_ENDPOINT_URL
const STORAGE_BUCKET = process.env.TIGRIS_BUCKET_NAME
const STORAGE_ACCESS_KEY = process.env.TIGRIS_ACCESS_KEY_ID
const STORAGE_SECRET_KEY = process.env.TIGRIS_SECRET_ACCESS_KEY
const STORAGE_REGION = process.env.TIGRIS_REGION || 'us-east-1'

if (!STORAGE_ENDPOINT || !STORAGE_BUCKET || !STORAGE_ACCESS_KEY || !STORAGE_SECRET_KEY) {
	throw new Error('Missing required Tigris storage environment variables')
}

const s3 = new aws4fetch({
	accessKeyId: STORAGE_ACCESS_KEY,
	secretAccessKey: STORAGE_SECRET_KEY,
	region: STORAGE_REGION,
	endpoint: STORAGE_ENDPOINT,
})

async function uploadToStorage(file: File | FileUpload, key: string) {
	try {
		const fileBuffer = file instanceof File 
			? Buffer.from(await file.arrayBuffer())
			: Buffer.from(await file.stream())

		await s3.putObject({
			Bucket: STORAGE_BUCKET,
			Key: key,
			Body: fileBuffer,
			ContentType: file.type,
		})

		return key
	} catch (error) {
		console.error('Failed to upload file to Tigris:', error)
		throw new Error(`Failed to upload object: ${key}`)
	}
}

export async function uploadListItemImage(
	listId: string,
	itemId: string,
	file: File | FileUpload,
) {
	const fileId = createId()
	const fileExtension = file.name.split('.').pop() || ''
	const timestamp = Date.now()
	const key = `lists/${listId}/items/${itemId}/images/${timestamp}-${fileId}.${fileExtension}`
	return uploadToStorage(file, key)
}

export async function uploadProfileImage(
	userId: string,
	file: File | FileUpload,
) {
	const fileId = createId()
	const fileExtension = file.name.split('.').pop() || ''
	const timestamp = Date.now()
	const key = `users/${userId}/profile-images/${timestamp}-${fileId}.${fileExtension}`
	return uploadToStorage(file, key)
}

export async function uploadNoteImage(
	userId: string,
	noteId: string,
	file: File | FileUpload,
) {
	const fileId = createId()
	const fileExtension = file.name.split('.').pop() || ''
	const timestamp = Date.now()
	const key = `users/${userId}/notes/${noteId}/images/${timestamp}-${fileId}.${fileExtension}`
	return uploadToStorage(file, key)
}

export async function getSignedUrl(key: string, expiresIn: number = 3600) {
	try {
		const command = {
			Bucket: STORAGE_BUCKET,
			Key: key,
			Expires: expiresIn,
		}
		return await s3.getSignedUrl('getObject', command)
	} catch (error) {
		console.error('Failed to generate signed URL:', error)
		throw new Error(`Failed to generate signed URL for: ${key}`)
	}
} 