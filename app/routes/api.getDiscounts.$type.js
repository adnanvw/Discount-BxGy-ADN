import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { discountModel } from "../db.server";
import AlternativeDiscountModel from "../MONGODB/models/AlternativeDiscountModel";

export const loader = async ({ params }) => {
    try {
        // const { session } = await authenticate.admin(request);
        let gotDiscount
        if (params.type === 'alternativeDiscount') {
            gotDiscount = await AlternativeDiscountModel.find();

        } else {
            gotDiscount = await discountModel.find();

        }
        // console.log('gotDiscount.............',gotDiscount);
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