var to_purchase_pack;


function parentVerifyCharge( userid) {

	// populate header text
	console.log("parentVerifyCharge for " + userid);

	createBuyButtons( userid);

}

var payment_processors = ["Google", "Amazon", "PayPal"];

function createBuyButtons( userid) {
	// on the beginpurchase page, populate the buttons for supported payment
	// processors

	createGoogleBuyButton( userid);

	$.mobile.changePage("#parent_verification_page", {
		transition : "fade"
	});

}

function createGoogleBuyButton( userid) {
	/*
	 * <form
	 * action="https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/770630670709102"
	 * id="BB_BuyButtonForm" method="post" name="BB_BuyButtonForm"
	 * target="_top"> <input name="item_name_1" type="hidden" value="Weirdoid
	 * Pack" /> <input name="item_description_1" type="hidden" value="Monster
	 * Mash pack" /> <input name="item_quantity_1" type="hidden" value="1" />
	 * <input name="item_price_1" type="hidden" value="1.99" /> <input
	 * name="item_currency_1" type="hidden" value="USD" /> <input
	 * name="shopping-cart.items.item-1.digital-content.description"
	 * type="hidden" value="these are instructions" /> <input
	 * name="shopping-cart.items.item-1.digital-content.key" type="hidden"
	 * value="WGF0jlsYj9iFyCQ5TZHrmVBxecTMlRKLQjQa5T5W54w=" /> <input
	 * name="shopping-cart.items.item-1.digital-content.key.is-encrypted"
	 * type="hidden" value="true" /> <input
	 * name="shopping-cart.items.item-1.digital-content.url" type="hidden"
	 * value="http://weirdoids.com/fileaccessurl" /> <input name="_charset_"
	 * type="hidden" value="utf-8" /> <input alt=""
	 * src="https://sandbox.google.com/checkout/buttons/buy.gif?merchant_id=770630670709102&amp;w=117&amp;h=48&amp;style=trans&amp;variant=text&amp;loc=en_US"
	 * type="image" /> </form>
	 * 
	 */

	$('#verify_google_checkout_div#BB_BuyButtonForm')
			.submit(
					function() {
						alert('You will be taken to Google Checkout. When you are done, return to yakhq.com.');

						return true;
					});


}