export function isAdminNotFound(error: unknown) {
	return typeof error === "object" && error !== null && "status" in error && error.status === 404;
}

export function isAdminForbidden(error: unknown) {
	return typeof error === "object" && error !== null && "status" in error && error.status === 403;
}

export function isAdminNetworkError(error: unknown) {
	return typeof error === "object" && error !== null && "kind" in error && error.kind === "network";
}
