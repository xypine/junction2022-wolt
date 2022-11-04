// https://github.com/mapbox/mapbox-sdk-js
// https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#geocoding
import GeocodingClient, { type GeocodeFeature } from '@mapbox/mapbox-sdk/services/geocoding';
export const mbx_api_key =
	'pk.eyJ1IjoiZGViYXRhYmxlODE2NCIsImEiOiJjbGEzMGU2OTgwbWQ4M29waDkzNjl2bTlhIn0.zbarmWnm8RWYMaGkZICSuw';
const geocoding_client = GeocodingClient({ accessToken: mbx_api_key });

export const current_location_address = 'Aalto Dipoli, Otakaari 24, 02150 Espoo';
export const current_location_coordinates = [24.832227, 60.1849845];

export async function geocode(query: string): Promise<GeocodeFeature[] | null> {
	let resp = await geocoding_client
		.forwardGeocode({
			query,
			limit: 5
		})
		.send();

	if (resp.statusCode == 200) {
		let body = resp.body;
		return body.features;
	}
	return null;
}
