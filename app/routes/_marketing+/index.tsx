import { Link } from 'react-router'
import { Button } from '#app/components/ui/button.tsx'
import { cn } from '#app/utils/misc.tsx'
import { type Route } from './+types/index.ts'
import { useState, useEffect } from 'react'
// import { ImageAsset } from '#app/components/ImageAsset'
// import giftPattern from '#app/assets/images/backgrounds/gift-pattern.svg'

// Temporary placeholder image URL
const placeholderImage =
	'https://placehold.co/800x600/rose/white/png?text=Coming+Soon'

const heroSlides = [
	{
		image: 'app/assets/images/hero/beckett-birthday-edited.jpg',
		alt: 'A child celebrating their birthday with mindfully chosen gifts',
		heading: 'Create Meaningful Gift Experiences',
		subheading: 'Less clutter. More meaning. Happier children.',
	},
	{
		image: 'app/assets/images/hero/mikayla-10.jpg',
		alt: 'A child engaged in an experiential gift activity',
		heading: 'Give the Gift of Experience',
		subheading: 'Create lasting memories through thoughtful experiences',
	},
	{
		image: placeholderImage,
		alt: 'Sustainably wrapped gifts showing mindful gift-giving',
		heading: 'Sustainable Gift-Giving',
		subheading: 'Make every gift count with purpose and meaning',
	},
]

export const meta: Route.MetaFunction = () => [{ title: 'Wish & Well' }]

