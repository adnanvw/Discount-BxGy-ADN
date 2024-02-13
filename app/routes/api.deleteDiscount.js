import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import discountModel from "../MONGODB/models/DiscountModel";

export const action = async ({ request }) => {

    const data = JSON.parse(await request.text())

    switch (request.method) {
        case "DELETE": {
            try {
                const { admin, session } = await authenticate.admin(request);

                console.log('data for delete................,..............,;........', data);

                const response = await discountModel.findByIdAndDelete(data._id);

                if (response) {
                    return json({
                        success: "Data Deleted Successfully."
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