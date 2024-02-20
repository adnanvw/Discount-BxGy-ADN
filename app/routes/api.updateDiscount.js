import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import discountModel from "../MONGODB/models/DiscountModel";

export const action = async ({ request }) => {

    const data = JSON.parse(await request.text())

    switch (request.method) {
        case "POST": {
            try {
                const { admin, session } = await authenticate.admin(request);

                // console.log('data...............for update.,..............,;........', data);
                // console.log('data...............for update.,..............,;........', data._id);


                const response = await discountModel.findByIdAndUpdate(data._id, {
                    ...data,
                    storeURL: session.shop
                }, { new: true });

                if (response) {
                    return json({
                        success: "Data Updated Successfully."
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