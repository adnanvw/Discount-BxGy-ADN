import { json } from "@remix-run/node";
import { shopModel, DraftOrderModel, discountModel } from "../db.server";
import { createDraftOrder } from "../graphql/createDraftOrder";

export const action = async ({ request }) => {
  const data = JSON.parse(await request.text())
  const { shop, itemsForCheckout } = data

  try {

    const shopData = await shopModel.findOne({ shop });

    const discountData = await discountModel.findOne()

    if (!shopData) {
      throw new Error("Invalid shop in session");
    }
    console.log('data:', data);

    const lineItems = itemsForCheckout.map((d, i) => {
      if (i % 2 !== 0) {
        return {
          "appliedDiscount": {
            "title": discountData.discountTitle,
            "value": discountData.discountValue,
            "valueType": "PERCENTAGE"
          },
          "quantity": 1,
          "variantId": `gid://shopify/ProductVariant/${d.variant_id}`
        }
      } else {
        return {
          "quantity": 1,
          "variantId": `gid://shopify/ProductVariant/${d.variant_id}`
        }
      }
    })

    console.log('lineItems', ...lineItems);

    const draftOrderData = await createDraftOrder({
      shopData,
      accessToken: shopData.accessToken,
      lineItems,
      note: data.note
    });

    const draftOrder = new DraftOrderModel({ draftOrderID: draftOrderData.draftOrder.id, createdAt: draftOrderData.draftOrder.createdAt })

    await draftOrder.save()

    console.log('Data from create draft order:', draftOrderData);

    return json({
      message: 'Successfully completed operation.',
      ...draftOrderData,
    });

  } catch (error) {
    console.error("Error parsing JSON:", error);
    return json({ error: 'Failed to parse JSON from the request body.', details: error.message });
  }
};

