//..................... render on cart page dynamic values .............

// below functionlaity will be for if the dicounted value and title will be dynamic
async function renderOnce() {
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
        console.log("gotDiscount", gotDiscount);
        discountTitle = gotDiscount[0].discountTitle;
        discountValue = gotDiscount[0].discountValue;
      }
    } catch (error) {
      console.log("error while fetching discount data", error);
    }
  
    // for Total price value with discounted price is incomplete currently
    let totalPrice = 0;
    const totalPriceElementCustom = document.getElementById("totalPrice-custom");
  
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
        totalPrice += originalPrice;
        console.log(
          'OP.getAttribute("check_is_even_row") from if',
          OP.getAttribute("check_is_even_row")
        );
      }
    });
  
    percentageDiscountPriceElement.forEach((pe, i) => {
      console.log("discountValue", discountValue);
      const originalPriceString = pe.getAttribute("data-original-price-discount");
      console.log("originalPrice", originalPriceString);
      const originalPrice = parseFloat(originalPriceString) / 100;
      console.log("originalPrice (in dollars)", originalPrice);
      const discountAmount = (discountValue / 100) * originalPrice;
      console.log("discountAmount", discountAmount);
      const discountedPrice = originalPrice - discountAmount;
      console.log("discountedPrice", discountedPrice);
      pe.innerHTML = `Rs. ${discountedPrice.toFixed(2)}`;
    });
  
    // for items discount text
    const percentageElementTitle = document.querySelectorAll(
      ".percentage-discounted-price-title"
    );
    percentageElementTitle.forEach((pe) => {
      pe.innerText = `"${discountTitle}" Applied`;
    });
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
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  
  document.getElementById("cartform").addEventListener("change", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("item-quantity")) {
      const itemId = e.target.getAttribute("input-quantity-variant-id");
      const quantityValue = e.target.value;
      const originalQuantity = e.target.getAttribute("original-quantity-data");
      const calculatedTotalQuantity = +originalQuantity + +quantityValue - 1;
      // console.log("itemId", itemId);
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
      quantity: quantity - 1,
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
  
    const itemsForCheckout = sortedCartItemsData.flatMap((item) =>
      Array.from({ length: item.quantity }, () => ({
        variant_id: item.variant_id,
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
        const result = await response.json();
        const { id, createdAt, invoiceUrl } = result.draftOrder;
        console.log("result", result);
        // customCheckOutButton.disabled = false;
        document.getElementById("loader").style.display = "none";
        window.location.href = invoiceUrl;
      } else {
        document.getElementById("loader").style.display = "none";
        document.getElementById("error-text").style.display = "block";
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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
  