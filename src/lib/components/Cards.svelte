<script lang="ts">
	import type { Item, Type } from '$lib/types/item';
	import { onMount } from 'svelte';
	import { slide, scale, fade } from 'svelte/transition';

	export let items: Item[];
	let open = true;

	let search_term: string = '';
	function search_clean_string(str: string): string {
		return str.toLowerCase().replaceAll(' ', '').replaceAll('-', '');
	}

	let current_type: Type = null;
	function search_filter(item: Item, match: string, type: Type): boolean {
		if (type && item.type !== type) return false;
		if (match === '') {
			return true;
		}
		let search_clean = search_clean_string(match);
		let item_name_clean = search_clean_string(item.name);
		if (item_name_clean.includes(search_clean)) {
			return true;
		}
		return false;
	}

	function change_type(type: Type) {
		current_type = type;
	}

	export let on_item_select = (item: Item) => {};
	export let on_items_filtered = (items: Item[]) => {};
	function filter_items(items: Item[], filter, type) {
		return items.filter((i) => search_filter(i, filter, type));
	}
	function sort_items(items: Item[]) {
		return items;
	}
	$: filtered_items = sort_items(filter_items(items, search_term, current_type));
	$: if (filtered_items != null) {
		on_items_filtered(filtered_items);
	}
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,300,1,200"
	/>
</svelte:head>

{#if !open}
	<div class="toggle-alone-container">
		<button
			on:click={() => {
				open = !open;
			}}
			class="toggle"
		>
			<span class="material-symbols-outlined"> arrow_drop_up </span>
		</button>
		<p>Items</p>
	</div>
{/if}
<main class="global-safe-padding" class:closed={!open}>
	<div class="settings">
		<div class="search">
			<button
				on:click={() => {
					open = !open;
				}}
				class="toggle"
			>
				<span class="material-symbols-outlined"> arrow_drop_down </span>
			</button>
			<input placeholder="Search items..." bind:value={search_term} />
		</div>
		<div class="class">
			<!-- <span>Select type:</span> -->
			<div class="type-container">
				<div class="types">
					<button
						class="type"
						on:click={() => {
							change_type('rent');
						}}
						style="background-color: {current_type !== 'rent' ? 'white' : 'lightgray'};"
						><span class="material-symbols-outlined"> supervised_user_circle </span>Rental</button
					>
					<button
						class="type"
						on:click={() => {
							change_type('buy');
						}}
						style="background-color: {current_type !== 'buy' ? 'white' : 'lightgray'};"
						><span class="material-symbols-outlined"> print </span>One-off</button
					>
				</div>
				<button
					class="cancel"
					on:click={() => {
						change_type(null);
					}}
					style="display: {current_type ? 'block' : 'none'}"
				>
					<span class="material-symbols-outlined">close</span>
				</button>
			</div>
		</div>
	</div>
	<div class="card-container">
		{#if filtered_items.length == 0}
			<div class="card">
				<p>No items found</p>
			</div>
		{/if}
		{#each filtered_items as item, index}
			<div
				class="card"
				in:fade={{
					delay: index * 50
				}}
				on:mouseenter={() => {
					on_item_select(item);
				}}
				on:click={() => {
					window.location.href = `/item/${index}`;
				}}
				style={item.images.length > 0 ? `--item-img: url(${item.images[0]})` : null}
			>
				<div class="card-info">
					<h3 class="card-title">{item.name}</h3>
					<span class="card-subtitle">{item.location.address}</span>
					{#if item.price.price_custom}
						<span class="card-subtitle">€: {item.price.price_custom}</span>
					{/if}
					{#if item.price.cents_per_hour}
						<span class="card-subtitle">€: {item.price.cents_per_hour / 100.0} €/h</span>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</main>

<style>
	.toggle-alone-container {
		display: flex;
		align-items: center;
	}
	.toggle {
		min-width: 4em;
		height: 4em;

		display: flex;
		justify-content: center;
		align-items: center;

		border: none;
		background: var(--bg);
		cursor: pointer;

		padding: 0;
	}
	main {
		max-width: 100%;
		overflow-x: auto;
		display: flex;
		flex-direction: column;
		text-align: center;

		--card-width: 300px;
		--card-height: 200px;

		transition: 200ms height;
	}
	main.closed {
		height: 0;
	}
	.class {
		display: flex;
		gap: 1em;
	}
	.cancel {
		background: none;
		border: none;
		cursor: pointer;

		display: flex;
		justify-content: center;
		align-items: center;
	}
	.settings {
		background-color: var(--bg-off);
		padding: 0;
		padding-right: 2em;
		margin-inline: -2em;
		display: flex;
		align-items: center;
		gap: 0.5em;
	}
	.search {
		display: flex;
		min-height: 2em;

		justify-content: center;
		align-items: center;
	}
	.search input {
		border-radius: 999px;
		border: 1px solid gray;
		padding: 0.25em 1em;
	}
	.search .toggle {
		margin-right: 0.5rem;
	}
	.card-container {
		display: flex;
		text-align: left;
		gap: 20px;
		max-width: 100vw;
		overflow-x: auto;
		margin-right: -2em;
	}
	.types {
		border: darkgray 1px solid;
		border-radius: 50px;

		display: flex;
		overflow: hidden;
	}
	.type-container {
		display: flex;
		overflow: hidden;
		justify-content: center;
		align-items: center;
	}
	.type {
		background: none;
		border: none;
		cursor: pointer;
		padding-inline: 0.5em;

		display: flex;
		align-items: center;
	}
	.card {
		border: 1px solid #ccc;
	}
	.card {
		min-height: var(--card-height);
		min-width: var(--card-width);
		padding: 0;
		margin-block: 20px;
		border-radius: 0.25rem;

		box-shadow: 0.25em 0.5em 0.5em rgba(var(--fg-raw), 0.1);

		cursor: pointer;
		display: flex;
		flex-direction: column-reverse;
		background-image: var(--item-img);
		background-size: cover;

		overflow: hidden;
	}
	.card-info {
		background-image: linear-gradient(0deg, var(--fg) 0%, rgba(0, 0, 0, 0) 100%);
		color: var(--bg);

		display: flex;
		height: 200px;
		justify-content: end;
		flex-direction: column;
		padding: 5px;
		font-size: 20px;
	}
	.card-title {
		font-size: 1.5em;
	}
</style>
