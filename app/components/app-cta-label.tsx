import { Trans } from "@lingui/react/macro";
import type { ReactNode } from "react";
import { useHasCompany } from "~/hooks/useHasCompany";

/**
 * Label for the buttons pointing at app.carbon.ms. Visitors who already have a
 * company there are returning users, not signups, so they get "Dashboard".
 */
export function AppCtaLabel({
	signupLabel = <Trans>Start Free</Trans>,
}: {
	signupLabel?: ReactNode;
}) {
	const hasCompany = useHasCompany();

	return hasCompany ? <Trans>Dashboard</Trans> : signupLabel;
}
