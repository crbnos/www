import { Link, Outlet } from "@remix-run/react";
import AnimatedShinyText from "~/components/ui/animated-shiny-text";

export const config = {
	runtime: "nodejs",
};

export default function Layout() {
	return (
		<>
			<div className="container flex justify-center scroll-smooth pt-[var(--header-height)]">
				<Link to="/learn" prefetch="intent">
					<div className="z-logo absolute hidden md:flex top-24 left-1/2 -translate-x-1/2 items-center justify-center group rounded-full border border-black/5 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800/20 hover:filter-blur dark:border-white/5 ">
						<AnimatedShinyText className="relative inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-zinc-600 hover:duration-300 hover:dark:text-zinc-400">
							<span>Learning Center</span>
						</AnimatedShinyText>
					</div>
				</Link>
				<div className="w-form-sm md:w-form-md lg:w-form-lg py-36">
					<Outlet />
				</div>
			</div>
		</>
	);
}
