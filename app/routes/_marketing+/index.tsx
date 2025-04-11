import { Link } from 'react-router'
import { Button } from '#app/components/ui/button'
import { cn } from '#app/utils/misc.tsx'
import { type Route } from './+types/index'
import { useState, useEffect } from 'react'
import { Icon } from '#app/components/ui/icon'
import { theme } from '#app/utils/theme'
import { Gift, Plus } from 'lucide-react'
// import { ImageAsset } from '#app/components/ImageAsset'
// import giftPattern from '#app/assets/images/backgrounds/gift-pattern.svg'

// Temporary placeholder image URL
const placeholderImage =
	'https://placehold.co/800x600/rose/white/png?text=Coming+Soon'

const heroSlides = [
	{
		image: 'app/assets/images/hero/beckett-birthday-edited.jpg',
		alt: 'A child celebrating their birthday with mindfully chosen gifts',
		heading: 'Meaningful Gifts for Growing Minds',
		subheading:
			'Create a registry that focuses on quality, not quantity. Help reduce clutter and create more meaningful gift-giving experiences.',
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
		<div className="flex min-h-screen flex-col bg-[#f9f7fe]">
			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative bg-[#f9f7fe] py-12">
					{/* Background Blobs */}
					<div className="absolute inset-0 overflow-hidden">
						{/* Pink blob in top left */}
						<div className="absolute -left-64 -top-64 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-pink-400/40 via-pink-300/30 to-transparent blur-[120px]" />
						{/* Blue blob in bottom right */}
						<div className="absolute -bottom-64 -right-64 h-[800px] w-[800px] rounded-full bg-gradient-to-tl from-blue-400/40 via-blue-300/30 to-transparent blur-[120px]" />
					</div>
					<div className="container relative mx-auto grid min-h-[500px] grid-cols-1 items-center gap-12 px-4 md:grid-cols-2">
						{/* Left Content */}
						<div className="flex items-center">
							<div className="max-w-xl">
								<div className="flex items-center gap-2 text-sm font-medium text-[#00BFA5]">
									<Plus className="h-5 w-5" />
									<span>Reimagining Gift Giving</span>
								</div>
								<h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-6xl">
									THE GIFT REGISTRY PLATFORM BUILT FOR{' '}
									<span className="bg-gradient-to-r from-[#00BFA5] to-[#3B82F6] bg-clip-text text-transparent">
										MEANING
									</span>
								</h1>
								<p className="mt-6 text-lg text-gray-600">
									Create a registry that focuses on quality, not quantity. Help
									reduce clutter and create more meaningful gift-giving
									experiences.
								</p>
								<div className="mt-8 flex flex-wrap gap-4">
									<Button
										asChild
										className="bg-[#00BFA5] text-white hover:bg-[#00BFA5]/90"
									>
										<Link to="/create-gift-list">Create a Registry →</Link>
									</Button>
									<Button
										asChild
										variant="outline"
										className="border-gray-200 text-gray-900 hover:bg-gray-50"
									>
										<Link to="/learn-more">Learn More</Link>
									</Button>
								</div>
							</div>
						</div>

						{/* Right Slider */}
						<div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-2xl md:aspect-[16/10]">
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
									<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
									{/* <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
										<p className="text-lg font-medium">
											Create joyful memories that last a lifetime
										</p>
									</div> */}
								</div>
							))}

							{/* Slider Navigation */}
							<div className="absolute bottom-16 left-6 flex gap-2">
								{heroSlides.map((_, index) => (
									<button
										key={index}
										onClick={() => setCurrentSlide(index)}
										className={cn(
											'h-2 rounded-full transition-all duration-300',
											index === currentSlide
												? 'w-6 bg-white'
												: 'w-2 bg-white/50 hover:bg-white/75',
										)}
										aria-label={`Go to slide ${index + 1}`}
									/>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* How Wish & Well Works - Simple Steps */}
				<section className="relative py-16">
					<div className="container mx-auto px-4">
						<h2 className="mb-4 text-center text-3xl font-bold text-gray-900 md:text-4xl">
							How Wish & Well Works
						</h2>
						<p className="mx-auto mb-12 max-w-2xl text-center text-lg text-gray-600">
							Our simple process helps you create meaningful gift experiences
						</p>
						<div className="grid gap-8 md:grid-cols-3">
							<div className="relative flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
								<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00BFA5]">
									<Icon name="gift" className="h-8 w-8 text-white" />
								</div>
								<h3 className="mb-2 text-xl font-semibold text-gray-900">
									Create a Registry
								</h3>
								<p className="text-center text-gray-600">
									Choose from our three registry types and add your child's
									profile information.
								</p>
							</div>
							<div className="relative flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
								<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00BFA5]">
									<Icon name="plus" className="h-8 w-8 text-white" />
								</div>
								<h3 className="mb-2 text-xl font-semibold text-gray-900">
									Share with Loved Ones
								</h3>
								<p className="text-center text-gray-600">
									Invite family and friends to contribute to meaningful gifts
									your child will cherish.
								</p>
							</div>
							<div className="relative flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
								<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00BFA5]">
									<Icon name="check" className="h-8 w-8 text-white" />
								</div>
								<h3 className="mb-2 text-xl font-semibold text-gray-900">
									Create Lasting Memories
								</h3>
								<p className="text-center text-gray-600">
									Reduce clutter and create more meaningful gift-giving
									experiences.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Everything You Need Section */}
				<section className="bg-white py-16">
					<div className="container mx-auto px-4">
						<h2 className="mb-2 text-center text-4xl font-bold md:text-5xl">
							EVERYTHING YOU NEED TO
						</h2>
						<h2 className="mb-6 text-center text-4xl font-bold text-[#00BFA5] md:text-5xl">
							CELEBRATE MEANINGFULLY
						</h2>
						<p className="mb-16 text-center text-lg text-gray-600">
							No more excessive gifts. No more clutter. Just meaningful
							celebrations.
						</p>

						<div className="grid gap-8 md:grid-cols-2">
							{/* Gift Categories Column */}
							<div className="rounded-2xl bg-white p-8 shadow-lg">
								<div className="mb-6 flex items-center gap-4">
									<div className="rounded-full bg-[#E5F9F6] p-3">
										<Icon name="gift" className="h-6 w-6 text-[#00BFA5]" />
									</div>
									<h3 className="text-2xl font-bold">
										Meaningful Gift Categories
									</h3>
								</div>
								<p className="mb-8 text-gray-600">
									Our unique 5-category system ensures children receive a
									balanced and thoughtful selection of gifts that contribute to
									their growth and happiness.
								</p>

								{/* Want Category */}
								<div className="mb-4 rounded-lg bg-[#E5F9F6] p-4">
									<div className="mb-2 flex items-center gap-3">
										<Icon name="gift" className="h-5 w-5 text-[#00BFA5]" />
										<h4 className="font-semibold">Want</h4>
									</div>
									<p className="mb-2 text-gray-600">
										Something they truly desire that brings joy and excitement.
									</p>
									<div className="flex flex-wrap gap-2">
										<span className="rounded-full bg-white px-3 py-1 text-sm">
											LEGO Sets
										</span>
										<span className="rounded-full bg-white px-3 py-1 text-sm">
											Art Supplies
										</span>
										<span className="rounded-full bg-white px-3 py-1 text-sm">
											Favorite Character Toys
										</span>
									</div>
								</div>

								{/* Need Category */}
								<div className="mb-4 rounded-lg bg-[#F3F4F6] p-4">
									<div className="mb-2 flex items-center gap-3">
										<Icon name="check" className="h-5 w-5 text-[#00BFA5]" />
										<h4 className="font-semibold">Need</h4>
									</div>
									<p className="mb-2 text-gray-600">
										Practical items that support their daily life and
										development.
									</p>
									<div className="flex flex-wrap gap-2">
										<span className="rounded-full bg-white px-3 py-1 text-sm">
											Backpack
										</span>
										<span className="rounded-full bg-white px-3 py-1 text-sm">
											Lunch Box
										</span>
										<span className="rounded-full bg-white px-3 py-1 text-sm">
											Water Bottle
										</span>
									</div>
								</div>

								{/* Experience Category */}
								<div className="mb-4 rounded-lg bg-[#FFF7ED] p-4">
									<div className="mb-2 flex items-center gap-3">
										<Icon name="plus" className="h-5 w-5 text-[#00BFA5]" />
										<h4 className="font-semibold">Experience</h4>
									</div>
									<p className="mb-2 text-gray-600">
										Activities and adventures that create lasting memories.
									</p>
									<div className="flex flex-wrap gap-2">
										<span className="rounded-full bg-white px-3 py-1 text-sm">
											Museum Passes
										</span>
										<span className="rounded-full bg-white px-3 py-1 text-sm">
											Zoo Membership
										</span>
										<span className="rounded-full bg-white px-3 py-1 text-sm">
											Swimming Lessons
										</span>
									</div>
								</div>

								{/* Wear Category */}
								<div className="mb-4 rounded-lg bg-[#FDF2F8] p-4">
									<div className="mb-2 flex items-center gap-3">
										<Icon name="avatar" className="h-5 w-5 text-[#00BFA5]" />
										<h4 className="font-semibold">Wear</h4>
									</div>
									<p className="mb-2 text-gray-600">
										Clothing and accessories that express their personality.
									</p>
									<div className="flex flex-wrap gap-2">
										<span className="rounded-full bg-white px-3 py-1 text-sm">
											Rain Boots
										</span>
										<span className="rounded-full bg-white px-3 py-1 text-sm">
											Special Occasion Outfit
										</span>
										<span className="rounded-full bg-white px-3 py-1 text-sm">
											Costume
										</span>
									</div>
								</div>

								{/* Learn Category */}
								<div className="rounded-lg bg-[#F5F3FF] p-4">
									<div className="mb-2 flex items-center gap-3">
										<Icon name="file-text" className="h-5 w-5 text-[#00BFA5]" />
										<h4 className="font-semibold">Learn</h4>
									</div>
									<p className="mb-2 text-gray-600">
										Educational items that spark curiosity and foster growth.
									</p>
									<div className="flex flex-wrap gap-2">
										<span className="rounded-full bg-white px-3 py-1 text-sm">
											Books
										</span>
										<span className="rounded-full bg-white px-3 py-1 text-sm">
											Science Kits
										</span>
										<span className="rounded-full bg-white px-3 py-1 text-sm">
											Musical Instruments
										</span>
									</div>
								</div>
							</div>

							{/* Registry Options Column */}
							<div className="rounded-2xl bg-white p-8 shadow-lg">
								<div className="mb-6 flex items-center gap-4">
									<div className="rounded-full bg-[#EEF2FF] p-3">
										<Icon name="check" className="h-6 w-6 text-[#00BFA5]" />
									</div>
									<h3 className="text-2xl font-bold">Registry Options</h3>
								</div>
								<p className="mb-8 text-gray-600">
									Choose from three unique registry types to match your family's
									preferences.
								</p>

								{/* Standard Registry */}
								<div className="mb-6 rounded-lg bg-[#F3F4F6] p-6">
									<div className="mb-3 flex items-center gap-3">
										<Icon name="check" className="h-6 w-6 text-[#00BFA5]" />
										<h4 className="text-xl font-semibold">
											Balanced Wishes Registry
										</h4>
									</div>
									<p className="mb-2 text-gray-700">
										The classic 5-category approach that ensures a balanced
										selection of gifts across all categories.
									</p>
									<p className="text-sm text-gray-500">
										Perfect for birthdays, holidays, and special occasions when
										you want variety.
									</p>
								</div>

								{/* OneGift Registry */}
								<div className="mb-6 rounded-lg bg-[#F3F4F6] p-6">
									<div className="mb-3 flex items-center gap-3">
										<Icon name="gift" className="h-6 w-6 text-[#00BFA5]" />
										<h4 className="text-xl font-semibold">OneGift Registry</h4>
									</div>
									<p className="mb-2 text-gray-700">
										Everyone contributes to one special gift that might
										otherwise be out of reach.
									</p>
									<p className="text-sm text-gray-500">
										Ideal for bigger items like bicycles, playsets, or special
										experiences.
									</p>
								</div>

								{/* Reverse Gift Registry */}
								<div className="mb-6 rounded-lg bg-[#F3F4F6] p-6">
									<div className="mb-3 flex items-center gap-3">
										<Icon name="plus" className="h-6 w-6 text-[#00BFA5]" />
										<h4 className="text-xl font-semibold">
											Reverse Gift Registry
										</h4>
									</div>
									<p className="mb-2 text-gray-700">
										Guests suggest gifts for your approval, bringing their
										unique ideas to the celebration.
									</p>
									<p className="text-sm text-gray-500">
										Great when you want to be surprised but still maintain some
										guidance.
									</p>
								</div>

								<p className="text-center text-sm text-gray-600">
									All registry types include our special interactive features
									and memory collection.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Interactive Features Section */}
				<section className="bg-[#f9f7fe] py-16">
					<div className="container mx-auto px-4">
						<div className="grid gap-8 md:grid-cols-2">
							{/* Interactive Giving Card */}
							<div className="rounded-2xl border border-orange-100 bg-white p-8 shadow-lg">
								<div className="mb-6 flex items-center gap-4">
									<div className="rounded-full bg-orange-50 p-3">
										<Icon
											name="envelope-closed"
											className="h-6 w-6 text-orange-400"
										/>
									</div>
									<h3 className="text-2xl font-bold">Interactive Giving</h3>
								</div>
								<p className="mb-8 text-gray-600">
									Contributors don't just give gifts—they share personal
									messages, photos, videos, and audio recordings.
								</p>

								<div className="grid grid-cols-2 gap-4">
									{/* Text Prompts */}
									<div className="rounded-lg bg-orange-50 p-4">
										<Icon
											name="envelope-closed"
											className="mb-3 h-5 w-5 text-orange-400"
										/>
										<h4 className="mb-2 font-semibold">Text Prompts</h4>
										<p className="mb-2 text-sm text-gray-600">
											Share personal stories and memories in writing.
										</p>
										<p className="text-sm italic text-gray-500">
											"What was your favorite toy as a kid?"
										</p>
									</div>

									{/* Photo Booth */}
									<div className="rounded-lg bg-orange-50 p-4">
										<Icon
											name="camera"
											className="mb-3 h-5 w-5 text-orange-400"
										/>
										<h4 className="mb-2 font-semibold">Photo Booth</h4>
										<p className="mb-2 text-sm text-gray-600">
											Capture fun moments with our built-in photo booth.
										</p>
										<p className="text-sm italic text-gray-500">
											"Strike a silly pose to make Emma laugh!"
										</p>
									</div>

									{/* Video Messages */}
									<div className="rounded-lg bg-orange-50 p-4">
										<Icon
											name="camera"
											className="mb-3 h-5 w-5 text-orange-400"
										/>
										<h4 className="mb-2 font-semibold">Video Messages</h4>
										<p className="mb-2 text-sm text-gray-600">
											Record personalized video messages and challenges.
										</p>
										<p className="text-sm italic text-gray-500">
											"Eat 5 crackers and try to whistle!"
										</p>
									</div>

									{/* Audio Recordings */}
									<div className="rounded-lg bg-orange-50 p-4">
										<Icon
											name="plus"
											className="mb-3 h-5 w-5 text-orange-400"
										/>
										<h4 className="mb-2 font-semibold">Audio Recordings</h4>
										<p className="mb-2 text-sm text-gray-600">
											Share songs, stories, or special messages.
										</p>
										<p className="text-sm italic text-gray-500">
											"Sing your favorite childhood song!"
										</p>
									</div>
								</div>

								<p className="mt-8 text-center text-sm text-gray-600">
									All these interactive elements become treasured memories that
									last far longer than physical gifts.
								</p>
							</div>

							{/* Child Profiles Card */}
							<div className="rounded-2xl border border-red-100 bg-white p-8 shadow-lg">
								<div className="mb-6 flex items-center gap-4">
									<div className="rounded-full bg-red-50 p-3">
										<Icon name="avatar" className="h-6 w-6 text-red-400" />
									</div>
									<h3 className="text-2xl font-bold">Child Profiles</h3>
								</div>
								<p className="mb-8 text-gray-600">
									Each child's profile showcases their personality,
									achievements, and aspirations.
								</p>

								{/* Past Year Achievements */}
								<div className="mb-6 rounded-lg bg-red-50 p-6">
									<div className="mb-3 flex items-center gap-3">
										<Icon name="check" className="h-6 w-6 text-red-400" />
										<h4 className="text-xl font-semibold">
											Past Year Achievements
										</h4>
									</div>
									<p className="mb-2 text-gray-700">
										Celebrate milestones like learning to swim, riding a bike,
										or reading independently.
									</p>
									<p className="text-sm text-gray-500">
										Helps gift-givers understand what matters to your child.
									</p>
								</div>

								{/* Memory Gallery */}
								<div className="mb-6 rounded-lg bg-red-50 p-6">
									<div className="mb-3 flex items-center gap-3">
										<Icon name="camera" className="h-6 w-6 text-red-400" />
										<h4 className="text-xl font-semibold">Memory Gallery</h4>
									</div>
									<p className="mb-2 text-gray-700">
										Share favorite photos and moments from the past year in a
										beautiful gallery.
									</p>
									<p className="text-sm text-gray-500">
										Creates a visual timeline of your child's growth and
										experiences.
									</p>
								</div>

								{/* Future Goals */}
								<div className="mb-6 rounded-lg bg-red-50 p-6">
									<div className="mb-3 flex items-center gap-3">
										<Icon name="plus" className="h-6 w-6 text-red-400" />
										<h4 className="text-xl font-semibold">Future Goals</h4>
									</div>
									<p className="mb-2 text-gray-700">
										Highlight what they're looking forward to learning or
										experiencing.
									</p>
									<p className="text-sm text-gray-500">
										Inspires gifts that support their dreams and aspirations.
									</p>
								</div>

								<p className="text-center text-sm text-gray-600">
									Profiles help gift-givers connect with your child on a deeper
									level, leading to more meaningful gifts.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="bg-[#00BFA5] py-24 text-center">
					<div className="container mx-auto px-4">
						<h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
							READY TO CREATE MORE
							<br />
							MEANINGFUL CELEBRATIONS?
						</h2>
						<p className="mb-8 text-xl text-white">
							Join thousands of families who are changing how we give gifts.
						</p>
						<Link
							to="/create-gift-list"
							className="inline-block rounded-full bg-white px-8 py-4 font-semibold text-[#00BFA5] transition-all hover:bg-opacity-90"
						>
							Start Your Registry →
						</Link>
						<div className="mt-8 flex items-center justify-center gap-8">
							<div className="flex items-center gap-2 text-white">
								<Icon name="check" className="h-5 w-5" />
								<span>No credit card required</span>
							</div>
							<div className="flex items-center gap-2 text-white">
								<Icon name="check" className="h-5 w-5" />
								<span>30-day free trial</span>
							</div>
							<div className="flex items-center gap-2 text-white">
								<Icon name="check" className="h-5 w-5" />
								<span>Cancel anytime</span>
							</div>
						</div>
					</div>
				</section>

				{/* Footer */}
				<footer className="bg-white py-16">
					<div className="container mx-auto px-4">
						<div className="mb-8 grid grid-cols-4 gap-8">
							{/* Column 1 - Wish & Well */}
							<div>
								<h3 className="mb-4 font-bold">Wish & Well</h3>
								<div className="mb-2 flex items-center gap-2">
									<Icon name="gift" className="h-5 w-5 text-[#00BFA5]" />
									<span className="font-bold">Wish & Well</span>
								</div>
								<p className="text-gray-600">
									Meaningful gifts for growing minds.
								</p>
							</div>

							{/* Column 2 - Registry Types */}
							<div>
								<h3 className="mb-4 font-bold">Registry Types</h3>
								<ul className="space-y-2 text-gray-600">
									<li>
										<Link to="/standard-registry">Standard Registry</Link>
									</li>
									<li>
										<Link to="/onegift">OneGift</Link>
									</li>
									<li>
										<Link to="/reverse-gift-list">Reverse Gift List</Link>
									</li>
								</ul>
							</div>

							{/* Column 3 - Company */}
							<div>
								<h3 className="mb-4 font-bold">Company</h3>
								<ul className="space-y-2 text-gray-600">
									<li>
										<Link to="/about">About Us</Link>
									</li>
									<li>
										<Link to="/blog">Blog</Link>
									</li>
									<li>
										<Link to="/careers">Careers</Link>
									</li>
								</ul>
							</div>

							{/* Column 4 - Legal */}
							<div>
								<h3 className="mb-4 font-bold">Legal</h3>
								<ul className="space-y-2 text-gray-600">
									<li>
										<Link to="/terms">Terms</Link>
									</li>
									<li>
										<Link to="/privacy">Privacy</Link>
									</li>
									<li>
										<Link to="/cookies">Cookies</Link>
									</li>
								</ul>
							</div>
						</div>

						<div className="flex items-center justify-between border-t border-gray-200 pt-8">
							<p className="text-gray-600">
								© 2025 Wish & Well. All rights reserved.
							</p>
							<div className="flex items-center gap-4">
								<Link
									to="https://facebook.com"
									className="text-gray-400 hover:text-gray-600"
								>
									<Icon name="plus" className="h-5 w-5" />
								</Link>
								<Link
									to="https://instagram.com"
									className="text-gray-400 hover:text-gray-600"
								>
									<Icon name="camera" className="h-5 w-5" />
								</Link>
								<Link
									to="https://twitter.com"
									className="text-gray-400 hover:text-gray-600"
								>
									<Icon name="plus" className="h-5 w-5" />
								</Link>
							</div>
						</div>
					</div>
				</footer>
			</main>
		</div>
	)
}
