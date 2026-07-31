const cookieName = "companyId";

/**
 * Present once the visitor has a company in the app. app.carbon.ms sets it on
 * the shared `.carbon.ms` domain, so www receives it too and can point CTAs at
 * the dashboard instead of signup.
 *
 * Parsed by hand rather than via the `cookie` package: that module ships no
 * types, and importing it here would add another TS7016 error to the build.
 */
export function getCompanyId(request: Request): string | null {
	const header = request.headers.get("cookie");
	if (!header) return null;

	const entry = header
		.split(";")
		.map((c) => c.trim())
		.find((c) => c.startsWith(`${cookieName}=`));
	const value = entry?.slice(cookieName.length + 1);

	return value ? decodeURIComponent(value) : null;
}
