import axios from "axios";

export const deleteDraftOrder = async ({ shopData, accessToken }) => {
    try {


        const draftOrderDeleteResponse = await axios({
            url: `https://${shopData.shop}/admin/api/2023-07/graphql.json`,
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken,
            },
            data: {
                // query: `mutation draftOrderCreate($input: DraftOrderInput!) {
                //                 draftOrderCreate(input: $input) {
                //                     draftOrder {
                //                         id
                //                         invoiceUrl
                //                         createdAt
                //                     }
                //                       userErrors {
                //                         field
                //                         message
                //                     }
                //                 }
                //               }`,
                // variables: {
                //   input: {
                //     note: "note***",
                //     lineItems,
                //   },
                // },
            },
        });

        console.log('Full response from Shopify API:', draftOrderDeleteResponse);

        return { status: true, data: draftOrderDeleteResponse };
    } catch (error) {
        console.error("Error creating draft order:", error);
        throw error;
    }
};
