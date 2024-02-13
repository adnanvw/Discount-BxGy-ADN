import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import discountModel from "../MONGODB/models/DiscountModel";

export const action = async ({ request }) => {

    const data = JSON.parse(await request.text())

    switch (request.method) {
        case "POST": {
            try {
                const { admin, session } = await authenticate.admin(request);

                console.log('data................,..............,;........', data);

                const response = await discountModel.create({
                    ...data,
                    storeURL: session.shop
                })

                if (response) {
                    return json({
                        success: "Data Saved Successfully."
                    });

                } else {
                    return json({
                        error: "Something went wrong...",
                        response: response

                    });
                }

            } catch (error) {
                console.log("error", error)
                return json({
                    error: "Something went wrong..."
                });
            }
        }
    }
};