//..................... render on cart page dynamic values .............

// below functionlaity will be for if the dicounted value and title will be dynamic
// also calculating discount according to this shopify calculator https://www.shopify.com/tools/discount-calculator
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
        // console.log("gotDiscount", gotDiscount);
        if (gotDiscount.length >= 1) {
          // console.log("gotDiscount inside", gotDiscount);
  
          discountTitle = gotDiscount[0].discountTitle;
          discountValue = gotDiscount[0].discountValue;
  
          const additional_text = document.querySelector(".additional-text");
          additional_text.innerHTML = `Carts with more than one item automatically <br> receive <strong
                  style="color:#50b3da!important;">${discountValue}% off</strong> half the items!`;
        }
      }
    } catch (error) {
      console.error("error while fetching discount data", error);
    }
  }
  renderOnce();
  
  //......................... end .....................
  
  
  //........................  checkout button ....................
  
  const customCheckOutButton = document.querySelector(".checkout-btn-custom");
  
  async function handleCheckoutClick() {
    customCheckOutButton.disabled = true;
    document.getElementById("loader").style.display = "block";
  
    const cartItemsData = JSON.parse(
      customCheckOutButton.getAttribute("cart-items-data")
    );
  
    // const itemsForCheckout = cartItemsData.map((item) => ({
    //   variant_id: item.variant_id,
    //   properties: item.properties,
    //   quantity: item.quantity,
    // }));
  
    const itemsForCheckout = cartItemsData.flatMap((item) =>
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
  if (customCheckOutButton) {
    customCheckOutButton.addEventListener("click", (e) => {
      e.preventDefault();
  
      handleCheckoutClick(e);
    });
  }
  
  //..................... end .........................
  