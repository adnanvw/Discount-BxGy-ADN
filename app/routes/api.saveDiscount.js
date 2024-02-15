import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import discountModel from "../MONGODB/models/DiscountModel";

export const action = async ({ request }) => {
    const data = JSON.parse(await request.text());

    switch (request.method) {
        case "POST": {
            try {
                const { admin, session } = await authenticate.admin(request);

                console.log('Received data for saving:', data);

                const createdDiscount = await discountModel.create({
                    ...data,
                    storeURL: session.shop
                });

                return json({
                    success: "Data Saved Successfully.",
                    createdDiscountId: createdDiscount._id
                });
            } catch (error) {
                console.error("Error while saving data:", error);

                if (error.name === 'ValidationError') {
                    return json({
                        error: "Validation Error",
                        validationErrors: error.errors
                    });
                }

                return json({
                    error: "Something went wrong..."
                });
            }
        }
    }
};
