import { parse } from 'node-html-parser';
import { read } from '$app/server';

var posts = [
	"https://labs.leaningtech.com/blog/webvm-claude",
	"https://labs.leaningtech.com/blog/cx-10",
	"https://labs.leaningtech.com/blog/webvm-20",
	"https://labs.leaningtech.com/blog/join-the-webvm-hackathon",
	"https://labs.leaningtech.com/blog/mini-webvm-your-linux-box-from-dockerfile-via-wasm",
	"https://labs.leaningtech.com/blog/webvm-virtual-machine-with-networking-via-tailscale",
	"https://labs.leaningtech.com/blog/webvm-server-less-x86-virtual-machines-in-the-browser",
];

async function getPostData(u)
{
	var ret = { title: null, image: null, url: u };
	try {
		var response = await fetch(u);
		if (!response.ok) throw new Error("Fetch failed");
		var str = await response.text();
		var root = parse(str);
		var tags = root.getElementsByTagName("meta");
		for(var i=0;i<tags.length;i++)
		{
			var metaName = tags[i].getAttribute("property");
			var metaContent = tags[i].getAttribute("content");
			switch(metaName)
			{
				case "og:title":
					ret.title = metaContent;
					break;
				case "og:image":
					ret.image = metaContent;
					break;
			}
		}
	} catch (e) {
		console.error(`Error fetching post data for ${u}:`, e);
		ret.title = "Blog Post (Preview unavailable)";
	}
	return ret;
}

export async function load()
{
	var ret = [];
	try {
		// Fetch with a strict timeout to avoid blocking the whole app
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 2000);
		
		for(var i=0;i<posts.length;i++)
		{
			ret.push(await getPostData(posts[i]));
		}
		clearTimeout(timeoutId);
	} catch (e) {
		console.error("Layout load error:", e);
	}
	return { posts: ret || [] };
}
