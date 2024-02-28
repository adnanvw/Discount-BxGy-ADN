//..................... render on cart page dynamic values .............

// below functionlaity will be for if the dicounted value and title will be dynamic
// also below calculating discount according to this shopify calculator https://www.shopify.com/tools/discount-calculator
async function renderOnce() {
  const itemsParent = document.querySelectorAll('.items-parent')
  // console.log('asdfkjasdf', itemsParent)
  itemsParent.forEach(e =>{
    // console.log('asd;liasdflkjkasdf', e.getAttribute('itemNo'))
  })
  let discountTitle;
  let discountValue;
  try {
    const response = await fetch(
      `https://${Shopify.shop}/apps/guys/api/getDiscounts`,
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const jsonData = await response.json();
      const { gotDiscount } = jsonData;
      // console.log("gotDiscount", gotDiscount);
      if (gotDiscount.length >= 1) {
        // console.log("gotDiscount inside", gotDiscount);

        discountTitle = gotDiscount[0].discountTitle;
        discountValue = gotDiscount[0].discountValue;

        // for Total price value with discounted price is incomplete currently
        let totalDiscountedPrice = 0;
        const totalPriceElementCustom =
          document.getElementById("totalPrice-custom");

        // for original value
        const OriginalPriceElement = document.querySelectorAll(
          ".percentage-original-price-value"
        );

        // for discount value
        const percentageDiscountPriceElement = document.querySelectorAll(
          ".percentage-discounted-price-value"
        );

        OriginalPriceElement.forEach((OP, i) => {
          const originalPrice = OP.getAttribute("data-original-price");
          if (OP.getAttribute("check_is_even_row") === "1") {
            totalDiscountedPrice += parseFloat(originalPrice) / 100;
          }
        });

        percentageDiscountPriceElement.forEach((pe, i) => {
          const originalPriceString = pe.getAttribute(
            "data-original-price-discount"
          );
          const originalPrice = parseFloat(originalPriceString) / 100;
          const discountAmount = (discountValue / 100) * originalPrice;
          const discountedPrice = originalPrice - discountAmount;
          const formattedDiscountedPrice = Number(
          discountedPrice
        ).toLocaleString("en-US", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
          pe.innerHTML = `Rs. ${formattedDiscountedPrice}`;
          totalDiscountedPrice += +discountedPrice;
        });

        // for items discount text
        const percentageElementTitle = document.querySelectorAll(
          ".percentage-discounted-price-title"
        );
        percentageElementTitle.forEach((pe) => {
          pe.innerText = `"${discountTitle}" Applied`;
        });

        const originalPriceElement = document.querySelectorAll(
          ".elements-for-lineThrough"
        );
        originalPriceElement.forEach((e, i) => {
          e.style.textDecoration = "line-through";
        });

        const additional_text = document.querySelector('.additional-text')
        additional_text.innerHTML = `Carts with more than one item automatically <br> receive <strong
                style="color:#50b3da!important;">${discountValue}% off</strong> half the items!`

        const DiscountedTotalPriceElement =
          document.getElementById("totalPrice-custom");
        // console.log(
        //   "Number(totalDiscountedPrice)",
        //   Number(totalDiscountedPrice)
        // );
        const formattedTotalAmount = Number(
          totalDiscountedPrice
        ).toLocaleString("en-US", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        // console.log("formattedTotalAmount", formattedTotalAmount);
        DiscountedTotalPriceElement.innerText = `Rs. ${formattedTotalAmount}`;
      } else {
        // if we need in future to hide a custom button when no discount in database this will help
        // below elements of both buttons custom and native
        const discountAvailableCheckout = document.querySelector(
          ".discount-available-checkout"
        );
        const noDiscountAvailableCheckout = document.querySelector(
          ".no-discount-available-checkout"
        );
      }
    }
  } catch (error) {
    console.error("error while fetching discount data", error);
  }
}
renderOnce();

//......................... end .....................

//........................ update quantity functionality ........

function updateQuantity(id, quantity) {
  let updates = {
    [id]: parseInt(quantity),
  };

  // console.log("updates.............", updates);

  fetch(window.Shopify.routes.root + "cart/update.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ updates }),
  })
    .then((response) => {
      const res = response.json();
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document.getElementById("cartform").addEventListener("change", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("item-quantity")) {
    const itemId = e.target.getAttribute("input-quantity-variant-id");
    const quantityInputValue = e.target.value;
    const Quantity = e.target.getAttribute("quantity-data");
    const originalQuantity = e.target.getAttribute("original-quantity-data");
    const calculatedTotalQuantity = +quantityInputValue + +(+originalQuantity === 1 ? 0 : +Quantity);
    // const calculatedTotalQuantity = +quantityInputValue;
    // console.log("(+originalQuantity == 1 ? 0 : +quantityInputValue)",(+originalQuantity == 1 ? 0 : +quantityInputValue));
    // console.log(`Quantity:${Quantity}  originalQuantity:${originalQuantity}  quantityInputValue:${quantityInputValue}`);
    updateQuantity(itemId, calculatedTotalQuantity);
  }
});

document.getElementById("update-cart").addEventListener("click", (e) => {
  e.preventDefault();
  setTimeout(() => {
    window.location.reload();
  }, 1000);
});

//......................... end ....................

//........................  remove button ....................

function handleRemoveClick(variantId, quantity) {
  let updates = {
    id: variantId,
    quantity: quantity,
  };
  // console.log("updates.............", updates);

  fetch(window.Shopify.routes.root + "cart/change.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  })
    .then((response) => {
      const res = response.json();
      return window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//..................... end .........................

//........................  checkout button ....................

const customCheckOutButton = document.querySelector(".checkout-btn-custom");

async function handleCheckoutClick() {
  customCheckOutButton.disabled = true;
  document.getElementById("loader").style.display = "block";

  const sortedCartItemsData = JSON.parse(
    customCheckOutButton.getAttribute("data-sorted-cart-items")
  );

  // const itemsForCheckout = sortedCartItemsData.map((item) => ({
  //   variant_id: item.variant_id,
  //   properties: item.properties,
  //   quantity: item.quantity,
  // }));

  const itemsForCheckout = sortedCartItemsData.flatMap((item) =>
    Array.from({ length: item.quantity }, () => ({
      variant_id: item.variant_id,
      properties: item.properties,
      // properties: {
      //   "Baby name": "we",
      //   "Birth date": "df",
      //   "Initial": "xv",
      //   "Weight and Length": "rt",
      //   "Dedication": "23",
      //   "Image": "ghj"
      // },
      quantity: 1,
    }))
  );

  const noteValue = document.getElementById("note").value;

  const newData = {
    shop: Shopify.shop,
    itemsForCheckout,
    note: noteValue,
  };
  try {
    const response = await fetch(
      `https://${Shopify.shop}/apps/guys/api/createDraftOrder`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newData }),
      }
    );

    if (response.ok) {
      // console.log("response", response);
      const result = await response.json();
      const { id, createdAt, invoiceUrl } = result.draftOrder;
      // console.log("result", result);
      // customCheckOutButton.disabled = false;
      document.getElementById("loader").style.display = "none";
      window.location.href = invoiceUrl;
    } else {
      // console.log("response else", response);
      document.getElementById("loader").style.display = "none";
      document.getElementById("error-text").style.display = "block";
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  } catch (error) {
    document.getElementById("loader").style.display = "none";
    document.getElementById("error-text").style.display = "block";
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    console.error("Error fetching discounts:", error);
  }
}

customCheckOutButton.addEventListener("click", (e) => {
  e.preventDefault();

  handleCheckoutClick(e);
});

//..................... end .........................
