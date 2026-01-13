import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fs from 'fs';
import path from 'path';

// Custom plugin to serve directory listings and support Range requests for CheerpX
const cheerpxIndexer = () => ({
	name: 'cheerpx-indexer',
	configureServer(server) {
		server.middlewares.use((req, res, next) => {
			const url = req.url.split('?')[0];
			const fullPath = path.join(process.cwd(), 'static', url);

			if (fs.existsSync(fullPath)) {
				const stat = fs.statSync(fullPath);
				let targetPath = fullPath;
				let isDirectory = stat.isDirectory();

				if (isDirectory) {
					targetPath = path.join(fullPath, 'index.list');
					if (!fs.existsSync(targetPath)) return next();
				}

				const targetStat = fs.statSync(targetPath);
				
				// Set Global Headers for CheerpX
				res.setHeader('Accept-Ranges', 'bytes');
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
				res.setHeader('Access-Control-Allow-Headers', 'Range, If-Modified-Since, Cache-Control');
				res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length');

				if (req.method === 'OPTIONS') {
					res.statusCode = 204;
					res.end();
					return;
				}

				// Handle index.list requests (Directory Indexing for CheerpX)
				if (isDirectory || url.endsWith('index.list')) {
					const listPath = isDirectory ? path.join(fullPath, 'index.list') : fullPath;
					if (fs.existsSync(listPath)) {
						console.log(`[CheerpX] Serving index: ${url}`);
						res.setHeader('Content-Type', 'text/plain');
						res.setHeader('Accept-Ranges', 'bytes');
						res.statusCode = 200;
						fs.createReadStream(listPath).pipe(res);
						return;
					}
				}

				// Handle Range Requests (PRIORITY for files)
				if (req.headers.range) {

				// Handle Full Requests for specific types or directories
				if (isDirectory || url.endsWith('.sh') || url.endsWith('.list')) {
					res.setHeader('Content-Length', targetStat.size);
					res.setHeader('Content-Type', isDirectory ? 'text/plain' : 'text/plain');
					res.statusCode = 200;
					if (req.method === 'HEAD') {
						res.end();
					} else {
						fs.createReadStream(targetPath).pipe(res);
					}
					return;
				}
			}
			next();
		});
	}
});

export default defineConfig({
	resolve: {
		alias: {
			'/config_terminal': path.resolve(process.env.WEBVM_MODE == "github" ? 'config_github_terminal.js' : 'config_public_terminal.js'),
			'/config_public_alpine': path.resolve('config_public_alpine.js'),
			"@leaningtech/cheerpx": process.env.CX_URL ? process.env.CX_URL : "@leaningtech/cheerpx"
		}
	},
	build: {
		target: "esnext"
	},
	optimizeDeps: {
		exclude: ["@leaningtech/cheerpx"],
		esbuildOptions: {
			target: "esnext"
		}
	},
	server: {
		fs: {
			allow: ['.']
		},
		headers: {
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'credentialless',
			'Cross-Origin-Resource-Policy': 'cross-origin',
			'X-Debug-Vite': 'true'
		}
	},
	plugins: [
		sveltekit(),
		cheerpxIndexer(),
		viteStaticCopy({
			targets: [
				{
					src: 'static/game/*',
					dest: 'game'
				}
			]
		})
	]
});