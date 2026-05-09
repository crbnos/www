import { Trans } from "@lingui/react/macro";
import { MeshGradient } from "@paper-design/shaders-react";
import { AnimatePresence, motion } from "framer-motion";
import {
	Book,
	Cable,
	CalendarDays,
	CheckCircle,
	ChevronRight,
	ExternalLink,
	GraduationCap,
	LayoutDashboard,
	Phone,
	Play,
	PlayCircle,
	Waypoints,
} from "lucide-react";
import { Link } from "react-router";
import { CodeExamples } from "~/components/code-examples";
import { DotPattern } from "~/components/dot-pattern";
import { Safari } from "~/components/safari";
import { Button } from "~/components/ui/button";
import { DiscordLogo } from "~/components/ui/discord-logo";
import { GithubLogo } from "~/components/ui/github-logo";
import { useMode } from "~/hooks/useMode";
import { cn } from "~/lib/utils";

export default function Route() {
	return (
		<>
			<Hero />
			<E2E />
			<CodeExamples />
			<Learn />
			<Features />
			<Reviews />
			<Memo />
			<CTA />
		</>
	);
}

const customers = [
	{
		name: "Minimal",
		logo: "/logos/minimal.svg",
		url: "https://minimal.tech",
	},

	{
		name: "Machenit",
		logo: "/logos/machenit.png",
		url: "https://machenit.com",
	},
	{
		name: "Black Cat Labs",
		logo: "/logos/black-cat-labs.png",
		url: "https://blackcatlabs.xyz",
	},
	{
		name: "M3 Aerospace",
		logo: "/logos/m3.png",
		url: "https://m3-aerospace.com/",
	},
	{
		name: "Zero",
		logo: "/logos/zero.webp",
		url: "https://zerofarms.it",
	},
	{
		name: "Witty Machines",
		logo: "/logos/witty-machines.svg",
		url: "https://www.witty-machines.com/",
	},
	{
		name: "Kform",
		logo: "/logos/kform.png",
		url: "https://kform.com/",
	},
	{
		name: "Allinol Technologies",
		logo: "/logos/allinol.png",
		url: "https://allinoltec.com",
	},
	{
		name: "Saeki",
		logo: "/logos/saeki.svg",
		url: "https://saeki.ch/",
	},
];

