'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatedSection } from './animated-section'

const inspirations = [
	{
		id: '1',
		title: 'Modern Bathroom',
		category: 'Bathroom',
		image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop',
	},
	{
		id: '2',
		title: 'Kitchen Elegance',
		category: 'Kitchen',
		image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop',
	},
	{
		id: '3',
		title: 'Living Room',
		category: 'Living',
		image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop',
	},
	{
		id: '4',
		title: 'Outdoor Space',
		category: 'Outdoor',
		image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop',
	},
	{
		id: '5',
		title: 'Minimalist Entry',
		category: 'Entryway',
		image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
	},
]

export function InspirationsGallery() {
	return (
		<section className="relative py-1 sm:py-1.5 lg:py-2 bg-muted/20 z-10">
			<div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
				{/* Section Header - Ultra Compact */}
				<AnimatedSection animation="fade-up">
					<div className="flex flex-col sm:flex-row sm:items-end justify-between mb-0.5 sm:mb-1 gap-0.5">
						<div>
							<p className="text-[7px] sm:text-[8px] text-muted-foreground uppercase tracking-wider mb-0.5">
								Ideas
							</p>
							<h2 className="font-serif text-sm sm:text-base lg:text-lg text-foreground">
								Get <span className="italic">Inspired</span>
							</h2>
						</div>
						<Link
							href="/inspiration"
							className="inline-flex items-center gap-0.5 text-[7px] sm:text-[8px] text-foreground hover:text-foreground/70 transition-colors group whitespace-nowrap"
						>
							View gallery
							<ArrowRight className="w-2 h-2 group-hover:translate-x-0.5 transition-transform" />
						</Link>
					</div>
				</AnimatedSection>

				{/* Bento Grid Layout - Ultra Compact and Minimal */}
				<div className="grid grid-cols-2 md:grid-cols-4 grid-rows-auto gap-[2px] sm:gap-0.5 h-auto md:h-[90px]">
					{/* Large Left Item */}
					<AnimatedSection
						animation="scale-up"
						delay={0}
						className="col-span-2 row-span-2 md:row-span-2 min-h-[48px] md:min-h-auto"
					>
						<Link
							href={`/inspiration/${inspirations[0].id}`}
							className="group block h-full"
						>
							<div className="relative h-full rounded-[4px] overflow-hidden">
								<img
									src={inspirations[0].image || '/placeholder.svg'}
									alt={inspirations[0].title}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
								<div className="absolute bottom-0.5 sm:bottom-1 left-0.5 sm:left-1">
									<p className="text-[5px] sm:text-[6px] text-background/70 uppercase tracking-wider mb-0">
										{inspirations[0].category}
									</p>
									<h3 className="text-[7px] sm:text-[8px] font-medium text-background line-clamp-1">
										{inspirations[0].title}
									</h3>
								</div>
							</div>
						</Link>
					</AnimatedSection>

					{/* Top Right Item */}
					<AnimatedSection
						animation="scale-up"
						delay={100}
						className="col-span-2 md:col-span-2 row-span-1 min-h-[24px] md:min-h-auto"
					>
						<Link
							href={`/inspiration/${inspirations[1].id}`}
							className="group block h-full"
						>
							<div className="relative h-full rounded-[4px] overflow-hidden">
								<img
									src={inspirations[1].image || '/placeholder.svg'}
									alt={inspirations[1].title}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
								<div className="absolute bottom-0.5 left-0.5 sm:left-1">
									<p className="text-[4px] sm:text-[5px] text-background/70 uppercase tracking-wider mb-0 hidden sm:block">
										{inspirations[1].category}
									</p>
									<h3 className="text-[6px] sm:text-[7px] font-medium text-background line-clamp-1">
										{inspirations[1].title}
									</h3>
								</div>
							</div>
						</Link>
					</AnimatedSection>

					{/* Bottom Right - 3 Small Items */}
					<AnimatedSection
						animation="scale-up"
						delay={200}
						className="col-span-1 row-span-1 min-h-[20px] md:min-h-auto"
					>
						<Link
							href={`/inspiration/${inspirations[2].id}`}
							className="group block h-full"
						>
							<div className="relative h-full rounded-[4px] overflow-hidden">
								<img
									src={inspirations[2].image || '/placeholder.svg'}
									alt={inspirations[2].title}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
								<div className="absolute bottom-0.5 left-0.5">
									<p className="text-[4px] text-background/70 uppercase tracking-wider mb-0 hidden sm:block">
										{inspirations[2].category}
									</p>
									<h3 className="text-[5px] sm:text-[6px] font-medium text-background line-clamp-1">
										{inspirations[2].title}
									</h3>
								</div>
							</div>
						</Link>
					</AnimatedSection>

					<AnimatedSection
						animation="scale-up"
						delay={300}
						className="col-span-1 row-span-1 min-h-[20px] md:min-h-auto"
					>
						<Link
							href={`/inspiration/${inspirations[3].id}`}
							className="group block h-full"
						>
							<div className="relative h-full rounded-[4px] overflow-hidden">
								<img
									src={inspirations[3].image || '/placeholder.svg'}
									alt={inspirations[3].title}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
								<div className="absolute bottom-0.5 left-0.5">
									<p className="text-[4px] text-background/70 uppercase tracking-wider mb-0 hidden sm:block">
										{inspirations[3].category}
									</p>
									<h3 className="text-[5px] sm:text-[6px] font-medium text-background line-clamp-1">
										{inspirations[3].title}
									</h3>
								</div>
							</div>
						</Link>
					</AnimatedSection>

					{/* Fifth item */}
					<AnimatedSection
						animation="scale-up"
						delay={400}
						className="col-span-2 md:col-span-1 row-span-1 min-h-[20px] md:min-h-auto"
					>
						<Link
							href={`/inspiration/${inspirations[4].id}`}
							className="group block h-full"
						>
							<div className="relative h-full rounded-[4px] overflow-hidden">
								<img
									src={inspirations[4].image || '/placeholder.svg'}
									alt={inspirations[4].title}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
								<div className="absolute bottom-0.5 left-0.5">
									<p className="text-[4px] text-background/70 uppercase tracking-wider mb-0">
										{inspirations[4].category}
									</p>
									<h3 className="text-[5px] sm:text-[6px] font-medium text-background line-clamp-1">
										{inspirations[4].title}
									</h3>
								</div>
							</div>
						</Link>
					</AnimatedSection>
				</div>
			</div>
		</section>
	)
}
