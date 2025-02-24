import { AwsClient } from 'aws4fetch'
import { nanoid } from 'nanoid'

type S3Config = {
    accessKeyId: string
    secretAccessKey: string
    region: string
    bucket: string
}

type AwsSignOptions = RequestInit & {
    signQuery?: boolean;
    expires?: number;
    aws?: {
        accessKeyId?: string;
        secretAccessKey?: string;
        sessionToken?: string;
        service?: string;
        region?: string;
    };
};

// Base command class
abstract class S3Command {
    protected bucket: string;
    protected key: string;
    
    constructor(bucket: string, key: string) {
        this.bucket = bucket;
        this.key = key;
    }

    abstract getMethod(): string;
    abstract getHeaders(): Record<string, string>;
}

// Command for GET operations
export class GetObjectCommand extends S3Command {
    getMethod(): string {
        return 'GET';
    }

    getHeaders(): Record<string, string> {
        return {
            'Host': `${this.bucket}.s3.amazonaws.com`
        };
    }
}

// Command for DELETE operations
export class DeleteObjectCommand extends S3Command {
    getMethod(): string {
        return 'DELETE';
    }

    getHeaders(): Record<string, string> {
        return {
            'Host': `${this.bucket}.s3.amazonaws.com`
        };
    }
}

// Command for PUT operations
export class PutObjectCommand extends S3Command {
    private contentType: string;
    private readonly finalKey: string;

    constructor(bucket: string, originalFileName: string, contentType: string) {
        // Generate a unique key based on the original filename
        const fileExtension = originalFileName.split('.').pop() || ''
        const uniqueKey = `uploads/${nanoid()}.${fileExtension}`
        super(bucket, uniqueKey);
        
        this.contentType = contentType;
        this.finalKey = uniqueKey;
    }

    getMethod(): string {
        return 'PUT';
    }

    getHeaders(): Record<string, string> {
        return {
            'Host': `${this.bucket}.s3.amazonaws.com`,
            'Content-Type': this.contentType
        };
    }

    getFinalUrl(region: string): string {
        return `https://${this.bucket}.s3.${region}.amazonaws.com/${this.finalKey}`
    }
}

export class S3PresignedUrlGenerator {
    private aws: AwsClient
    private bucket: string

    constructor(config: S3Config) {
        this.aws = new AwsClient({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: config.region,
            service: 's3'
        });
        
        this.bucket = config.bucket;
    }

    /**
     * Generate a presigned URL based on the provided command
     * @param {S3Command} command - The command object containing operation details
     * @param {number} expiresIn - Expiration time in seconds (default: 60)
     * @returns {Promise<string>} The presigned URL
     */
    async getPresignedUrl(command: S3Command, expiresIn: number = 60): Promise<string> {
        const url = new URL(`https://${this.bucket}.s3.amazonaws.com/${command['key']}`);
        
        const signedRequest = await this.aws.sign(url.toString(), {
            method: command.getMethod(),
            signQuery: true,
            headers: command.getHeaders(),
            expires: expiresIn
        } as AwsSignOptions);

        return signedRequest.url;
    }
}

export const s3Client = new S3PresignedUrlGenerator({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    region: process.env.AWS_REGION ?? '',
    bucket: process.env.S3_BUCKET ?? ''
})
  