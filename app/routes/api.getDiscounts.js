import { json } from "@remix-run/node";
import { authenticate } from '../../app/shopify.server'
import { discountModel } from "../db.server";

export const loader = async ({ request }) => {
    try {
        // const { session } = await authenticate.admin(request);

        const gotDiscount = await discountModel.find();
        console.log('gotDiscount.............',gotDiscount);
        return json({
            gotDiscount,
        }, { status: 200 });
    } catch (error) {
        console.error("Error in loader:", error);
        return json({
            error: `Something went wrong: ${error.message || error}`,
        }, { status: 500 });
    }
};