function Hero() {
	const mode = useMode();
	const meshGradientColors =
		mode === "light"
			? ["#BDD4FF", "#E0EBFF", "#ffffff", "#e6f3ff"]
			: ["#023225", "#000000", "#0D0D0D", "#050505"];

	return (
		<section id="hero" className="py-0 relative -mt-[var(--header-height)]">
			<div className="bg-[linear-gradient(to_bottom_right,#E0EBFF_35.67%,#BDD4FF_88.95%)] dark:bg-[linear-gradient(to_bottom_right,#0D0D0D_35.67%,#050505_88.95%)] min-h-screen w-full mx-auto py-36 relative">
				<MeshGradient
					speed={1}
					colors={meshGradientColors}
					distortion={0.8}
					swirl={0.1}
					grainMixer={0}
					grainOverlay={0}
					className="absolute inset-0 w-full h-full"
					style={{ height: "100%", width: "100%" }}
				/>
				<div className="container mx-auto px-4 relative z-10">
					<div className="flex flex-col justify-start items-center gap-8">
						<DiscordButton />
						<h2 className="font-display text-primary dark:text-foreground text-balance mx-auto  max-w-5xl text-center font-medium tracking-tighter leading-[115%] text-[2.6rem] sm:text-6xl lg:text-[5rem] xl:text-[7.2rem]">
							<Trans>
								The open source{" "}
								<span className="text-secondary">manufacturing ERP</span>
							</Trans>
						</h2>
						<p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-[780px] text-center font-medium tracking-tighter text-base md:text-lg lg:text-xl">
							<Trans>
								Carbon is a manufacturing system of record that combines ERP,
								MES, and QMS into a single, unified, API-first system that's
								perfect for complex manufacturing.
							</Trans>
						</p>
						<div className="flex flex-col md:flex-row gap-2">
							<Button variant="secondary" size="xl" asChild>
								<a href="https://app.carbon.ms">
									<Trans>Try It Now</Trans>
									<Play />
								</a>
							</Button>
							<Button variant="outline" size="xl" asChild>
								<a
									href="https://github.com/crbnos/carbon"
									target="_blank"
									rel="noopener"
								>
									<GithubLogo />
									<Trans>Star on GitHub</Trans>
								</a>
							</Button>
						</div>

						<div className="flex flex-col gap-4 max-w-4xl mx-auto mt-8">
							<div className="flex flex-col gap-4 max-w-4xl mx-auto ">
								<p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-3xl text-center font-medium tracking-tighter text-base">
									<Trans>
										Modern manufacturers build their tech stack on Carbon
									</Trans>
								</p>
							</div>
							<div className="flex flex-col md:flex-row items-center justify-center gap-8 min-h-[125px]">
								<AnimatePresence>
									{customers.map((customer, index) => (
										<motion.a
											key={customer.name}
											href={customer.url}
											target="_blank"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{
												duration: 0.5,
												delay: index * 0.1,
												ease: "easeInOut",
											}}
										>
											<img
												alt={customer.name}
												src={customer.logo}
												className="w-28 h-auto dark:invert transition-all duration-300 hover:scale-110"
											/>
										</motion.a>
									))}
								</AnimatePresence>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function E2E() {
	return (
		<section id="e2e" className="pb-[140px] lg:pb-[240px]">
			<div className="flex gap-8 container max-w-[1380px] mx-auto px-4">
				<div className="flex flex-col gap-8 mt-[205px] flex-grow max-w-[1380px] mx-auto pl-8">
					<h3 className="text-muted-foreground uppercase text-sm leading-[140%] tracking-tighter">
						<Trans>End-to-End</Trans>
					</h3>
					<h4 className="font-display text-foreground text-balance text-left font-medium tracking-tight leading-[115%] text-4xl lg:text-5xl xl:text-6xl -mt-4">
						<Trans>Designed for manufacturing</Trans>
					</h4>

					<div className="flex flex-col gap-4">
						<div className="flex justify-start items-center gap-2">
							<CheckCircle className="size-6 text-secondary" />
							<p className="text-foreground text-left font-medium tracking-tighter text-lg">
								<Trans>Unified quality, purchasing & production</Trans>
							</p>
						</div>
						<div className="flex justify-start items-center gap-2">
							<CheckCircle className="size-6 text-secondary" />
							<p className="text-foreground text-left font-medium tracking-tighter text-lg">
								<Trans>Assembly and make-to-order workflows</Trans>
							</p>
						</div>
						<div className="flex justify-start items-center gap-2">
							<CheckCircle className="size-6 text-secondary" />
							<p className="text-foreground text-left font-medium tracking-tighter text-lg">
								<Trans>Multi-location planning and inventory</Trans>
							</p>
						</div>
						<div className="flex justify-start items-center gap-2">
							<CheckCircle className="size-6 text-secondary" />
							<p className="text-foreground text-left font-medium tracking-tighter text-lg">
								<Trans>Built on the best of open-source software</Trans>
							</p>
						</div>
						<div className="flex justify-start items-center gap-2">
							<CheckCircle className="size-6 text-secondary" />
							<p className="text-foreground text-left font-medium tracking-tighter text-lg">
								<Trans>Govcloud-hosted Version Available</Trans>
							</p>
						</div>
					</div>
					<div className="flex flex-col md:flex-row gap-4">
						<Button variant="secondary" size="xl" asChild>
							<a href="https://learn.carbon.ms">
								<Trans>Start Learning</Trans>
								<GraduationCap />
							</a>
						</Button>

						<Button variant="outline" size="xl" asChild>
							<Link to="/sales">
								<Phone />
								<Trans>Talk to Us</Trans>
							</Link>
						</Button>
					</div>
					<div className="flex flex-row gap-4">
						<img
							alt="ITAR"
							src="/logos/itar.svg"
							className="h-20 dark:invert"
						/>
					</div>
				</div>
				<div className="hidden lg:flex mt-[225px] pr-8 hover:scale-110 transition-all duration-300">
					<Safari
						url="https://app.carbon.ms"
						className="size-full dark:hidden"
						imageSrc="/screenshots/sales-orders-light.jpeg"
					/>
					<Safari
						url="https://app.carbon.ms"
						className="size-full hidden dark:block"
						imageSrc="/screenshots/sales-orders-dark.jpeg"
					/>
				</div>
			</div>
		</section>
	);
}

function Features() {
	return (
		<section id="grid">
			<div className="mx-auto bg-muted w-full py-24">
				<div className="container">
					<div className="flex flex-col gap-8">
						<div className="flex flex-col gap-2">
							<h3 className="text-muted-foreground uppercase text-sm leading-[140%] tracking-tighter text-center">
								<Trans>Features</Trans>
							</h3>
							<h2 className="font-display text-balance mx-auto max-w-2xl text-center font-medium tracking-tight leading-[115%] text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
								<Trans>Powerful tools to run your business</Trans>
							</h2>
						</div>
					</div>
					<div className="flex flex-col gap-8 mt-14 mb-12">
						<div className="flex flex-col">
							<div className="grid lg:grid-cols-2 grid-cols-1 border border-b-0 ">
								<div className="flex flex-col border-r border-border bg-background lg:border-b-0 border-b justify-center manufacturing-bg">
									<div className="flex flex-col gap-4 pl-10 py-10 pr-20 h-full justify-between">
										<div className="flex flex-col gap-4">
											<div className="flex items-center gap-2">
												<div className="not-prose w-fit shadow-md rounded-lg border bg-primary dark:bg-muted text-white p-1.5 dark:dark:text-muted-foreground">
													<Waypoints className="size-4 flex-shrink-0" />
												</div>
												<h4 className="text-foreground text-balance text-left font-medium tracking-tighter text-base">
													<Trans>End-to-End Traceability</Trans>
												</h4>
											</div>
											<p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-sm">
												<Trans>
													Achieve granular, end-to-end tracking of materials,
													components, and processes, ensuring compliance,
													simplifying audits, and enabling rapid root cause
													analysis without the complexity and cost of
													traditional high-end systems.
												</Trans>
											</p>
										</div>
										{/* <div>
                      <Button variant="outline">Learn More</Button>
                    </div> */}
									</div>
								</div>
								<div className="flex bg-background manufacturing-bg">
									{/* <div className="flex justify-center items-center mt-10 mb-[70px] pt-10 pb-[22px]"></div> */}
									<div className="flex flex-col gap-4 pl-10 py-10 pr-20 h-full justify-between">
										<div className="flex flex-col gap-4">
											<div className="flex items-center gap-2">
												<div className="not-prose w-fit shadow-md rounded-lg border bg-primary dark:bg-muted text-white p-1.5 dark:dark:text-muted-foreground text-white">
													<CheckCircle className="size-4 flex-shrink-0" />
												</div>
												<h4 className="text-foreground text-balance text-left font-medium tracking-tighter text-base">
													<Trans>Integrated Agents</Trans>
												</h4>
											</div>
											<p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-sm">
												<Trans>
													Our ever-expanding catalog of agents allow you to save
													time and money by automating repetitive tasks. For
													example, our purchasing agent can create purchase
													orders and get quotes from suppliers automatically.
												</Trans>
											</p>
										</div>
										{/* <div>
                      <Button variant="outline">Learn More</Button>
                    </div> */}
									</div>
								</div>
							</div>
							<div className="grid lg:grid-cols-3 grid-cols-1 bg-background border">
								<div className="flex border-r border-border lg:border-b-0 border-b manufacturing-bg">
									{/* <div className="flex justify-center items-center mt-10 mb-[70px] pt-10 pb-[22px]"></div> */}
									<div className="flex flex-col gap-4 pl-10 py-10 pr-20 h-full justify-between">
										<div className="flex flex-col gap-4">
											<div className="flex items-center gap-2">
												<div className="not-prose w-fit shadow-md rounded-lg border bg-primary dark:bg-muted text-white p-1.5 dark:dark:text-muted-foreground text-white">
													<LayoutDashboard className="size-4 flex-shrink-0" />
												</div>
												<h4 className="text-foreground text-balance text-left font-medium tracking-tighter text-base">
													<Trans>Product Configurator</Trans>
												</h4>
											</div>
											<p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-sm">
												<Trans>
													Automatically generate the Bill of Materials and Bill
													of Process for a given set of options/parameters with
													our powerful product configurator.
												</Trans>
											</p>
										</div>
										{/* <div>
                      <Button variant="outline">Learn More</Button>
                    </div> */}
									</div>
								</div>
								<div className="flex border-r border-border lg:border-b-0 border-b manufacturing-bg">
									{/* <div className="flex justify-center items-center mt-10 mb-[70px] pt-10 pb-[22px]"></div> */}
									<div className="flex flex-col gap-4 pl-10 py-10 pr-20 h-full justify-between">
										<div className="flex flex-col gap-4">
											<div className="flex items-center gap-2">
												<div className="not-prose w-fit shadow-md rounded-lg border bg-primary dark:bg-muted text-white p-1.5 dark:dark:text-muted-foreground text-white">
													<CalendarDays className="size-4 flex-shrink-0" />
												</div>
												<h4 className="text-foreground text-balance text-left font-medium tracking-tighter text-base">
													<Trans>Simplified Scheduling</Trans>
												</h4>
											</div>
											<p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-sm">
												<Trans>
													Keep your shop floor schedule up-to-date with our
													simple and powerful scheduling engine. Schedule by job
													due date, or by fine-tune work center and resource
													availability.
												</Trans>
											</p>
										</div>
										{/* <div>
                      <Button variant="outline">Learn More</Button>
                    </div> */}
									</div>
								</div>
								<div className="flex lg:border-b-0 border-b manufacturing-bg">
									{/* <div className="flex justify-center items-center mt-10 mb-[70px] pt-10 pb-[22px]"></div> */}
									<div className="flex flex-col gap-4 pl-10 py-10 pr-20 h-full justify-between">
										<div className="flex flex-col gap-4">
											<div className="flex items-center gap-2">
												<div className="not-prose w-fit shadow-md rounded-lg border bg-primary dark:bg-muted text-white p-1.5 dark:dark:text-muted-foreground text-white">
													<Cable className="size-4 flex-shrink-0" />
												</div>
												<h4 className="text-foreground text-balance text-left font-medium tracking-tighter text-base">
													<Trans>API-First Architecture</Trans>
												</h4>
											</div>
											<p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-sm">
												<Trans>
													Carbon is built with an "API-First Architecture,"
													which gives you unparalleled flexibility to seamlessly
													connect Carbon with your other business systems. This
													allows you to automate workflows across all
													applications.
												</Trans>
											</p>
										</div>
										{/* <div>
                      <Button variant="outline">Learn More</Button>
                    </div> */}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function Learn() {
	return (
		<section
			id="learn"
			className="relative min-h-[800px] flex w-full flex-col items-center justify-center overflow-hidden rounded-lg  bg-background"
		>
			<DotPattern
				glow
				className={cn(
					"[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] h-full w-full",
				)}
			/>
			<div className="container z-50 py-24">
				<div className="flex flex-col w-full max-w-section mx-auto px-section gap-24">
					<div className="flex flex-col gap-2">
						<h3 className="text-muted-foreground uppercase text-sm leading-[140%] tracking-tighter text-center">
							<Trans>Open Source</Trans>
						</h3>
						<h2 className="font-display text-balance mx-auto max-w-3xl text-center font-medium tracking-tight leading-[115%] text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
							<Trans>Modern, minimal, transparent</Trans>
						</h2>
					</div>
					<div className="grid gap-3 container grid-cols-1 lg:grid-cols-3">
						<div
							data-card="true"
							className="block rounded-xl border bg-card p-4 text-card-foreground transition-colors max-lg:col-span-full flex flex-col"
						>
							<div className="not-prose mb-2 w-fit shadow-md rounded-lg border bg-primary dark:bg-muted p-1.5 dark:text-muted-foreground text-white">
								<PlayCircle className="size-4" />
							</div>
							<h3 className="not-prose mb-1 text-base font-medium">
								<Trans>Video Library</Trans>
							</h3>
							<p className="!my-0 text-sm text-muted-foreground flex-grow">
								<Trans>
									Carbon Academy is a free, self-paced learning platform that
									teaches you how to use Carbon. It's a great way to get started
									with Carbon and learn how to use it to its full potential.
								</Trans>
							</p>
							<div className="text-sm text-muted-foreground prose-no-margin empty:hidden">
								<Button variant="outline" className="mt-4" asChild>
									<a
										href="https://learn.carbon.ms"
										target="_blank"
										rel="noopener"
									>
										<Trans>Start Learning</Trans>
										<GraduationCap className="size-4" />
									</a>
								</Button>
							</div>
						</div>

						<div
							data-card="true"
							className="block rounded-xl border bg-card p-4 text-card-foreground transition-colors max-lg:col-span-full flex flex-col"
						>
							<div className="not-prose mb-2 w-fit shadow-md rounded-lg border bg-primary dark:bg-muted p-1.5 dark:text-muted-foreground text-white">
								<Book className="size-4" />
							</div>
							<h3 className="not-prose mb-1 text-base font-medium">
								<Trans>Documentation</Trans>
							</h3>
							<p className="!my-0 text-sm text-muted-foreground flex-grow">
								<Trans>
									Carbon's developer documentation guides you through getting
									Carbon running locally, and extending it to build your own own
									custom applications.
								</Trans>
							</p>
							<div className="text-sm text-muted-foreground prose-no-margin empty:hidden">
								<Button variant="outline" className="mt-4" asChild>
									<a
										href="https://docs.carbon.ms"
										target="_blank"
										rel="noopener"
									>
										<Trans>View Docs</Trans>
										<ExternalLink className="size-4" />
									</a>
								</Button>
							</div>
						</div>

						<div
							data-card="true"
							className="block rounded-xl border bg-card p-4 text-card-foreground transition-colors max-lg:col-span-full flex flex-col"
						>
							<div className="not-prose mb-2 w-fit shadow-md rounded-lg border bg-primary dark:bg-muted p-1.5 dark:text-muted-foreground text-white">
								<GithubLogo className="size-4" />
							</div>
							<h3 className="not-prose mb-1 text-base font-medium">
								<Trans>Source Code</Trans>
							</h3>
							<p className="!my-0 text-sm text-muted-foreground flex-grow">
								<Trans>
									Carbon's source code is available on GitHub and is free to
									use. You can maintain your own public fork or acquire a
									commercial license to make your code modifications private.
								</Trans>
							</p>
							<div className="text-sm text-muted-foreground prose-no-margin empty:hidden">
								<Button variant="outline" className="mt-4" asChild>
									<a
										href="https://github.com/crbnos/carbon"
										target="_blank"
										rel="noopener"
									>
										<Trans>View Source</Trans>
										<GithubLogo className="size-4" />
									</a>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

const reviews = [
	{
		logo: "/logos/minimal.svg",
		face: "/faces/liam.jpeg",
		review:
			"Best ERP/MRP/MES System I've ever seen in a 22 year career across defence and automotive. Carbon is what modern engineering and manufacturing needs in 2026. Native integration with Onshape, we synchronise all our data without additional PLM connectors. Fully features, good UX, modern native integrations, under active development, open source and open to contributions, open API and MCP, suitable for cloud and on-prem. We run our whole electric vehicle engineering and manufacturing business on Carbon. I couldn't imagine going back to a legacy system.",
		author: "Liam Sill",
		authorTitle: "CTO, Minimal",
	},
	{
		logo: "/logos/black-cat-mark.png",
		face: "/faces/anthan.jpg",
		review:
			"We've been using Carbon for the last 6 months to grow our sheet metal and fabrication business, and I feel like it's a platform that will be able to grow with us over the next 10-15 years. If you're growing a job shop, I highly recommend it. The customer support is super responsive, the platform is easy to use, and the value far outweighs the cost.",
		author: "Anthan Rajaratnam",
		authorTitle: "CEO, Black Cat Labs, AS9100D",
	},
	{
		logo: "/logos/stealth.jpeg",
		face: "/faces/avnish.jpg",
		review:
			"Been diving deep into Carbon over the last few weeks. Incredibly impressed by how clean, modular, and extensible the codebase is. This is exactly the kind of open infrastructure the manufacturing world needs. Excited to keep building on top of it!",
		author: "Avnish Sachar",
		authorTitle: "Co-founder, Stealth",
	},
];

function Reviews() {
	return (
		<section
			id="reviews"
			className="bg-primary text-primary-foreground bg-[url('/reviews.webp')] bg-[0_0] bg-no-repeat bg-cover py-20 dark:bg-gradient-to-br dark:from-secondary dark:to-secondary-foreground"
		>
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="flex flex-col gap-2 mb-12">
					<h3 className="opacity-60 uppercase text-sm tracking-tighter text-center">
						<Trans>Reviews</Trans>
					</h3>
					<h2 className="font-display font-medium text-balance mx-auto max-w-4xl text-center tracking-tight text-3xl lg:text-5xl">
						<Trans>What our customers say:</Trans>
					</h2>
				</div>
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
					<div className="lg:col-span-3 flex flex-col justify-between rounded-2xl bg-background text-foreground p-10 lg:p-12 shadow-sm outline-1 -outline-offset-1 outline-black/5">
						<div>
							<img
								src={reviews[0].logo}
								alt=""
								className="h-8 w-auto mb-8 dark:invert"
							/>
							<p className="relative text-pretty text-xl lg:text-2xl font-medium tracking-tight before:absolute before:inline before:-translate-x-full before:content-['\201C'] after:inline after:content-['\201D']">
								{reviews[0].review}
							</p>
						</div>
						<div className="mt-10 flex items-center gap-5">
							<img
								src={reviews[0].face}
								alt=""
								className="size-14 rounded-full outline-1 -outline-offset-1 outline-black/5"
							/>
							<div>
								<p className="text-base font-semibold">{reviews[0].author}</p>
								<p className="text-sm text-muted-foreground">
									{reviews[0].authorTitle}
								</p>
							</div>
						</div>
					</div>
					<div className="lg:col-span-2 flex flex-col gap-6">
						{reviews.slice(1).map((review) => (
							<div
								key={review.author}
								className="flex flex-1 flex-col justify-between rounded-2xl bg-background text-foreground p-8 shadow-sm outline-1 -outline-offset-1 outline-black/5"
							>
								<div className="flex flex-col gap-4">
									<img
										src={review.logo}
										alt=""
										className="h-6 w-auto self-start dark:invert"
									/>
									<p className="relative text-pretty text-base font-medium tracking-tight before:absolute before:inline before:-translate-x-full before:content-['\201C'] after:inline after:content-['\201D']">
										{review.review}
									</p>
								</div>
								<div className="mt-6 flex items-center gap-4">
									<img
										src={review.face}
										alt=""
										className="size-10 rounded-full outline-1 -outline-offset-1 outline-black/5"
									/>
									<div>
										<p className="text-sm font-semibold">{review.author}</p>
										<p className="text-sm text-muted-foreground">
											{review.authorTitle}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

function Memo() {
	return (
		<section id="memo" className="md:py-8 lg:pt-36 lg:pb-24 md:px-4">
			<div className="max-w-4xl mx-auto flex flex-col gap-4 border-[0.5px] bg-card px-8 shadow py-12 lg:p-14 text-lg xl-p-16">
				<div className="mb-4 flex flex-col gap-1.5 md:mb-6 lg:mb-8 tracking-tight">
					<p className="dark:text-muted-foreground font-mono uppercase text-base font-light">
						<Trans>Founder memo</Trans>
					</p>
					<p className="font-mono uppercase font-medium">
						<Trans>Carbon Manufacturing Systems Corp.</Trans>
					</p>
				</div>

				<p className="leading-[1.8] text-foreground">
					<Trans>
						After spending nearly a decade building end-to-end systems for
						manufacturing, I had a pretty good idea of what an "ideal" solution
						looked like from a technical perspective:
					</Trans>
				</p>

				<p className="leading-[1.8] text-foreground">
					<Trans>
						API-first, realtime subscriptions, simple scheduling, and 1,000
						little details to make the juice of using an ERP worth the squeeze.
					</Trans>
				</p>
				<p className="leading-[1.8] text-foreground">
					<Trans>
						But even as we work with our customers to become the best
						off-the-shelf ERP/MES for many types of discrete manufacturing, we
						are faced with the reality that there is no "perfect" off-the-shelf
						solution, because each manufacturing business is unique.
					</Trans>
				</p>

				<p className="leading-[1.8] text-foreground">
					<Trans>
						We open-sourced Carbon not because it's a great business plan, but
						because that's the system I would have wanted when I was in your
						shoes.
					</Trans>
				</p>

				<p className="leading-[1.8] text-foreground">
					<Trans>
						I believe open-source has incredible potential because it's not just
						a product–it's a community of like-minded people working to build
						the future of manufacturing in the age of AI and robotics.
					</Trans>
				</p>

				<p className="leading-[1.8] text-foreground">
					<Trans>We're glad you're here for it.</Trans>
				</p>

				<DiscordButton />

				<div className="mt-8 flex flex-col gap-4">
					<a
						target="_blank"
						className="mt-4 flex items-center gap-4 md:mt-6 lg:mt-8"
						href="https://x.com/barbinbrad"
						rel="noopener"
					>
						<img
							alt="Brad Barbin"
							loading="lazy"
							className="w-14 h-auto rounded-full corner-squircle"
							src="/faces/brad.webp"
						/>
						<div className="flex flex-col">
							<p className="dark:text-tertiary text-foreground">Brad Barbin</p>
							<p className="dark:text-tertiary text-muted-foreground text-sm">
								<Trans>Co-founder</Trans>
							</p>
						</div>
					</a>
				</div>
			</div>
		</section>
	);
}

function CTA() {
	return (
		<section id="cta" className="py-24">
			<div className="container max-w-4xl mx-auto px-4">
				<div className="flex flex-col gap-4 bg-muted dark:bg-muted bg-[url('/cta.webp')] dark:bg-none bg-[0_0] bg-no-repeat bg-cover rounded-xl py-24 justify-center items-center px-4">
					<h2 className="font-display text-balance mx-auto max-w-2xl text-center font-medium tracking-tight leading-[115%] text-3xl md:text-4xl lg:text-5xl ">
						<Trans>Build something with Carbon</Trans>
					</h2>
					<p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-2xl text-center font-medium tracking-tighter text-lg">
						<Trans>Start your 30-day free trial today</Trans>
					</p>
					<div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
						<Button variant="default" size="xl" asChild>
							<a href="https://app.carbon.ms">
								<Trans>Try It Now</Trans>
								<Play />
							</a>
						</Button>
						<Button variant="outline" size="xl" asChild>
							<Link to="/sales">
								<Phone />
								<Trans>Talk to Us</Trans>
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}

function DiscordButton() {
	return (
		<div>
			<Button variant="outline" asChild>
				<a href="https://discord.gg/yGUJWhNqzy" target="_blank" rel="noopener">
					<DiscordLogo />
					<Trans>Join our Discord community</Trans>{" "}
					<ChevronRight className="text-muted-foreground size-3" />
				</a>
			</Button>
		</div>
	);
}
