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
			// Only intercept static folder assets
			const fullPath = path.join(process.cwd(), 'static', url);
			console.log(`[CheerpX] Request: ${req.method} ${url} Headers: ${JSON.stringify(req.headers)}`);

			if (fs.existsSync(fullPath)) {
				const stat = fs.statSync(fullPath);
				let targetPath = fullPath;
				let isDirectory = stat.isDirectory();

				if (isDirectory && !url.endsWith('/') && !url.endsWith('index.list')) {
					res.statusCode = 301;
					res.setHeader('Location', url + '/');
					res.end();
					return;
				}

				const targetStat = isDirectory ? null : fs.statSync(targetPath);
				
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
				if (url.endsWith('/index.list')) {
					const listPath = isDirectory ? path.join(fullPath, 'index.list') : fullPath;
					if (fs.existsSync(listPath)) {
						const listStat = fs.statSync(listPath);
						res.setHeader('Content-Type', 'text/plain');
						res.setHeader('Content-Length', listStat.size);
						res.statusCode = 200;
						fs.createReadStream(listPath).pipe(res);
						return;
					}
				}

				// Handle Range Requests (ESSENTIAL for .jar and .so files)
				if (req.headers.range && !isDirectory) {
					const parts = req.headers.range.replace(/bytes=/, "").split("-");
					const start = parseInt(parts[0], 10);
					const end = parts[1] ? parseInt(parts[1], 10) : targetStat.size - 1;
					const chunksize = (end - start) + 1;
					
					res.setHeader('Content-Range', `bytes ${start}-${end}/${targetStat.size}`);
					res.setHeader('Content-Length', chunksize);
					res.setHeader('Content-Type', 'application/octet-stream');
					res.statusCode = 206;
					
					fs.createReadStream(targetPath, {start, end}).pipe(res);
					return;
				}

				// Fallback for full requests
				if (!isDirectory && (req.method === 'GET' || req.method === 'HEAD')) {
					res.setHeader('Content-Length', targetStat.size);
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
		cheerpxIndexer(),
		sveltekit(),
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