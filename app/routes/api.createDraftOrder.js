import { json } from "@remix-run/node";
import { shopModel, DraftOrderModel, discountModel, } from "../db.server";
import { createDraftOrder } from "../graphql/createDraftOrder";
import AlternativeDiscountModel from "../MONGODB/models/AlternativeDiscountModel";

export const action = async ({ request }) => {
  const data = JSON.parse(await request.text())
  const { shop, itemsForCheckout, discountCode } = data

  try {
    const shopData = await shopModel.findOne({ shop });

    let AlternativeDiscountData
    if (discountCode) {
      AlternativeDiscountData = await AlternativeDiscountModel.findOne({ discountTitle: discountCode })
      // console.log('AlternativeDiscountData.............', AlternativeDiscountData)
      if (!AlternativeDiscountData) {
        // console.log('inside.............', AlternativeDiscountData)
        return json({
          message: 'Invalid Discount Code.',
          discountCodeNotValid: true,
        });
      }
      else {
        // console.log('hit else itemsForCheckout=============.==================.==========', itemsForCheckout)
        let itemsForDraftOrderTotalDiscount = [];
        const reduceItems = itemsForCheckout.forEach((data) => {
          const matchedVariantIDIndex = itemsForDraftOrderTotalDiscount.findIndex(
            (it) => it.variant_id === data.variant_id
          );

          if (matchedVariantIDIndex === -1) {
            itemsForDraftOrderTotalDiscount.push({ ...data });
          } else {
            itemsForDraftOrderTotalDiscount[matchedVariantIDIndex].quantity += 1;
          }
        });
        // console.log('hit else itemsForDraftOrderTotalDiscount=============.==================.==========', itemsForDraftOrderTotalDiscount)
        const lineItems = itemsForDraftOrderTotalDiscount.map((item) => {
          const customAttributesArray = Object.entries(item.properties).map(([key, value]) => ({
            key,
            value
          }));

          return {
            customAttributes: customAttributesArray,
            quantity: item.quantity,
            variantId: `gid://shopify/ProductVariant/${item.variant_id}`,
          };
        });

        const draftOrderData = await createDraftOrder({
          shopData,
          accessToken: shopData.accessToken,
          lineItems,
          note: data.note,
          appliedDiscountTotal: {
            value: AlternativeDiscountData.discountValue,
            valueType: AlternativeDiscountData.discountValueType,
            title: AlternativeDiscountData.discountTitle
          },
        });
        // console.log('draftOrderData', draftOrderData)

        const draftOrder = new DraftOrderModel({ draftOrderID: draftOrderData.draftOrder.id, createdAt: draftOrderData.draftOrder.createdAt })
        await draftOrder.save()
        // console.log('Data from create draft order:', draftOrderData);
        return json({
          message: 'Successfully completed operation.',
          discountCodeNotValid: false,
          ...draftOrderData,
        });
      }
    }

    const discountData = await discountModel.findOne()

    if (!discountData || !discountData.discountTitle) {
      throw new Error("Invalid discount data");
    }

    if (!shopData) {
      throw new Error("Invalid shop in session");
    }
    // console.log('data:....................', data);

    // const lineItems = itemsForCheckout.map((d, i) => {
    //   if (i % 2 !== 0) {
    //     return {
    //       "appliedDiscount": {
    //         "title": discountData.discountTitle,
    //         "value": discountData.discountValue,
    //         "valueType": "PERCENTAGE"
    //       },
    //       "quantity": d.quantity,
    //       "variantId": `gid://shopify/ProductVariant/${d.variant_id}`
    //     }
    //   } else {
    //     return {
    //       "quantity": d.quantity,
    //       "variantId": `gid://shopify/ProductVariant/${d.variant_id}`
    //     }
    //   }
    // })
    // console.log('lineItems', ...lineItems);

    const listOfItemsDiscounted = itemsForCheckout.map((item, index) => ({
      ...item,
      discounted: index % 2 === 1
    }));

    // below code for item with more than 1 quantity showing all discounted individually and grouping all non-discounted in one

    // let itemsForDraftOrders = []
    // const reduceItems = listOfItemsDiscounted.map((data, index)=>{
    //     const filteredData = itemsForDraftOrders.filter(it => (it.variant_id === data.variant_id) && (it.discounted === false))
    //     if (data.discounted === true) {
    //         itemsForDraftOrders.push({
    //             ...data
    //         })
    //     } else  {

    //         if (filteredData.length < 1) {

    //             itemsForDraftOrders.push({
    //                 ...data
    //             })
    //         } else {
    //             // console.log('filteredData[0].quantity',filteredData[0].quantity)
    //             const filteredDataQuantity = filteredData[0].quantity
    //             // console.log('filteredDataQuantity', filteredDataQuantity)
    //             const updatedItems = itemsForDraftOrders.map((d) =>{
    //                 if (d.variant_id == filteredData[0].variant_id && d.discounted === false) {
    //                     // console.log('matched ', d)
    //                     return {
    //                         ...d,
    //                         quantity : +filteredData[0].quantity + 1
    //                     }
    //                 } else {
    //                     return d
    //                 }
    //             })
    //             itemsForDraftOrders = updatedItems
    //         }
    //     }
    // })

    // below non optimized code for item with more than 1 quantity grouping all discounted in one and all non-discounted in one 

    // const listOfItemsDiscounted = itemsForCheckout.map((d, i) => {
    //   if (i % 2 === 1) {
    //     return {
    //       ...d,
    //       discounted: true
    //     }
    //   } else {
    //     return {
    //       ...d,
    //       discounted: false
    //     }
    //   }
    // })

    // let itemsForDraftOrders = []
    // const reduceItems = listOfItemsDiscounted.map((data, index) => {
    //   const filteredData = itemsForDraftOrders.filter(it => (it.variant_id === data.variant_id) && (it.discounted === data.discounted))
    //   // console.log('itemsForDraftOrders', itemsForDraftOrders)
    //   console.log('filteredData', filteredData)
    //   if (filteredData.length < 1) {

    //     itemsForDraftOrders.push({
    //       ...data
    //     })
    //   } else {
    //     // console.log('filteredData[0].quantity',filteredData[0].quantity)
    //     const filteredDataQuantity = filteredData[0].quantity
    //     // console.log('filteredDataQuantity', filteredDataQuantity)
    //     const updatedItems = itemsForDraftOrders.map((d) => {
    //       if (filteredData[0].variant_id === d.variant_id && filteredData[0].discounted === d.discounted) {
    //         // console.log('matched ', d)
    //         return {
    //           ...d,
    //           quantity: +filteredData[0].quantity + 1
    //         }
    //       } else {
    //         return d
    //       }
    //     })
    //     itemsForDraftOrders = updatedItems
    //   }
    // })

    // const lineItems = itemsForDraftOrders.map((d, i) => {
    //   const customAttributesArray = Object.keys(d.properties).map(key => {
    //     return {
    //       "key": key,
    //       "value": d.properties[key]
    //     };
    //   });
    //   console.log('customAttributesArray', customAttributesArray);
    //   if (d.discounted) {
    //     return {
    //       "appliedDiscount": {
    //         "title": 'discountData.discountTitle',
    //         "value": 'discountData.discountValue',
    //         "valueType": "PERCENTAGE"
    //       },
    //       "customAttributes": customAttributesArray,
    //       "quantity": d.quantity,
    //       "variantId": `gid://shopify/ProductVariant/${d.variant_id}`
    //     }
    //   } else {
    //     return {
    //       "customAttributes": customAttributesArray,
    //       "quantity": d.quantity,
    //       "variantId": `gid://shopify/ProductVariant/${d.variant_id}`
    //     }
    //   }
    // })


    // below optimized code for item with more than 1 quantity grouping all discounted in one and all non-discounted in one 

    let itemsForDraftOrders = [];
    const reduceItems = listOfItemsDiscounted.forEach((data) => {
      const matchedVariantIDIndex = itemsForDraftOrders.findIndex(
        (it) => it.variant_id === data.variant_id && it.discounted === data.discounted
      );

      if (matchedVariantIDIndex === -1) {
        itemsForDraftOrders.push({ ...data });
      } else {
        itemsForDraftOrders[matchedVariantIDIndex].quantity += 1;
      }
    });

    const lineItems = itemsForDraftOrders.map((item) => {
      const customAttributesArray = Object.entries(item.properties).map(([key, value]) => ({
        key,
        value
      }));

      return {
        customAttributes: customAttributesArray,
        quantity: item.quantity,
        variantId: `gid://shopify/ProductVariant/${item.variant_id}`,
        ...(item.discounted && {
          appliedDiscount: {
            title: discountData.discountTitle,
            value: discountData.discountValue,
            valueType: 'PERCENTAGE'
          }
        })
      };
    });

    // console.log("shopData,accessToken,lineItems,note", shopData, shopData.accessToken,
    //   lineItems, data.note);

    const draftOrderData = await createDraftOrder({
      shopData,
      accessToken: shopData.accessToken,
      lineItems,
      note: data.note
    });

    // console.log('draftOrderData', draftOrderData)

    const draftOrder = new DraftOrderModel({ draftOrderID: draftOrderData.draftOrder.id, createdAt: draftOrderData.draftOrder.createdAt })

    await draftOrder.save()

    // console.log('Data from create draft order:', draftOrderData);

    return json({
      message: 'Successfully completed operation.',
      discountCodeNotValid: false,
      ...draftOrderData,
    });

  } catch (error) {
    console.error("Error parsing JSON:", error);
    return json({ error: 'Failed to parse JSON from the request body.', details: error.message });
  }
};

