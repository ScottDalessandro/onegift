import { type LoaderFunctionArgs } from 'react-router'
import { s3Client, PutObjectCommand } from '../../../../server/utils/s3.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url)
	const fileName = url.searchParams.get('fileName')
	const fileType = url.searchParams.get('fileType')

	if (!fileName || !fileType) {
		return Response.json(
			{ error: 'fileName and fileType are required' },
			{ status: 400 },
		)
	}

	// Create the put command with the original filename
	const putCommand = new PutObjectCommand(
		process.env.S3_BUCKET ?? '',
		fileName,
		fileType,
	)

	try {
		const presignedUrl = await s3Client.getPresignedUrl(putCommand)

		// Get the final URL using the command's helper method
		const fileUrl = putCommand.getFinalUrl(process.env.AWS_REGION ?? '')

		return Response.json({
			success: true,
			presignedUrl,
			fileUrl,
		})
	} catch (error) {
		console.error('Error generating presigned URL:', error)
		return Response.json(
			{ error: 'Failed to generate upload URL' },
			{ status: 500 },
		)
	}
}
