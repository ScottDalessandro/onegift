import { useEffect } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router'
import {
	isValidationError,
	isNotFoundError,
	isDatabaseError,
} from '#app/utils/errors.client'
import type {
	ValidationError,
	NotFoundError,
	DatabaseError,
} from '#app/utils/errors.client'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Button } from './ui/button'

function getErrorComponent(error: unknown, statusHandlers?: StatusHandlers) {
	// Log error to console in development
	if (process.env.NODE_ENV === 'development') {
		console.error('Error caught by error boundary:', error)
	}

	// Handle React Router errors
	if (isRouteErrorResponse(error)) {
		const handler = statusHandlers?.[error.status]
		if (handler) {
			return handler({ error })
		}
		if (error.status === 404) {
			return (
				<div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="mb-4 h-16 w-16 text-gray-400"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="M15 9l-6 6M9 9l6 6" />
					</svg>
					<h2 className="mb-2 text-2xl font-semibold">Page Not Found</h2>
					<p className="mb-6 text-gray-600">
						We couldn't find the page you're looking for.
					</p>
					<Button onClick={() => window.history.back()} variant="outline">
						Go Back
					</Button>
				</div>
			)
		}

		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="mb-4 h-16 w-16 text-red-500"
				>
					<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
					<path d="M12 9v4" />
					<path d="M12 17h.01" />
				</svg>
				<h2 className="mb-2 text-2xl font-semibold">
					{error.status} {error.statusText}
				</h2>
				<p className="mb-6 text-gray-600">{error.data}</p>
				<div className="space-x-4">
					<Button onClick={() => window.location.reload()} variant="default">
						Try Again
					</Button>
					<Button onClick={() => window.history.back()} variant="outline">
						Go Back
					</Button>
				</div>
			</div>
		)
	}

	if (isValidationError(error)) {
		const validationError = error as ValidationError
		return (
			<Alert variant="destructive" className="mb-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="h-5 w-5"
				>
					<path d="M12 8v4M12 16h.01" />
					<circle cx="12" cy="12" r="10" />
				</svg>
				<AlertTitle>Validation Error</AlertTitle>
				<AlertDescription>
					{validationError.field
						? `${validationError.field}: ${validationError.message}`
						: validationError.message}
				</AlertDescription>
			</Alert>
		)
	}

	if (isNotFoundError(error)) {
		const notFoundError = error as NotFoundError
		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="mb-4 h-16 w-16 text-gray-400"
				>
					<circle cx="12" cy="12" r="10" />
					<path d="M15 9l-6 6M9 9l6 6" />
				</svg>
				<h2 className="mb-2 text-2xl font-semibold">Resource Not Found</h2>
				<p className="mb-6 text-gray-600">
					{`We couldn't find the ${notFoundError.resource} you're looking for.`}
				</p>
				<Button onClick={() => window.history.back()} variant="outline">
					Go Back
				</Button>
			</div>
		)
	}

	if (isDatabaseError(error)) {
		const databaseError = error as DatabaseError
		return (
			<Alert variant="destructive" className="mb-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="h-5 w-5"
				>
					<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
					<path d="M12 9v4" />
					<path d="M12 17h.01" />
				</svg>
				<AlertTitle>System Error</AlertTitle>
				<AlertDescription>
					{databaseError.code === 'P2002'
						? 'This record already exists.'
						: 'There was a problem with the database. Please try again later.'}
				</AlertDescription>
			</Alert>
		)
	}

	// Default error UI
	return (
		<div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="mb-4 h-16 w-16 text-red-500"
			>
				<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
				<path d="M12 9v4" />
				<path d="M12 17h.01" />
			</svg>
			<h2 className="mb-2 text-2xl font-semibold">
				Oops! Something went wrong
			</h2>
			<p className="mb-6 text-gray-600">
				An unexpected error occurred. Please try again later.
			</p>
			<div className="space-x-4">
				<Button onClick={() => window.location.reload()} variant="default">
					Try Again
				</Button>
				<Button onClick={() => window.history.back()} variant="outline">
					Go Back
				</Button>
			</div>
		</div>
	)
}

interface StatusHandlers {
	[statusCode: number]: (props: { error?: any }) => React.ReactElement
}

interface GeneralErrorBoundaryProps {
	statusHandlers?: StatusHandlers
}

export function GeneralErrorBoundary({
	statusHandlers,
}: GeneralErrorBoundaryProps) {
	const error = useRouteError()

	useEffect(() => {
		// You could add error reporting service here
		if (process.env.NODE_ENV === 'production') {
			// Example: report to error tracking service
			// reportError(error)
		}
	}, [error])

	return getErrorComponent(error, statusHandlers)
}
