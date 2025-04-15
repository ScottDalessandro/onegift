import {
	ArrowRight,
	Check,
	Gift,
	Heart,
	MessageCircle,
	Play,
	Plus,
	User,
} from 'lucide-react'
import { Img } from 'openimg/react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
import { Icon } from '#app/components/ui/icon'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '#app/components/ui/tabs'
import { cn } from '#app/utils/misc.tsx'
import { theme } from '#app/utils/theme'
import { type Route } from './+types/index'

// Temporary placeholder image URL
const placeholderImage =
	'https://placehold.co/800x600/rose/white/png?text=Coming+Soon'

const heroSlides = [
	{
		image: '/img/hero/beckett-birthday-edited.jpg',
		alt: 'A child celebrating their birthday with mindfully chosen gifts',
		heading: 'Meaningful Gifts for Growing Minds',
		subheading:
			'Create a registry that focuses on quality, not quantity. Help reduce clutter and create more meaningful gift-giving experiences.',
	},
	{
		image: '/img/hero/mikayla-10.jpg',
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
	const [activeRegistry, setActiveRegistry] = useState('balanced')

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
							{heroSlides.map((slide, index) => {
								console.log('slide', slide)
								return (
									<div
										key={index}
										className={cn(
											'absolute inset-0 transition-opacity duration-1000',
											index === currentSlide ? 'opacity-100' : 'opacity-0',
										)}
									>
										<Img
											src={slide.image}
											alt={slide.alt}
											className="h-full w-full object-cover"
											width={1000}
											height={1000}
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
										{/* <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-lg font-medium">
                    Create joyful memories that last a lifetime
                </p>
            </div> */}
									</div>
								)
							})}

							{/* Slider Navigation */}
							<div className="absolute bottom-16 left-6 flex gap-2">
								{heroSlides.map((slide, index) => (
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
				<section
					id="how-it-works"
					className="bg-gray-50 py-12 md:py-24 lg:py-32"
				>
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
								How Wish & Well Works
							</h2>
							<p className="max-w-[700px] text-gray-500 md:text-xl">
								Our simple process helps you create meaningful gift experiences
								and preserve precious memories
							</p>
						</div>
						<div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
							<Card className="border-none shadow-md">
								<CardHeader className="pb-2">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
										<Gift className="h-6 w-6 text-teal-700" />
									</div>
									<CardTitle>Create a Registry</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-gray-500">
										Choose from our three unique registry types and add your
										child's profile information.
									</p>
								</CardContent>
							</Card>
							<Card className="border-none shadow-md">
								<CardHeader className="pb-2">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
										<Heart className="h-6 w-6 text-teal-700" />
									</div>
									<CardTitle>Share with Loved Ones</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-gray-500">
										Invite family and friends to contribute to meaningful gifts
										your child will cherish.
									</p>
								</CardContent>
							</Card>
							<Card className="border-none shadow-md">
								<CardHeader className="pb-2">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
										<MessageCircle className="h-6 w-6 text-teal-700" />
									</div>
									<CardTitle>Create Fun Digital Memories</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-gray-500">
										Contributors share playful challenges, photo booth pics, mix
										tapes, and friendly competitions alongside their gifts.
									</p>
								</CardContent>
							</Card>
							<Card className="border-none shadow-md">
								<CardHeader className="pb-2">
									<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
										<Play className="h-6 w-6 text-teal-700" />
									</div>
									<CardTitle>Treasure Forever</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-gray-500">
										Access your digital memory collection anytime, creating a
										lasting emotional keepsake beyond physical gifts.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				<section id="our-products" className="py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
								EVERYTHING YOU NEED TO{' '}
								<span className="text-teal-500">CELEBRATE MEANINGFULLY</span>
							</h2>
							<p className="max-w-[700px] text-gray-500 md:text-xl">
								No more excessive gifts. No more clutter. Just meaningful
								celebrations.
							</p>
						</div>

						<Tabs defaultValue="registries" className="mt-12">
							<TabsList className="mb-8 grid w-full grid-cols-2">
								<TabsTrigger value="registries" className="text-lg">
									Registry Options
								</TabsTrigger>
								<TabsTrigger value="memories" className="text-lg">
									Digital Memories
								</TabsTrigger>
							</TabsList>

							<TabsContent value="registries" className="space-y-8">
								<div id="registries">
									<div className="grid gap-6 md:grid-cols-3">
										<button
											onClick={() => setActiveRegistry('balanced')}
											className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
												activeRegistry === 'balanced'
													? 'border-teal-500 shadow-lg'
													: 'border-gray-200'
											}`}
										>
											<div className="p-6">
												<div className="mb-3 flex items-center gap-2">
													<Check
														className={`h-5 w-5 ${activeRegistry === 'balanced' ? 'text-teal-500' : 'text-gray-400'}`}
													/>
													<h3 className="text-lg font-medium">
														Balanced Wishes Registry
													</h3>
												</div>
												<p className="text-left text-sm text-gray-600">
													The classic 5-category approach that ensures a
													balanced selection of gifts.
												</p>
											</div>
											{activeRegistry === 'balanced' && (
												<div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-500"></div>
											)}
										</button>

										<button
											onClick={() => setActiveRegistry('onegift')}
											className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
												activeRegistry === 'onegift'
													? 'border-teal-500 shadow-lg'
													: 'border-gray-200'
											}`}
										>
											<div className="p-6">
												<div className="mb-3 flex items-center gap-2">
													<Check
														className={`h-5 w-5 ${activeRegistry === 'onegift' ? 'text-teal-500' : 'text-gray-400'}`}
													/>
													<h3 className="text-lg font-medium">
														OneGift Registry
													</h3>
												</div>
												<p className="text-left text-sm text-gray-600">
													Everyone contributes to one special gift that might
													otherwise be out of reach.
												</p>
											</div>
											{activeRegistry === 'onegift' && (
												<div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-500"></div>
											)}
										</button>

										<button
											onClick={() => setActiveRegistry('reverse')}
											className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
												activeRegistry === 'reverse'
													? 'border-teal-500 shadow-lg'
													: 'border-gray-200'
											}`}
										>
											<div className="p-6">
												<div className="mb-3 flex items-center gap-2">
													<Plus
														className={`h-5 w-5 ${activeRegistry === 'reverse' ? 'text-teal-500' : 'text-gray-400'}`}
													/>
													<h3 className="text-lg font-medium">
														Reverse Gift Registry
													</h3>
												</div>
												<p className="text-left text-sm text-gray-600">
													Guests suggest gifts for your approval, bringing their
													unique ideas to the celebration.
												</p>
											</div>
											{activeRegistry === 'reverse' && (
												<div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-500"></div>
											)}
										</button>
									</div>

									<div className="mt-8 rounded-xl bg-gray-50 p-8">
										{activeRegistry === 'balanced' && (
											<div className="grid gap-8 md:grid-cols-2">
												<div className="space-y-4">
													<h3 className="text-2xl font-bold">
														Balanced Wishes Registry
													</h3>
													<p className="text-gray-600">
														The classic 5-category approach that ensures a
														balanced selection of gifts across all categories.
													</p>
													<p className="text-gray-500">
														Perfect for birthdays, holidays, and special
														occasions when you want variety.
													</p>
													<div className="space-y-2">
														<h4 className="font-medium">Key Benefits:</h4>
														<ul className="space-y-2">
															<li className="flex items-start gap-2">
																<Check className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
																<span className="text-gray-600">
																	Ensures children receive a thoughtful mix of
																	gifts across all 5 categories
																</span>
															</li>
															<li className="flex items-start gap-2">
																<Check className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
																<span className="text-gray-600">
																	Prevents gift overload in any single category
																</span>
															</li>
															<li className="flex items-start gap-2">
																<Check className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
																<span className="text-gray-600">
																	Gives gift-givers clear guidance while still
																	offering plenty of choices
																</span>
															</li>
														</ul>
													</div>
													<Button className="mt-4 bg-teal-500 hover:bg-teal-600">
														Create Balanced Registry
													</Button>
												</div>
												<div className="relative h-[300px] overflow-hidden rounded-xl">
													<Img
														src="/placeholder.svg?key=balanced-registry"
														alt="Balanced Wishes Registry example"
														width={600}
														height={300}
														className="h-full w-full object-cover"
													/>
												</div>
											</div>
										)}

										{activeRegistry === 'onegift' && (
											<div className="grid gap-8 md:grid-cols-2">
												<div className="space-y-4">
													<h3 className="text-2xl font-bold">
														OneGift Registry
													</h3>
													<p className="text-gray-600">
														Everyone contributes to one special gift that might
														otherwise be out of reach.
													</p>
													<p className="text-gray-500">
														Ideal for bigger items like bicycles, playsets, or
														special experiences.
													</p>
													<div className="space-y-2">
														<h4 className="font-medium">Perfect For:</h4>
														<ul className="space-y-2">
															<li className="flex items-start gap-2">
																<Check className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
																<span className="text-gray-600">
																	Big-ticket items like bicycles, playsets, or
																	electronics
																</span>
															</li>
															<li className="flex items-start gap-2">
																<Check className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
																<span className="text-gray-600">
																	Special experiences like museum memberships or
																	classes
																</span>
															</li>
															<li className="flex items-start gap-2">
																<Check className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
																<span className="text-gray-600">
																	Families who want to minimize physical gifts
																	but maximize impact
																</span>
															</li>
														</ul>
													</div>
													<Button className="mt-4 bg-teal-500 hover:bg-teal-600">
														Create OneGift Registry
													</Button>
												</div>
												<div className="relative h-[300px] overflow-hidden rounded-xl">
													<Img
														src="/placeholder.svg?key=onegift-registry"
														alt="OneGift Registry example"
														width={600}
														height={300}
														className="h-full w-full object-cover"
													/>
												</div>
											</div>
										)}

										{activeRegistry === 'reverse' && (
											<div className="grid gap-8 md:grid-cols-2">
												<div className="space-y-4">
													<h3 className="text-2xl font-bold">
														Reverse Gift Registry
													</h3>
													<p className="text-gray-600">
														Guests suggest gifts for your approval, bringing
														their unique ideas to the celebration.
													</p>
													<p className="text-gray-500">
														Great when you want to be surprised but still
														maintain some guidance.
													</p>
													<div className="space-y-2">
														<h4 className="font-medium">How It Works:</h4>
														<ul className="space-y-2">
															<li className="flex items-start gap-2">
																<Check className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
																<span className="text-gray-600">
																	Guests suggest gift ideas based on their
																	knowledge of your child
																</span>
															</li>
															<li className="flex items-start gap-2">
																<Check className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
																<span className="text-gray-600">
																	You review and approve suggestions before they
																	become visible to others
																</span>
															</li>
															<li className="flex items-start gap-2">
																<Check className="mt-0.5 h-5 w-5 shrink-0 text-teal-500" />
																<span className="text-gray-600">
																	Discover unique gift ideas you might not have
																	thought of yourself
																</span>
															</li>
														</ul>
													</div>
													<Button className="mt-4 bg-teal-500 hover:bg-teal-600">
														Create Reverse Registry
													</Button>
												</div>
												<div className="relative h-[300px] overflow-hidden rounded-xl">
													<Img
														src="/placeholder.svg?key=reverse-registry"
														alt="Reverse Gift Registry example"
														width={600}
														height={300}
														className="h-full w-full object-cover"
													/>
												</div>
											</div>
										)}
									</div>

									<div className="mt-8 rounded-xl border border-gray-100 bg-white p-6">
										<h3 className="mb-4 text-xl font-medium">
											Meaningful Gift Categories
										</h3>
										<div className="grid gap-6 md:grid-cols-5">
											<div>
												<h4 className="mb-2 font-medium">Want</h4>
												<p className="text-sm text-gray-500">
													Something they truly desire that brings joy and
													excitement.
												</p>
											</div>
											<div>
												<h4 className="mb-2 font-medium">Need</h4>
												<p className="text-sm text-gray-500">
													Practical items that support their daily life and
													development.
												</p>
											</div>
											<div>
												<h4 className="mb-2 font-medium">Experience</h4>
												<p className="text-sm text-gray-500">
													Activities and adventures that create lasting
													memories.
												</p>
											</div>
											<div>
												<h4 className="mb-2 font-medium">Wear</h4>
												<p className="text-sm text-gray-500">
													Clothing and accessories that express their
													personality.
												</p>
											</div>
											<div>
												<h4 className="mb-2 font-medium">Learn</h4>
												<p className="text-sm text-gray-500">
													Educational items that spark curiosity and foster
													growth.
												</p>
											</div>
										</div>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="memories" className="space-y-8">
								<div className="mb-8 rounded-xl bg-teal-50 p-8">
									<div className="mx-auto max-w-3xl text-center">
										<h3 className="mb-4 text-2xl font-bold">
											Digital Memories: The Fun Part!
										</h3>
										<p className="mb-6 text-gray-700">
											Our Digital Memories collection turns gift-giving into an
											interactive experience. It's like having a photo booth,
											mix tape creator, and friendly competition platform all in
											one place!
										</p>
									</div>
								</div>

								<div id="memories" className="grid gap-8 md:grid-cols-2">
									<Card className="overflow-hidden border-2 border-teal-100 shadow-md">
										<CardHeader className="bg-teal-50 pb-2">
											<CardTitle className="flex items-center gap-2">
												<img
													src="app/assets/images/features/classic-camera-icon.png"
													alt="Camera icon"
													width={24}
													height={24}
												/>
												Photo Booth Fun
											</CardTitle>
										</CardHeader>
										<CardContent className="pt-6">
											<div className="space-y-4">
												<p className="text-sm">
													Strike silly poses, use digital props, and create
													memorable moments!
												</p>
												<div className="rounded-lg bg-gray-50 p-4">
													<p className="text-sm font-medium">
														Challenge Ideas:
													</p>
													<ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
														<li>
															"Make your goofiest face to make the birthday girl
															laugh"
														</li>
														<li>"Show us your best superhero pose"</li>
														<li>
															"Take a family photo where everyone is upside
															down"
														</li>
													</ul>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card className="overflow-hidden border-2 border-teal-100 shadow-md">
										<CardHeader className="bg-teal-50 pb-2">
											<CardTitle className="flex items-center gap-2">
												<Img
													src="app/assets/images/features/simple-audio-icon.png"
													alt="Audio icon"
													width={24}
													height={24}
												/>
												Mix Tape Creator
											</CardTitle>
										</CardHeader>
										<CardContent className="pt-6">
											<div className="space-y-4">
												<p className="text-sm">
													Send songs, create playlists, and share the soundtrack
													of your memories!
												</p>
												<div className="rounded-lg bg-gray-50 p-4">
													<p className="text-sm font-medium">Fun Ideas:</p>
													<ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
														<li>
															"Everyone add a song that reminds you of Emma"
														</li>
														<li>
															"Create a birthday morning playlist to wake up to"
														</li>
														<li>
															"Record yourself singing happy birthday (no matter
															how off-key!)"
														</li>
													</ul>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card className="overflow-hidden border-2 border-teal-100 shadow-md">
										<CardHeader className="bg-teal-50 pb-2">
											<CardTitle className="flex items-center gap-2">
												<MessageCircle className="h-5 w-5 text-teal-500" />
												Family Challenges
											</CardTitle>
										</CardHeader>
										<CardContent className="pt-6">
											<div className="space-y-4">
												<p className="text-sm">
													Create friendly competitions between family members!
												</p>
												<div className="rounded-lg bg-gray-50 p-4">
													<p className="text-sm font-medium">
														Challenge Examples:
													</p>
													<ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
														<li>
															"Who can score better on an SAT math test, Aunt
															Lanna or Uncle Brendan?"
														</li>
														<li>
															"Grandma vs. Grandpa: Who knows the birthday boy
															better?"
														</li>
														<li>
															"Cousins challenge: Who can do the most jumping
															jacks in 30 seconds?"
														</li>
													</ul>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card className="overflow-hidden border-2 border-teal-100 shadow-md">
										<CardHeader className="bg-teal-50 pb-2">
											<CardTitle className="flex items-center gap-2">
												<Play className="h-5 w-5 text-teal-500" />
												Video Time Capsules
											</CardTitle>
										</CardHeader>
										<CardContent className="pt-6">
											<div className="space-y-4">
												<p className="text-sm">
													Record special messages, challenges, and predictions
													for the future!
												</p>
												<div className="rounded-lg bg-gray-50 p-4">
													<p className="text-sm font-medium">Prompt Ideas:</p>
													<ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
														<li>
															"Record your prediction: What will Noah be when he
															grows up?"
														</li>
														<li>
															"Show and tell: Share something special from your
															childhood"
														</li>
														<li>
															"Eat 5 crackers and try to whistle the happy
															birthday song!"
														</li>
													</ul>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>

								<div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 p-8 md:p-10">
									<div className="relative z-10 mx-auto max-w-3xl text-center">
										<h3 className="mb-4 text-2xl font-bold text-white">
											More Than Just Gifts
										</h3>
										<p className="mb-6 text-white">
											Digital Memories turn ordinary gift-giving into
											extraordinary experiences. Long after the toys are
											outgrown and the clothes don't fit, these playful
											interactions become treasured keepsakes that capture
											personalities, relationships, and special moments in time.
										</p>
										<Button className="bg-white text-teal-500 hover:bg-gray-100">
											Create Your Memory Collection
										</Button>
									</div>
									<div className="absolute inset-0 opacity-10">
										<Img
											src="/polaroid-background.png"
											alt="Background pattern"
											width={1200}
											height={600}
											className="h-full w-full object-cover"
										/>
									</div>
								</div>

								<div className="grid gap-6 md:grid-cols-3">
									<div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
										<div className="mb-4 flex justify-center">
											<div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
												<Gift className="h-6 w-6 text-teal-600" />
											</div>
										</div>
										<h3 className="mb-2 text-center font-medium">
											Alongside Gifts
										</h3>
										<p className="text-center text-sm text-gray-500">
											Add fun digital memories to complement physical gifts in
											any registry.
										</p>
									</div>

									<div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
										<div className="mb-4 flex justify-center">
											<div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
												<Img
													src="../../assets/images/featuresimple-audio-icon.png"
													alt="Audio icon"
													width={24}
													height={24}
												/>
											</div>
										</div>
										<h3 className="mb-2 text-center font-medium">
											As a Standalone
										</h3>
										<p className="text-center text-sm text-gray-500">
											Create a digital-only collection for distant relatives or
											no-gift celebrations.
										</p>
									</div>

									<div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
										<div className="mb-4 flex justify-center">
											<div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
												<Heart className="h-6 w-6 text-teal-600" />
											</div>
										</div>
										<h3 className="mb-2 text-center font-medium">
											For Any Occasion
										</h3>
										<p className="text-center text-sm text-gray-500">
											Birthdays, graduations, holidays, or just because—digital
											memories fit every celebration.
										</p>
									</div>
								</div>
							</TabsContent>
						</Tabs>
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
