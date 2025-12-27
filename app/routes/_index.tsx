import { MeshGradient } from "@paper-design/shaders-react";
import { Link } from "@remix-run/react";
import {
	ArrowLeft,
	ArrowRight,
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
import { useState } from "react";
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
			<Features />
			<Grid />
			<Learn />
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
		url: "https://minimalx.com",
	},
	{
		name: "Black Cat Labs",
		logo: "/logos/black-cat-labs.png",
		url: "https://blackcatlabs.xyz",
	},
	{
		name: "Harp Engineering",
		logo: "/logos/harp.png",
		url: "https://headco.net",
	},
	{
		name: "Northwest Production Source",
		logo: "/logos/northwest.png",
		url: "https://nwprosource.com",
	},
	{
		name: "Allinol Technologies",
		logo: "/logos/allinol.png",
		url: "https://allinoltec.com",
	},
	{
		name: "M3 Aerospace",
		logo: "/logos/m3.png",
		url: "https://m3-aerospace.com/",
	},
	{
		name: "Three Rivers Precision",
		logo: "/logos/trp.png",
		url: "https://www.threeriversprecision.com/",
	},
];

function Hero() {
	const mode = useMode();
	const meshGradientColors =
		mode === "light"
			? ["#c9fff8", "#f7f5ff", "#ffffff", "#e6f3ff"]
			: ["#1A1A1A", "#000000", "#0D0D0D", "#050505"];

	return (
		<section id="hero" className="py-0 relative">
			<div className="bg-[linear-gradient(to_bottom_right,#f7f5ff_35.67%,#c9fff8_88.95%)] dark:bg-[linear-gradient(to_bottom_right,#0D0D0D_35.67%,#050505_88.95%)]  w-full mx-auto py-20 relative">
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
						<h2 className="font-display text-foreground text-balance mx-auto  max-w-5xl text-center font-medium tracking-tight leading-[115%] text-[2.4rem] sm:text-6xl lg:text-[5rem] xl:text-[7.2rem]">
							The open-source{" "}
							<span className="text-secondary">manufacturing ERP</span>
						</h2>
						<p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-[780px] text-center font-medium tracking-tighter text-base md:text-lg lg:text-xl">
							Carbon is a modern manufacturing system that combines ERP, MES,
							and Quality Management into a single, unified, API-first system
							that's perfect for complex manufacturing.
						</p>
						<div className="flex flex-col md:flex-row gap-2">
							<Button variant="secondary" size="xl" asChild>
								<a href="https://app.carbon.ms">
									Start Now
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
									Star on GitHub
								</a>
							</Button>
						</div>

						<div className="flex flex-col gap-4 max-w-4xl mx-auto mt-8">
							<p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-3xl text-center font-medium tracking-tighter text-base">
								Trusted by builders worldwide
							</p>
						</div>

						<div className="flex flex-col md:flex-row items-center justify-center gap-8 min-h-[145px]">
							{customers.map((customer) => (
								<a key={customer.name} href={customer.url} target="_blank">
									<img
										alt={customer.name}
										src={customer.logo}
										className="w-28 h-auto dark:invert"
									/>
								</a>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function Features() {
	return (
		<section id="features" className="pb-[140px] lg:pb-[240px]">
			<div className="flex gap-8 container max-w-[1380px] mx-auto px-4">
				<div className="flex flex-col gap-8 mt-[205px] flex-grow max-w-[1380px] mx-auto pl-8">
					<h3 className="text-muted-foreground uppercase text-sm leading-[140%] tracking-tighter">
						Features
					</h3>
					<h4 className="font-display text-foreground text-balance text-left font-medium tracking-tight leading-[115%] text-4xl lg:text-5xl xl:text-6xl -mt-4">
						Simplify complex manufacturing
					</h4>
					<p className="text-muted-foreground dark:text-foreground text-balance text-left font-medium tracking-tighter text-lg">
						Escape legacy software with a flexible, AI-powered platform designed
						for the speed and agility of today's manufacturing challenges.
					</p>
					<div className="flex flex-col gap-4">
						<div className="flex justify-start items-center gap-2">
							<CheckCircle className="size-6 text-secondary" />
							<p className="text-foreground text-left font-bold tracking-tighter text-lg">
								Live Job Costing and Simplified Scheduling
							</p>
						</div>
						<div className="flex justify-start items-center gap-2">
							<CheckCircle className="size-6 text-secondary" />
							<p className="text-foreground text-left font-bold tracking-tighter text-lg">
								Unified Quoting, Purchasing & Production
							</p>
						</div>
						<div className="flex justify-start items-center gap-2">
							<CheckCircle className="size-6 text-secondary" />
							<p className="text-foreground text-left font-bold tracking-tighter text-lg">
								Job Shop and Assembly Workflows
							</p>
						</div>
						<div className="flex justify-start items-center gap-2">
							<CheckCircle className="size-6 text-secondary" />
							<p className="text-foreground text-left font-bold tracking-tighter text-lg">
								Multi-location Planning and Inventory
							</p>
						</div>
						<div className="flex justify-start items-center gap-2">
							<CheckCircle className="size-6 text-secondary" />
							<p className="text-foreground text-left font-bold tracking-tighter text-lg">
								Govcloud-hosted Version Available
							</p>
						</div>
					</div>
					<div className="flex flex-col md:flex-row gap-4">
						<Button variant="secondary" size="xl" asChild>
							<a href="https://learn.carbon.ms">
								Start Learning
								<GraduationCap />
							</a>
						</Button>

						<Button variant="outline" size="xl" asChild>
							<Link to="/sales">
								<Phone />
								Talk to Us
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

function Grid() {
	return (
		<section id="grid">
			<div className="mx-auto bg-muted w-full py-24">
				<div className="container">
					<div className="flex flex-col gap-8">
						<h2 className="font-display text-balance mx-auto max-w-2xl text-center font-medium tracking-tight leading-[115%] text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
							Drive growth and efficiency
						</h2>

						<p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-2xl text-center font-medium tracking-tighter text-base">
							Leave the spreadsheets and outdated software behind. Carbon gives
							you the control and clarity you need to run a better business.
						</p>
					</div>
					<div className="flex flex-col gap-8 mt-14 mb-12">
						<div className="flex flex-col">
							<div className="grid lg:grid-cols-2 grid-cols-1 border border-b-0 ">
								<div className="flex flex-col border-r border-border bg-background lg:border-b-0 border-b justify-center manufacturing-bg">
									<div className="flex flex-col gap-4 pl-10 py-10 pr-20 h-full justify-between">
										<div className="flex flex-col gap-4">
											<div className="flex items-center gap-2">
												<div className="not-prose w-fit shadow-md rounded-lg border bg-primary dark:bg-muted text-white p-1.5 dark:dark:text-muted-foreground text-white">
													<Waypoints className="size-4 flex-shrink-0" />
												</div>
												<h4 className="text-foreground text-balance text-left font-medium tracking-tighter text-base">
													End-to-End Traceability
												</h4>
											</div>
											<p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-sm">
												Achieve granular, end-to-end tracking of materials,
												components, and processes, ensuring compliance,
												simplifying audits, and enabling rapid root cause
												analysis without the complexity and cost of traditional
												high-end systems.
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
													Integrated Agents
												</h4>
											</div>
											<p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-sm">
												Our ever-expanding catalog of agents allow you to save
												time and money by automating repetitive tasks. For
												example, our purchasing agent can create purchase orders
												and get quotes from suppliers automatically.
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
													Custom Fields
												</h4>
											</div>
											<p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-sm">
												Add custom fields with a few clicks to any table to
												track additional information. Then create custom views
												to track the data you need. Then use the configurator to
												generate Bill of Materials.
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
													Simplified Scheduling
												</h4>
											</div>
											<p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-sm">
												Optimize your shop floor schedule with flexible sorting
												capabilities, maximizing throughput, improving on-time
												delivery, and easily adapting to priority changes.
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
													API-First Architecture
												</h4>
											</div>
											<p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-sm">
												Carbon is built with an "API-First Architecture," which
												gives you unparalleled flexibility to seamlessly connect
												Carbon with your other business systems. This allows you
												to automate workflows across all applications.
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
					<h2 className="font-display text-balance mx-auto max-w-3xl text-center font-medium tracking-tight leading-[115%] text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
						Modern, minimal, transparent
					</h2>
					<div className="grid gap-3 container grid-cols-1 lg:grid-cols-3">
						<div
							data-card="true"
							className="block rounded-xl border bg-card p-4 text-card-foreground transition-colors max-lg:col-span-full flex flex-col"
						>
							<div className="not-prose mb-2 w-fit shadow-md rounded-lg border bg-primary dark:bg-muted p-1.5 dark:text-muted-foreground text-white">
								<PlayCircle className="size-4" />
							</div>
							<h3 className="not-prose mb-1 text-base font-medium">
								Video Library
							</h3>
							<p className="!my-0 text-sm text-muted-foreground flex-grow">
								Carbon Academy is a free, self-paced learning platform that
								teaches you how to use Carbon. It's a great way to get started
								with Carbon and learn how to use it to its full potential.
							</p>
							<div className="text-sm text-muted-foreground prose-no-margin empty:hidden">
								<Button variant="outline" className="mt-4" asChild>
									<a
										href="https://learn.carbon.ms"
										target="_blank"
										rel="noopener"
									>
										Start Learning
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
								Documentation
							</h3>
							<p className="!my-0 text-sm text-muted-foreground flex-grow">
								Carbon's developer documentation guides you through getting
								Carbon running locally, and extending it to build your own own
								custom applications.
							</p>
							<div className="text-sm text-muted-foreground prose-no-margin empty:hidden">
								<Button variant="outline" className="mt-4" asChild>
									<a
										href="https://docs.carbon.ms"
										target="_blank"
										rel="noopener"
									>
										View Docs
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
								Source Code
							</h3>
							<p className="!my-0 text-sm text-muted-foreground flex-grow">
								Carbon's source code is available on GitHub and is free to use.
								You can maintain your own public fork or acquire a commercial
								license to make your code modifications private.
							</p>
							<div className="text-sm text-muted-foreground prose-no-margin empty:hidden">
								<Button variant="outline" className="mt-4" asChild>
									<a
										href="https://github.com/crbnos/carbon"
										target="_blank"
										rel="noopener"
									>
										View Source
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
			"As an engineering start-up pushing the boundaries in manufacturing assembly, we needed more than just another MRP/MES system. Carbon delivered - combining deep functionality with a refreshingly open, API-first design. It integrates seamlessly with our CAD tools, scales effortlessly, has fantastic UX and offers exceptional value.",
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
	const [currentReview, setCurrentReview] = useState(0);

	const onPrev = () => {
		setCurrentReview((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
	};

	const onNext = () => {
		setCurrentReview((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
	};

	return (
		<section
			id="reviews"
			className="bg-primary text-primary-foreground bg-[url('/reviews.webp')] bg-[0_0] bg-no-repeat bg-cover py-20 dark:bg-gradient-to-br dark:from-secondary dark:to-secondary-foreground"
		>
			<div className="container flex flex-col gap-12 mx-auto px-4">
				<h2 className="font-display font-medium text-balance mx-auto max-w-4xl text-center tracking-tight leading-[115%] text-3xl lg:text-5xl">
					What our customers say:
				</h2>
				<div className="max-w-5xl mx-auto overflow-hidden p-4">
					<div className="flex flex-row items-center justify-center gap-4">
						<button
							onClick={onPrev}
							type="button"
							className="hidden lg:flex items-center justify-center bg-background/90 hover:bg-background text-foreground text-3xl font-bold size-12 rounded-xl px-3"
						>
							<ArrowLeft />
						</button>
						<div className="flex flex-grow dark:bg-background/90 bg-background text-foreground rounded-xl w-full h-full min-h-[420px]">
							<div className="flex flex-col flex-grow gap-12 justify-between h-full items-center p-12 w-full">
								<p className="text-balance text-left flex-grow font-medium tracking-tight text-xl md:text-2xl">
									{reviews[currentReview].review}
								</p>
								<div className="flex justify-start w-full">
									<div className="flex items-center gap-2">
										<img
											src={reviews[currentReview].face}
											alt="Avatar"
											className="size-16 rounded-full"
										/>
										<div className="flex flex-col">
											<p className="text-xl font-bold">
												{reviews[currentReview].author}
											</p>
											<p className="text-base text-muted-foreground font-medium">
												{reviews[currentReview].authorTitle}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<button
							onClick={onNext}
							type="button"
							className="hidden lg:flex items-center justify-center bg-background/90 hover:bg-background text-foreground text-3xl font-bold size-12 rounded-xl px-3"
						>
							<ArrowRight />
						</button>
					</div>
				</div>
				<div className="flex flex-col max-w-[864px] mx-auto w-full">
					<div className="w-full flex justify-center items-center gap-8 lg:hidden">
						<button
							onClick={onPrev}
							type="button"
							className="flex items-center justify-center bg-background/90 hover:bg-background text-foreground text-3xl font-bold size-12 rounded-xl px-3"
						>
							<ArrowLeft />
						</button>
						<button
							onClick={onNext}
							type="button"
							className="flex items-center justify-center bg-background/90 hover:bg-background text-foreground text-3xl font-bold size-12 rounded-xl px-3"
						>
							<ArrowRight />
						</button>
					</div>
					{/* <div className="hidden lg:flex w-full items-center justify-center">
            {reviews.map((image, index) => (
              <div
                key={image.logo}
                role="button"
                onClick={() => setCurrentReview(index)}
                className={cn(
                  "cursor-pointer flex-1 flex items-center justify-center pb-8 border-b border-secondary-foreground opacity-30 transition-opacity duration-200",
                  index === currentReview && "opacity-100"
                )}
              >
                <img
                  className="h-6 w-auto invert dark:invert-0"
                  src={image.logo}
                  loading="lazy"
                />
              </div>
            ))}
          </div> */}
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
						Founder memo
					</p>
					<p className="font-mono uppercase font-medium">
						Carbon Manufacturing Systems Corp.
					</p>
				</div>

				<p className="leading-[1.8] text-foreground">
					After spending nearly a decade building end-to-end systems for
					manufacturing, I had a pretty good idea of what an "ideal" solution
					looked like from a technical perspective:
				</p>

				<p className="leading-[1.8] text-foreground">
					API-first, realtime subscriptions, simple scheduling, and 1,000 little
					details to make the juice of using an ERP worth the squeeze.
				</p>
				<p className="leading-[1.8] text-foreground">
					But even as we work with our customers to become the best
					off-the-shelf ERP/MES for many types of discrete manufacturing, we are
					faced with the reality that there is no "perfect" off-the-shelf
					solution, because each manufacturing business is unique.
				</p>

				<p className="leading-[1.8] text-foreground">
					We open-sourced Carbon not because it's a great business plan, but
					because that's the system I would have wanted when I was in your
					shoes.
				</p>

				<p className="leading-[1.8] text-foreground">
					I believe open-source has incredible potential because it's not just a
					product&ndash;it's a community of like-minded people working to build
					the future of manufacturing in the age of AI and robotics.
				</p>

				<p className="leading-[1.8] text-foreground">
					We're glad you're here for it.
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
							className="w-14 h-auto rounded-full"
							src="/faces/brad.webp"
						/>
						<div className="flex flex-col">
							<p className="dark:text-tertiary text-foreground">Brad Barbin</p>
							<p className="dark:text-tertiary text-muted-foreground text-sm">
								Co-founder &amp; CEO
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
						Build something with Carbon
					</h2>
					<p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-2xl text-center font-medium tracking-tighter text-lg">
						Start your 30-day free trial today
					</p>
					<div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
						<Button variant="default" size="xl" asChild>
							<a href="https://app.carbon.ms">
								Start Now
								<Play />
							</a>
						</Button>
						<Button variant="outline" size="xl" asChild>
							<Link to="/sales">
								<Phone />
								Talk to Us
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
					<DiscordLogo className="text-[#5865f2]" />
					Join our Discord community{" "}
					<ChevronRight className="text-muted-foreground size-3" />
				</a>
			</Button>
		</div>
	);
}
