<script lang="ts">
	import { current_location_address } from '$lib/maputils';
	import type { RouteReturn } from '$lib/server/wolt';

	// https://kit.svelte.dev/docs/load
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	let route_details: RouteReturn = data.route_details;
	console.log('route details', route_details);

	let imageIndex = 0;

	function changeImage(i: number) {
		imageIndex = i;
	}

	export let form: ActionData;
	console.log('form', form);

	const userFields = ['Name', 'Address', 'Phone'];
</script>

<svelte:head>
	<title>{data.item.name} - ComOwn</title>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
	/>
</svelte:head>

<main>
	<div class="images">
		<div class="big-image-container">
			<img class={'big-image'} src={data.item.images[imageIndex]} alt={data.item.name} />
		</div>
		<div class="small-images">
			{#each data.item.images as image, i}
				<img
					class="small-image {imageIndex === i ? 'selected' : ''}"
					src={image}
					alt={data.item.name}
					on:click={() => {
						changeImage(i);
					}}
				/>
			{/each}
		</div>
	</div>
	<div class="data">
		<h1>{data.item.name}</h1>
		<p>{data.item.description}</p>
		<p class="user">
			Owned by: <span class="material-symbols-outlined" style="pointer-events: none; width: 1em;">
				account_circle
			</span><span class="username">{data.item.user}</span>
		</p>
		{#if data.item.price.price_custom}
			<span class="card-subtitle">Price: {data.item.price.price_custom}</span>
		{/if}
		{#if data.item.price.cents_per_hour}
			<span class="card-subtitle">Price: {data.item.price.cents_per_hour / 100.0} €/h</span>
		{/if}
		<div class="route-details">
			{#if route_details.error}
				<p>Error fetching delivery details: {route_details.error}</p>
			{:else}
				<h2>Delivery</h2>
				<p>Estimated delivery time: {route_details.time_estimate_minutes} minutes</p>
				<p>Fee: {route_details.fee.amount / 100.0} €</p>
			{/if}
		</div>
		<div class="order">
			<form method="POST">
				<div class="order-info">
					{#each userFields as info}
						<div class="user-info">
							<span class="material-symbols-outlined" style="pointer-events: none; width: 1em;">
								{info === 'Name' ? 'account_circle' : info === 'Address' ? 'location_on' : 'phone'}
							</span>
							<label for={info} class="user-info-text">{info}:</label>
							{#if form?.missing && Object.keys(form).includes(info) && form[info] == null}<p
									class="error"
								>
									missing
								</p>{/if}
							<input
								type="text"
								disabled={info === 'Address'}
								id={info}
								name={info}
								value={info === 'Address' ? current_location_address : null}
							/>
						</div>
					{/each}
					{#if data.item.file_required}
						<div class="user-info">
							<span class="material-symbols-outlined" style="pointer-events: none; width: 1em;">
								attach_file
							</span>
							<label for="file" class="user-info-text">File:</label>
							<input type="file" id="file" name="file" />
						</div>
					{/if}
				</div>
				<input class="order-button" value="Order" type="submit" />
			</form>
		</div>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-wrap: wrap;
		min-height: calc(100vh - var(--header-height));
	}
	.images {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		flex: 1;
		min-width: 500px;
		max-width: 70%;
	}
	.small-image {
		max-height: 100px;
		cursor: pointer;
		border: 3px solid transparent;
	}
	.small-images {
		display: flex;
		flex-direction: row;
		gap: 2em;
		padding-left: 50px;
	}
	.big-image-container {
		display: flex;
		justify-content: center;
		padding-bottom: 20px;
	}
	.big-image {
		height: 500px;
		cursor: pointer;
	}
	.route-details {
		padding-top: 25px;
	}
	.data {
		min-width: 30%;
		max-width: 40ch;
	}
	.data,
	.images {
		padding: 1em;
	}
	.username {
		text-decoration: underline;
		cursor: pointer;
	}
	.user {
		display: flex;
		align-items: center;
		gap: 3px;
	}
	.user-info {
		padding-bottom: 3px;
	}
	.selected {
		border: 3px solid #4f97f6;
	}
	.order {
		padding-top: 1.5em;
	}
	.order-button {
		font-size: 25px;
		background-color: #4f97f6;
		border: none;
		border-radius: 999px;
		padding: 0.5em 2em;
		margin-top: 1em;
		width: 100%;
		cursor: pointer;
	}
	.user-info {
		display: flex;
		gap: 0.2em;
	}
	.user-info input {
		flex: 1;
	}
	.user-info label {
		flex: 1;
	}
</style>
