<script lang="ts">
	import 'mapbox-gl/dist/mapbox-gl.css';
	import type { Item } from '$lib/types/item';
	export let items: Item[];
	import { onMount } from 'svelte';

	import { geocode, mbx_api_key, current_location_coordinates } from '$lib/maputils';

	import mapboxgl from 'mapbox-gl';
	import { browser } from '$app/environment';
	let map_center = [24.832995, 60.184841];
	let map_default_zoom = 10;
	let map_item_zoom = 13;
	let map: mapboxgl.Map;
	onMount(async () => {
		mapboxgl.accessToken = mbx_api_key;
		map = new mapboxgl.Map({
			container: 'map', // container ID
			style: 'mapbox://styles/mapbox/streets-v11', // style URL
			center: map_center, // starting position [lng, lat]
			zoom: map_default_zoom // starting zoom
		});

		for (let [i, item] of items.entries()) {
			const markerIcon = document.createElement('span');
			markerIcon.className = 'material-symbols-outlined marker-icon';
			markerIcon.innerText = 'location_on';
			markerIcon.onclick = () => {
				window.location.href = `/item/${i}`;
			};

			const itemElem = markerIcon.appendChild(document.createElement('div'));
			itemElem.className = 'marker';
			itemElem.style.backgroundImage = `url(${item.images[0]})`;
			let geocoded = await geocode(item.location.address);
			if (geocoded) {
				let coordinates = geocoded[0].center;
				new mapboxgl.Marker({
					anchor: 'bottom',
					element: markerIcon
				})
					.setLngLat(coordinates)
					.addTo(map);
			}
		}

		// Add current location
		new mapboxgl.Marker().setLngLat(current_location_coordinates).addTo(map);
	});

	function compare_coords(arr1, arr2) {
		let tolerance = Number.EPSILON;
		if (Math.abs(arr1[0] - arr2[0]) > tolerance) {
			return false;
		}
		if (Math.abs(arr1[1] - arr2[1]) > tolerance) {
			return false;
		}
		return true;
	}
	export async function centerOnItems(items: Item[]) {
		if (map != null) {
			// up-down first, then left-right
			let min = [90, 180];
			let max = [-90, -180];
			for (let item of items) {
				let geocoded = await geocode(item.location.address);
				if (geocoded) {
					let coordinates = geocoded[0].center;
					min[0] = Math.min(min[0], coordinates[0]);
					max[0] = Math.max(max[0], coordinates[0]);
					min[1] = Math.min(min[1], coordinates[1]);
					max[1] = Math.max(max[1], coordinates[1]);
				}
			}
			console.log('minmax coordinates', min, max);
			if (!compare_coords(min, max)) {
				map.fitBounds(
					[
						min, // southwestern corner of the bounds
						max // northeastern corner of the bounds
					],
					{
						padding: 80
					}
				);
			} else {
				map.flyTo({
					center: min,
					zoom: map_item_zoom
				});
			}
		}
	}
	let height: number;
	$: if (height && map) {
		map.resize();
	}
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,1,0"
	/>
</svelte:head>

<main bind:clientHeight={height}>
	<div class="map-container">
		<div id="map" />
		{#if !browser}
			<p class="self-expanding-centered">Loading map...</p>
		{/if}
	</div>
</main>

<style>
	main {
		min-width: 100%;
		display: flex;
		gap: 0.5em;

		flex: 1;
		overflow: hidden;
	}

	.map-container {
		background-color: var(--bg-off);
		flex: 1;
	}
	.self-expanding-centered {
		min-width: 100%;
		min-height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	div :global(.marker) {
		height: 40px;
		width: 40px;
		background-size: cover;
		border-radius: 50%;
		cursor: pointer;
		position: absolute;
		top: 10px;
		left: 17.5px;
	}
	div :global(.marker-icon) {
		font-size: 75px;
		color: whitesmoke;
	}

	#map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
	}
</style>
