// Todo: .env / env hehee
import { env } from "$env/dynamic/private";
export const bearer = env.TOKEN;
export const merchant_id = env.MERCHANT_ID;
export const wolt_endpoint = `https://daas-public-api.development.dev.woltapi.com/merchants/${merchant_id}`;

export type pickup_dropoff = {
    location: {
        formatted_address: string
    },
    coordinates?: {
        lat: number,
        lon: number
    },
}
export type fee_request_data = {
    pickup: pickup_dropoff,
    dropoff: pickup_dropoff
};


export type RouteDetails = {
        created_at: string,
        pickup: pickup_dropoff,
        dropoff: pickup_dropoff,
        fee: {
            amount: number, // Cents
            currency: string
        },
        time_estimate_minutes: number,
        scheduled_dropoff_time: any // Dunno what this is, it's null all the time
}
export type RouteErr = {
    error: string
}
export type RouteReturn = RouteDetails | RouteErr;
export async function get_route_details(from: string, to: string): Promise<RouteDetails | RouteErr> {
    let data: fee_request_data = {
        pickup: {
            location: {
                formatted_address: from
            }
        },
        dropoff: {
            location: {
                formatted_address: to
            }
        }
    }
    let res = await fetch(`${wolt_endpoint}/delivery-fee`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Authorization": `Bearer ${bearer}`,
            "Content-Type": "application/json"
        }
    });
    if(res.ok) {
        return await res.json();
    }
    else {
        try {
            let details = await res.json();
            return {
                error: JSON.stringify(details)
            };
        } catch {
            return {
                error: res.statusText
            };
        }
    }
}

export type pickup_dropoff_order = {
    location: {
        formatted_address: string
    },
    comment: string,
    contact_details: {
        name: string,
        phone_number: string,
        send_tracking_link_sms: boolean
    }
}
export type order_content = {
    count: number,
    description: string,
    identifier: string,
    tags: string[]
};
export type order_request_data = {
    pickup: pickup_dropoff_order,
    dropoff: pickup_dropoff_order,
    merchant_order_reference_id: string, // Maybe number (was null)???
    is_no_contact: boolean,
    contents: order_content[],
    tips: any[],
    min_preparation_time_minutes: number,
    scheduled_dropoff_time: null // We probably should check the docs on this one,
    customer_support: {
        email: string,
        url: string,
        phone_number: string
    }
};
export async function order(order: order_request_data) {
    let res = await fetch(`${wolt_endpoint}/delivery-order`, {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
            "Authorization": `Bearer ${bearer}`,
            "Content-Type": "application/json"
        }
    });
    if(res.ok) {
        return await res.json();
    }
    else {
        try {
            let details = await res.json();
            return {
                error: JSON.stringify(details)
            };
        } catch {
            return {
                error: res.statusText
            };
        }
    }
}