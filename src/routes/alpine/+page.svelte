<script>
import WebVM from '$lib/WebVM.svelte';
import { onMount } from 'svelte';

export let data;
$: ({ configObj } = data);

let tryPlausible = () => {};

onMount(async () => {
	// Dynamically import plausible to be defensive against ad-blockers
	try {
		const mod = await import('$lib/plausible.js');
		tryPlausible = mod.tryPlausible;
	} catch (e) {
		console.warn("Analytics blocked by browser extension.");
	}

	if ('serviceWorker' in navigator) {
		const registrations = await navigator.serviceWorker.getRegistrations();
		for (let registration of registrations) {
			await registration.unregister();
			console.log("Force-unregistered zombie service worker.");
		}
	}

	window.logs = [];
	const oldFetch = window.fetch;
	window.fetch = async (...args) => {
		const url = args[0].toString();
		if (url.includes('index.list')) {
			window.logs.push("FETCH: " + url);
			const res = await oldFetch(...args);
			window.logs.push("RESULT: " + url + " " + res.status + " " + res.headers.get('Content-Type'));
			return res;
		}
		return oldFetch(...args);
	};
});

function handleProcessCreated(processCount)
{
	// Log only the first process, as a proxy for successful startup
	if(processCount == 1)
	{
		tryPlausible("Alpine init");
	}
}
</script>

<WebVM configObj={configObj} processCallback={handleProcessCreated} cacheId="blocks_alpine">
	<p>Looking for something different? Try the classic <a class="underline" href="/" target="_blank">Debian Linux</a> terminal-based WebVM</p>
</WebVM>