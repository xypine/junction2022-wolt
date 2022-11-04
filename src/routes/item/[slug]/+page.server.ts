import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { items } from '$lib/server/items';
import { get_route_details, order } from '$lib/server/wolt';
import { current_location_address } from '$lib/maputils';
import type { Item } from '$lib/types/item';

// https://kit.svelte.dev/docs/load
export const load: PageServerLoad = async ({ params }) => {
	const item: Item = items[params.slug];

	if(item != null) {
		const route_details = get_route_details(current_location_address, item.location.address);
		return {
			params,
			item,
			route_details
		};
	}
	else {
		throw error(404, "Item not found");
	}
};

import type { Actions } from './$types';
import { invalid, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({request, params}) => {
		const item: Item = items[params.slug];
		if(!item) {
			throw error(404, "Item not found");
		}
		const data = await request.formData();
		// 
		const Name  = data.get('Name');
		// const Address  = data.get('Address');
		let Address = current_location_address;
		const Phone  = data.get('Phone');
		
		if(!Name) {
			return invalid(400, { Name, missing: true });
		}
		/* if(!Address) {
			return invalid(400, { Address, missing: true });
		} */
		if(!Phone) {
			return invalid(400, { Phone, missing: true });
		}

		let ref_id = new Date().getTime() + "";
		let res = await order({
			pickup: {
				location: {
					formatted_address: item.location.address
				},
				comment: "Add comment here",
				contact_details: {
					name: item.user,
					phone_number: "+358123456789",
					send_tracking_link_sms: false
				}
			},
			dropoff: {
				location: {
					formatted_address: Address
				},
				comment: "Add user comment here",
				contact_details: {
					name: Name,
					phone_number: Phone,
					send_tracking_link_sms: true
				}
			},
			contents: [
				{
					count: 1,
					description: item.description,
					identifier: params.slug,
					tags: [
					]
				}
			],
			is_no_contact: true,
			min_preparation_time_minutes: 10,
			scheduled_dropoff_time: null,
			tips: [],
			merchant_order_reference_id: ref_id,
			customer_support: {
				email: "string",
				phone_number: "string",
				url: "https://comown.vercel.app/"
			}
		});

		if(res.error) {
			return {
				error: res.error
			}
		}

		throw redirect(303, res.tracking.url);
	}
  };