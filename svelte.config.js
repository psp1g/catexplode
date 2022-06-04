import staticAdapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		prerender: {
			default: false,
		},
		adapter: staticAdapter({
			pages: 'docs', assets: 'docs' // GitHub pages deployment
		}),
		paths: {
			base: process.env.BASE_PATH || ''
		},
	}
};

export default config;