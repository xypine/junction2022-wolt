<script lang="ts">
	import Cards from '$lib/components/Cards.svelte';
	import Map from '$lib/components/Map.svelte';
	import type { Item } from '$lib/types/item';

	// https://kit.svelte.dev/docs/load
	import type { PageData } from './$types';
	export let data: PageData;
	let on_item_select = (item: Item) => {
		mapInstance.centerOnItems([item]);
	};
	let on_items_filtered = (items: Item[]) => {
		if (mapInstance) mapInstance.centerOnItems(items);
	};

	let mapInstance: Map;
</script>

<svelte:head>
	<title>ComOwn</title>
</svelte:head>

<main>
	<Map items={data.items} bind:this={mapInstance} />
	<Cards items={data.items} {on_item_select} {on_items_filtered} />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;

		height: calc(100vh - var(--header-height));
	}
</style>