export default function Index() {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
		}, 5000)
		return () => clearInterval(timer)
	}, [])

	return (
		<div className="flex min-h-screen flex-col bg-rose-50">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b border-rose-200 bg-white/80 backdrop-blur-md">
				<div className="container mx-auto px-4">
					<div className="flex h-16 items-center justify-between">
						<Link to="/" className="text-2xl font-bold text-rose-700">
							Wish & Well
						</Link>
						<nav className="hidden items-center space-x-8 md:flex">
							<Link to="/about" className="text-rose-700 hover:text-rose-900">
								About
							</Link>
							<Link
								to="/how-it-works"
								className="text-rose-700 hover:text-rose-900"
							>
								How It Works
							</Link>
							<Link to="/contact" className="text-rose-700 hover:text-rose-900">
								Contact
							</Link>
							<Button
								asChild
								variant="default"
								className="bg-rose-600 text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-700 hover:shadow-rose-600/30"
							>
								<Link to="/create-gift-list">Create Gift List</Link>
							</Button>
						</nav>
						<Button
							variant="ghost"
							className="md:hidden"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<svg
								className="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								{isMenuOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</Button>
					</div>
					{/* Mobile Menu */}
					<div className={cn('md:hidden', isMenuOpen ? 'block' : 'hidden')}>
						<div className="space-y-4 py-4">
							<Link
								to="/about"
								className="block text-rose-700 hover:text-rose-900"
								onClick={() => setIsMenuOpen(false)}
							>
								About
							</Link>
							<Link
								to="/how-it-works"
								className="block text-rose-700 hover:text-rose-900"
								onClick={() => setIsMenuOpen(false)}
							>
								How It Works
							</Link>
							<Link
								to="/contact"
								className="block text-rose-700 hover:text-rose-900"
								onClick={() => setIsMenuOpen(false)}
							>
								Contact
							</Link>
							<Button
								asChild
								variant="default"
								className="w-full bg-rose-600 text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-700 hover:shadow-rose-600/30"
							>
								<Link to="/create-gift-list">Create Gift List</Link>
							</Button>
						</div>
					</div>
				</div>
			</header>

			<main className="flex-1">
				{/* Hero Section with Image Slider */}
				<section className="relative py-8 md:py-16">
					{/* Image Slider */}
					<div className="absolute inset-0 overflow-hidden">
						{heroSlides.map((slide, index) => (
							<div
								key={index}
								className={cn(
									'absolute inset-0 transition-opacity duration-1000',
									index === currentSlide ? 'opacity-100' : 'opacity-0',
								)}
							>
								<img
									src={slide.image}
									alt={slide.alt}
									className="h-full w-full object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-r from-rose-900/70 to-rose-800/50" />
							</div>
						))}
					</div>

					{/* Slider Navigation */}
					<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-6">
						{heroSlides.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentSlide(index)}
								className={cn(
									'h-1.5 rounded-full transition-all md:h-2',
									index === currentSlide
										? 'w-6 bg-white md:w-8'
										: 'w-1.5 bg-white/50 hover:bg-white/75 md:w-2',
								)}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>

					{/* Hero Content */}
					<div className="relative flex min-h-[50vh] items-center justify-center md:min-h-[60vh]">
						<div className="container mx-auto px-4 text-center text-white">
							<h1 className="animate-fade-in text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
								{heroSlides[currentSlide]?.heading ||
									'Mindful Gifting with Wish & Well'}
							</h1>
							<p className="mx-auto mt-4 max-w-2xl text-base text-rose-50 md:mt-6 md:text-lg lg:text-xl">
								{heroSlides[currentSlide]?.subheading ||
									'Less clutter. More meaning. Happier children.'}
							</p>
							<Button
								asChild
								variant="default"
								className="mt-6 bg-white px-4 py-3 text-sm text-rose-700 shadow-xl shadow-rose-900/20 transition-all hover:bg-rose-50 hover:shadow-rose-900/30 md:mt-8 md:px-6 md:py-4 md:text-base"
							>
								<Link to="/create-gift-list">Create Your Gift List</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Why Mindful Gifting Matters */}
				<section className="py-12 md:py-24">
					<div className="container mx-auto px-4">
						<h2 className="mb-8 text-center text-3xl font-bold text-rose-900 md:mb-16 md:text-4xl lg:text-5xl">
							Why Mindful Gifting Matters
						</h2>
						<div className="grid gap-6 md:grid-cols-2 md:gap-8">
							<div className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8">
								<div className="mb-6 overflow-hidden rounded-lg">
									<img
										src={placeholderImage}
										alt="A beautifully organized and decluttered children's playroom"
										className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								</div>
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
									<svg
										className="h-6 w-6 text-rose-600"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
								</div>
								<h3 className="text-2xl font-semibold text-rose-800">
									Reduce Clutter
								</h3>
								<p className="mt-3 text-lg text-rose-700">
									Say goodbye to unnecessary toys that pile up and hello to a
									more organized home. Our gift list helps prevent the
									accumulation of items that quickly lose their appeal.
								</p>
							</div>

							<div className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8">
								<div className="mb-6 overflow-hidden rounded-lg">
									<img
										src={placeholderImage}
										alt="Parents and family members planning gifts together"
										className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								</div>
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
									<svg
										className="h-6 w-6 text-rose-600"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<h3 className="text-2xl font-semibold text-rose-800">
									Save Time
								</h3>
								<p className="mt-3 text-lg text-rose-700">
									Parents can easily manage gift preferences online, eliminating
									the stress of last-minute shopping and ensuring children
									receive gifts they'll truly appreciate.
								</p>
							</div>

							<div className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8">
								<div className="mb-6 overflow-hidden rounded-lg">
									<img
										src={placeholderImage}
										alt="A child happily playing with a thoughtfully chosen gift"
										className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								</div>
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
									<svg
										className="h-6 w-6 text-rose-600"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										/>
									</svg>
								</div>
								<h3 className="text-2xl font-semibold text-rose-800">
									Guilt-Free Giving
								</h3>
								<p className="mt-3 text-lg text-rose-700">
									Gift-givers no longer need to worry about their presents
									ending up in the trash. Every gift through Wish & Well is
									pre-approved and genuinely wanted.
								</p>
							</div>

							<div className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8">
								<div className="mb-6 overflow-hidden rounded-lg">
									<img
										src={placeholderImage}
										alt="A child learning and growing through meaningful gifts"
										className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								</div>
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
									<svg
										className="h-6 w-6 text-rose-600"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/>
									</svg>
								</div>
								<h3 className="text-2xl font-semibold text-rose-800">
									Teach Meaningful Values
								</h3>
								<p className="mt-3 text-lg text-rose-700">
									Help children understand that receiving 100 toys isn't the
									goal. Our approach teaches that fewer, more purposeful gifts
									create lasting joy and appreciation.
								</p>
							</div>
						</div>
						<div className="mt-16 text-center">
							<p className="mx-auto max-w-3xl text-lg italic text-rose-700">
								"The greatest gift you can give your children is not more stuff,
								but the understanding of what truly matters. Wish & Well helps
								families create celebrations focused on meaning rather than
								excess."
							</p>
							<Button
								asChild
								variant="default"
								className="mt-8 bg-rose-600 text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-700 hover:shadow-rose-600/30"
							>
								<Link to="/about">Learn More About Our Approach</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* How It Works */}
				<section className="relative overflow-hidden bg-gradient-to-br from-rose-100 to-rose-50 py-12 md:py-24">
					<div className="pointer-events-none absolute inset-0">
						<img
							src="app/assets/images/backgrounds/gift-pattern.svg"
							alt=""
							className="h-full w-full object-cover opacity-5"
						/>
					</div>
					<div className="container relative mx-auto px-4">
						<h2 className="mb-4 text-center text-3xl font-bold text-rose-900 md:text-4xl lg:text-5xl">
							How Wish & Well Works
						</h2>
						<p className="mb-12 text-center text-base text-rose-700 md:mb-16 md:text-lg lg:text-xl">
							Our simple process helps you create meaningful gift experiences
						</p>
						<div className="grid gap-8 md:grid-cols-3">
							<div className="group text-center">
								<div className="mb-6">
									<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-600 shadow-lg shadow-rose-600/20 transition-all group-hover:shadow-rose-600/30">
										<svg
											className="h-10 w-10 text-white"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
											/>
										</svg>
									</div>
								</div>
								<h3 className="text-2xl font-semibold text-rose-800">
									Create a Gift List
								</h3>
								<p className="mt-3 text-lg text-rose-700">
									Choose from our three gift list types and add your child's
									profile information.
								</p>
							</div>

							<div className="group text-center">
								<div className="mb-6">
									<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-600 shadow-lg shadow-rose-600/20 transition-all group-hover:shadow-rose-600/30">
										<svg
											className="h-10 w-10 text-white"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
											/>
										</svg>
									</div>
								</div>
								<h3 className="text-2xl font-semibold text-rose-800">
									Share with Loved Ones
								</h3>
								<p className="mt-3 text-lg text-rose-700">
									Invite family and friends to contribute to meaningful gifts
									your child will cherish.
								</p>
							</div>

							<div className="group text-center">
								<div className="mb-6">
									<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-600 shadow-lg shadow-rose-600/20 transition-all group-hover:shadow-rose-600/30">
										<svg
											className="h-10 w-10 text-white"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
											/>
										</svg>
									</div>
								</div>
								<h3 className="text-2xl font-semibold text-rose-800">
									Create Lasting Memories
								</h3>
								<p className="mt-3 text-lg text-rose-700">
									Watch as your child receives gifts that truly matter and
									create precious memories that last a lifetime.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Gift Categories */}
				<section className="py-12 md:py-24">
					<div className="container mx-auto px-4">
						<h2 className="mb-4 text-center text-3xl font-bold text-rose-900 md:text-4xl lg:text-5xl">
							The 5 Gift Categories
						</h2>
						<p className="mb-12 text-center text-base text-rose-700 md:mb-16 md:text-lg lg:text-xl">
							Our thoughtful approach to gift-giving ensures every present
							serves a purpose
						</p>
						<div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
							<div className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8">
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
									<svg
										className="h-6 w-6 text-rose-600"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-rose-800">
									Something They Want
								</h3>
								<p className="mt-2 text-rose-700">
									A special toy or item they've been wishing for, chosen with
									care
								</p>
							</div>

							<div className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8">
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
									<svg
										className="h-6 w-6 text-rose-600"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-rose-800">
									Something They Need
								</h3>
								<p className="mt-2 text-rose-700">
									Practical items useful in daily life, chosen with purpose
								</p>
							</div>

							<div className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8">
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
									<svg
										className="h-6 w-6 text-rose-600"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-rose-800">
									An Experience
								</h3>
								<p className="mt-2 text-rose-700">
									Activities that create lasting memories and learning
									opportunities
								</p>
							</div>

							<div className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8">
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
									<svg
										className="h-6 w-6 text-rose-600"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-rose-800">
									Something to Wear
								</h3>
								<p className="mt-2 text-rose-700">
									Clothing that expresses their personality and fits their style
								</p>
							</div>

							<div className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl md:p-8">
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
									<svg
										className="h-6 w-6 text-rose-600"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-rose-800">
									Something to Learn
								</h3>
								<p className="mt-2 text-rose-700">
									Books or educational items that help them grow and develop
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Gift Options */}
				<section className="relative overflow-hidden bg-gradient-to-br from-rose-100 to-rose-50 py-12 md:py-24">
					<div className="pointer-events-none absolute inset-0">
						<img
							src="app/assets/images/backgrounds/gift-pattern.svg"
							alt=""
							className="h-full w-full object-cover opacity-5"
						/>
					</div>
					<div className="container relative mx-auto px-4">
						<h2 className="mb-12 text-center text-3xl font-bold text-rose-900 md:mb-16 md:text-4xl lg:text-5xl">
							Our Gifting Options
						</h2>
						<div className="grid gap-6 md:grid-cols-3 md:gap-8">
							<div className="group rounded-xl bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl md:p-8">
								<div className="mb-4">
									<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
										<svg
											className="h-8 w-8 text-rose-600"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
											/>
										</svg>
									</div>
								</div>
								<h3 className="text-xl font-semibold text-rose-800">
									Standard Gift List
								</h3>
								<p className="mt-2 text-rose-700">
									Curate gifts across five mindful categories
								</p>
							</div>

							<div className="group rounded-xl bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl md:p-8">
								<div className="mb-4">
									<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
										<svg
											className="h-8 w-8 text-rose-600"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
									</div>
								</div>
								<h3 className="text-xl font-semibold text-rose-800">OneGift</h3>
								<p className="mt-2 text-rose-700">
									Everyone contributes to one significant gift that will be
									treasured for years
								</p>
							</div>

							<div className="group rounded-xl bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl md:p-8">
								<div className="mb-4">
									<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
										<svg
											className="h-8 w-8 text-rose-600"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
											/>
										</svg>
									</div>
								</div>
								<h3 className="text-xl font-semibold text-rose-800">
									Reverse Gift List
								</h3>
								<p className="mt-2 text-rose-700">
									Suggest gifts and let the recipient choose what truly
									resonates
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="relative overflow-hidden bg-gradient-to-br from-rose-600 to-rose-500 py-12 md:py-24">
					<div className="pointer-events-none absolute inset-0">
						<div className="absolute inset-0 bg-[url('/images/backgrounds/gift-pattern.svg')] opacity-10" />
					</div>
					<div className="container relative mx-auto px-4 text-center">
						<h2 className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
							Ready to Change How You Gift?
						</h2>
						<p className="mx-auto mt-4 max-w-2xl text-base text-rose-50 md:mt-6 md:text-lg lg:text-xl">
							Create a gift list that focuses on what truly matters. Less
							clutter, more meaning, happier children.
						</p>
						<Button
							asChild
							variant="default"
							className="mt-6 bg-white px-6 py-4 text-base text-rose-700 shadow-xl shadow-rose-900/20 transition-all hover:bg-rose-50 hover:shadow-rose-900/30 md:mt-10 md:px-8 md:py-6 md:text-lg"
						>
							<Link to="/create-gift-list">Create Your Gift List</Link>
						</Button>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="border-t border-rose-200 bg-white py-12 md:py-16">
				<div className="container mx-auto px-4">
					<div className="grid gap-8 md:grid-cols-4 md:gap-12">
						<div>
							<h3 className="text-lg font-semibold text-rose-800">
								Wish & Well
							</h3>
							<p className="mt-3 text-rose-700">
								Mindful gifting for meaningful moments.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-rose-800">
								Gift Options
							</h3>
							<ul className="mt-3 space-y-3 text-rose-700">
								<li>
									<Link
										to="/standard-gift-list"
										className="hover:text-rose-900"
									>
										Standard Gift List
									</Link>
								</li>
								<li>
									<Link to="/onegift" className="hover:text-rose-900">
										OneGift
									</Link>
								</li>
								<li>
									<Link to="/reverse-gift-list" className="hover:text-rose-900">
										Reverse Gift List
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-rose-800">Company</h3>
							<ul className="mt-3 space-y-3 text-rose-700">
								<li>
									<Link to="/about" className="hover:text-rose-900">
										About Us
									</Link>
								</li>
								<li>
									<Link to="/how-it-works" className="hover:text-rose-900">
										How It Works
									</Link>
								</li>
								<li>
									<Link to="/contact" className="hover:text-rose-900">
										Contact
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-rose-800">
								Our Mission
							</h3>
							<p className="mt-3 text-rose-700">
								We're dedicated to transforming gift-giving into a more
								meaningful, sustainable, and joyful experience for families. By
								reducing clutter and emphasizing purpose, we help create
								celebrations that matter.
							</p>
						</div>
					</div>
					<div className="mt-8 border-t border-rose-200 pt-6 text-center text-sm text-rose-700 md:mt-12 md:pt-8 md:text-base">
						<p>© 2024 Wish & Well. All rights reserved.</p>
						<div className="mt-3 space-x-6">
							<Link to="/privacy" className="hover:text-rose-900">
								Privacy Policy
							</Link>
							<Link to="/terms" className="hover:text-rose-900">
								Terms of Service
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}
