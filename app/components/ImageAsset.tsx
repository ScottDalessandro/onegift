import { useState } from 'react'
import { cn } from '#app/utils/misc'

interface ImageAssetProps {
	src: string
	alt: string
	className?: string
	priority?: boolean
}

export function ImageAsset({
	src,
	alt,
	className,
	priority = false,
}: ImageAssetProps) {
	const [isLoading, setIsLoading] = useState(true)

	return (
		<div className={cn('overflow-hidden', className)}>
			<img
				src={src}
				alt={alt}
				loading={priority ? 'eager' : 'lazy'}
				className={cn(
					'duration-700 ease-in-out',
					isLoading
						? 'scale-110 blur-2xl grayscale'
						: 'scale-100 blur-0 grayscale-0',
				)}
				onLoad={() => setIsLoading(false)}
			/>
		</div>
	)
}
