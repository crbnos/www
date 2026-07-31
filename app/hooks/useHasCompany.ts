import { path } from "~/utils/path";
import { useRouteData } from "./useRouteData";

/**
 * True when the visitor already has a company in the app (a `companyId` cookie
 * on `.carbon.ms`). Read from the root loader so the CTA is correct in the SSR
 * markup — resolving it on the client would flash "Start Free" first.
 */
export function useHasCompany() {
	const routeData = useRouteData<{ hasCompany: boolean }>(path.to.root);
	return routeData?.hasCompany ?? false;
}
