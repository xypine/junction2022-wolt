<script lang="ts">
	export let name: string;
	export let url: string | null;
	export let url_name: string | null;
	export let description_short: string;
	export let description: string;
	export let images: string[];
	export let repository: string | null;

	export let onPrevClicked: Function;
	export let onNextClicked: Function;
	export let onShowAllClicked: Function;

	export let isFirst = false;
	export let isLast = false;

	let selected_image = 0;
	$: if (name) {
		selected_image = 0;
	}
</script>

<main>
	<div class="images panel">
		{#key name}
			<div>
				{#each images as image_url, index}
					{#if selected_image == index}
						<img style="height: 100%;width: 100%;" src={image_url} alt={`screenshot of ${name}`} />
					{/if}
				{/each}
			</div>
			<div class="image-selector">
				{#each images as image_url, index}
					<img
						class="selectable"
						class:selected={selected_image == index}
						on:click={() => {
							selected_image = index;
						}}
						src={image_url}
						alt={`select screenshot ${index} of ${name}`}
					/>
				{/each}
			</div>
		{/key}
	</div>
	<div class="about panel">
		<h1>{name}</h1>
		<div class="links">
			{#if url}
				<a href={url} target="_blank" rel="noreferrer" title="opens in a new tab"
					>{url_name || url}</a
				>
			{/if}
			{#if repository}
				<a href={repository} target="_blank" rel="noreferrer" title="opens in a new tab"
					>Source Code</a
				>
			{/if}
		</div>
		<h2 style="max-width: 30ch;">{description_short}</h2>
		<p style="flex:1;max-width: 45ch;overflow-y: auto;white-space: pre-wrap;max-height: 50vh;">
			{description}
		</p>
		<div class="actions">
			<slot name="actions">
				<button
					disabled={isFirst}
					on:click={() => {
						onPrevClicked();
					}}>Previous</button
				>
				<button
					on:click={() => {
						onShowAllClicked();
					}}>Show All</button
				>
				<button
					disabled={isLast}
					on:click={() => {
						onNextClicked();
					}}>Next</button
				>
			</slot>
		</div>
	</div>
</main>

<style>
	main {
		display: flex;
		gap: 0.5em;

		max-width: 100%;
		max-height: 100%;

		flex-wrap: wrap;
	}
	.panel {
		border-radius: 0.5em;
		border: 2px solid var(--border);
		background: var(--border);
	}
	.images {
		display: flex;
		flex: 1;
		overflow: hidden;

		flex-direction: column;
		gap: 0.5em;

		min-width: min(400px, 90vw);
	}
	img {
		max-width: 100%;
		max-height: 100%;
	}
	img.selectable {
		border: 4px solid transparent;
		border-radius: 0.25em;
		cursor: pointer;
	}
	img.selected {
		border: 4px solid var(--brand);
	}
	.image-selector {
		height: 5em;
		display: flex;
		gap: 0.5em;
		padding-bottom: 0.5em;
		overflow-x: auto;
	}
	.about {
		display: flex;
		flex-direction: column;
		padding: 0.5em 1em;
	}
	.links {
		display: flex;
		gap: 0.5em;
		flex-wrap: wrap;
		width: 100%;
		justify-content: space-between;
	}
	.actions {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
	}
	.actions * {
		flex: 1;
	}
</style>
