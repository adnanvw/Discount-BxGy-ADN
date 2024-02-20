import axios from "axios";
import { DraftOrderModel } from "../db.server";

export const deleteDraftOrder = async ({ shopData, accessToken, fifteenMinutesAgo }) => {
    try {

        const foundData = await DraftOrderModel.find({
            createdAt: {
                $lt: fifteenMinutesAgo
            }
        });

        // console.log('Found data:', foundData);

        const draftOrderIdsToDelete = foundData.map((d, i) => d.draftOrderID)

        // console.log('draftOrderIdsToDelete', draftOrderIdsToDelete);
        const draftOrderDeleteResponse = await axios({
            url: `https://${shopData.shop}/admin/api/2023-07/graphql.json`,
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken,
            },
            data: {
                query: `mutation draftOrderBulkDelete {
                    draftOrderBulkDelete(ids: [${draftOrderIdsToDelete.map(id => `"${id}"`).join(',')}]) {
                        job {
                        id
                      }
                      userErrors {
                        field
                        message
                      }
                    }
                  }`,
            },
        });

        console.log('Full response from Shopify API:', draftOrderDeleteResponse.data);

        if (draftOrderDeleteResponse.data.errors) {
            // console.log('hit if')
            return { status: false, message: 'Error occured while deleting draft orders', data: draftOrderDeleteResponse };
        } else if (draftOrderDeleteResponse.data.data.draftOrderBulkDelete.userErrors[0]) {
            // console.log('hit else if ')
            return { status: false, message: 'Error occured while deleting draft orders', data: draftOrderDeleteResponse };
        }
        // console.log('hit outside if')

        return { status: true, message: 'Successfully deleted draft orders', data: draftOrderDeleteResponse };
    } catch (error) {
        console.error("Error creating draft order:", error);
        throw error;
    }
};


