export async function handle({ event, resolve }) {
	console.log("HOOK RUNNING for", event.url.pathname);
	const response = await resolve(event);
	response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
	response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
	response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
	return response;
}
