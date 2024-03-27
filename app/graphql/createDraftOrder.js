import axios from "axios";

export const createDraftOrder = async ({ shopData, accessToken, lineItems, note, appliedDiscountTotal }) => {
  try {

    const draftOrderResponse = await axios({
      url: `https://${shopData.shop}/admin/api/2023-07/graphql.json`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      data: {
        query: `mutation draftOrderCreate($input: DraftOrderInput!) {
                        draftOrderCreate(input: $input) {
                            draftOrder {
                                id
                                invoiceUrl
                                createdAt
                            }
                            userErrors {
                              field
                              message
                            }
                        }
                      }`,
        variables: {
          input: {
            note: note,
            lineItems,
            ...(
              appliedDiscountTotal ? {appliedDiscount:appliedDiscountTotal} : {}
            )
          },
        },
      },
    });

    console.log('Full response from Shopify API:', draftOrderResponse.data);

    return draftOrderResponse.data.data.draftOrderCreate;
  } catch (error) {
    console.error("Error creating draft order:", error);
    throw error;
  }
};
