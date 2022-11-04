export type Location = {
	address: string;
};
export type Price = {
	cents_per_hour?: number; // For renting
	price_custom?: string; // For purchases
};

export type Type = 'rent' | 'buy' | null;

export type ItemRentDetails = {
	date_from: string,
	date_to: string,
};
export type Item = {
	name: string;
	description: string;
	images: string[];
	location: Location;
	price: Price;
	type: Type;
	available: boolean;
	rent_details?: ItemRentDetails;
	user: string;
	file_required?: boolean;
};
