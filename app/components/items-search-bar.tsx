import { useSearchParams } from 'react-router'
import { useState, useEffect, useDeferredValue } from 'react'
import { Input } from '#app/components/ui/input'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
	placeholder?: string
	onSearch: (query: string) => void
	className?: string
}

export function SearchBar({
	placeholder = 'Search items...',
	onSearch,
	className = '',
}: SearchBarProps) {
	const [searchParams, setSearchParams] = useSearchParams()
	const [localSearch, setLocalSearch] = useState(
		searchParams.get('search') || '',
	)

	// Debounce the search to avoid excessive calls
	const deferredSearch = useDeferredValue(localSearch)

	// Update URL and trigger search when debounced value changes
	useEffect(() => {
		const newParams = new URLSearchParams(searchParams)

		if (deferredSearch) {
			newParams.set('search', deferredSearch)
		} else {
			newParams.delete('search')
		}

		// Only update URL if it actually changed
		if (newParams.toString() !== searchParams.toString()) {
			setSearchParams(newParams, { replace: true })
			onSearch(deferredSearch)
		}
	}, [deferredSearch, searchParams, setSearchParams, onSearch])

	const clearSearch = () => {
		setLocalSearch('')
	}

	return (
		<div className={`relative ${className}`}>
			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
				<Input
					placeholder={placeholder}
					value={localSearch}
					onChange={(e) => setLocalSearch(e.target.value)}
					className="pl-10 pr-10"
				/>
				{localSearch && (
					<button
						onClick={clearSearch}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
						aria-label="Clear search"
					>
						<X className="h-4 w-4" />
					</button>
				)}
			</div>
		</div>
	)
}
