import type { PageServerLoad } from './$types';
import { items } from '$lib/server/items';

// https://kit.svelte.dev/docs/load
export const load: PageServerLoad = async ({ params }) => {
	return {
		items
	};
};
