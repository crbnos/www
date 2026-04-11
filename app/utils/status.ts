export function fetchStatus() {
	return fetch("https://status.carbon.ms/api/badge/1/status")
		.then((res) => res.text())
		.then((html) => ({ up: html.includes("Up") }))
		.catch(() => ({ up: false }));
}
