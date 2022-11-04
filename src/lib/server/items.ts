import type { Item } from '$lib/types/item';

export let items: Item[] = [
	{
		name: '3D Printer',
		description: 'Prints stuff, but in 3D! Available PLA colors: black, white, red and blue. (Please send an stl file to print)',
		images: ['https://fi.farnell.com/productimages/large/en_GB/2843627-40.jpg', 'https://www.nepad.org/sites/default/files/styles/521_800/public/2022-06/iStock-1301565754_0.jpg?itok=4vNXsp7D', 'https://c8.alamy.com/comp/RYX9FH/red-black-3d-printer-printing-blue-logo-symbol-on-metal-diamond-plate-future-technology-modern-concept-background-RYX9FH.jpg'],
		location: {
			address: 'Liisankatu 16, Helsinki'
		},
		price: {
			price_custom: '2c per PLA gram'
		},
		type: 'buy',
		available: true,
		user: "jukkapekka",
		file_required: true
	},
	{
		name: '3d-printer',
		description: 'I am a bad person and don\'t have a cool tagline. Available PLA colors: black, black and black. (Don\'t worry about sending an stl file, I\'ll print whatever I want)',
		images: ['https://hackaday.com/wp-content/uploads/2018/03/fire.png', "https://img.freepik.com/premium-psd/fire-extinguisher-icon-isolated-3d-render-illustration_47987-10348.jpg?w=2000"],
		location: {
			address: 'Kivimiehentie 3, Helsinki'
		},
		price: {
			price_custom: '1.9c per PLA gram'
		},
		type: 'buy',
		available: true,
		user: "pekkajukka",
		file_required: true
	},
	{
		name: 'Sauna tent',
		description: 'A tent for rent available to be lent. DM Kent for more info.',
		images: [
			'https://cdn.shopify.com/s/files/1/0346/3993/7580/products/DisplayTentMockup-HalfSide_2400x.png?v=1631401392',
			'https://i.ytimg.com/vi/8Z6nivgdy_I/maxresdefault.jpg'
		],
		location: {
			address: 'Arkadiankatu 12B'
		},
		price: {
			cents_per_hour: 1000
		},
		type: 'rent',
		available: true,
		user: "pekkajukka"
	},
	{
		name: 'Chainsaw',
		description: 'it cuts™',
		images: [
			'https://www.richardsonsaw.com/wp/img/choosing-a-chainsaw-for-cutting-firewood-680x459.jpg', 'https://media.istockphoto.com/id/502910575/fi/vektori/moottorisaha.jpg?s=612x612&w=is&k=20&c=9eIIKph3Wn9pEp2M7KDYR5i9b6SnhSZUpKlbaOxEKlE='
		],
		location: {
			address: 'Fleminginkatu 9, 00530 Helsinki'
		},
		price: {
			cents_per_hour: 500
		},
		type: 'rent',
		available: true,
		user: "paula"
	},
	{
		name: 'Laser printer',
		description: 'Standard colors, pretty high definition',
		images: [
			'https://media.istockphoto.com/id/171574641/fi/valokuva/mustesuihkutulostimen.jpg?s=612x612&w=0&k=20&c=qhzXzLHPehEd4yS2wS44Z5VCK56mMIDZbYaJp5yGITU=', 'https://cdn.pixabay.com/photo/2017/05/11/03/11/printers-hp-large-2302607_1280.jpg'
		],
		location: {
			address: 'Topeliaksenkatu'
		},
		price: {
			price_custom: '50c per page'
		},
		type: 'buy',
		available: true,
		user: "Heikki",
		file_required: true
	},
	{
		name: 'Electronics repair kit',
		description: 'A kit for repairing electronics, contains a soldering iron, solder, and a few other tools',
		images: [
			'https://media.istockphoto.com/photos/repairman-workplace-with-phone-and-special-tools-tool-kit-multimeter-picture-id930536058'],
		location: {
			address: 'Ståhlberginkuja 1, Helsinki'
		},
		price: {
			cents_per_hour: 120
		},
		type: 'rent',
		available: true,
		user: "Jukka-Pekka Arvo Miehelä-Järvinen"
	}
];

function validate_items() {
	for (let item of items) {
		if (item.type === 'rent') {
			if (item.price.cents_per_hour == null) {
				throw new Error(`Invalid item, missing cents_per_hour: ${item}`);
			}
		} else if (item.type === 'buy') {
			if (item.price.price_custom == null) {
				throw new Error(`Invalid item, missing price_custom: ${item}`);
			}
		}
	}
}

validate_items();
