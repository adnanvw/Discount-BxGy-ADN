
document.addEventListener('DOMContentLoaded', async function () {


    const discount_section = document.getElementById('custom-discount-section');
    const checkout_container = document.getElementById('checkout-container');

    const checkCartItems = async () => {
        try {

            const response = await fetch('https://my-store-development-14.myshopify.com/cart.json', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                // console.log('"result" from extension...........', result);
                var itemCount = result.item_count
                if (itemCount === 0) {
                    discount_section.style.display = 'none';
                    checkout_container.style.display = 'none';
                } else {
                    discount_section.style.removeProperty("display");
                    checkout_container.style.removeProperty("display");

                }
            }


        } catch (error) {
            console.log('error from extension', error);
        }
    }

    checkCartItems()

    setInterval(async () => {
        checkCartItems()
    }, 1000)

    const applyBtn = document.getElementById('apply-discount-btn');
    const checkoutBtn = document.getElementById('custom-checkout-btn');

    applyBtn.addEventListener('click', function () {
        const discountCode = document.getElementById('discount-code').value;

        console.log('discount value entered', discountCode);
    });

    checkoutBtn.addEventListener('click', function () {
        const wiki = 'https://www.wikipedia.org/';
        window.location.href = wiki;
    });


});


////////////////////////////////////extension running check////////////////////////////////////

console.log("Theme app extension is running! ")
